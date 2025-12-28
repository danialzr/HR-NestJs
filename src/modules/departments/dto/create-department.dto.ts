import { IsNotEmpty, IsString, MaxLength, IsOptional } from "class-validator";


export class CreateDepartmentDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

     @IsString()
     @IsOptional()
     description?: string
}