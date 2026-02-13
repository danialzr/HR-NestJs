import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { LeaveEmployeeService } from "../services/leaves-employee.service";
import { GetUser } from "../../../common/decorators/getUser.decorator";
import { CreateLeaveDto } from "../dto/create-leave.dto";
import { UpdateLeaveDto } from "../dto/update-leave.dto";

@ApiTags('Leaves')
@ApiBearerAuth()
@Controller('employee/leave')
export class LeaveEmployeeController {
    constructor(
        private readonly leaveService: LeaveEmployeeService
    ) { }

    @Post()
    @ApiOperation({ summary: 'ثبت مرخصی جدید' })
    async create(@GetUser('id') userId: number, @Body() dto: CreateLeaveDto) {
        return await this.leaveService.create(userId, dto);
    }

    @Get()
    @ApiOperation({ summary: 'گرفتن فهرست همه مرخصی ها' })
    async findAll(@GetUser('id') userId: number) {
        return await this.leaveService.findAll(userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'دریافت یک مرخصی' })
    async findOne(
        @Param('id', ParseIntPipe) id: number,
        @GetUser('id') userId: number) {
        return await this.findOne(id, userId);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'ویرایش درخواست مرخصی pending' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @GetUser('id') userId: number,
        @Body() dto: UpdateLeaveDto,
    ) {
        return this.leaveService.update(id, userId, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'حذف درخواست مرخصی pending' })
    remove(
        @Param('id', ParseIntPipe) id: number,
        @GetUser('id') userId: number
    ) {
        return this.leaveService.remove(id, userId);
    }
}
