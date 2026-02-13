import { Role } from "../../../shared/enums/user-role.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RefreshToken } from "../../auth/entities/refresh-token.entity";
import { Payroll } from "src/modules/payroll/entities/payroll.entity";
import { Leave } from "src/modules/leaves/entities/leave.entity";
import { Department } from "src/modules/departments/entities/department.entity";


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

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => RefreshToken, rt => rt.user)
    refreshTokens: RefreshToken[];

    @OneToMany(() => Payroll, (payroll) => payroll.user)
    payrolls: Payroll[];

    @OneToMany(() => Leave, (leave) => leave.user)
    leaves: Leave[];

    @ManyToOne(() => Department, (dept) => dept.users, { onDelete: 'SET NULL' })
    department: Department;
}