import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";
import { LeaveType } from "src/shared/enums/leave-type.enum";

export class CreateLeaveDto {
    @ApiProperty({
        description: 'زمان شروع مرخصی',
        example: '1404/11/21'
    })
    @IsString({ message: 'زمان شروع باید رشته باشد' })
    @IsNotEmpty()
    startDate: string;

    @ApiProperty({
        description: 'زمان پایان مرخصی',
        example: '1404/11/21'
    })
    @IsNotEmpty()
    @IsString({ message: 'زمان پایان باید رشته باشد' })
    endDate: string;

    @ApiPropertyOptional({
        description: 'زمان شروع مرخصی ساعتی',
        example: '04:26'
    })
    @IsOptional()
    @IsString({ message: 'زمان شروع مرخصی ساعتی باید یک رشته باشد' })
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'فرمت ساعت باید HH:mm باشد' })
    startTime?: string;

    @ApiPropertyOptional({
        description: 'زمان پایان مرخصی ساعتی',
        example: '04:26'
    })
    @IsOptional()
    @IsString({ message: 'زمان پایان مرخصی ساعتی باید یک رشته باشد' })
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'فرمت ساعت باید HH:mm باشد' })
    endTime?: string;

    @ApiPropertyOptional({
        description: 'توضیحات در مورد مرخصی',
        example: 'سر درد هستم '
    })
    @IsOptional()
    @IsString({ message: 'دلیل باید یک رشته باشد' })
    reason?: string

    @ApiProperty({
        enum: LeaveType,
        description: 'نوع مرخصی کاربر',
        example: LeaveType.ANNUAL
    })
    @IsEnum(LeaveType)
    @IsNotEmpty()
    type: LeaveType;
}
