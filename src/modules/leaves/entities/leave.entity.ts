import { User } from "../../../modules/users/entities/user.entity";
import { LeaveStatus } from "../../../shared/enums/leave-status.enum";
import { LeaveType } from "../../../shared/enums/leave-type.enum";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('leaves')
export class Leave {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 10 })
    startDate: string;

    @Column({ type: 'varchar', length: 10 })
    endDate: string;

    @Column({ type: 'int', nullable: true })
    startTime?: number | null;

    @Column({ type: 'int', nullable: true })
    endTime?: number | null;

    @Column({ type: 'int', default: 0 })
    totalMinute: number;

    @Column({ type: 'varchar', length: 255, nullable: true, })
    reason?: string;

    @Column({ type: 'enum', enum: LeaveStatus, default: LeaveStatus.PENDING })
    status: LeaveStatus;

    @Column({ type: 'enum', enum: LeaveType, default: LeaveType.HOURLY })
    type: LeaveType;

    @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
    approvedBy: User;

    @ManyToOne(() => User, (user) => user.leaves, {
        eager: true,
        onDelete: 'CASCADE'
    })
    user: User;
}
