import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";


@Entity('refresh_token')
export class RefreshToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    tokenHash: string;

    @CreateDateColumn()
    createdAt: Date;
    
    @Column({ type: 'timestamp', nullable: true })
    revokedAt: Date | null;

    @ManyToOne(() => User, user => user.refreshTokens)
    user: User;
}