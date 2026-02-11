import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { IsNull, MoreThan, Repository } from "typeorm";
import { RefreshToken } from "./entities/refresh-token.entity";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import * as bcrypt from 'bcrypt'
import { JwtService } from "@nestjs/jwt";
import { Role } from "../../shared/enums/user-role.enum";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../users/users.service";
import { User } from "../users/entities/user.entity";


@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,

        @InjectRepository(RefreshToken)
        private readonly rtRepository: Repository<RefreshToken>,

        private jwtService: JwtService,
        private config: ConfigService
    ) { }

    //register With mobile & password
    async register(payload: RegisterDto): Promise<User> {
        const { mobile, password } = payload;

        const alreadyExist = await this.usersService.findByMobile(mobile);
        if (alreadyExist) throw new BadRequestException('این شماره موبایل قبلاً ثبت شده است');

        const passwordHashed = await bcrypt.hash(password, 12);

        const user = await this.usersService.create({
            mobile,
            password: passwordHashed
        });

        const { password: _, ...result } = user;
        return result as User;
    }

    //validate With mobile & pssword use in Login Controller
    async validateUser(payload: LoginDto): Promise<User> {
        const { mobile, password } = payload;
        const user = await this.usersService.findByMobile(mobile);

        if (!user) throw new UnauthorizedException('شماره موبایل یا رمز عبور اشتباه است');

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new UnauthorizedException('شماره موبایل یا رمز عبور اشتباه است');

        return user;
    }

    async login(user: User, details: { userAgent: string; ipAddress: string }) {
        const payload = { sub: user.id, role: user.role }

        //Access Token
        const accessToken = this.jwtService.sign(payload, {
            secret: this.config.get('JWT_ACCESS_SECRET'),
            expiresIn: this.config.get('ACCESS_TOKEN_EXPIRE') || '15m'
        })

        //Refresh Token
        const refreshToken = this.jwtService.sign(
            { sub: user.id },
            {
                secret: this.config.get('JWT_REFRESH_SECRET'),
                expiresIn: this.config.get('REFRESH_TOKEN_EXPIRE') || '14d'
            })

        const tokenHash = await bcrypt.hash(refreshToken, 12)

        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 14);

        const rt = this.rtRepository.create({
            tokenHash,
            user,
            userAgent: details.userAgent,
            ipAddress: details.ipAddress,
            expiresAt
        })
        await this.rtRepository.save(rt)

        return {
            accessToken,
            refreshToken,
            user
        }
    }

    async refreshToken(providedRefreshToken: string) {
        let payload: any;

        try {
            payload = this.jwtService.verify(providedRefreshToken, {
                secret: this.config.get('JWT_REFRESH_SECRET'),
            })
        } catch {
            throw new UnauthorizedException('Refresh Token inValid');
        }

        const userId = payload.sub;

        const tokens = await this.rtRepository.find({
            where: {
                user: { id: userId },
                revokedAt: IsNull(),
                expiresAt: MoreThan(new Date())
            },
            relations: ['user']
        });

        let isValidRefreshToken = false;
        for (const rt of tokens) {
            const match = await bcrypt.compare(providedRefreshToken, rt.tokenHash)

            if (match) {
                isValidRefreshToken = true

                rt.revokedAt = new Date();
                await this.rtRepository.save(rt)

                const user = rt.user;

                const newPayload = { sub: user.id, role: user.role }

                //Access Token
                const newAccessToken = this.jwtService.sign(newPayload, {
                    secret: this.config.get('JWT_ACCESS_SECRET'),
                    expiresIn: this.config.get('ACCESS_TOKEN_EXPIRE') || '15m'
                })

                //Refresh Token
                const newRefreshToken = this.jwtService.sign(
                    { sub: user.id },
                    {
                        secret: this.config.get('JWT_REFRESH_SECRET'),
                        expiresIn: this.config.get('REFRESH_TOKEN_EXPIRE') || '14d'
                    }
                )

                const tokenHash = await bcrypt.hash(newRefreshToken, 12)
                const expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + 14);

                const refreshToken = this.rtRepository.create({
                    tokenHash,
                    user,
                    userAgent: rt.userAgent,
                    ipAddress: rt.ipAddress,
                    expiresAt
                })
                await this.rtRepository.save(refreshToken)

                return {
                    newAccessToken,
                    newRefreshToken,
                }
            }
        }

        if (!isValidRefreshToken) throw new BadRequestException('your token is not valid')
    }


    async logOut(providedRefreshToken: string) {
        const payload = this.jwtService.decode(providedRefreshToken) as any;

        if (!payload || !payload.sub) {
            throw new UnauthorizedException('refresh invalid');
        }

        const userId = payload.sub;

        const tokens = await this.rtRepository.find({
            where: {
                user: { id: userId },
                revokedAt: IsNull()
            }
        });

        for (const rt of tokens) {
            const match = await bcrypt.compare(providedRefreshToken, rt.tokenHash);
            if (match) {
                rt.revokedAt = new Date();
                await this.rtRepository.save(rt);
                return { message: 'session logOut' };
            }
        }

        throw new BadRequestException('not found valid Session');
    }
}