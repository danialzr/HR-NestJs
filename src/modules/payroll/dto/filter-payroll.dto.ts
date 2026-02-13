import { IsEnum, IsOptional, IsString, Matches, Min } from "class-validator";
import { PayrollStatus } from "../../../shared/enums/payroll-status.enum";
import { ApiPropertyOptional } from "@nestjs/swagger";


export class FilterPayrollDto {
    @ApiPropertyOptional({ description: 'شناسه کاربر برای فیلتر کردن فیش‌های حقوقی', example: 1 })
    @IsOptional()
    userId?: number;

    @ApiPropertyOptional({ description: 'فیلتر دوره حقوقی به فرمت YYYY/MM', example: '1404/11' })
    @IsString({ message: 'salaryPeriod must be string' })
    @Matches(/^\d{4}\/\d{2}$/, { message: 'format not correct' })
    @IsOptional()
    salaryPeriod?: string;

    @ApiPropertyOptional({
        description: 'فیلتر بر اساس وضعیت فیش حقوقی',
        enum: PayrollStatus,
        example: PayrollStatus.PENDING
    })
    @IsEnum(PayrollStatus, { message: ' status can be pending & paid' })
    @IsOptional()
    status: PayrollStatus;
}