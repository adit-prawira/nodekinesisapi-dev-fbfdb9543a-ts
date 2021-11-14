import express, { Request, Response } from "express";
import { DataBaseConnectionError } from "../../errors";
import { Track } from "../../models";
import { requireAuth } from "../../middlewares";
const router = express.Router();

router.get("/api/tracks", requireAuth, async (req: Request, res: Response) => {
    let tracks;
    try {
        // only return specific attributes that is needed to be rendered on the front-end hence optimizing API performance
        tracks = await Track.find({ userId: req.currentUser!.id }).select(
            "name dateCreated dateUpdated met"
        );
    } catch (err) {
        throw new DataBaseConnectionError();
    }
    res.status(200).send(tracks);
});

export { router as getTracksRouter };
