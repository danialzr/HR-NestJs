import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, IsOptional } from "class-validator";


export class CreateDepartmentDto {
    @ApiProperty({ example: 'واحد backend', description: 'انتخاب اسم دپارتمان' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(80)
    name: string;

    @ApiPropertyOptional({
        example: 'توضیحات مربوط به backend',
        description: 'توضیحات دپارتمان'
    })
    @IsString()
    @IsOptional()
    description?: string;
}