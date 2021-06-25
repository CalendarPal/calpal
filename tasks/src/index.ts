import dotenv from "dotenv";
import path from "path";
import crypto from "crypto";
import { initDS, DataSources } from "./data";
import { serviceContainer } from "./injection";
import createApp from "./app";
import { UserUpdatesListener } from "./events/user-updates-listener";

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

  /*
   * Initialize data sources (just postgres so far)
   */

  let ds: DataSources;

  try {
    ds = await initDS();
  } catch (err) {
    console.error(err);
    process.exit();
  }

  console.info("Successfully initialized data sources!");

  /*
   * Inject concrete repository implementations into services
   */
  serviceContainer.init(ds);

  console.info("Service container initialized");

  const app = createApp();

  app.listen(process.env.WEB_PORT, () => {
    console.log(`Listening on port ${process.env.WEB_PORT}`);
  });

  const listener = new UserUpdatesListener({
    userService: serviceContainer.services.userService,
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
