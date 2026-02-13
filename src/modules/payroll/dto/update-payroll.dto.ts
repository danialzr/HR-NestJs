import { IsEnum, IsNumber, IsOptional, IsString, Matches, Min } from "class-validator";
import { PayrollStatus } from "../../../shared/enums/payroll-status.enum";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdatePayrollDto {
    @ApiPropertyOptional({ description: 'دوره حقوقی جدید به فرمت YYYY/MM', example: '1404/12' })
    @IsString({ message: 'salaryPeriod must be string' })
    @Matches(/^\d{4}\/\d{2}$/, { message: 'format not correct' })
    @IsOptional()
    salaryPeriod?: string;

    @ApiPropertyOptional({ description: 'حقوق پایه جدید', example: 15000000 })
    @IsNumber({}, { message: 'base salary must be number' })
    @Min(0, { message: 'base salary cant be negetive' })
    @IsOptional()
    baseSalary?: number;

    @ApiPropertyOptional({ description: 'مزایای جدید', example: 2000000 })
    @IsNumber({}, { message: 'bonuses must be number' })
    @Min(0, { message: 'bonuses cant be negetive' })
    @IsOptional()
    bonuses?: number;

    @ApiPropertyOptional({ description: 'کسورات جدید', example: 800000 })
    @IsNumber({}, { message: 'deduction must be number' })
    @Min(0, { message: 'deduction cant be negetive' })
    @IsOptional()
    deduction?: number;

    @ApiPropertyOptional({
        description: 'وضعیت جدید فیش حقوقی',
        enum: PayrollStatus,
        example: PayrollStatus.PAID
    })
    @IsEnum(PayrollStatus, { message: ' status can be pending & paid' })
    @IsOptional()
    status: PayrollStatus;
}