import { Body, Controller, Post, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { GetUserId } from "./decorators/get-user.decorator";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { Public } from "./decorators/public.decorator";

@Public()
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

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
    async refresh(@Body() dto: RefreshTokenDto) {
        if (!dto.refreshToken) throw new UnauthorizedException('Refresh Token missing');

        const tokens = await this.authService.refreshToken(dto.refreshToken)

        return {
            accessToken: tokens?.newAccessToken,
            refreshToken: tokens?.newRefreshToken,

        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logOut(@GetUserId() userId: number) {

        await this.authService.logOut(userId);

        return { message: 'با موفقیت خارج شدید' };
    }
}
