import S3 from "aws-sdk/clients/s3";
import fs from "fs";
require("dotenv").config();
const region: string = process.env.AWS_REGION!;
const accessKeyId: string = process.env.AWS_ACCESS_KEY!;
const secretAccessKey: string = process.env.AWS_SECRET_KEY!;
const bucketName: string = process.env.AWS_BUCKET_NAME!;

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey,
});

// upload file to S3 Bucket
export const uploadImage = (file: any) => {
    const fileStream: fs.ReadStream = fs.createReadStream(file.path);
    const uploadParams = {
        Bucket: bucketName,
        Key: file.filename,
        Body: fileStream,
    };
    return s3.upload(uploadParams).promise();
};

// download file from S3 Bucket
export const getImage = (fileKey: string) => {
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName,
    };
    return s3.getObject(downloadParams).createReadStream();
};

export const deleteImage = (fileKey: string) => {
    const deleteParams = {
        Key: fileKey,
        Bucket: bucketName,
    };
    return s3.deleteObject(deleteParams).promise();
};
