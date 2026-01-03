import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { DepartmentsManagerService } from "../services/departments.manager.service";
import { CreateDepartmentDto } from "../dto/create-department.dto";
import { Department } from "../entities/department.entity";
import { UpdateDepartmentDto } from "../dto/update-department.dto";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Roles } from "src/modules/auth/decorators/roles.decorator";
import { Role } from "src/shared/enums/user-role.enum";

@ApiBearerAuth()
@Roles(Role.MANAGER)
@Controller('manager/departments')
export class DepartmentsManagerController {
    constructor(
        private readonly departmentsService: DepartmentsManagerService
    ) {}

    // @POST /admin/departments
    @Post()
    async create(@Body() dto: CreateDepartmentDto): Promise<Department> {
        return await this.departmentsService.create(dto);
    }

    // GET /admin/departments/
    @Get()
    async findAll(): Promise<Department[]> {
        return await this.departmentsService.findAll();
    }

    // GET /admin/departments/:id
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Department> {
        return await this.departmentsService.findOne(id);
    }

    //PATCH /admin/departments/:id
    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateDepartmentDto,
    ): Promise<Department> {
        return await this.departmentsService.update(id, dto)
    }

    //DELETE /admin/departments/:id
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<{ success: boolean }> {
        await this.departmentsService.remove(id)
        return { success: true }
    }
}