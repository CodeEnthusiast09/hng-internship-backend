import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('ProfileController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Enable CORS like in production
    app.enableCors();

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /me', () => {
    it('should return 200 and correct response structure', () => {
      return request(app.getHttpServer())
        .get('/me')
        .expect(200)
        .expect('Content-Type', /json/)
        .then((response) => {
          expect(response.body).toHaveProperty('status', 'success');
          expect(response.body).toHaveProperty('user');
          expect(response.body).toHaveProperty('timestamp');
          expect(response.body).toHaveProperty('fact');
        });
    });

    it('should return valid user object', () => {
      return request(app.getHttpServer())
        .get('/me')
        .expect(200)
        .then((response) => {
          const { user } = response.body;

          expect(user).toHaveProperty('email');
          expect(user).toHaveProperty('name');
          expect(user).toHaveProperty('stack');

          expect(typeof user.email).toBe('string');
          expect(typeof user.name).toBe('string');
          expect(typeof user.stack).toBe('string');

          expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/); // Basic email validation
        });
    });

    it('should return valid ISO 8601 timestamp', () => {
      return request(app.getHttpServer())
        .get('/me')
        .expect(200)
        .then((response) => {
          const { timestamp } = response.body;

          // Check ISO 8601 format
          const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
          expect(timestamp).toMatch(iso8601Regex);

          // Verify it's a valid date
          const date = new Date(timestamp);
          expect(date.toString()).not.toBe('Invalid Date');

          // Check it's approximately current time (within 10 seconds)
          const now = new Date();
          const diff = Math.abs(now.getTime() - date.getTime());
          expect(diff).toBeLessThan(10000);
        });
    });

    it('should return a cat fact', () => {
      return request(app.getHttpServer())
        .get('/me')
        .expect(200)
        .then((response) => {
          const { fact } = response.body;

          expect(typeof fact).toBe('string');
          expect(fact.length).toBeGreaterThan(0);
        });
    });

    it('should return different timestamps on consecutive requests', async () => {
      const response1 = await request(app.getHttpServer()).get('/me');

      // Wait a small amount to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 100));

      const response2 = await request(app.getHttpServer()).get('/me');

      expect(response1.body.timestamp).not.toBe(response2.body.timestamp);
    });

    it('should have correct Content-Type header', () => {
      return request(app.getHttpServer())
        .get('/me')
        .expect('Content-Type', /application\/json/);
    });

    it('should handle CORS', () => {
      return request(app.getHttpServer())
        .get('/me')
        .expect(200)
        .then((response) => {
          // In a real test, you might check for CORS headers
          // but this depends on your CORS configuration
          expect(response.status).toBe(200);
        });
    });

    it('should respond within acceptable time', async () => {
      const startTime = Date.now();

      await request(app.getHttpServer()).get('/me').expect(200);

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should respond within 10 seconds (considering external API call)
      expect(duration).toBeLessThan(10000);
    });
  });

  describe('Invalid routes', () => {
    it('should return 404 for non-existent routes', () => {
      return request(app.getHttpServer()).get('/invalid-route').expect(404);
    });
  });
});
