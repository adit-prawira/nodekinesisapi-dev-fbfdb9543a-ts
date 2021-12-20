import express, { Request, Response } from "express";
import fs from "fs";
import util from "util";
import { User } from "../../models";
import { DataBaseConnectionError, AWSCredentialsError } from "../../errors";
import { uploadImage, getImage, deleteImage } from "../../service";
import multer from "multer";
import { requireAuth } from "../../middlewares/require-auth";

const router = express.Router();
const upload = multer({ dest: "uploads/" });
const unlinkFile = util.promisify(fs.unlink);

router.get(
    "/api/users/account/profile-picture/:key",
    (req: Request, res: Response) => {
        try {
            const key = req.params.key;
            const readStream = getImage(key);
            readStream.pipe(res);
        } catch (err) {
            throw new AWSCredentialsError();
        }
    }
);

router.post(
    "/api/users/account/profile-picture",
    requireAuth,
    upload.single("image"),
    async (req: Request, res: Response) => {
        let avatarEndPoint = "";
        const file = req.file;
        try {
            const result = await uploadImage(file);
            await unlinkFile(file!.path);
            avatarEndPoint = `/api/users/account/profile-picture/${result.Key}`;
            if (req.currentUser!.avatar !== "") {
                const splitEndPoint = req.currentUser!.avatar.split("/");
                const targetKey = splitEndPoint[splitEndPoint.length - 1];
                await deleteImage(targetKey);
            }
        } catch (err) {
            throw new AWSCredentialsError();
        }

        try {
            const targetUserId = req.currentUser!.id;

            await User.findByIdAndUpdate(targetUserId, {
                avatar: avatarEndPoint,
            });
            res.status(201).send({
                imagePath: avatarEndPoint,
            });
        } catch (err) {
            throw new DataBaseConnectionError();
        }
    }
);

export { router as accountProfilePictureRouter };
