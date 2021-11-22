import request from "supertest";
import { app } from "../../../app";
it("returns 404 when user is trying to sign in with deleted account", async () => {
    const jwtToken = await global.signin();
    await request(app)
        .delete("/api/users/account/delete")
        .set("Authorization", `Bearer ${jwtToken}`)
        .expect(204);
    const email = "automation.test@test.com";
    const password = "automation_testing";
    await request(app)
        .post("/api/users/signin")
        .send({ email, password })
        .expect(404);
});

it("returns 401 when user tries to delete account byt is not authenticated", async () => {
    await request(app).delete("/api/users/account/delete").expect(401);
});

it("returns 204 when user is authenticated but want to delete account", async () => {
    const jwtToken = await global.signin();
    await request(app)
        .delete("/api/users/account/delete")
        .set("Authorization", `Bearer ${jwtToken}`)
        .expect(204);
});
