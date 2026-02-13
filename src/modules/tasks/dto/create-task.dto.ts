import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { TaskPriority } from "../../../shared/enums/task-priority.enum";

export class CreateTaskDto {
    @ApiProperty({
        description: 'تایتل مربوز به تسک',
        example: 'طراحی یوزر'
    })
    @IsString({ message: 'تایتل باید رشته باشد' })
    @IsNotEmpty({ message: 'تایتل نباید خالی باشد' })
    @MaxLength(100)
    title: string;

    @ApiPropertyOptional({
        description: 'بخش توضیحات تسک',
        example: 'بخش لاگین یوزر رو انجام بده'
    })
    @IsOptional()
    @IsString({ message: 'توضیحات باید رشته باشد' })
    @MaxLength(250)
    description?: string;

    @ApiProperty({
        description: 'مهلت انجام تسک',
        example: '2026-02-20T10:00:00Z'
    })
    @IsDateString()
    @IsNotEmpty({ message: 'تعیین مهلت انجام (Deadline) الزامی است' })
    deadline: Date;

    @ApiProperty({ enum: TaskPriority, default: TaskPriority.MEDIUM })
    @IsEnum(TaskPriority)
    @IsOptional()
    priority?: TaskPriority;

    @ApiProperty({ example: 1, description: 'آیدی کارمندی که تسک به او واگذار می‌شود' })
    @IsInt()
    @IsNotEmpty({ message: 'انتخاب کارمند (Assignee) الزامی است' })
    assigneeId: number;

}
