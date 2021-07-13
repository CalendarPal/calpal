import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Task {
  @PrimaryKey()
  id!: number;

  @Property()
  title!: string;

  @Property()
  description!: string;

  @Property()
  emailReminder!: boolean;

  @Property()
  userId!: string;

  @Property()
  startDate = new Date();

  @Property()
  goalDate = new Date(Date.now() + 3600 * 1000 * 24);

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
