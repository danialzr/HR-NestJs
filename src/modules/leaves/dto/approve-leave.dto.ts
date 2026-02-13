import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { LeaveStatus } from "../../../shared/enums/leave-status.enum";


export class ApproveLeaveDto {
    @ApiProperty({
        enum: LeaveStatus,
        description: 'approved یا rejected',
        example: LeaveStatus.APPROVED
    })
    @IsEnum(LeaveStatus)
    @IsNotEmpty()
    status: LeaveStatus;
}