import * as fs from "fs";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { NotAuthorizedError } from "../errors/not-authorized-error";

interface TokenClaims {
  user: UserClaims;
}

interface UserClaims {
  uid: string;
  email: string;
  name: string;
  imageUrl: string;
  website: string;
}

// For appending a current user to Express Request
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserClaims;
    }
  }
}

const pubKey = fs.readFileSync("src/rsa_public_dev.pem");

export const authUser = (req: Request, _: Response, next: NextFunction) => {
  const authHeader = req.header("Authorization");

  const token = authHeader?.split(" ")[1];

  if (!token) {
    const err = new NotAuthorizedError();
    console.log("No token found in Auth Header: ", err);
    return next(err);
  }

  try {
    const tokenPayload = jwt.verify(token, pubKey) as TokenClaims;
    req.currentUser = tokenPayload.user;
  } catch (err) {
    console.log("Invalid or unverified token...");
    console.log(err);
  }

  next();
};
