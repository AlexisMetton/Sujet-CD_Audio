const request = require("supertest");
const app = require("../../server");

describe("cdRoutes Integration Tests with Testcontainers", () => {
  test("POST /api/cds should add a new CD", async () => {
    const newCD = { title: "Test CD", artist: "Test Artist", year: 2023 };

    const response = await request(app)
      .post("/api/cds")
      .send(newCD)
      .set("Content-Type", "application/json");

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(newCD);
    expect(response.body.id).toBeDefined();
  });

  test("GET /api/cds should return all CDs", async () => {
    const cdToAdd = { title: "CD1", artist: "Artist1", year: 2022 };
    const res = await request(app)
      .post("/api/cds")
      .send(cdToAdd)
      .set("Content-Type", "application/json");

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject(cdToAdd);
      expect(res.body.id).toBeDefined();

    const response = await request(app).get("/api/cds");
    console.log('GET /api/cds response:', response.body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([expect.objectContaining(cdToAdd)])
    );
  });

  test("DELETE /api/cds/:id should delete a CD", async () => {
    // Créer un CD via POST
    const cdToDelete = { title: "CD to Delete", artist: "Artist", year: 2021 };
    const createRes = await request(app)
      .post("/api/cds")
      .send(cdToDelete)
      .set("Content-Type", "application/json");
    const cdId = createRes.body.id;

    // Supprimer le CD
    const deleteRes = await request(app).delete(`/api/cds/${cdId}`);
    expect(deleteRes.status).toBe(204);

    // Vérifier que le CD n’existe plus via GET
    const getRes = await request(app).get("/api/cds");
    expect(getRes.status).toBe(200);
    expect(getRes.body).not.toContainEqual(
      expect.objectContaining({ id: cdId })
    );
  });
});
