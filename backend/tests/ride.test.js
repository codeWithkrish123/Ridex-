const request = require('supertest');
const app = require('../src/app');

describe('Ride API', () => {
  describe('GET /', () => {
    it('should return API running message', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);
      
      expect(response.text).toBe('RideX API is running');
    });
  });

  describe('POST /api/rides/create', () => {
    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/rides/create')
        .send({
          pickup: 'Test Location',
          destination: 'Test Destination',
          vehicleType: 'sedan'
        })
        .expect(401);
      
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/rides/user-rides', () => {
    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/rides/user-rides')
        .expect(401);
      
      expect(response.body).toHaveProperty('message');
    });
  });
});
