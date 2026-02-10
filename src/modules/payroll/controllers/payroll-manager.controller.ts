import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { Roles } from "../../../modules/auth/decorators/roles.decorator";
import { Role } from "../../../shared/enums/user-role.enum";
import { PayrollManagerService } from "../services/payroll-manager.service";
import { CreatePayrollDto } from "../dto/create-payroll.dto";
import { Payroll } from "../entities/payroll.entity";
import { FilterPayrollDto } from "../dto/filter-payroll.dto";
import { UpdatePayrollDto } from "../dto/update-payroll.dto";


@ApiBearerAuth()
@Roles(Role.MANAGER)
@Controller('manager/payroll')
export class PayrollManagerController {
    constructor(
        private readonly payrollService: PayrollManagerService
    ) { }

    @Post()
    @ApiOperation({ summary: 'ایجاد رکورد حقوق و دستمزد جدید' })
    async create(@Body() dto: CreatePayrollDto): Promise<Payroll> {
        return await this.payrollService.create(dto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'update paysilp'})
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdatePayrollDto
    ): Promise<Payroll> {
        return await this.payrollService.update(id, dto)
    }

    @Get()
    @ApiOperation({ summary: 'get all payslip' })
    async findAll(@Query() filters: FilterPayrollDto): Promise<Payroll[]> {
        return await this.payrollService.findAll(filters);
    }

    @Get(':id')
    @ApiOperation({ summary: 'get one payslip' })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Payroll> {
        return await this.payrollService.findOne(id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'delete payslip'})
    async remove(@Param('id', ParseIntPipe) id: number): Promise<{ success: boolean}> {
        await this.payrollService.remove(id)
        return { success: true}

    }
}