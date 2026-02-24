import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
  } from "typeorm"
  import { User } from "./User";
  
  @Entity()
  export class Auth {
    @PrimaryGeneratedColumn("uuid")
    id!: string
  
    @Column({ nullable: true })
    refreshToken!: string
  
    @OneToOne(() => User, (user) => user.auth)
    @JoinColumn()
    user!: User
  }