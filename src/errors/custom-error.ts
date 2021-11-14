/**
 * CustomError is an abstract class can be inherit to create any types of error
 * with consistent error response body structure
 */
export abstract class CustomError extends Error {
    abstract statusCode: number; // when using CustomError a statusCode of that error must be provided
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this.message, CustomError.prototype);
    }

    // this indicates that to implement this abstract class
    // an error message must be defined where the field is optional
    abstract serializeErrors(): {
        message: string;
        field?: string;
    }[];
}
