import { IsNotEmpty, IsString, Length, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
    @ApiProperty({ description: 'mobile number', example: '09370947629' })
    @IsString({ message: 'phone must be string' })
    @IsNotEmpty()
    @Matches(/^09\d{9}$/, { message: 'number must be 09********' })
    mobile: string;

    @ApiProperty({ description: 'password', example: '12345678', minLength: 6 })
    @IsString()
    @IsNotEmpty()
    @Length(6, 8, { message: 'رمز عبور باید بین ۶ تا ۲۰ کاراکتر باشد' })
    password: string;
}