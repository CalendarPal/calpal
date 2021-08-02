import { randomUUID } from "crypto";
import {
  Entity as TOEntity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from "typeorm";

import Entity from "./Entity";
import User from "./User";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Exclude } from "class-transformer";

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

  // For Future

  // @OneToMany(() => Project, (project) => project.user)
  // projects: Project[];

  // Unsure if this is needed

  @BeforeInsert()
  async genId() {
    this.id = randomUUID();
  }
}
