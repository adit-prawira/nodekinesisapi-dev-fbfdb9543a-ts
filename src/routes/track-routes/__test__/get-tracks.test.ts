import request from "supertest";
import { app } from "../../../app";
it("returns 401 when user is not authenticated", async () => {
    await request(app).get("/api/tracks").expect(401);
});

it("returns 200 when user is authenticated", async () => {
    const jwtToken = await global.signin();
    const tracks = (
        await request(app)
            .get("/api/tracks")
            .set("Authorization", `Bearer ${jwtToken}`)
            .expect(200)
    ).body;
    expect(tracks.length).toEqual(0);

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

    const latestTracks = (
        await request(app)
            .get("/api/tracks")
            .set("Authorization", `Bearer ${jwtToken}`)
            .expect(200)
    ).body;
    expect(latestTracks.length).toBeGreaterThan(0);
});
