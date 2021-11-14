import express, { Request, Response } from "express";
import { requireAuth } from "../../middlewares";
import { DataBaseConnectionError, NotAuthorizedError } from "../../errors";
import { Track } from "../../models";
const router = express.Router();

router.delete(
    "/api/tracks/delete/:id",
    requireAuth,
    async (req: Request, res: Response) => {
        let targetTrack;
        try {
            targetTrack = await Track.findById(req.params.id);
        } catch (err) {
            throw new DataBaseConnectionError();
        }
        if (req.currentUser!.id !== targetTrack?.userId.toString()) {
            throw new NotAuthorizedError();
        }
        await targetTrack.delete();
        res.status(204).send({});
    }
);
export { router as deleteTrackRouter };
