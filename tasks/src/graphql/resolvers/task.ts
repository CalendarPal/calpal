import { Task } from "../../database/models/Task";
import { Ctx, Query, Resolver } from "type-graphql";

@Resolver()
export class TaskResolver {
  @Query(() => [Task])
  tasks(@Ctx() ctx: MyContext) {
    return "hello world";
  }
}
