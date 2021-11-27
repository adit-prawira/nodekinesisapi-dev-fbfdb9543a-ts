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
            .isArray({ min: 1 })
            .withMessage("Location check points must be provided"),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const requestValues = req.body;
        let newTrack;
        try {
            const userMass = req.currentUser!.mass;
            const { timeRecorded, met } = requestValues;
            newTrack = await Track.build({
                ...requestValues,
                burnedCalories:
                    (timeRecorded / 60) * (met * 3.5) * (userMass / 200),
                userId: req.currentUser!.id,
            });
            await newTrack.save();
        } catch (err) {
            throw new DataBaseConnectionError();
        }
        res.status(201).send(newTrack);
    }
);

export { router as createTrackRouter };
