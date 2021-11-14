import mongoose from "mongoose";
import { Password } from "../service";

/**
 * Attributes that are required to create a user
 */
interface UserAttributes {
    username: string;
    age: number;
    email: string;
    password: string;
    dateCreated: string;
    dateUpdated: string;
}

/**
 * interface of user data that will be stored in MongoDB
 */
interface UserDocument extends mongoose.Document {
    username: string;
    age: number;
    email: string;
    password: string;
    dateCreated: string;
    dateUpdated: string;
}

/**
 * An interface that describe to build user based on UserAttribute
 * and store it as UserDocument in MongoDB
 */
interface UserModel extends mongoose.Model<UserDocument> {
    build(attributes: UserAttributes): UserDocument;
}

/**
 * Define the schema of a user
 */
const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        age: { type: Number, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        dateCreated: { type: String, required: true },
        dateUpdated: { type: String, required: true },
    },
    {
        toJSON: {
            transform(doc, ret) {
                delete ret.password; // do not show password in database
                delete ret.__v;

                // rename id property name form "_id" -> "id"
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);

// create a schema interceptor or a pre-save system that will hash user's password
userSchema.pre("save", async function (done) {
    if (this.isModified("password")) {
        const hashedPassword = await Password.toHash(this.get("password")); // hash the given password
        this.set("password", hashedPassword); // stored the hashedPassword instead
    }
    done();
});

userSchema.statics.build = (attributes: UserAttributes) => {
    return new User(attributes);
};

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

export { User };
