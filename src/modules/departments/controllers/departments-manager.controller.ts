import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { DepartmentsManagerService } from "../services/departments.manager.service";
import { CreateDepartmentDto } from "../dto/create-department.dto";
import { Department } from "../entities/department.entity";
import { UpdateDepartmentDto } from "../dto/update-department.dto";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Roles } from "../../../modules/auth/decorators/roles.decorator";
import { Role } from "../../../shared/enums/user-role.enum";

@ApiTags('Manager - Departments')
@ApiBearerAuth()
@Roles(Role.MANAGER, Role.SUPER_ADMIN)
@Controller('manager/departments')
export class DepartmentsManagerController {
    constructor(
        private readonly departmentsService: DepartmentsManagerService
    ) { }

    // @POST /manager/departments
    @Post()
    @ApiOperation({ summary: 'ایجاد دپارتمان جدید' })
    async create(@Body() dto: CreateDepartmentDto): Promise<Department> {
        return await this.departmentsService.create(dto);
    }

    // GET /manager/departments/
    @Get()
    @ApiOperation({ summary: 'دریافت لیست تمام دپارتمان‌ها' })
    async findAll(): Promise<Department[]> {
        return await this.departmentsService.findAll();
    }

    // GET /manager/departments/:id
    @Get(':id')
    @ApiOperation({ summary: 'دریافت جزئیات یک دپارتمان' })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Department> {
        return await this.departmentsService.findOne(id);
    }

    //PATCH /manager/departments/:id
    @Patch(':id')
    @ApiOperation({ summary: 'ویرایش اطلاعات دپارتمان' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateDepartmentDto,
    ): Promise<Department> {
        return await this.departmentsService.update(id, dto)
    }

    //DELETE /manager/departments/:id
    @Delete(':id')
    @ApiOperation({ summary: 'حذف دپارتمان' })
    async remove(@Param('id', ParseIntPipe) id: number): Promise<{ success: boolean }> {
        return await this.departmentsService.remove(id)
    }

    @Post(':id/assign-users')
    @ApiOperation({ summary: 'اضافه کردن گروهی کاربران به یک دپارتمان' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'string', example: "1" }
            }
        }
    })
    async assignUsers(
        @Param('id', ParseIntPipe) id: number,
        @Body('userId') userId: string
    ) {
        return await this.departmentsService.assignUsersToDepartment(id, userId);
    }
}