import { IsEnum, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; 
import { Role } from '../../../shared/enums/user-role.enum';

export class CreateUserDto {
    @ApiProperty({ 
        example: '09121234567', 
        description: 'شماره موبایل کاربر (باید ۱۱ رقم باشد)' 
    })
    @IsNotEmpty({ message: 'شماره موبایل اجباری است' })
    @Matches(/^09\d{9}$/, { message: 'number must be 09********' })
    mobile: string;

    @ApiProperty({ 
        example: '123456', 
        description: 'رمز عبور کاربر (بین ۶ تا ۲۰ کاراکتر)',
        minLength: 6,
        maxLength: 20
    })
    @IsString()
    @IsNotEmpty({ message: 'رمز عبور اجباری است' })
    @Length(6, 8, { message: 'رمز عبور باید بین ۶ تا ۲۰ کاراکتر باشد' })
    password: string;

    @ApiProperty({ 
        enum: Role, 
        default: Role.EMPLOYEE,
        description: 'نقش کاربر در سیستم' 
    })
    @IsEnum(Role, { message: 'نقش انتخاب شده معتبر نیست' })
    @IsOptional()
    role?: Role;
}