import { CustomError } from "./custom-error";

export class DataNotFoundError extends CustomError {
    statusCode = 404;
    reason = "Data not found";
    constructor() {
        super("Data do not exist in the database");
        Object.setPrototypeOf(this, DataNotFoundError.prototype);
    }
    serializeErrors() {
        return [{ message: this.reason }];
    }
}
