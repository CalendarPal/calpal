import { Request, Response, Router } from "express";

const router = Router();

const getClaims = async (req: Request, res: Response) => {
  console.log(req.currentUser);
  // console.log(res);
  return res.send("Yote");
};

router.get("/", getClaims);

export default router;
