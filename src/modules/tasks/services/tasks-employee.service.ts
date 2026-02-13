import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "../entities/task.entity";
import { Repository } from "typeorm";
import { TaskStatus } from "../../../shared/enums/task-status.enum";

@Injectable()
export class TasksEmployeeService {
    constructor(
        @InjectRepository(Task)
        private readonly taskRepo: Repository<Task>
    ) { }

    async findOne(taskId: number, userId: number) {
        const task = await this.taskRepo.findOne({
            where: {
                id: taskId,
                assignee: { id: userId }
            },
            relations: ['creator']
        });

        if (!task) throw new NotFoundException('تسک مورد نظر یافت نشد');

        return task;
    }

    async findAll(userId: number) {
        const tasks = await this.taskRepo.find({
            where: {
                assignee: { id: userId }
            },
            relations: ['creator'],
            order: {
                priority: 'DESC',
                createdAt: 'DESC'
            }, 
            select: {
                creator: {
                    id: true,
                    fullName: true
                }
            }
        });
        return tasks
    }

    async updateStatus(taskId: number, userId: number, status: TaskStatus) {
        const task = await this.findOne(taskId, userId)
        task.status = status;
        return await this.taskRepo.save(task)
    }
}