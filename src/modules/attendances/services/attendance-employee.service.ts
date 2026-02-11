import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Attendance } from "../entities/attendance.entity";
import { IsNull, Repository } from "typeorm";
import { FilterAttendanceDto } from "../dto/filter-attendance.dto";


@Injectable()
export class AttendanceEmployeeService {
    constructor(
        @InjectRepository(Attendance)
        private readonly attendanceRepo: Repository<Attendance>
    ) { }

    //CheckIn API
    async checkIn(userId: number, jDate: string, notes?: string) {
        if (!jDate) throw new BadRequestException('Enter Date');

        const openedAttendance = await this.attendanceRepo.find({
            where: {
                user: { id: userId },
                checkOutTime: IsNull(),
                jDate
            }
        });

        if (openedAttendance.length) throw new BadRequestException('You have open attendance')

        const attendance = this.attendanceRepo.create({
            user: { id: userId } as any,
            checkInTime: new Date(),
            notes: notes || null,
            jDate
        })

        return await this.attendanceRepo.save(attendance);
    }

    //CHeckOut API
    async checkOut(userId: number, jDate: string, notes?: string) {
        const attendance = await this.attendanceRepo.findOne({
            where: {
                user: { id: userId },
                checkOutTime: IsNull(),
                jDate
            },
            order: { checkInTime: 'DESC' }
        });

        if (!attendance) throw new NotFoundException('هیچ رکرود ورودی بدون خروج یافت نشد');

        attendance.checkOutTime = new Date();

        if (notes) {
            attendance.notes = attendance.notes ? `${attendance.notes} - ${notes}` : notes;
        }

        return await this.attendanceRepo.save(attendance)
    }

    async findMyattendance(userId: number, filters: FilterAttendanceDto) {
        const queryBuilder = this.attendanceRepo
            .createQueryBuilder('attendances')
            .where('attendances.userId = userId', { userId });

        if (filters.startTime) {
            queryBuilder.andWhere('attendances.jDate >= :startTime', {
                startTime: filters.startTime
            });
        }

        if (filters.endTime) {
            queryBuilder.andWhere('attendances.jDate <= :endTime', {
                endTime: filters.endTime
            });
        }

        return await queryBuilder
            .orderBy('attendances.checkInTime', 'DESC')
            .getMany();
    }
}