import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../errors";
import { User } from "../models";
import jwt from "jsonwebtoken";

interface UserPayload {
    id: string;
    username: string;
    email: string;
    age: number;
    height: number;
    mass: number;
}

declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload;
        }
    }
}
export const requireAuth = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { authorization } = req.headers;

    if (!authorization) {
        throw new NotAuthorizedError();
    }

    const token = authorization.replace("Bearer", "").trim();

    jwt.verify(token, process.env.JWT_KEY!, async (err, payload) => {
        if (err) {
            throw new NotAuthorizedError();
        }
        const { userId } = payload!;
        req.currentUser = (await User.findById(userId)) as UserPayload;
        next();
    });
};
