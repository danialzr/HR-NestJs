import { Controller, Delete, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { AttendanceManagerService } from "../services/attendance-manager.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Roles } from "../../../modules/auth/decorators/roles.decorator";
import { Role } from "../../../shared/enums/user-role.enum";
import { FilterAttendanceDto } from "../dto/filter-attendance.dto";

@ApiTags('Manager - Attendances')
@ApiBearerAuth()
@Roles(Role.MANAGER, Role.SUPER_ADMIN)
@Controller('manager/attendance')
export class AttendanceManagerController {
    constructor(private readonly managerService: AttendanceManagerService) {}

    @Get()
    @ApiOperation({ summary: 'دریافت لیست تمام حضور غیاب ها'})
    async findAll(@Query() filters: FilterAttendanceDto) {
        return await this.managerService.findAll(filters);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'حذف یدونه رکرود'})
    async remove(@Param('id', ParseIntPipe) id: number) {
        return await this.managerService.remove(id)
    }
}