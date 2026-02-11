import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CheckInOutDto {
    @ApiPropertyOptional({
        description: 'optional notes for in or out',
        example: 'delay for teraffic'
    })
    @IsString({ message: 'note must be string'})
    @IsOptional()
    notes?: string;

    @IsString({message: 'tarix must be string'})
    @IsOptional()
    jDate: string;
}