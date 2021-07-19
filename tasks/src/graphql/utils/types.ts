import { Connection } from "@mikro-orm/core";
import { IDatabaseDriver } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/core";

export type MyContext = {
  em: EntityManager<IDatabaseDriver<Connection>>;
};
