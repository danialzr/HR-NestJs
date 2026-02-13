import { User } from "../../../modules/users/entities/user.entity";
import { TaskPriority } from "../../../shared/enums/task-priority.enum";
import { TaskStatus } from "../../../shared/enums/task-status.enum";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    title: string;

    @Column({ type: 'varchar', nullable: true, length: 250 })
    description: string;

    @Column({ type: 'timestamp', nullable: true })
    deadline: Date;

    @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.TODO })
    status: TaskStatus;

    @Column({ type: 'enum', enum: TaskPriority, default: TaskPriority.MEDIUM })
    priority: TaskPriority;

    @ManyToOne(() => User, (user) => user.assignedTasks)
    assignee: User;

    @ManyToOne(() => User, (user) => user.createdTasks) 
    creator: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
