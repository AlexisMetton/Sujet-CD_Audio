const cdController = require('../../Controllers/cdController');
const pool = require('../../configs/db');

// Mock de la connexion PostgreSQL
jest.mock('../../configs/db', () => ({
  query: jest.fn()
}));

describe('cdController Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getAllCDs devrait retourner tous les CDs', async () => {
    const mockCDs = [{ id: 1, title: 'Test CD', artist: 'Test Artist', year: 2023 }];
    pool.query.mockResolvedValue({ rows: mockCDs });

    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await cdController.getAllCDs(req, res);
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM cds ORDER BY id ASC');
    expect(res.json).toHaveBeenCalledWith(mockCDs);
  });

  test('addCD devrait ajouter un CD et retourner le résultat', async () => {
    const mockCD = { id: 1, title: 'New CD', artist: 'New Artist', year: 2024 };
    pool.query.mockResolvedValue({ rows: [mockCD] });

    const req = { body: { title: 'New CD', artist: 'New Artist', year: 2024 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await cdController.addCD(req, res);
    expect(pool.query).toHaveBeenCalledWith(
      'INSERT INTO cds (title, artist, year) VALUES ($1, $2, $3) RETURNING *',
      ['New CD', 'New Artist', 2024]
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockCD);
  });

  test('deleteCD devrait supprimer un CD', async () => {
    pool.query.mockResolvedValue({});

    const req = { params: { id: '1' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    await cdController.deleteCD(req, res);
    expect(pool.query).toHaveBeenCalledWith('DELETE FROM cds WHERE id = $1', ['1']);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});