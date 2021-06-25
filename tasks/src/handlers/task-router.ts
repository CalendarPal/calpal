import express, { Request, Response, Router, NextFunction } from "express";
import { body } from "express-validator";

import { requireAuth } from "../middlewares/require-auth";
import { serviceContainer } from "../injection";
import { validateRequest } from "../middlewares/validate-request";

export const createTaskRouter = (): Router => {
  const taskRouter = express.Router();
  const { taskService } = serviceContainer.services;

  taskRouter.use(requireAuth);

  taskRouter.get("/", (req: Request, res: Response) => {
    res.json({
      user: req.currentUser,
      reqBody: req.body,
    });
  });

  taskRouter.post(
    "/",
    [
      body("task").not().isEmpty().trim().withMessage("required"),
      body("refUrl").optional().isURL().trim().withMessage("url"),
      body("emailReminder").optional().isBoolean().withMessage("boolean"),
    ],
    async (req: Request, res: Response, next: NextFunction) => {

      const { task, refUrl, emailReminder } = req.body;

      try {
        const created = await taskService.addTask(
          { task, refUrl, emailReminder },
          { email: req.currentUser!.email, id: req.currentUser!.uid }
        );

        res.status(201).json(created);
      } catch (err) {
        next(err);
      }
    }
  );

  return taskRouter;
};
