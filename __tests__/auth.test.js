process.env.NODE_ENV = 'test';

const request = require('supertest');
const bcrypt = require('bcrypt');

jest.mock('jsonwebtoken');
jest.mock('../db/connect', () => jest.fn().mockResolvedValue());
jest.mock('../models/users');
jest.mock('../models/tokens');
jest.mock('bcrypt');

const jwt = require('jsonwebtoken');
const Users = require('../models/users');
const Token = require('../models/tokens');

const app = require('../app');

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/signup', () => {
    it('should create a new user', async () => {
      Users.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword123');
      Users.create.mockResolvedValue({ username: 'testuser' });

      const res = await request(app)
        .post('/api/v1/signup')
        .send({ username: 'testuser', password: 'password123' });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('user created testuser');
    });

    it('should return 400 if username or password missing', async () => {
      const res = await request(app)
        .post('/api/v1/signup')
        .send({ username: 'testuser' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('please provide email and password');
    });

    it('should return error if user already exists', async () => {
      Users.findOne.mockResolvedValue({ username: 'testuser' });

      const res = await request(app)
        .post('/api/v1/signup')
        .send({ username: 'testuser', password: 'password123' });

      expect(res.body.error).toBe('User already exists');
    });
  });

  describe('POST /api/v1/login', () => {
    it('should login a user and return tokens', async () => {
      const mockUser = {
        _id: 'user123',
        username: 'testuser',
        password: 'hashedPassword',
        admin: false,
        staff: false,
      };

      Users.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      Token.findOne.mockResolvedValue(null);
      Token.create.mockResolvedValue({});
      jwt.sign.mockReturnValue('mockToken');

      const res = await request(app)
        .post('/api/v1/login')
        .send({ username: 'testuser', password: 'password123' });

      expect(res.status).toBe(200);
      expect(res.body.token).toBe('mockToken');
      expect(res.body.refreshToken).toBe('mockToken');
    });

    it('should return 400 if credentials missing', async () => {
      const res = await request(app)
        .post('/api/v1/login')
        .send({ username: 'testuser' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('please provide email and password');
    });

    it('should return 400 if user not found', async () => {
      Users.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/v1/login')
        .send({ username: 'nonexistent', password: 'password123' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('user not found');
    });

    it('should return error if password is wrong', async () => {
      Users.findOne.mockResolvedValue({
        _id: 'user123',
        username: 'testuser',
        password: 'hashedPassword',
        admin: false,
        staff: false,
      });
      bcrypt.compare.mockResolvedValue(false);

      const res = await request(app)
        .post('/api/v1/login')
        .send({ username: 'testuser', password: 'wrongpassword' });

      expect(res.body.error).toBe('Wrong credenatisls');
    });
  });

  describe('POST /api/v1/token', () => {
    it('should refresh token when valid', async () => {
      const mockDecoded = {
        id: 'user123',
        username: 'testuser',
        admin: false,
        staff: false,
      };

      jwt.verify.mockImplementation((token, secret, cb) => {
        cb(null, mockDecoded);
      });

      Token.findOne.mockResolvedValue({ token: 'validRefreshToken' });
      jwt.sign.mockReturnValue('newMockToken');

      const res = await request(app)
        .post('/api/v1/token')
        .send({ token: 'validRefreshToken' });

      expect(res.status).toBe(200);
      expect(res.body.token).toBe('newMockToken');
    });

    it('should return 401 if no token supplied', async () => {
      const res = await request(app)
        .post('/api/v1/token')
        .send({});

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('No token supplied');
    });

    it('should return 401 if token not in database', async () => {
      jwt.verify.mockImplementation((token, secret, cb) => {
        cb(null, { id: 'user123', username: 'testuser', admin: false, staff: false });
      });
      Token.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/v1/token')
        .send({ token: 'nonexistentToken' });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Token not found from database');
    });
  });

  describe('GET /api/v1/dashboard', () => {
    it('should return dashboard for authenticated user', async () => {
      jwt.verify.mockImplementation((token, secret, cb) => {
        cb(null, { id: 'user123', username: 'testuser', admin: false, staff: false });
      });

      const res = await request(app)
        .get('/api/v1/dashboard')
        .set('Authorization', 'Bearer validtoken');

      expect(res.status).toBe(200);
      expect(res.body.msg).toBe('testuser');
      expect(res.body.secret).toContain('luck number');
    });

    it('should return 401 without auth header', async () => {
      const res = await request(app)
        .get('/api/v1/dashboard');

      expect(res.status).toBe(401);
    });

    it('should return 401 with invalid token', async () => {
      jwt.verify.mockImplementation((token, secret, cb) => {
        cb(new Error('jwt malformed'), null);
      });

      const res = await request(app)
        .get('/api/v1/dashboard')
        .set('Authorization', 'Bearer invalidtoken');

      expect(res.status).toBe(401);
    });
  });
});
