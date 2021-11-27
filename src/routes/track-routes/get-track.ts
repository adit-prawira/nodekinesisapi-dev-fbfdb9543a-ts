import express, { Request, Response } from "express";
import { requireAuth } from "../../middlewares";
import {
    DataBaseConnectionError,
    NotAuthorizedError,
    NotFoundError,
} from "../../errors";
import { Track } from "../../models";
const router = express.Router();

router.get(
    "/api/tracks/:id",
    requireAuth,
    async (req: Request, res: Response) => {
        let targetTrack;
        try {
            try {
                targetTrack = await Track.findById(req.params.id);
            } catch (err) {
                targetTrack = null;
            }
        } catch (err) {
            throw new DataBaseConnectionError();
        }

        if (!targetTrack) throw new NotFoundError(); // track not found

        // the current user's id does not match the ones that exist from target track
        // throw an unauthorized error
        if (req.currentUser!.id !== targetTrack?.userId.toString()) {
            throw new NotAuthorizedError();
        }
        res.status(200).send(targetTrack);
    }
);

export { router as getTrackRouter };
