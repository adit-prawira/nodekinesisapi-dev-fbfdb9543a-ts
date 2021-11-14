import { CustomError } from "./custom-error";

/**
 * An error class that will handle any illegal request made by user
 */
export class NotAuthorizedError extends CustomError {
    statusCode = 401;
    reason = "Not Authorized";
    constructor() {
        super("Forbidden access");
        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }
    serializeErrors() {
        return [{ message: this.reason }];
    }
}
