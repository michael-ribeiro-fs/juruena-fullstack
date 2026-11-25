'use strict';

const request = require('supertest');
const app = require('../../src/app');

describe('GET /api/health', () => {
  it('retorna 200 com shape correto', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.uptime).toBeGreaterThanOrEqual(0);
    expect(res.body.timestamp).toBeDefined();
    expect(res.body.host).toBeDefined();
  });
});
