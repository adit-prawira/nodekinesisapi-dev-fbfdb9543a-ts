import { CustomError } from "./custom-error";
import { ValidationError } from "express-validator";
/**
 * An error class that will handle the case when user made a request with invalid parameters
 * The error returned list of errors as this can be caused by multiple cases
 */
export class RequestValidationError extends CustomError {
    statusCode = 400;
    constructor(public errors: ValidationError[]) {
        super("Invalid request parameters");
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
    serializeErrors() {
        return this.errors.map((err) => ({
            message: err.msg,
            field: err.param,
        }));
    }
}
