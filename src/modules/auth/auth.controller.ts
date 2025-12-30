import { Body, Controller, Post, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";


@Controller('auth')
export class AuthController {
    constructor (
        private readonly authService: AuthService
    ) {}

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        const user = await this.authService.register(dto)
        return user
    }

    @Post('login')
    async login(@Body() dto: LoginDto) {
        const user = await this.authService.validateUser(dto)

        const token = await this.authService.login(user)

        return {
            accessToken: token.accessToken,
            refreshToken: token.refreshToken,

        }
    }

    @Post('refresh')
    async refresh(@Body() body: { refreshToken: string }) {
        if (!body.refreshToken) throw new UnauthorizedException('Refresh Token missing');

        const tokens = await this.authService.refreshToken(body.refreshToken)

        return {
            accessToken: tokens?.newAccessToken,
            refreshToken: tokens?.newRefreshToken,

        }
    }

    // @Post('logOut')
    // async logOut()
}