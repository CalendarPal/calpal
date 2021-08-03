import { NextFunction, Request, Response, Router } from "express";
import { body } from "express-validator";

import Project from "../entities/Project";
import Task from "../entities/Task";
import { requireAuth } from "../middleware/require-auth";
import user from "../middleware/store-user";
import { validateRequest } from "../middleware/validate-request";

const createTask = async (req: Request, res: Response, next: NextFunction) => {
  const { title, description, projectId } = req.body;

  const user = res.locals.user;

  try {
    const project = await Project.findOneOrFail({
      id: projectId,
      userId: user.id,
    });

    const task = new Task({
      title,
      description,
      user,
      project: project,
    });

    await task.save();

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

const router = Router();
router.use(requireAuth);

router.post(
  "/",
  user,
  [
    body("title").notEmpty().trim().withMessage("required"),
    body("description").notEmpty().trim().withMessage("required"),
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
  createTask
);

export default router;
