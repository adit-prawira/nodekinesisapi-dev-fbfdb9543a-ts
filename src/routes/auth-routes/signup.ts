import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { body } from "express-validator";
import { User } from "../../models/user";
import { BadRequestError, DataBaseConnectionError } from "../../errors";
import { validateRequest } from "../../middlewares/validate-request";
const router = express.Router();
router.post(
    "/api/users/signup",
    [
        body("username")
            .notEmpty()
            .isString()
            .withMessage("A username must be provided"),
        body("age").notEmpty().isInt().withMessage("Age must be provided"),
        body("email")
            .isEmail()
            .withMessage("A valid working email must be provided"),
        body("password")
            .trim()
            .isLength({ min: 4, max: 20 })
            .withMessage("A password must be between 4 to 20 characters"),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password, username, age } = req.body;
        const existingUser = await User.findOne({ email });
        const date = new Date().toLocaleDateString();
        const dateCreated = date;
        const dateUpdated = date;
        // Send BadRequestError when creating an account with an email that already exist
        if (existingUser) {
            throw new BadRequestError("Email has already been used");
        }

        try {
            const user = await User.build({
                username,
                age,
                email,
                password,
                dateCreated,
                dateUpdated,
            });
            await user.save();

            // generate JWT token for user
            const token = jwt.sign(
                {
                    userId: user.id,
                },
                process.env.JWT_KEY!
            );
            res.status(201).send({ token });
        } catch (err) {
            throw new DataBaseConnectionError();
        }
    }
);
export { router as signUpRouter };
