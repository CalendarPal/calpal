import express, { Express } from 'express';
import morgan from 'morgan';

import { authUser } from './middleware/auth-user';
import { errorHandler } from './middleware/error-handler';
import taskRoutes from './routes/tasks';

const createApp = (): Express => {
  const app = express();

  app.use(express.json());
  app.use(authUser);
  app.use(morgan("dev"));

  app.get("/api", (_, res) => res.send("Hello World"));
  app.use("/api/tasks", taskRoutes);

  app.use(errorHandler);

  return app;
};

export default createApp;
