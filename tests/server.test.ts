import request from 'supertest';
import mongoose from 'mongoose';
import { Express } from 'express';
import app from '../src/index';

// Mock environment variables
process.env.MONGO_URI = 'mongodb://localhost:27017/test_db';

// Connect to the test database before running tests
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI!, {});
});

// Clean up the database after each test
afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

// Disconnect from the database after all tests are done
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Conversation API', () => {
  let testServer: Express;

  beforeAll(() => {
    testServer = app;
  });

  describe('GET /api/conversations', () => {
    it('should return an empty list initially', async () => {
      const response = await request(testServer).get('/api/conversations');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('POST /api/conversations', () => {
    it('should create a new conversation', async () => {
      const response = await request(testServer)
        .post('/api/conversations')
        .send({
          model: 123,
          initialMessage: { message: 'Hello', response: 'Hi there!' }
        });
      expect(response.status).toBe(201);
      expect(response.body.model).toBe(123);
      expect(response.body.messages[0].message).toBe('Hello');
      expect(response.body.messages[0].response).toBe('Hi there!');
    });

    it('should return an error if model is not a number', async () => {
      const response = await request(testServer)
        .post('/api/conversations')
        .send({
          model: 'invalid-model',
          initialMessage: { message: 'Hello' }
        });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Model must be a number');
    });
  });

  describe('GET /api/conversations/:id', () => {
    it('should return a specific conversation', async () => {
      const createResponse = await request(testServer)
        .post('/api/conversations')
        .send({ model: 123, initialMessage: { message: 'Hello' } });

      const conversationId = createResponse.body._id;

      const getResponse = await request(testServer).get(`/api/conversations/${conversationId}`);
      expect(getResponse.status).toBe(200);
      expect(getResponse.body._id).toBe(conversationId);
      expect(getResponse.body.model).toBe(123);
    });

    it('should return a 404 error if conversation is not found', async () => {
      const response = await request(testServer).get('/api/conversations/invalid-id');
      expect(response.status).toBe(500);
    });
  });

  describe('POST /api/conversations/:id/messages', () => {
    it('should add a new message to a conversation', async () => {
      const createResponse = await request(testServer)
        .post('/api/conversations')
        .send({ model: 123, initialMessage: { message: 'Hello' } });

      const conversationId = createResponse.body._id;

      const messageResponse = await request(testServer)
        .post(`/api/conversations/${conversationId}/messages`)
        .send({ message: 'New message' });

      expect(messageResponse.status).toBe(201);
      expect(messageResponse.body.messages).toHaveLength(2);
      expect(messageResponse.body.messages[1].message).toBe('New message');
    });

    it('should return a 404 error if conversation is not found', async () => {
      const response = await request(testServer)
        .post('/api/conversations/invalid-id/messages')
        .send({ message: 'Test message' });

      expect(response.status).toBe(500);
    });
  });
});
