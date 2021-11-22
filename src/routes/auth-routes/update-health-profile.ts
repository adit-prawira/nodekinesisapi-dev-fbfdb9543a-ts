import express, { Request, Response } from "express";
import { User } from "../../models";
import { requireAuth } from "../../middlewares";
import { DataBaseConnectionError, NotFoundError } from "../../errors";
import { body } from "express-validator";
import { validateRequest } from "../../middlewares";
const router = express.Router();

router.put(
    "/api/users/health-profile/update",
    requireAuth,
    [
        body("height")
            .notEmpty()
            .isFloat({ gt: 0 })
            .withMessage("A valid height value must be provided"),
        body("mass")
            .notEmpty()
            .isFloat({ gt: 0 })
            .withMessage("A valid mass value must be provided"),
        body("age")
            .notEmpty()
            .isInt({ gt: 0 })
            .withMessage("A valid age value must be provided"),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        try {
            const targetUserId = req.currentUser!.id;
            const { age, height, mass } = req.body;
            await User.findByIdAndUpdate(targetUserId, {
                age,
                height,
                mass,
                dateUpdated: new Date().toISOString(),
            });
            res.status(204).send({});
        } catch (err) {
            throw new DataBaseConnectionError();
        }
    }
);

export { router as updateHealthProfileRoute };
