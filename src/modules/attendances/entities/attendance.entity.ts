import { User } from "src/modules/auth/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('attendances')
export class Attendance {
    @PrimaryGeneratedColumn()
    id: number;

    //tarikh shamsi
    @Column({ type: 'text', nullable: false})
    jDate: string;

    @Column({ type: 'timestamp', nullable: true})
    checkInTime: Date | null;

    @Column({ type: 'timestamp', nullable: true})
    checkOutTime: Date | null;

    @Column({ type: 'text', nullable: true })
    notes: string | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, { eager: true})
    user: User;

}