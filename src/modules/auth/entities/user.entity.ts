import { Role } from "../../../shared/enums/user-role.enum";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RefreshToken } from "./refresh-token.entity";


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

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => RefreshToken, rt => rt.user)
    refreshTokens: RefreshToken[];
}