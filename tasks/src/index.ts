import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Task } from "./entities/Task";
import microConfig from "./mikro-orm.config";

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();
  // const task = orm.em.create(Task, { title: "my first task" });
  // await orm.em.persistAndFlush(task);

  // const tasks = await orm.em.find(Task, {});
  // console.log(tasks);
};

main().catch((err) => {
  console.error(err);
});
