import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Attendance } from "../entities/attendance.entity";
import { Repository } from "typeorm";
import { FilterAttendanceDto } from "../dto/filter-attendance.dto";

@Injectable()
export class AttendanceManagerService {
    constructor(
        @InjectRepository(Attendance)
        private readonly attendanceRepo: Repository<Attendance>
    ) { }

    async findAll(filters: FilterAttendanceDto) {
        const queryBuilder = this.attendanceRepo.createQueryBuilder('attendances')
            .leftJoinAndSelect('attendances.user', 'users')
            .select([
                'attendances',
                'users.id',
                'users.fullName',
            ]);

        if (filters.startTime) {
            queryBuilder.andWhere('attendance.jDate >= :startTime', { startTime: filters.startTime });
        }

        if (filters.endTime) {
            queryBuilder.andWhere('attendance.jDate <= :endTime', { endTime: filters.endTime });
        }

        return queryBuilder.orderBy('attendances.id', 'DESC').getMany();
    }

    async remove(id: number) {
        const record = await this.attendanceRepo.findOne({
            where: { id }
        })
        if (!record) throw new NotFoundException('record not found');

        await this.attendanceRepo.delete(id);

        return {
            message: 'رکورد با موفقیت پاک شد',
            success: true
        };
    }
}