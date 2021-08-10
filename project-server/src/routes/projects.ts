import { NextFunction, Request, Response, Router } from "express";
import { body } from "express-validator";
import { getRepository } from "typeorm";

import Project from "../entities/Project";
import Task from "../entities/Task";
import User from "../entities/User";
import { ConflictError } from "../errors/conflict-errors";
import { requireAuth } from "../middleware/require-auth";
import user from "../middleware/store-user";
import { validateRequest } from "../middleware/validate-request";

const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, description } = req.body;

  const user: User = res.locals.user;

  try {
    const check = await getRepository(Project)
      .createQueryBuilder("project")
      .where("project.userId = :uid AND lower(project.title) = :title", {
        uid: user.id,
        title: title.toLowerCase(),
      })
      .getOne();

    if (check) throw new ConflictError("title");

    const project = new Project({
      title,
      description,
      user,
    });

    await project.save();

    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
};

const getProjects = async (_: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;

  try {
    let projects = await Project.find({
      where: { userId: user.id },
      relations: ["tasks"],
    });

    res.status(200).json(projects);
  } catch (err) {
    next(err);
  }
};

const getProject = async (req: Request, res: Response, next: NextFunction) => {
  const { identifier } = req.params;

  const user = res.locals.user;

  try {
    const project = await Project.findOneOrFail({
      where: { userId: user.id, id: identifier },
      // relations: ["tasks"],
    });

    const tasks = await Task.find({
      where: { project },
      order: { goalDate: "ASC" },
      relations: ["project", "notes"],
    });

    project.tasks = tasks;

    res.status(200).json(project);
  } catch (err) {
    next(err);
  }
};

const router = Router();
router.use(requireAuth);

router.post(
  "/",
  user,
  [body("title").notEmpty().trim().withMessage("required")],
  validateRequest,
  createProject
);
router.get("/", user, getProjects);
router.get("/:identifier", user, getProject);

export default router;
