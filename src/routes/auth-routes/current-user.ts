import express, { Request, Response } from "express";
import { requireAuth } from "../../middlewares";
const router = express.Router();
router.get(
    "/api/users/currentuser",
    requireAuth,
    (req: Request, res: Response) => {
        res.status(200).send({ currentUser: req.currentUser || null });
    }
);
export { router as currentUserRouter };
