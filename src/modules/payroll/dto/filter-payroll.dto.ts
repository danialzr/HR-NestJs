import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, Min } from "class-validator";
import { PayrollStatus } from "src/shared/enums/payroll-status.enum";


export class FilterPayrollDto {
    @IsNumber({}, { message: 'Id must be number' })
    @Min(1, { message: 'Id mubst be bigger than 0' })
    @IsNotEmpty({ message: 'Id required' })
    @IsOptional()
    userId?: number;

    @IsString({ message: 'salaryPeriod must be string' })
    @Matches(/^\d{4}\/\d{2}$/, { message: 'format not correct' })
    @IsOptional()
    salaryPeriod?: string;

    @IsEnum(PayrollStatus, { message: ' status can be pending & paid' })
    @IsOptional()
    status: PayrollStatus;
}