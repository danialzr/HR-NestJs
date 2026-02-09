import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { IsNull, Repository } from "typeorm";
import { RefreshToken } from "./entities/refresh-token.entity";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import * as bcrypt from 'bcrypt'
import { JwtService } from "@nestjs/jwt";
import { Role } from "src/shared/enums/user-role.enum";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(RefreshToken)
        private readonly rtRepository: Repository<RefreshToken>,

        private jwtService: JwtService,
        private config: ConfigService
    ) { }

    async register(payload: RegisterDto): Promise<User> {
        const { mobile, password, role = Role.EMPLOYEE } = payload;
        
        const alreadyExistMobile = await this.findUserByMobile(mobile);
        if (alreadyExistMobile) throw new BadRequestException('mobile num already used') 
        const passwordHashed = await bcrypt.hash(password, 12);
        const user = this.userRepository.create({ mobile, password: passwordHashed, role })

        const savedUser = await this.userRepository.save(user);

        const { password: _, ...result } = savedUser;

        return result as User;
    }

    async validateUser(payload: LoginDto): Promise<User> {
        const { mobile, password } = payload;
        const user = await this.userRepository.findOne({ where: { mobile } })

        if (!user) throw new NotFoundException('didnt found user with this number & password')

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) throw new UnauthorizedException('didnt found user with this number & password')

        return user
    }

    async login(user: User) {
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
        const rt = this.rtRepository.create({ tokenHash, user })
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

        const tokens = await this.rtRepository
            .createQueryBuilder('rt')
            .leftJoinAndSelect('rt.user', 'user')
            .where('rt.userId = :userId', { userId })
            .andWhere('rt.revokedAt IS NULL')
            .getMany();

        let isValidRefreshToken = false;
        for (const rt of tokens) {
            const match = await bcrypt.compare(providedRefreshToken, rt.tokenHash)

            if (match) {
                isValidRefreshToken = true
                rt.revokedAt = new Date();
                await this.rtRepository.save(rt)

                const user = rt.user;

                const payload = { sub: user.id, role: user.role }

                //Access Token
                const newAccessToken = this.jwtService.sign(payload, {
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
                const refreshToken = this.rtRepository.create({ tokenHash, user })
                await this.rtRepository.save(refreshToken)

                return {
                    newAccessToken,
                    newRefreshToken,
                    user
                }
            }

        }

        if (!isValidRefreshToken) throw new BadRequestException('your token is not valid')
    }

    async logOut(userId: number) {
        await this.rtRepository.createQueryBuilder()
            .update(RefreshToken)
            .set({ revokedAt: () => 'NOW()' })
            .where('userId= :id', { id: userId })
            .execute()
    }

    async findUserById(userId: number) {
        const user = await this.userRepository.findOne({ where: { id: userId } })
        if (!user) throw new NotFoundException('user not found');
        return user;
    }

    async findUserByMobile(mobile: string) {
        const user = await this.userRepository.findOne({ where: { mobile } })
        if (!user) return false;
        return user;
    }
}