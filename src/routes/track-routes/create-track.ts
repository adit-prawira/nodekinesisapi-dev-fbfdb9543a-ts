import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "../../middlewares";
import { DataBaseConnectionError } from "../../errors";
import { Track } from "../../models";
const router = express.Router();
router.post(
    "/api/tracks/new",
    requireAuth,
    [
        body("name")
            .notEmpty()
            .isString()
            .withMessage("A name must be given for a track"),
        body("met")
            .notEmpty()
            .isFloat({ gt: 0 })
            .withMessage("An exercise type must be chosen for MET level value"),
        body("timeRecorded")
            .notEmpty()
            .isFloat({ gt: 0 })
            .withMessage("Time spent on the exercise must be provided"),
        body("locations")
            .notEmpty()
            .isArray()
            .withMessage("Location check points must be provided"),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const requestValues = req.body;
        const date = new Date().toLocaleDateString();
        const dateCreated = date;
        const dateUpdated = date;
        let newTrack;
        try {
            newTrack = await Track.build({
                ...requestValues,
                userId: req.currentUser!.id,
                dateCreated,
                dateUpdated,
            });
            await newTrack.save();
        } catch (err) {
            throw new DataBaseConnectionError();
        }
        res.status(201).send(newTrack);
    }
);

export { router as createTrackRouter };
