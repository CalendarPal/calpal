import { Exclude, Expose } from "class-transformer";
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
import Note from "./Notes";
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
  @Column({ type: "uuid" })
  projectId: string;

  @ManyToOne(() => User, (user) => user.tasks)
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => Project, (project) => project.tasks)
  @JoinColumn({ name: "projectId" })
  project: Project;

  @OneToMany(() => Note, (note) => note.task)
  notes: Note[];

  @Expose() get url(): string {
    return `/p/${this.projectId}/${this.id}`;
  }

  @Expose() get noteCount(): number {
    return this.notes?.length;
  }

  @BeforeInsert()
  async genId() {
    this.id = randomUUID();
  }
}
