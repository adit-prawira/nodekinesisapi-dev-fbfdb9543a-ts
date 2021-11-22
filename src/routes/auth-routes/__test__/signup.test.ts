import request from "supertest";
import { app } from "../../../app";

it("returns 400 when user give invalid request body", async () => {
    const email = "automation.test@test.com";
    const username = "automation-test-2899";
    const password = "automation_testing";
    await request(app)
        .post("/api/users/signup")
        .send({ email, password })
        .expect(400); // username is not given
    await request(app)
        .post("/api/users/signup")
        .send({ username, password })
        .expect(400); // email is not given
    await request(app)
        .post("/api/users/signup")
        .send({ email, password: "ih" })
        .expect(400); // expect 400 if password is too short
});

it("returns 400 when email is already been used", async () => {
    await global.signin();
    const email = "automation.test@test.com";
    const username = "automation-test-2899";
    const password = "automation_testing";
    await request(app)
        .post("/api/users/signup")
        .send({ username, email, password })
        .expect(400); // signing up by an email that has been previously registered
});

it("return 201 when user give valid request body", async () => {
    const email = "automation.test@test.com";
    const username = "automation-test-2899";
    const password = "automation_testing";
    await request(app)
        .post("/api/users/signup")
        .send({ username, email, password })
        .expect(201);
});
