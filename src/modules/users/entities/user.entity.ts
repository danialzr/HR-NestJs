import { Role } from "../../../shared/enums/user-role.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RefreshToken } from "../../auth/entities/refresh-token.entity";


@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    mobile: string;

    @Column()
    password: string; //hash

    @Column({ type: 'enum', enum: Role, default: Role.EMPLOYEE })
    role: Role;

    @Column({ nullable: true })
    fullName: string;

    @Column({ unique: true, nullable: true })
    nationalCode: string;

    @Column({ nullable: true })
    bankAccountNumber: string;

    @Column({ nullable: true })
    insuranceNumber: string;

    @Column({ nullable: true })
    managerId: number;

    @ManyToOne(() => User, (user) => user.subordinates)
    @JoinColumn({ name: 'managerId' })
    manager: User;

    @OneToMany(() => User, (user) => user.manager)
    subordinates: User[];

    // --- روابط با ماژول‌های دیگر (بعداً اضافه می‌شوند) ---
    // @OneToMany(() => LeaveRequest, lr => lr.employee)
    // leaveRequests: LeaveRequest[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => RefreshToken, rt => rt.user)
    refreshTokens: RefreshToken[];
}