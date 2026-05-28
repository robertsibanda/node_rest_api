process.env.NODE_ENV = 'test';

const request = require('supertest');

jest.mock('jsonwebtoken');
jest.mock('../db/connect', () => jest.fn().mockResolvedValue());
jest.mock('../models/users');
jest.mock('../models/tokens');
jest.mock('../models/course');
jest.mock('../models/topic');

const jwt = require('jsonwebtoken');

const app = require('../app');

describe('Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Authentication Middleware', () => {
    it('should reject requests without Authorization header', async () => {
      const res = await request(app).get('/api/v1/dashboard');

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('invalid token .. login again');
    });

    it('should reject requests with non-Bearer Authorization header', async () => {
      const res = await request(app)
        .get('/api/v1/dashboard')
        .set('Authorization', 'Basic somecreds');

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('invalid token .. login again');
    });

    it('should reject requests with malformed token', async () => {
      jwt.verify.mockImplementation((token, secret, cb) => {
        cb(new Error('jwt malformed'), null);
      });

      const res = await request(app)
        .get('/api/v1/dashboard')
        .set('Authorization', 'Bearer badtoken');

      expect(res.status).toBe(401);
      expect(res.body.error1).toBe('not authorized to access this route');
    });
  });

  describe('404 Not Found', () => {
    it('should return 404 for unknown routes', async () => {
      const res = await request(app).get('/api/v1/nonexistent');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Route not found');
    });

    it('should return 404 for unknown POST routes', async () => {
      const res = await request(app).post('/api/v1/nonexistent');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Route not found');
    });
  });

  describe('CORS Headers', () => {
    it('should include CORS headers in responses', async () => {
      const res = await request(app).get('/api/v1/nonexistent');

      expect(res.headers['access-control-allow-origin']).toBe('*');
      expect(res.headers['access-control-allow-methods']).toBeDefined();
      expect(res.headers['access-control-allow-headers']).toBeDefined();
    });
  });
});
