import { Body, Controller, Get, Param, ParseIntPipe, Patch } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { TasksEmployeeService } from "../services/tasks-employee.service";
import { GetUser } from "../../../common/decorators/getUser.decorator";
import { UpdateTaskStatusDto } from "../dto/update-taskstatus.dto";

@ApiTags('Employee - Tasks')
@ApiBearerAuth()
@Controller('employee/tasks')
export class TasksEmployeeController {
  constructor(
    private readonly taskService: TasksEmployeeService
  ) { }

  @Get(':id')
  @ApiOperation({ summary: 'مشاهده جزئیات یک تسک خاص من' })
  async findOne(@Param('id', ParseIntPipe) taskId: number, @GetUser('id') userId: number) {
    return await this.taskService.findOne(taskId, userId)
  }

  @Get()
  @ApiOperation({ summary: 'مشاهده تمام تسک‌های اختصاص داده شده به من' })
  async findAll(@GetUser('id') userId: number) {
    return await this.taskService.findAll(userId)
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'تغییر وضعیت تسک (توسط کارمند)' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskStatusDto,
    @GetUser('id') userId: number
  ) {
    return await this.taskService.updateStatus(id, userId, dto.status);
  }
}