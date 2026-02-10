import { IsDateString, IsOptional, IsString } from "class-validator";


export class FilterAttendanceDto {
    @IsString()
    @IsOptional()
    startTime?: string;

    @IsDateString({}, { message: 'فرمت زمان پایان مناسب نیست'})
    @IsOptional()
    endTime?: string;
}