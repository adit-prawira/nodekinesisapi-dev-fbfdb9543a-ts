import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import request from "supertest";

declare global {
    var signin: () => Promise<string>;
}
let mongo: any;

// create mongo memory server before executing all existing test
beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
    await mongoose.connect(mongoUri);
});

// before executing each test, reset collections in Mongo Memory Server so that
// it won't burn out your CPU and memory
beforeEach(async () => {
    process.env.JWT_KEY = "test-key";
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

// After all test has been passed and completed close connection to mongo memory server
afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

// Global function to sign up as a user
global.signin = async () => {
    const email = "automation.test@test.com";
    const age = 22;
    const username = "automation-test-2899";
    const password = "automation_testing";
    const res = await request(app)
        .post("/api/users/signup")
        .send({ username, age, email, password })
        .expect(201);
    return res.body.token;
};
