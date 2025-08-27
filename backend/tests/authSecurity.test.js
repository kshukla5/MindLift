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

describe('Authentication Security Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Login Security', () => {
    it('should NOT allow login when database error occurs', async () => {
      // Simulate database error
      UserModel.findByEmail.mockRejectedValue(new Error('Database connection failed'));

      const res = await request(app)
        .post('/api/login')
        .send({ 
          email: 'hacker@test.com', 
          password: 'anypassword' 
        });

      // Should return 503 (service unavailable) instead of allowing login
      expect(res.statusCode).toBe(503);
      expect(res.body.error).toContain('Database temporarily unavailable');
      expect(res.body.code).toBe('DATABASE_UNAVAILABLE');
      expect(res.body.token).toBeUndefined();
    });

    it('should NOT allow signup when database error occurs', async () => {
      // Simulate database error during user creation
      UserModel.findByEmail.mockRejectedValue(new Error('Database connection failed'));

      const res = await request(app)
        .post('/api/signup')
        .send({ 
          name: 'Test User',
          email: 'hacker@test.com', 
          password: 'anypassword' 
        });

      // Should return 503 (service unavailable) instead of creating mock user
      expect(res.statusCode).toBe(503);
      expect(res.body.error).toContain('Database temporarily unavailable');
      expect(res.body.code).toBe('DATABASE_UNAVAILABLE');
      expect(res.body.token).toBeUndefined();
    });

    it('should require correct password for valid user', async () => {
      UserModel.findByEmail.mockResolvedValue({ 
        id: 1, 
        password: 'hashed-password', 
        role: 'subscriber' 
      });
      bcrypt.compare.mockResolvedValue(false); // Wrong password

      const res = await request(app)
        .post('/api/login')
        .send({ 
          email: 'valid@user.com', 
          password: 'wrongpassword' 
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe('Invalid credentials');
      expect(res.body.token).toBeUndefined();
    });

    it('should allow login only with correct credentials', async () => {
      UserModel.findByEmail.mockResolvedValue({ 
        id: 1, 
        password: 'hashed-password', 
        role: 'subscriber' 
      });
      bcrypt.compare.mockResolvedValue(true); // Correct password

      const res = await request(app)
        .post('/api/login')
        .send({ 
          email: 'valid@user.com', 
          password: 'correctpassword' 
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBe('signed-token');
    });
  });
});
