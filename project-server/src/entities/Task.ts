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
} from "typeorm";

import Entity from "./Entity";
import Project from "./Project";
import User from "./User";

dayjs.extend(relativeTime);

@TOEntity("tasks")
export default class Task extends Entity {
  constructor(task: Partial<Task>) {
    super();
    Object.assign(this, task);
  }

  @Index()
  @Exclude()
  @Column({ type: "uuid" })
  userId: string;

  @Column()
  title: string;

  @Column({ type: "text" })
  description: string;

  @Index()
  @Column({ type: "timestamptz", default: () => "NOW()" })
  startDate: Date;

  @Index()
  @Column({
    type: "timestamptz",
    default: () => "NOW() + INTERVAL '24 HOURS'",
  })
  goalDate: Date;

  @Index()
  @Column()
  projectId: string;

  @ManyToOne(() => User, (user) => user.tasks)
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => Project, (project) => project.user)
  @JoinColumn({ name: "projectId" })
  project: Project;

  @BeforeInsert()
  async genId() {
    this.id = randomUUID();
  }
}
