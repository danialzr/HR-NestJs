import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "../entities/task.entity";
import { Repository } from "typeorm";
import { User } from "src/modules/users/entities/user.entity";
import { CreateTaskDto } from "../dto/create-task.dto";
import { TaskStatus } from "src/shared/enums/task-status.enum";
import { UpdateTaskDto } from "../dto/update-task.dto";

@Injectable()
export class TasksManagerService {
    constructor(
        @InjectRepository(Task)
        private readonly taskRepo: Repository<Task>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ) { }

    async create(creatorId, dto: CreateTaskDto) {
        const assignee = await this.userRepo.findOneBy({ id: dto.assigneeId });
        if (!assignee) throw new NotFoundException('گکارمند مورد نظر وجود ندارد');

        const task = this.taskRepo.create({
            ...dto,
            assignee,
            creator: { id: creatorId } as User
        })

        return await this.taskRepo.save(task)
    }

    async findAll(filters: { assigneeId?: any, status?: TaskStatus }) {
        const query = this.taskRepo.createQueryBuilder('tasks')
            .leftJoinAndSelect('tasks.assignee', 'assignee')
            .leftJoinAndSelect('tasks.creator', 'creator');

        if (filters.assigneeId) {
            const targetAssigneeId = typeof filters.assigneeId === 'string'
                ? parseInt(filters.assigneeId, 10)
                : filters.assigneeId;

            if (!isNaN(targetAssigneeId)) {
                query.andWhere('assignee.id = :assigneeId', { assigneeId: targetAssigneeId });
            }
        }

        if (filters.status) {
            query.andWhere('tasks.status = :status', { status: filters.status });
        }

        return await query
            .select([
                'tasks',
                'assignee.id', 'assignee.fullName',
                'creator.id', 'creator.fullName'
            ])
            .orderBy('tasks.createdAt', 'DESC')
            .getMany();
    }

    async update(id: number, dto: UpdateTaskDto) {
        const task = await this.taskRepo.findOneBy({ id });
        if (!task) throw new NotFoundException('تسک یافت نشد');

        if (dto.assigneeId) {
            const newAssignee = await this.userRepo.findOneBy({ id: dto.assigneeId });
            if (!newAssignee) throw new NotFoundException('کارمند جدید یافت نشد');
            task.assignee = newAssignee;
        }

        Object.assign(task, dto);
        return await this.taskRepo.save(task);
    }

    async remove(id: number) {
        const result = await this.taskRepo.delete(id);
        if (result.affected === 0) throw new NotFoundException('تسک پیدا نشد');
        return { success: true, message: 'تسک با موفقیت حذف شد' };
    }
}