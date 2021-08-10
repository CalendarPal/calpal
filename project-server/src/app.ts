import cors from "cors";
import express, { Express } from "express";
import morgan from "morgan";

import { authUser } from "./middleware/auth-user";
import { errorHandler } from "./middleware/error-handler";
import projectRoutes from "./routes/projects";
import taskRoutes from "./routes/tasks";

const createApp = (): Express => {
  const app = express();

  app.use(express.json());
  app.use(authUser);
  app.use(morgan("dev"));
  app.use(
    cors({
      credentials: true,
      origin: "http://calpal.test",
      optionsSuccessStatus: 200,
    })
  );

  app.get("/api", (_, res) => res.send("Hello World"));
  app.use("/api/tasks", taskRoutes);
  app.use("/api/projects", projectRoutes);

  app.use(errorHandler);

  return app;
};

export default createApp;
