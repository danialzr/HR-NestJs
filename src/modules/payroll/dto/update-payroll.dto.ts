import { IsEnum, IsNumber, IsOptional, IsString, Matches, Min } from "class-validator";
import { PayrollStatus } from "src/shared/enums/payroll-status.enum";

export class UpdatePayrollDto {
    @IsString({ message: 'salaryPeriod must be string' })
    @Matches(/^\d{4}\/\d{2}$/, { message: 'format not correct' })
    @IsOptional()
    salaryPeriod?: string;

    @IsNumber({}, { message: 'base salary must be number' })
    @Min(0, { message: 'base salary cant be negetive' })
    @IsOptional()
    baseSalary?: number;

    @IsNumber({}, { message: 'bonuses must be number' })
    @Min(0, { message: 'bonuses cant be negetive'})
    @IsOptional()
    bonuses?: number;

    @IsNumber({}, { message: 'deduction must be number' })
    @Min(0, { message: 'deduction cant be negetive'})
    @IsOptional()
    deduction?: number;

    @IsEnum(PayrollStatus, { message: ' status can be pending & paid'})
    @IsOptional()
    status: PayrollStatus;  
}