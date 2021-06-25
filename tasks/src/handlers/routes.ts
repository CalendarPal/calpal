import express from "express";

import { requireAuth } from "../middlewares/require-auth";

const taskRouter = express.Router();

taskRouter.use(requireAuth);

taskRouter.get("/", (req, res) => {
  res.json({
    user: req.currentUser,
    reqBody: req.body,
  });
});

export { taskRouter };