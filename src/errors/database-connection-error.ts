import { CustomError } from "./custom-error";
/**
 * A class that will handle error due to problematic database connection
 */
export class DataBaseConnectionError extends CustomError {
    statusCode = 500;
    reason = "Failed connecting to database";
    constructor() {
        super("Error connecting to database (MongoDB)");
        Object.setPrototypeOf(this, DataBaseConnectionError.prototype);
    }
    serializeErrors() {
        return [{ message: this.reason }];
    }
}
