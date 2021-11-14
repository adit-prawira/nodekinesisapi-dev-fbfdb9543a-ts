import { CustomError } from "./custom-error";
export class InvalidCredentialsError extends CustomError {
    statusCode = 422;
    reason = "Provide invalid credentials";
    constructor() {
        super("Invalid credentials");
        Object.setPrototypeOf(this, InvalidCredentialsError.prototype);
    }
    serializeErrors() {
        return [{ message: this.reason }];
    }
}
