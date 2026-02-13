import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Leave } from "../entities/leave.entity";
import { Repository } from "typeorm";
import { CreateLeaveDto } from "../dto/create-leave.dto";
import { LeaveStatus } from "../../../shared/enums/leave-status.enum";
import { Role } from "../../../shared/enums/user-role.enum";
import { ApproveLeaveDto } from "../dto/approve-leave.dto";


@Injectable()
export class LeavesManagerService {
    constructor(
        @InjectRepository(Leave)
        private readonly leaveRepo: Repository<Leave>
    ) { }

    async createByManager(managerId: number, employeeId: number, dto: CreateLeaveDto) {
        const { startTime, endTime, ...rest } = dto;

        let startInMinutes = startTime ? this.timeToMinutes(startTime) : null;
        let endInMinutes = endTime ? this.timeToMinutes(endTime) : null;

        let totalMinute = 0;

        if (startInMinutes !== null && endInMinutes !== null) {
            totalMinute = endInMinutes - startInMinutes;
            if (totalMinute <= 0) {
                throw new BadRequestException('زمان پایان باید بعد از زمان شروع باشد');
            }
        }

        const leave = this.leaveRepo.create({
            ...rest,
            startTime: startInMinutes,
            endTime: endInMinutes,
            totalMinute,
            status: LeaveStatus.APPROVED,
            user: { id: employeeId } as any,
            approvedBy: { id: managerId } as any,
        });

        return await this.leaveRepo.save(leave);
    }

    async findAll(user: any) {
        const query = this.leaveRepo.createQueryBuilder('leaves')
            .leftJoinAndSelect('leaves.user', 'employee')
            .leftJoinAndSelect('leaves.approvedBy', 'approver')
            .orderBy('leaves.id', 'DESC');

        if (user.role === Role.MANAGER) {
            query.where('user.managerId = :managerId', { managerId: user.id });
        }

        if (user.role !== Role.SUPER_ADMIN && user.role !== Role.MANAGER) {
            throw new ForbiddenException('شما سطح دسترسی لازم برای مشاهده این لیست را ندارید');
        }

        const leaves = await query.getMany();

        return leaves.map(leave => ({
            ...leave,
            startTime: leave.startTime ? this.minutesToTime(leave.startTime) : null,
            endTime: leave.endTime ? this.minutesToTime(leave.endTime) : null,
        }));
    }

    async decide(id: number, managerId: number, dto: ApproveLeaveDto) {
        const leave = await this.leaveRepo.findOne({ where: { user: { id } } });

        if (!leave) throw new NotFoundException('درخواست مرخصی پیدا نشد');

        leave.status = dto.status;
        leave.approvedBy = { id: managerId } as any;

        return await this.leaveRepo.save(leave);
    }

    private timeToMinutes(time: string): number {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }

    private minutesToTime(totalMinutes: number): string {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
}