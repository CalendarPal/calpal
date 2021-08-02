import { NextFunction, Request, Response, Router } from "express";
import { body } from "express-validator";
import Task from "../entities/Task";

import { validateRequest } from "../middleware/validate-request";
import { requireAuth } from "../middleware/require-auth";
import user from "../middleware/store-user";

// const createTask = (req: Request, res: Response) => {
//   const { title, description, project } = req.body;

//   const user = req.currentUser;

//   if (title.trim() === "") {
//     res.status(400)
//   }
// };

const router = Router();
router.use(requireAuth);

// router.post("/", createTask);

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
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, projectId } = req.body;

    const user = res.locals.user;

    try {
      // TODO: Find project

      //   title,
      //   description,
      //   refUrl,
      //   emailReminder,
      //   email
      //   uid
      //   projectId,

      const task = new Task({
        title,
        description,
        user,
        projectId: projectId,
      });

      await task.save();

      res.status(201).json(task);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
