import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Roles } from "src/modules/auth/decorators/roles.decorator";
import { Role } from "src/shared/enums/user-role.enum";
import { AttendanceEmployeeService } from "../services/attendance-employee.service";
import { CheckInOutDto } from "../dto/check-in-out.dto";
import { User } from "src/common/decorators/user.decorator";
import { FilterAttendanceDto } from "../dto/filter-attendance.dto";
import { Attendance } from "../entities/attendance.entity";

@ApiBearerAuth()
@Roles(Role.EMPLOYEE)
@Controller('employee/attendance')
export class AttendanceEmployeeController {
    constructor(
        private readonly attendanceEmployeeService: AttendanceEmployeeService
    ) { }

    @Post('check_in')
    async checkIn(
        @Body() dto: CheckInOutDto,
        @User() user: { id: number, role: string }): Promise<Attendance> {
        return await this.attendanceEmployeeService.checkIn(user.id, dto.jDate, dto.notes)
    }

    @Post('check_out')
    async checkOut(
        @Body() dto: CheckInOutDto,
        @User() user: { id: number, role: string }
    ): Promise<Attendance> {
        return await this.attendanceEmployeeService.checkOut(user.id, dto.jDate, dto.notes)
    }

    @Get()
    async findMyAttendance(
        @Query() filters: FilterAttendanceDto,
        @User() user: { id: number }
    ): Promise<Attendance[]>{
        return await this.attendanceEmployeeService.findMyattendance(user.id, filters)
    }

}  