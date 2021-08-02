import { Entity as TOEntity, Column, Index, OneToMany } from "typeorm";

import Entity from "./Entity";
import Task from "./Task";

@TOEntity("users")
export default class User extends Entity {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @Index()
  @Column({ unique: true })
  email: string;
  
  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  // For Future

  // @OneToMany(() => Project, (project) => project.user)
  // projects: Project[];

  // Unsure if this is needed

  // @BeforeInsert()
  // async hashPassword() {
  //   this.password = await bcrypt.hash(this.password, 6);
  // }
}
