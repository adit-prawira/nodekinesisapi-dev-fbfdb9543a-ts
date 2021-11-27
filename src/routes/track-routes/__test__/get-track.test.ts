import request from "supertest";
import { app } from "../../../app";
import mongoose from "mongoose";

it("returns status 401 when user is not authenticated", async () => {
    await request(app).get("/api/tracks/123").expect(401);
});

it("return status 401 when user trying to access track that is not theirs", async () => {
    const jwtToken = await global.signin();

    const email = "other.automation.test@test.com";
    const username = "other.test-2899";
    const password = "other.testing";

    const otherUserToken = (
        await request(app)
            .post("/api/users/signup")
            .send({ username, email, password })
    ).body.token;
    const newTrack = (
        await request(app)
            .post("/api/tracks/new")
            .set("Authorization", `Bearer ${otherUserToken}`)
            .send({
                name: "new track for real",
                met: 3.5,
                timeRecorded: 3600.987,
                locations: [
                    {
                        timestamp: 100000,
                        coords: {
                            latitude: 100,
                            longitude: 100,
                            altitude: 100,
                            accuracy: 100,
                            heading: 100,
                            speed: 100,
                        },
                    },
                ],
            })
    ).body;
    await request(app)
        .get(`/api/tracks/${newTrack.id}`)
        .set("Authorization", `Bearer ${jwtToken}`)
        .expect(401);
});

it("returns status 404 when track is not found", async () => {
    const jwtToken = await global.signin();
    const id = new mongoose.Types.ObjectId();
    await request(app)
        .get(`/api/tracks/${id}`)
        .set("Authorization", `Bearer ${jwtToken}`)
        .expect(404);
});

it("returns 200 when user is authenticated and has created a new track", async () => {
    const jwtToken = await global.signin();
    const newTrack = (
        await request(app)
            .post("/api/tracks/new")
            .set("Authorization", `Bearer ${jwtToken}`)
            .send({
                name: "new track for real",
                met: 3.5,
                timeRecorded: 3600.987,
                locations: [
                    {
                        timestamp: 100000,
                        coords: {
                            latitude: 100,
                            longitude: 100,
                            altitude: 100,
                            accuracy: 100,
                            heading: 100,
                            speed: 100,
                        },
                    },
                ],
            })
    ).body;
    await request(app)
        .get(`/api/tracks/${newTrack.id}`)
        .set("Authorization", `Bearer ${jwtToken}`);
});
