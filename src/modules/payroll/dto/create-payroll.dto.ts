import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, Min } from "class-validator";
import { PayrollStatus } from "../../../shared/enums/payroll-status.enum";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreatePayrollDto {
    @ApiProperty({ description: 'شناسه کاربر برای ثبت فیش حقوقی', example: 1 })
    @IsNumber({}, { message: 'Id must be number' })
    @Min(1, { message: 'Id mubst be bigger than 0' })
    @IsNotEmpty({ message: 'Id required' })
    userId: number;

    @ApiProperty({ description: 'دوره حقوقی به فرمت YYYY/MM', example: '1404/11' })
    @IsString({ message: 'salaryPeriod must be string' })
    @Matches(/^\d{4}\/\d{2}$/, { message: 'format not correct' })
    @IsNotEmpty({ message: 'salary period required' })
    salaryPeriod: string;

    @ApiProperty({ description: 'حقوق پایه کاربر', example: 12000000 })
    @IsNumber({}, { message: 'base salary must be number' })
    @Min(0, { message: 'base salary cant be negetive' })
    @IsNotEmpty({ message: 'base salary required' })
    baseSalary: number;

    @ApiPropertyOptional({ description: 'مزایا (اختیاری)', example: 1500000 })
    @IsNumber({}, { message: 'bonuses must be number' })
    @Min(0, { message: 'bonuses cant be negetive' })
    @IsOptional()
    bonuses?: number;

    @ApiPropertyOptional({ description: 'کسورات (اختیاری)', example: 500000 })
    @IsNumber({}, { message: 'deduction must be number' })
    @Min(0, { message: 'deduction cant be negetive' })
    @IsOptional()
    deduction?: number;

    @ApiPropertyOptional({
        description: 'وضعیت فیش حقوقی',
        enum: PayrollStatus,
        example: PayrollStatus.PENDING
    })
    @IsEnum(PayrollStatus, { message: ' status can be pending & paid' })
    @IsOptional()
    status: PayrollStatus;
}