import { IsEnum, IsOptional, IsString } from "class-validator";
import { Role } from "../../../shared/enums/user-role.enum";
import { ApiProperty } from "@nestjs/swagger";


export class RegisterDto {
    @ApiProperty({ description: 'mobile number', example: '09370947629'})
    @IsString()
    mobile: string;

    @ApiProperty({ description: 'password', example: '12345678'})
    @IsString()
    password: string;

    @IsOptional()
    @IsEnum(Role)
    role?: Role;
}