import { NextFunction, Request, Response, Router } from "express";
import { body } from "express-validator";
import { getRepository } from "typeorm";

import Project from "../entities/Project";
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

const router = Router();
router.use(requireAuth);

router.post(
  "/",
  user,
  [body("title").notEmpty().trim().withMessage("required")],
  validateRequest,
  createProject
);

export default router;
