import request from "supertest";
import { app } from "../../../app";
import mongoose from "mongoose";

it("returns 401 when user is not authenticated", async () => {
    const id = new mongoose.Types.ObjectId();
    await request(app).delete(`/api/tracks/delete/${id}`).expect(401);
});

it("returns 401 when user deleting a track that is not theirs", async () => {
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
        .delete(`/api/tracks/delete/${newTrack.id}`)
        .set("Authorization", `Bearer ${jwtToken}`)
        .expect(401);
});

it("returns 404 when user deleting a track that does not exist", async () => {
    const jwtToken = await global.signin();
    const id = new mongoose.Types.ObjectId();
    await request(app)
        .delete(`/api/tracks/${id}`)
        .set("Authorization", `Bearer ${jwtToken}`)
        .expect(404);
});
