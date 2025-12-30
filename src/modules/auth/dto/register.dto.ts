import { IsEnum, IsOptional, IsString } from "class-validator";
import { Role } from "../../../shared/enums/user-role.enum";


export class RegisterDto {
    @IsString()
    mobile: string;

    @IsString()
    password: string;

    @IsOptional()
    @IsEnum(Role)
    role?: Role;
}