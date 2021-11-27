import request from "supertest";
import { app } from "../../../app";
it("returns 401 when user is not authenticated but is trying to updated their account", async () => {
    await request(app)
        .put("/api/users/account/update")
        .send({
            username: "goodStudent",
            email: "student@student.university.edu.com",
        })
        .expect(401);
});

it("returns 404 when user updated their account but signin with the old information", async () => {
    const jwtToken = await global.signin();
    await request(app)
        .put("/api/users/account/update")
        .set("Authorization", `Bearer ${jwtToken}`)
        .send({
            username: "goodStudent",
            email: "student@student.university.edu.com",
        })
        .expect(204);
    const email = "automation.test@test.com";

    const password = "automation_testing";
    await request(app)
        .post("/api/users/signin")
        .send({ email, password })
        .expect(404);
});

it("returns 422 when user change password but singin with old password", async () => {
    const jwtToken = await global.signin();
    await request(app)
        .put("/api/users/password/update")
        .set("Authorization", `Bearer ${jwtToken}`)
        .send({
            password: "passwordischanged",
        })
        .expect(204);
    const email = "automation.test@test.com";
    const password = "automation_testing";
    await request(app)
        .post("/api/users/signin")
        .send({ email, password })
        .expect(422);
});

it("returns 204 when user is authenticated and provide a valid request body for details", async () => {
    const jwtToken = await global.signin();
    const { email: oldEmail, username: oldUsername } = (
        await request(app)
            .get("/api/users/currentuser")
            .set("Authorization", `Bearer ${jwtToken}`)
    ).body.currentUser;

    await request(app)
        .put("/api/users/account/update")
        .set("Authorization", `Bearer ${jwtToken}`)
        .send({
            username: "newusername",
            email: "newusername@username.com",
        })
        .expect(204);
    const { email: newEmail, username: newUsername } = (
        await request(app)
            .get("/api/users/currentuser")
            .set("Authorization", `Bearer ${jwtToken}`)
    ).body.currentUser;

    expect(oldEmail).not.toEqual(newEmail);
    expect(oldUsername).not.toEqual(newUsername);
});
