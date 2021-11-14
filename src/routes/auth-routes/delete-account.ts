import express, { Request, Response } from "express";
import { requireAuth } from "../../middlewares";
import { User } from "../../models";
import { DataBaseConnectionError } from "../../errors/database-connection-error";
const router = express.Router();

router.delete(
    "/api/users/account/delete",
    requireAuth,
    async (req: Request, res: Response) => {
        try {
            const targetUserId = req.currentUser!.id;

            // TODO: Delete all tracks created by this user

            // delete data of the user
            await User.findByIdAndDelete(targetUserId);
            res.status(204).send({});
        } catch (err) {
            throw new DataBaseConnectionError();
        }
    }
);

export { router as deleteAccountRouter };
