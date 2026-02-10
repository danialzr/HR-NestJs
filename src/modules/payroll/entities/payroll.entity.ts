import { User } from "src/modules/auth/entities/user.entity";
import { PayrollStatus } from "src/shared/enums/payroll-status.enum";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('payrolls')
export class Payroll {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 7 })
    salaryPeriod: string;

    @Column()
    baseSalary: number;

    @Column({ default: 0})
    bonuses: number;

    @Column({ default: 0})
    deduction: number;

    @Column()
    totalAmount: number;

    @Column({ type: 'enum', enum: PayrollStatus, default: PayrollStatus.PENDING })
    status: PayrollStatus;

    @Column({ type: 'timestamp', nullable: true})
    paymentDate: Date; 

    @CreateDateColumn()
    createdAt: Date;
    
    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, { eager: true })
    user: User
}