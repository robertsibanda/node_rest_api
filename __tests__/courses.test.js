process.env.NODE_ENV = 'test';

const request = require('supertest');

jest.mock('jsonwebtoken');
jest.mock('../db/connect', () => jest.fn().mockResolvedValue());
jest.mock('../models/users');
jest.mock('../models/tokens');
jest.mock('../models/course');
jest.mock('../models/topic');

const jwt = require('jsonwebtoken');
const Course = require('../models/course');
const Topic = require('../models/topic');

const app = require('../app');

describe('Course Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function mockAuth(user) {
    jwt.verify.mockImplementation((token, secret, cb) => {
      cb(null, user);
    });
  }

  describe('GET /api/v1/courses', () => {
    it('should return all courses', async () => {
      mockAuth({ id: 'user1', username: 'testuser', admin: false, staff: true });
      Course.find.mockResolvedValue([{ _id: 'course1', name: 'Math' }, { _id: 'course2', name: 'Science' }]);

      const res = await request(app)
        .get('/api/v1/courses')
        .set('Authorization', 'Bearer validtoken');

      expect(res.status).toBe(200);
      expect(res.body.courses).toHaveLength(2);
    });

    it('should return 401 without auth', async () => {
      const res = await request(app)
        .get('/api/v1/courses');

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/courses/:id', () => {
    it('should return a single course', async () => {
      mockAuth({ id: 'user1', username: 'testuser', admin: false, staff: true });
      Course.find.mockResolvedValue([{ _id: 'course1', name: 'Math' }]);

      const res = await request(app)
        .get('/api/v1/courses/course1')
        .set('Authorization', 'Bearer validtoken');

      expect(res.status).toBe(200);
      expect(res.body.course).toBeDefined();
    });

    it('should return 400 on error', async () => {
      mockAuth({ id: 'user1', username: 'testuser', admin: false, staff: true });
      Course.find.mockRejectedValue(new Error('DB error'));

      const res = await request(app)
        .get('/api/v1/courses/course1')
        .set('Authorization', 'Bearer validtoken');

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/v1/courses/add', () => {
    it('should create a course for staff user', async () => {
      mockAuth({ id: 'user1', username: 'staffuser', admin: false, staff: true });
      Course.findOne.mockResolvedValue(null);
      Course.create.mockResolvedValue({ _id: 'newcourse' });
      Topic.create.mockResolvedValue({});
      Course.find.mockResolvedValue([{ _id: 'newcourse', name: 'Physics' }]);

      const res = await request(app)
        .post('/api/v1/courses/add')
        .set('Authorization', 'Bearer validtoken')
        .send({ name: 'Physics', topics: ['Mechanics', 'Thermodynamics'] });

      expect(res.status).toBe(200);
      expect(res.body.courses).toBeDefined();
    });

    it('should deny non-staff users', async () => {
      mockAuth({ id: 'user1', username: 'normaluser', admin: false, staff: false });

      const res = await request(app)
        .post('/api/v1/courses/add')
        .set('Authorization', 'Bearer validtoken')
        .send({ name: 'Physics', topics: [] });

      expect(res.body.error).toBe('permission denied');
    });

    it('should return error if course already exists', async () => {
      mockAuth({ id: 'user1', username: 'staffuser', admin: false, staff: true });
      Course.findOne.mockResolvedValue({ _id: 'existing', name: 'Physics' });

      const res = await request(app)
        .post('/api/v1/courses/add')
        .set('Authorization', 'Bearer validtoken')
        .send({ name: 'Physics', topics: [] });

      expect(res.body.error).toBe('Course already exists');
    });
  });

  describe('DELETE /api/v1/courses/:id', () => {
    it('should delete a course and its topics', async () => {
      mockAuth({ id: 'user1', username: 'testuser', admin: false, staff: true });
      Course.findOneAndDelete.mockResolvedValue({ _id: 'course1', name: 'Math' });
      Topic.find.mockResolvedValue([{ _id: 'topic1' }]);
      Topic.findOneAndDelete.mockResolvedValue({});
      Course.find.mockResolvedValue([]);

      const res = await request(app)
        .delete('/api/v1/courses/course1')
        .set('Authorization', 'Bearer validtoken');

      expect(res.status).toBe(200);
    });

    it('should return error if course not found', async () => {
      mockAuth({ id: 'user1', username: 'testuser', admin: false, staff: true });
      Course.findOneAndDelete.mockResolvedValue(null);

      const res = await request(app)
        .delete('/api/v1/courses/nonexistent')
        .set('Authorization', 'Bearer validtoken');

      expect(res.body.error).toBe('Course not found');
    });
  });

  describe('PATCH /api/v1/courses/:id', () => {
    it('should edit a course', async () => {
      mockAuth({ id: 'user1', username: 'instructor', admin: false, staff: true });
      Course.findOne.mockResolvedValueOnce({
        _id: 'course1',
        name: 'Old Name',
        instructor: { username: 'instructor' },
      });
      Course.findOne.mockResolvedValueOnce(null);
      Course.findOneAndUpdate.mockResolvedValue({ _id: 'course1', name: 'New Name' });
      Course.find.mockResolvedValue([]);

      const res = await request(app)
        .patch('/api/v1/courses/course1')
        .set('Authorization', 'Bearer validtoken')
        .send({ name: 'New Name' });

      expect(res.status).toBe(200);
    });
  });
});
