import { CustomError } from "./custom-error";
export class AWSCredentialsError extends CustomError {
    statusCode = 401;
    reason = "AWS credentials is not defined";
    constructor() {
        super("AWS credentials may not be valid or defined within the system");
        Object.setPrototypeOf(
            AWSCredentialsError,
            AWSCredentialsError.prototype
        );
    }
    serializeErrors() {
        return [{ message: this.reason }];
    }
}
