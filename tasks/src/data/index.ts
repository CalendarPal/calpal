import console from "console";
import { Pool } from "pg";
import { PubSub } from "@google-cloud/pubsub";

export interface DataSources {
  db: Pool;
  pubSubClient: PubSub;
}

export const initDS = async (): Promise<DataSources> => {
  const db = new Pool({
    user: process.env.PG_USER ? process.env.PG_USER : undefined,
    host: process.env.PG_TASK ? process.env.PG_TASK : undefined,
    password: process.env.PG_PASSWORD ? process.env.PG_PASSWORD : undefined,
    port: process.env.PG_PORT ? parseInt(process.env.PG_PORT) : undefined,
  });

  // Test connection
  try {
    const client = await db.connect();

    client.release();
  } catch (err) {
    throw new Error(`Unable to connect to postgres. Reason: ${err}`);
  }

  const pubSubClient = new PubSub();

  return {
    db,
    pubSubClient,
  };
};
