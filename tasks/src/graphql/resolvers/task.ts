import { Task } from "../../database/models/Task";
import { Arg, Ctx, Int, Query, Resolver } from "type-graphql";
import { MyContext } from "../utils/types";

@Resolver()
export class TaskResolver {
  @Query(() => [Task])
  tasks(@Ctx() { em }: MyContext): Promise<Task[]> {
    return em.find(Task, {});
  }

  @Query(() => Task, { nullable: true })
  task(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<Task | null> {
    return em.findOne(Task, { id });
  }
}
