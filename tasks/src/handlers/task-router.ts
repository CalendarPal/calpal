import express, { Request, Response, Router, NextFunction } from "express";
import { body, check } from "express-validator";
import { requireAuth } from "../middlewares/require-auth";
import { serviceContainer } from "../injection";
import { validateRequest } from "../middlewares/validate-request";

export const createTaskRouter = (): Router => {
  const taskRouter = express.Router();
  const { taskService } = serviceContainer.services;

  taskRouter.use(requireAuth);

  taskRouter.get(
    "/",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const taskList = await taskService.getTasks(req.currentUser!.uid);

        res.status(200).json(taskList);
      } catch (err) {
        next(err);
      }
    }
  );

  taskRouter.post(
    "/",
    [
      body("task").notEmpty().trim().withMessage("required"),
      body("description").notEmpty().trim().withMessage("required"),
      body("refUrl").optional().isURL().trim().withMessage("url"),
      body("emailReminder").optional().isBoolean().withMessage("boolean"),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
      const { task, refUrl, emailReminder, description } = req.body;

      try {
        const created = await taskService.addTask(
          { task, description, refUrl, emailReminder },
          { email: req.currentUser!.email, id: req.currentUser!.uid }
        );

        res.status(201).json(created);
      } catch (err) {
        next(err);
      }
    }
  );

  taskRouter.post(
    "/delete",
    [
      body("taskIds")
        .isArray({ min: 1 })
        .withMessage("must be array with non-zero length"),
      body("taskIds.*").isUUID().withMessage("array must contain UUIDs"),
    ],
    validateRequest,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const deletedIds = await taskService.deleteTasks(req.body.taskIds);
        return res.status(200).json(deletedIds);
      } catch (err) {
        next(err);
      }
    }
  );

  return taskRouter;
};
