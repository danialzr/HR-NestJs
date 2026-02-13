import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLeaveDto } from '../dto/create-leave.dto';
import { UpdateLeaveDto } from '../dto/update-leave.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Leave } from '../entities/leave.entity';
import { Not, Repository } from 'typeorm';
import { LeaveStatus } from '../../../shared/enums/leave-status.enum';

@Injectable()
export class LeaveEmployeeService {
  constructor(
    @InjectRepository(Leave)
    private readonly leaveRepo: Repository<Leave>,
  ) { }

  async create(userId: number, dto: CreateLeaveDto) {
    if (!dto.startDate || !dto.endDate) throw new BadRequestException('زمان شروع یا پایان مرخصی خالی است');

    const isLeave = await this.leaveRepo.find({
      where: {
        user: { id: userId },
        startDate: dto.startDate,
        endDate: dto.endDate
      }
    })
    if (isLeave.length) throw new BadRequestException('درخواست مرحصی وجود دارد');

    let startInMinutes: number | null = null;
    let endInMinutes: number | null = null;
    let totalMinute = 0;

    if (dto.startTime && dto.endTime) {
      startInMinutes = this.timeToMinutes(dto.startTime);
      endInMinutes = this.timeToMinutes(dto.endTime);

      totalMinute = endInMinutes - startInMinutes;

      if (totalMinute <= 0) {
        throw new BadRequestException('زمان پایان مرخصی نمی‌تواند قبل یا مساوی زمان شروع باشد');
      }
    }

    const leave = this.leaveRepo.create({
      startDate: dto.startDate,
      endDate: dto.endDate,
      startTime: startInMinutes,
      endTime: endInMinutes,
      totalMinute,
      reason: dto.reason,
      type: dto.type,
      user: { id: userId } as any,
    })

    return await this.leaveRepo.save(leave);
  }

  async findAll(userId: number) {
    const leaves = await this.leaveRepo.find({
      where: { user: { id: userId } },
      order: { id: 'DESC' }
    });

    return leaves.map(leave => ({
      ...leave,
      startTime: leave.startTime ? this.minutesToTime(leave.startTime) : null,
      endTime: leave.endTime ? this.minutesToTime(leave.endTime) : null,
    }));
  }

  async findOne(id: number, userId: number) {
    const leave = await this.leaveRepo.findOne({
      where: { id, user: { id: userId } }
    });
    if (!leave) throw new NotFoundException('این مرخصی وجود ندارد');

    return {
      ...leave,
      startTime: leave.startTime ? this.minutesToTime(leave.startTime) : null,
      endTime: leave.endTime ? this.minutesToTime(leave.endTime) : null,
    };
  }

  async update(id: number, userId: number, dto: UpdateLeaveDto) {
    const leave = await this.leaveRepo.findOne({ where: { id, user: { id: userId } } });

    if (!leave) { throw new NotFoundException('مرخصی یافت نشد'); }

    if (leave.status !== LeaveStatus.PENDING) {
      throw new BadRequestException('مرخصی تایید یا رد شده قابل ویرایش نیست');
    }

    const { startTime, endTime } = dto;

    if (dto.startDate || dto.endDate) {
      const exists = await this.leaveRepo.findOne({
        where: {
          user: { id: userId },
          startDate: dto.startDate ?? leave.startDate,
          endDate: dto.endDate ?? leave.endDate,
          id: Not(id),
        },
      });
      if (exists) throw new BadRequestException('مرخصی با این تاریخ وجود دارد');
    }

    let startInMinutes = startTime ? this.timeToMinutes(startTime) : leave.startTime;
    let endInMinutes = endTime ? this.timeToMinutes(endTime) : leave.endTime;

    let totalMinute = leave.totalMinute;

    if (typeof startInMinutes === 'number' && typeof endInMinutes === 'number') {
      totalMinute = endInMinutes - startInMinutes;
      if (totalMinute <= 0) {
        throw new BadRequestException('زمان پایان نمی‌تواند قبل یا مساوی زمان شروع باشد');
      }
    }
    Object.assign(leave, {
      startDate: dto.startDate ?? leave.startDate,
      endDate: dto.endDate ?? leave.endDate,
      reason: dto.reason ?? leave.reason,
      type: dto.type ?? leave.type,
      startTime: startInMinutes,
      endTime: endInMinutes,
      totalMinute
    });

    return await this.leaveRepo.save(leave);
  }

  async remove(id: number, userId: number) {
    const leave = await this.leaveRepo.findOne({
      where: { id, user: { id: userId } }
    });

    if (!leave) {
      throw new NotFoundException('مرخصی یافت نشد');
    }

    if (leave.status !== LeaveStatus.PENDING) {
      throw new BadRequestException('مرخصی تایید یا رد شده قابل حذف نیست');
    }

    await this.leaveRepo.remove(leave);

    return {
      message: 'درخواست مرخصی با موفقیت حذف شد',
      success: true
    };
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
