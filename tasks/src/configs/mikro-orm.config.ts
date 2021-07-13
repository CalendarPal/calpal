import { Task } from "../database/models/Task";
import { MikroORM } from "@mikro-orm/core";
import path from "path";
import dotenv from "dotenv";

/*
 * Load environment vars
 */
const result = dotenv.config({
  path: path.resolve(process.cwd(), ".env.dev"),
});

if (result.error) {
  console.error(
    `Unable to load environment variables. Reason:\n${result.error}`
  );
  process.exit();
}

console.info("Successfully loaded environment variables");

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Task],
  dbName: "postgres",
  type: "postgresql",
  user: process.env.PG_USER ? process.env.PG_USER : undefined,
  host: process.env.PG_TASK ? process.env.PG_TASK : undefined,
  password: process.env.PG_PASSWORD ? process.env.PG_PASSWORD : undefined,
  port: process.env.PG_PORT ? parseInt(process.env.PG_PORT) : undefined,
  debug: process.env.NODE_ENV !== "production",
} as Parameters<typeof MikroORM.init>[0];
