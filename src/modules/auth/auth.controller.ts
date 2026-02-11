import { Body, Controller, Post, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { GetUser } from "../../common/decorators/getUser.decorator";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { Public } from "./decorators/public.decorator";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Public()
    @Post('register')
    async register(@Body() dto: RegisterDto) {
        const user = await this.authService.register(dto)
        return user
    }

    @Public()
    @Post('login')
    async login(@Body() dto: LoginDto, @Req() req: any) {
        const user = await this.authService.validateUser(dto)

        const userAgent = req.headers['user-agent'] || 'Unknown';
        const ipAddress = req.ip || req.connection.remoteAddress;

        const token = await this.authService.login(user, { userAgent, ipAddress });

        return {
            accessToken: token.accessToken,
            refreshToken: token.refreshToken,
            role: user.role
        }
    }

    @Public()
    @Post('refresh')
    async refresh(@Body() dto: RefreshTokenDto) {
        if (!dto.refreshToken) throw new UnauthorizedException('Refresh Token missing');

        const tokens = await this.authService.refreshToken(dto.refreshToken)

        return {
            accessToken: tokens?.newAccessToken,
            refreshToken: tokens?.newRefreshToken,
        }
    }

    @Post('logout')
    async logOut(@Body() dto: RefreshTokenDto) {
        return await this.authService.logOut(dto.refreshToken);
    }
}
