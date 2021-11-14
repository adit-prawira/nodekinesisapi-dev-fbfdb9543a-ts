import request from "supertest";
import { app } from "../../../app";

it("returns status 404 when user sign in with an unregistered email", async () => {
    return request(app)
        .post("/api/users/signin")
        .send({ email: "unregistereduser@illegal.com", password: "test123" })
        .expect(404);
});

it("returns 422 when user signing in with an incorrect password", async () => {
    // create new account
    await request(app).post("/api/users/signup").send({
        username: "newuser",
        age: 10,
        email: "newusertest@test.com",
        password: "test123",
    });

    // signing in with wrong password
    return await request(app)
        .post("/api/users/signin")
        .send({ email: "newusertest@test.com", password: "test" })
        .expect(422);
});

it("returns 200 when user signin in with valid credential", async () => {
    // create new account
    await request(app).post("/api/users/signup").send({
        username: "newuser",
        age: 10,
        email: "newusertest@test.com",
        password: "test123",
    });

    //signing in with valid password
    return await request(app)
        .post("/api/users/signin")
        .send({ email: "newusertest@test.com", password: "test123" })
        .expect(200);
});
