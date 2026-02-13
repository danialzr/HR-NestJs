import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from 'src/shared/enums/task-status.enum';

export class UpdateTaskStatusDto {
    @ApiProperty({ enum: TaskStatus, example: TaskStatus.IN_PROGRESS })
    @IsEnum(TaskStatus, { message: 'وضعیت انتخاب شده نامعتبر است' })
    status: TaskStatus;
}