import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
const scryptAsync = promisify(scrypt);

export class Password {
    /**
     *
     * @param password is the parameters that is given by user.
     * Generally used when user is signing up for a new account
     */
    static async toHash(password: string) {
        const salt = randomBytes(8).toString("hex"); // generate salt
        const buffer = (await scryptAsync(password, salt, 64)) as Buffer; // perform password hashing
        return `${buffer.toString("hex")}.${salt}`;
    }

    /**
     *
     * @param storedPassword password that is hashed and stored in database
     * @param inputPassword password that is given by user
     * Generally used when user is signing in to their account
     */
    static async compare(storedPassword: string, inputPassword: string) {
        const [hashedPassword, salt] = storedPassword.split(".");
        const bufferInput = (await scryptAsync(
            inputPassword,
            salt,
            64
        )) as Buffer; // hashed input password by using the existing password's salt

        // compare whether the stored and hashed password is the same as the hashed input password
        return bufferInput.toString("hex") === hashedPassword;
    }
}
