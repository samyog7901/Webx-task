import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
  } from "typeorm";
  import { User } from "./User"
  
  @Entity()
  export class PasswordReset {
    @PrimaryGeneratedColumn("uuid")
    id!: string
  
    @Column()
    tokenHash!: string
  
    @Column()
    expiresAt!: Date
  
    @ManyToOne(() => User, (user) => user.passwordResets)
    user!: User
  
    @CreateDateColumn()
    createdAt!: Date
  }