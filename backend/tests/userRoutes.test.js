const request = require('supertest');
const app = require('../src/app');

jest.mock('../src/models/userModel');
jest.mock('bcrypt');
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'signed-token'),
  verify: jest.fn(() => ({ id: 1, role: 'speaker' }))
}));

const UserModel = require('../src/models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

describe('POST /api/login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns token for valid credentials', async () => {
    UserModel.findByEmail.mockResolvedValue({ id: 1, password: 'hashed', role: 'speaker' });
    bcrypt.compare.mockResolvedValue(true);

    const res = await request(app).post('/api/login').send({ email: 'a@b.c', password: 'secret' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBe('signed-token');
    expect(jwt.sign).toHaveBeenCalled();
  });

  it('returns 401 for invalid credentials', async () => {
    UserModel.findByEmail.mockResolvedValue({ id: 1, password: 'hashed', role: 'speaker' });
    bcrypt.compare.mockResolvedValue(false);

    const res = await request(app).post('/api/login').send({ email: 'a@b.c', password: 'wrong' });
    expect(res.statusCode).toBe(401);
  });
});
