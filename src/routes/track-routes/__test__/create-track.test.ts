import request from "supertest";
import { app } from "../../../app";
it("returns status 400 when user give invalid request body", async () => {
    const jwtToken = await global.signin();
    await request(app)
        .post("/api/tracks/new")
        .set("Authorization", `Bearer ${jwtToken}`)
        .send({
            name: "new track for real",
            met: 3.5,
            timeRecorded: 3600.987,
            locations: [],
        })
        .expect(400);
    await request(app)
        .post("/api/tracks/new")
        .set("Authorization", `Bearer ${jwtToken}`)
        .send({
            name: "new track for real",
            timeRecorded: 3600.987,
            locations: [],
        })
        .expect(400);
    await request(app)
        .post("/api/tracks/new")
        .set("Authorization", `Bearer ${jwtToken}`)
        .send({
            name: "new track for real",
            met: 3.5,
            locations: [],
        })
        .expect(400);
});

it("return 401 when user is not authenticated", async () => {
    await request(app)
        .post("/api/tracks/new")
        .send({
            name: "new track for real",
            met: 3.5,
            timeRecorded: 3600.987,
            locations: [],
        })
        .expect(401);
});

it("returns status 201 when user give valid request body to create a track", async () => {
    const jwtToken = await global.signin();
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
        .expect(201);
});
