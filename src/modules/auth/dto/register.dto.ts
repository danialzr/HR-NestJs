import { IsNotEmpty, IsString, Matches, MinLength } from "class-validator";
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
    @MinLength(6)
    password: string;
}