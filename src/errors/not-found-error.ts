import { CustomError } from "./custom-error";
/**
 * An error class that will handle the case when user trying to made a request
 * to a non-existing API route
 */
export class NotFoundError extends CustomError {
    statusCode = 404;
    reason = "URL not found";
    constructor() {
        super("Invalid url or url does not exist");
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
    serializeErrors() {
        return [{ message: this.reason }];
    }
}
