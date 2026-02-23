import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn
  } from "typeorm";
  import { Auth } from "./Auth";
  import { PasswordReset } from "./PasswordReset";
  
  @Entity()
  export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
  
    @Column()
    name!: string;
  
    @Column({ unique: true })
    email!: string;
  
    @Column()
    password!: string;
  
    @Column({ default: "user" })
    role!: string;
  
    @OneToOne(() => Auth, (auth) => auth.user)
    auth!: Auth;
  
    @OneToMany(() => PasswordReset, (reset) => reset.user)
    passwordResets!: PasswordReset[];
  
    @CreateDateColumn()
    createdAt!: Date;
  
    @UpdateDateColumn()
    updatedAt!: Date;
  }