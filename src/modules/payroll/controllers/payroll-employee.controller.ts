import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { GetUser } from "../../../common/decorators/getUser.decorator";
import { PayrollEmployeeService } from "../services/payroll-employee.service";


@ApiTags('Employee - Payroll')
@ApiBearerAuth()
@Controller('employee/payrolls')
export class PayrollEmployeeController {
    constructor(private readonly payrollService: PayrollEmployeeService) { }

    @Get()
    @ApiOperation({ summary: 'مشاهده لیست تمام فیش‌های حقوقی من' })
    async findAll(@GetUser('id') userId: number) {
        return await this.payrollService.findAllMyPayrolls(userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'مشاهده جزئیات یک فیش حقوقی خاص' })
    async findOne(
        @Param('id', ParseIntPipe) id: number,
        @GetUser('id') userId: number
    ) {
        return await this.payrollService.findOneMyPayroll(id, userId);
    }
}