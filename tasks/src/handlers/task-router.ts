import express, { Request, Response, Router, NextFunction } from "express";
import { body, query } from "express-validator";

import { requireAuth } from "../middlewares/require-auth";
import { serviceContainer } from "../injection";
import { validateRequest } from "../middlewares/validate-request";
import { BadRequestError } from "../errors/bad-request-error";

export const createTaskRouter = (): Router => {
  const taskRouter = express.Router();
  const { taskService } = serviceContainer.services;

  taskRouter.use(requireAuth);

  taskRouter.get(
    "/",
    [
      query("page")
        .optional({ nullable: true })
        .isInt()
        .withMessage("Must be null or an integer"),
      query("limit")
        .optional({ nullable: true })
        .isInt({ max: 100 })
        .withMessage("Must be null or an integer less than or equal to 100"),
    ],
    validateRequest,
    async (req: Request, res: Response, next: NextFunction) => {
      const limit = req.query["limit"]
        ? parseInt(req.query["limit"] as string)
        : undefined;
      const page = req.query["page"]
        ? parseInt(req.query["page"] as string)
        : undefined;

      try {
        const taskList = await taskService.getTasks({
          userId: req.currentUser!.uid,
          limit,
          page,
        });

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
      body("refUrl")
        .optional({ checkFalsy: true })
        .isURL()
        .trim()
        .withMessage("url"),
      body("emailReminder")
        .optional({ nullable: true })
        .isBoolean()
        .withMessage("boolean"),
      body("projectId")
        .optional()
        .isUUID()
        .withMessage("UUID to attached project (if any)"),
    ],
    validateRequest,
    async (req: Request, res: Response, next: NextFunction) => {
      const { task, refUrl, emailReminder, description, projectId } = req.body;

      try {
        const created = await taskService.addTask({
          task,
          description,
          refUrl,
          emailReminder,
          email: req.currentUser!.email,
          uid: req.currentUser!.uid,
          projectId,
        });

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

  taskRouter.put(
    "/:id",
    [
      body("task")
        .isString()
        .isLength({ min: 1 })
        .trim()
        .withMessage("required"),
      body("description")
        .exists({ checkNull: true })
        .isString()
        .trim()
        .withMessage("required"),
      body("refUrl")
        .exists({ checkNull: true })
        .if(body("refUrl").notEmpty())
        .isURL()
        .trim()
        .withMessage("url"),
      body("emailReminder").optional().isBoolean().withMessage("boolean"),
      body("goalDate")
        .exists({ checkNull: true })
        .notEmpty()
        .withMessage("date"),
      body("projectId")
        .optional()
        .isUUID()
        .withMessage("UUID to attached project (if any)"),
    ],
    validateRequest,
    async (req: Request, res: Response, next: NextFunction) => {
      const {
        task,
        refUrl,
        emailReminder: eReminder,
        description,
        startDate: strDate,
        goalDate: glDate,
        projectId: pId,
      } = req.body;

      // parse date
      let startDate: Date;
      let goalDate: Date;
      let projectId =
        pId != null ? pId : "00000000-0000-0000-0000-000000000000";
      let emailReminder = eReminder != null ? eReminder : false;
      try {
        startDate = new Date(strDate as string);
        goalDate = new Date(glDate as string);
      } catch (err) {
        console.error("Invalid date string!", err);
        throw new BadRequestError(
          "startDate must be a string that can be parsed as a date"
        );
      }

      try {
        const updated = await taskService.updateTask({
          id: req.params.id,
          uid: req.currentUser!.uid,
          task,
          description,
          refUrl,
          emailReminder,
          startDate,
          goalDate,
          projectId,
        });

        res.status(200).json(updated);
      } catch (err) {
        next(err);
      }
    }
  );

  return taskRouter;
};
