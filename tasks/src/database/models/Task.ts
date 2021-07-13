import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Task {
  @Field()
  @PrimaryKey()
  id!: number;

  @Field()
  @Property({ type: "text" })
  title!: string;

  // @Property({ type: "text" })
  // description!: string;

  // @Property({ type: "boolean" })
  // emailReminder = false;

  // @Property({ type: "text" })
  // userId!: string;

  @Field()
  @Property({ type: "date" })
  startDate = new Date();

  @Field()
  @Property({ type: "date" })
  goalDate = new Date(Date.now() + 3600 * 1000 * 24);

  @Field()
  @Property({ type: "date" })
  createdAt = new Date();

  @Field()
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();
}
