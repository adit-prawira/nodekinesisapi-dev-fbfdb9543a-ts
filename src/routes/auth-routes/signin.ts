import express, { Request, Response } from "express";
import {
    DataBaseConnectionError,
    InvalidCredentialsError,
    NotFoundError,
} from "../../errors";
import { validateRequest } from "../../middlewares";
import { body } from "express-validator";
import { User } from "../../models";
import { Password } from "../../service";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
    "/api/users/signin",
    [
        body("email")
            .isEmail()
            .withMessage("A valid working email must be provided"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("A password must be provided"),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;
        let targetUser;

        try {
            targetUser = await User.findOne({ email });
        } catch (err) {
            throw new DataBaseConnectionError();
        }

        if (!targetUser) throw new NotFoundError();
        const isMatch = await Password.compare(targetUser.password, password);
        if (!isMatch) throw new InvalidCredentialsError();
        const token = jwt.sign({ userId: targetUser.id }, process.env.JWT_KEY!);
        res.status(200).send({ token });
    }
);

export { router as signInRouter };
