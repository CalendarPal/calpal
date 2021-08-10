import { NextFunction, Request, Response, Router } from "express";
import { getRepository } from "typeorm";
import { body } from "express-validator";

import Note from "../entities/Notes";
import Project from "../entities/Project";
import Task from "../entities/Task";
import { ConflictError } from "../errors/conflict-errors";
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

    const check = await getRepository(Task)
      .createQueryBuilder("task")
      .where(
        "task.userId = :uid AND task.projectId = :pid AND lower(task.title) = :title",
        {
          uid: user.id,
          pid: project.id,
          title: title.toLowerCase(),
        }
      )
      .getOne();

    if (check) throw new ConflictError("title");

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

const getTasks = async (_: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;

  try {
    const tasks = await Task.find({
      where: { userId: user.id },
      order: { goalDate: "ASC" },
      relations: ["project", "notes"],
    });

    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
};

const getTask = async (req: Request, res: Response, next: NextFunction) => {
  const { identifier } = req.params;

  const user = res.locals.user;

  try {
    const task = await Task.findOneOrFail({
      where: { userId: user.id, id: identifier },
      relations: ["project", "notes"],
    });

    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
};

const createNoteOnTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { identifier } = req.params;
  const body = req.body.body;

  const user = res.locals.user;

  try {
    const task = await Task.findOneOrFail({
      where: { userId: user.id, id: identifier },
      relations: ["project", "user"],
    });

    const note = new Note({ body, user, task });

    await note.save();

    res.status(200).json(note);
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
router.get("/", user, getTasks);
router.get("/:identifier", user, getTask);
router.post(
  "/:identifier/notes",
  user,
  [body("body").notEmpty().trim().withMessage("required")],
  validateRequest,
  createNoteOnTask
);
export default router;
