import { Entity as TOEntity, Column, Index } from "typeorm";

import Entity from "./Entity";

@TOEntity("users")
export default class User extends Entity {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @Index()
  @Column({ unique: true })
  email: string;

  // For Future

  // @OneToMany(() => Task, (task) => task.user)
  // tasks: Task[];

  // @OneToMany(() => Project, (project) => project.user)
  // projects: Project[];

  // Unsure if this is needed

  // @BeforeInsert()
  // async hashPassword() {
  //   this.password = await bcrypt.hash(this.password, 6);
  // }
}
