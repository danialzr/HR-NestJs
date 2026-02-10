import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Attendance } from "../entities/attendance.entity";
import { IsNull, Repository } from "typeorm";


@Injectable()
export class AttendanceEmployeeService {
    constructor(
        @InjectRepository(Attendance)
        private readonly attendanceRepo: Repository<Attendance>
    ) {}

    //CheckIn API
    async checkIn(userId: number, notes?: string) {
        const attendance = this.attendanceRepo.create({
            user: { id: userId} as any,
            checkInTime: new Date(),
            notes: notes || null
        })

        return await this.attendanceRepo.save(attendance);
    }

    //CHeckOut API
    async checkOut(userId: number, notes?: string) {
        const attendance = await this.attendanceRepo.findOne({
            where: {
                user: {id: userId},
                checkOutTime: IsNull()
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
}