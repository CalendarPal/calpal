import express, { json } from "express";
import { authUser } from "./middlewares/auth-user";
import { errorHandler } from "./middlewares/error-handler";
import { taskRouter } from "./handlers/routes";

const app = express();

app.use(json());
app.use(authUser);

app.use("/api/tasks", taskRouter);

app.use(errorHandler);

export default app;