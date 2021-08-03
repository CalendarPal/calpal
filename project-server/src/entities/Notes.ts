import { Exclude } from "class-transformer";
import { randomUUID } from "crypto";
import {
  BeforeInsert,
  Column,
  Entity as TOEntity,
  Index,
  JoinColumn,
  ManyToOne,
} from "typeorm";

import Entity from "./Entity";
import Task from "./Task";
import User from "./User";

@TOEntity("notes")
export default class Note extends Entity {
  constructor(note: Partial<Note>) {
    super();
    Object.assign(this, note);
  }
  @Index()
  @Exclude()
  @Column({ type: "uuid" })
  userId: string;

  @Column()
  body: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => Task, (task) => task.notes, { nullable: false })
  task: Task;

  @BeforeInsert()
  async genId() {
    this.id = randomUUID();
  }
}
