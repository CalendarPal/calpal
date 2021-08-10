import { Exclude } from "class-transformer";
import { IsEmail } from "class-validator";
import { Column, Entity as TOEntity, Index, OneToMany } from "typeorm";

import Entity from "./Entity";
import Project from "./Project";
import Task from "./Task";

@TOEntity("users")
export default class User extends Entity {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @Index()
  @Exclude()
  @IsEmail()
  @Column({ unique: true, update: true })
  email: string;

  @Column()
  name: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @OneToMany(() => Project, (project) => project.user)
  projects: Project[];
}
