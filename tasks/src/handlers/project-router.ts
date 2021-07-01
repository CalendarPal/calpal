import express, { Request, Response, Router, NextFunction } from "express";
import { body, query } from "express-validator";

import { requireAuth } from "../middlewares/require-auth";
import { serviceContainer } from "../injection";
import { validateRequest } from "../middlewares/validate-request";
import { BadRequestError } from "../errors/bad-request-error";

export const createProjectRouter = (): Router => {
  const projectRouter = express.Router();
  const { projectService } = serviceContainer.services;

  projectRouter.use(requireAuth);

  projectRouter.get(
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
        const projectList = await projectService.getProjects({
          userId: req.currentUser!.uid,
          limit,
          page,
        });

        res.status(200).json(projectList);
      } catch (err) {
        next(err);
      }
    }
  );

  projectRouter.post(
    "/",
    [body("project").notEmpty().trim().withMessage("required")],
    validateRequest,
    async (req: Request, res: Response, next: NextFunction) => {
      const { project, refUrl, emailReminder, description } = req.body;

      try {
        const created = await projectService.addProject({
          project,
          uid: req.currentUser!.uid,
        });

        res.status(201).json(created);
      } catch (err) {
        next(err);
      }
    }
  );

  projectRouter.post(
    "/delete",
    [
      body("projectIds")
        .isArray({ min: 1 })
        .withMessage("must be array with non-zero length"),
      body("projectIds.*").isUUID().withMessage("array must contain UUIDs"),
    ],
    validateRequest,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const deletedIds = await projectService.deleteProjects(
          req.body.projectIds
        );
        return res.status(200).json(deletedIds);
      } catch (err) {
        next(err);
      }
    }
  );

  projectRouter.put(
    "/:id",
    [
      body("project")
        .isString()
        .isLength({ min: 1 })
        .trim()
        .withMessage("required"),
    ],
    validateRequest,
    async (req: Request, res: Response, next: NextFunction) => {
      const { project } = req.body;

      try {
        const updated = await projectService.updateProject({
          id: req.params.id,
          uid: req.currentUser!.uid,
          project,
        });

        res.status(200).json(updated);
      } catch (err) {
        next(err);
      }
    }
  );

  return projectRouter;
};
