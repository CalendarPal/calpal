import { NextFunction, Request, Response } from "express";

import { CustomError } from "../errors/custom-error";

export const errorHandler = (
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      errors: err.serializeErrors(),
    });
  }

  res.status(400).json({
    errors: [{ message: "Something went wrong" }],
  });
  next(err);
};
