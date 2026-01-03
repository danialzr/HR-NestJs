import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches } from "class-validator";


export class LoginDto {
    @ApiProperty({
        description: 'شماره موبایل باید با الگو مطابقت داشته باشد',
        example: '09370947629',
        pattern: '^09\\d{9}$',
        minLength: 11,
        maxLength: 11
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/^09\d{9}$/, { message: 'number must be 09********' })
    mobile: string;

    @ApiProperty({
        description: 'رمز عبور کاربر',
        example: '12345678'
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}