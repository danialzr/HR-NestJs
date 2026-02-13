import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { DepartmentsEmployeeService } from "../services/departments-employee.service";
import { Department } from "../entities/department.entity";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('employee - department')
@ApiBearerAuth()
@Controller('employee/departments')
export class DepartmentsEmployeeController {
    constructor(
        private readonly departmentsService: DepartmentsEmployeeService
    ) {}

    // GET /employee/departments
    @Get()
    @ApiOperation({ summary: 'دریافت لیست تمام دپارتمان‌ها' })
    async findAll(): Promise<Department[]> {
        return await this.departmentsService.findAll();
    }

    // GET /employee/departments/:id
    @Get(':id')
    @ApiOperation({ summary: 'دریافت جزئیات یک دپارتمان' })
    async findone(@Param('id', ParseIntPipe) id: number): Promise<Department> {
        return await this.departmentsService.findOne(id)
    }
}