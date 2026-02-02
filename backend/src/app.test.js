const request = require('supertest');
const app = require('./app');

describe('Express App', () => {
  describe('GET /api/health', () => {
    it('should return health check status', async () => {
      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'OK',
        message: 'Server is running',
      });
    });
  });

  describe('CORS', () => {
    it('should have CORS enabled', async () => {
      const response = await request(app)
        .get('/api/health')
        .set('Origin', 'http://localhost:3000');

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });

  describe('JSON Middleware', () => {
    it('should parse JSON body', async () => {
      // This test assumes you have a route that accepts JSON
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password' })
        .set('Content-Type', 'application/json');

      // Should not return 400 for malformed JSON parsing
      expect(response.status).not.toBe(400);
    });
  });

  describe('Routes', () => {
    it('should have auth routes mounted', async () => {
      const response = await request(app).post('/api/auth/login');

      // Should not return 404
      expect(response.status).not.toBe(404);
    });

    it('should have survey routes mounted', async () => {
      const response = await request(app)
        .get('/api/admin/surveys')
        .set('Authorization', 'Bearer invalid-token');

      // Should not return 404 (might return 401/403 due to auth)
      expect(response.status).not.toBe(404);
    });
  });
});
