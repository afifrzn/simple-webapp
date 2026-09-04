const request = require('supertest');
const app = require('./app');

describe('DevSecOps Lab Unit Tests', () => {
  it('GET /health should return status UP', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'UP');
  });

  it('GET /search should return search query text', async () => {
    const res = await request(app).get('/search?q=test');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('Search Results for: test');
  });

  it('GET /ping without host should return 400', async () => {
    const res = await request(app).get('/ping');
    expect(res.statusCode).toEqual(400);
  });
});
