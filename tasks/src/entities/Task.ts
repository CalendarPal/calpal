import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Task {
  @PrimaryKey()
  id!: number;

  @Property({ type: "text" })
  title!: string;

  // @Property({ type: "text" })
  // description!: string;

  // @Property({ type: "boolean" })
  // emailReminder = false;

  // @Property({ type: "text" })
  // userId!: string;

  @Property({ type: "date" })
  startDate = new Date();

  @Property({ type: "date" })
  goalDate = new Date(Date.now() + 3600 * 1000 * 24);

  @Property({ type: "date" })
  createdAt = new Date();

  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();
}
