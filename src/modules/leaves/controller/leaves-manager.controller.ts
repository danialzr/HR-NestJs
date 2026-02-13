import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Roles } from "../../../modules/auth/decorators/roles.decorator";
import { Role } from "../../../shared/enums/user-role.enum";
import { LeavesManagerService } from "../services/leaves-manager.service";
import { GetUser } from "../../../common/decorators/getUser.decorator";
import { ApproveLeaveDto } from "../dto/approve-leave.dto";
import { CreateLeaveDto } from "../dto/create-leave.dto";

@ApiTags('Manager - Leaves')
@ApiBearerAuth()
@Roles(Role.MANAGER, Role.SUPER_ADMIN)
@Controller('manager/leave')
export class LeavesManagerController {
    constructor(private readonly leavesService: LeavesManagerService) { }

    @Post(':id')
    @ApiOperation({ summary: 'ثبت مرخصی برای کارمند توسط مدیر' })
    async createByManager(
        @GetUser('id') managerId: number,
        @Param('id', ParseIntPipe) employeeId: number,
        @Body() dto: CreateLeaveDto
    ) {
        return await this.leavesService.createByManager(managerId, employeeId, dto);
    }

    @Get()
    @ApiOperation({ summary: 'مشاهده لیست مرخصی‌ها (بر اساس سطح دسترسی)' })
    async findAll(@GetUser() user: any) {
        return await this.leavesService.findAll(user);
    }

    @Patch(':id/decide')
    @ApiOperation({ summary: 'تایید یا رد درخواست مرخصی کارمند' })
    async decide(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: ApproveLeaveDto,
        @GetUser('id') managerId: number,
    ) {
        return await this.leavesService.decide(id, managerId, dto);
    }
}