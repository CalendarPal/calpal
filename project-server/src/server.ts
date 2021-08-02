import "reflect-metadata";
import { createConnection } from "typeorm";
import { initDS, DataSources } from "./data";
import path from "path";
import dotenv from "dotenv";

import { UserUpdatesListener } from "./events/user-updates-listener";
import createApp from "./app";



const startup = async () => {
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

  console.info("Successfully loaded environment variables!");

  let ds: DataSources;

  try {
    ds = await initDS();
  } catch (err) {
    console.error(err);
    process.exit();
  }

  console.info("Successfully initialized data sources!");

  const app = createApp();
  app.listen(8080, async () => {
    console.log("Server was ccreated at http://localhost:8080");

    try {
      await createConnection();
      console.log("Database connected");
    } catch (err) {
      console.log(err);
    }
  });

  const listener = new UserUpdatesListener({
    pubSub: ds.pubSubClient,
  });

  await listener.init("events-sub", {
    ackDeadlineSeconds: 30,
  });
  listener.listen();

  process.on("SIGINT", async () => await shutdown());
  process.on("SIGTERM", async () => await shutdown());

  const shutdown = async () => {
    ds.pubSubClient.close();
    await listener.subscription?.delete();
  };
};

startup();