import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/modules/auth/decorators/roles.decorator";
import { Role } from "src/shared/enums/user-role.enum";
import { TasksManagerService } from "../services/task-manager.service";
import { GetUser } from "src/common/decorators/getUser.decorator";
import { CreateTaskDto } from "../dto/create-task.dto";
import { TaskStatus } from "src/shared/enums/task-status.enum";
import { UpdateTaskDto } from "../dto/update-task.dto";

@ApiTags('Manager - Tasks')
@ApiBearerAuth()
@Roles(Role.MANAGER, Role.SUPER_ADMIN)
@Controller('manager/tasks')
export class TasksManagerController {
    constructor(
        private readonly taskService: TasksManagerService
    ) { }

    @Post()
    @ApiOperation({ summary: 'ایجاد تسک جدید' })
    async create(@GetUser('id') creatorId: number, @Body() dto: CreateTaskDto) {
        return await this.taskService.create(creatorId, dto);
    }

    @Get()
    @ApiOperation({ summary: 'مشاهده و فیلتر تمام تسک‌ها' })
    async findAll(
        @Query('assigneeId') assigneeId?: string,
        @Query('status') status?: TaskStatus
    ) {
        return await this.taskService.findAll({ assigneeId, status })
    }

    @Patch(':id')
    @ApiOperation({ summary: 'ویرایش کامل تسک' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateTaskDto
    ) {
        return await this.taskService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'حذف تسک' })
    async remove(@Param('id', ParseIntPipe) id: number) {
        return await this.taskService.remove(id);
    }
}