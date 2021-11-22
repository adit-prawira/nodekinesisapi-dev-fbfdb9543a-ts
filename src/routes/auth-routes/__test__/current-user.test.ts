import request from "supertest";
import { app } from "../../../app";
it("returns 200 when user is authenticated", async () => {
    const jwtToken = await global.signin();

    await request(app)
        .get("/api/users/currentuser")
        .set("Authorization", `Bearer ${jwtToken}`)
        .expect(200);
});

it("returns 401 when user is not authenticated", async () => {
    await request(app).get("/api/users/currentuser").expect(401);
});
