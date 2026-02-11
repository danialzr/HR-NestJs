import { IsOptional, IsString, Matches, Length, IsEnum, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../shared/enums/user-role.enum';

export class UpdateUserDto {
    @ApiProperty({ example: '09121234567', required: false })
    @IsOptional()
    @Matches(/^09\d{9}$/, { message: 'فرمت موبایل اشتباه است' })
    mobile?: string;

    @ApiProperty({ example: 'newPass123', required: false })
    @IsOptional()
    @IsString()
    @Length(6, 20)
    password?: string;

    @ApiProperty({ enum: Role, required: false })
    @IsOptional()
    @IsEnum(Role)
    role?: Role;

    @ApiProperty({ example: 'عرفان خادم', required: false })
    @IsOptional()
    @IsString()
    fullName?: string;

    @ApiProperty({ example: '0012345678', required: false })
    @IsOptional()
    @Matches(/^\d{10}$/, { message: 'کد ملی باید ۱۰ رقم باشد' })
    nationalCode?: string;

    @ApiProperty({ example: '6037991234567890', required: false })
    @IsOptional()
    @IsString()
    bankAccountNumber?: string;

    @ApiProperty({ example: '123456789', required: false })
    @IsOptional()
    @IsString()
    insuranceNumber?: string;

    @ApiProperty({ example: true, required: false })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiProperty({ example: 1, description: 'آیدی مدیرِ این کاربر', required: false })
    @IsOptional()
    @IsNumber()
    managerId?: number;
}