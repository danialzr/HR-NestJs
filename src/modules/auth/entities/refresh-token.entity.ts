import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";


@Entity('refresh_token')
export class RefreshToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    tokenHash: string;

    //برای مدیریت نشست 
    @Column({ nullable: true })
    userAgent: string;

    @Column({ nullable: true })
    ipAddress: string;

    @Column({ type: 'timestamp' })
    expiresAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    revokedAt: Date | null;

    @ManyToOne(() => User, user => user.refreshTokens, {
        onDelete: 'CASCADE',
    })
    user: User;
}