import { Exclude } from "class-transformer";
import { randomUUID } from "crypto";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  BeforeInsert,
  Column,
  Entity as TOEntity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";

import Entity from "./Entity";
import Task from "./Task";
import User from "./User";

dayjs.extend(relativeTime);

@TOEntity("projects")
export default class Project extends Entity {
  constructor(project: Partial<Project>) {
    super();
    Object.assign(this, project);
  }

  @Index()
  @Exclude()
  @Column({ type: "uuid" })
  userId: string;

  @Column()
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.tasks)
  @JoinColumn({ name: "userId" })
  user: User;

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];

  @BeforeInsert()
  async genId() {
    this.id = randomUUID();
  }
}
