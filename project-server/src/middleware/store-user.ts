import { NextFunction, Request, Response } from "express";

import User from "../entities/User";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userID = req.currentUser!.uid;

    const user = await User.findOne({ id: userID });

    res.locals.user = user;

    return next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: "Unauthenticated" });
  }
};
