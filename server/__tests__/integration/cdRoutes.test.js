const request = require('supertest');
const express = require('express');
const cdRoutes = require('../../Routes/cdRoutes');
const pool = require('../../configs/db');

const app = express();
app.use(express.json());
app.use('/api', cdRoutes);

describe('cdRoutes Integration Tests', () => {
  beforeAll(async () => {
    // Initialisation de la table pour les tests
    await pool.query('CREATE TABLE IF NOT EXISTS cds (id SERIAL PRIMARY KEY, title VARCHAR(255), artist VARCHAR(255), year INTEGER)');
  });

  afterEach(async () => {
    // Nettoyage après chaque test
    await pool.query('TRUNCATE cds RESTART IDENTITY');
  });

  afterAll(async () => {
    // Fermeture de la connexion
    await pool.end();
  });

  test('POST /api/cds devrait ajouter un CD', async () => {
    const newCD = { title: 'Test CD', artist: 'Test Artist', year: 2023 };
    const response = await request(app)
      .post('/api/cds')
      .send(newCD)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(newCD);
    expect(response.body.id).toBeDefined();
  });

  test('GET /api/cds devrait retourner tous les CDs', async () => {
    await pool.query('INSERT INTO cds (title, artist, year) VALUES ($1, $2, $3)', ['CD1', 'Artist1', 2022]);
    const response = await request(app).get('/api/cds');

    expect(response.status).toBe(200);
    //expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject({ title: 'CD1', artist: 'Artist1', year: 2022 });
  });

  test('DELETE /api/cds/:id devrait supprimer un CD', async () => {
    const { rows } = await pool.query('INSERT INTO cds (title, artist, year) VALUES ($1, $2, $3) RETURNING id', ['CD1', 'Artist1', 2022]);
    const id = rows[0].id;

    const response = await request(app).delete(`/api/cds/${id}`);
    expect(response.status).toBe(204);

    const check = await pool.query('SELECT * FROM cds WHERE id = $1', [id]);
    expect(check.rows).toHaveLength(0);
  });

});