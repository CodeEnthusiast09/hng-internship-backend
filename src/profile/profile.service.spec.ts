import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ProfileService } from './profile.service';
import { of, throwError } from 'rxjs';
import { AxiosResponse, AxiosHeaders, AxiosError } from 'axios';

describe('ProfileService', () => {
  let service: ProfileService;
  let httpService: HttpService;
  let configService: ConfigService;

  // ---- Mock ConfigService ----
  const mockConfigService: Partial<ConfigService> = {
    get: jest.fn((key: string, defaultValue?: string): string => {
      const config: Record<string, string> = {
        CAT_FACT_API_URL: 'https://catfact.ninja/fact',
        USER_EMAIL: 'test@example.com',
        USER_NAME: 'Test User',
        USER_STACK: 'Node.js/NestJS',
      };
      return config[key] ?? defaultValue ?? '';
    }),
  } as unknown as ConfigService;

  // ---- Mock HttpService ----
  const mockHttpService: Partial<HttpService> = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return profile with cat fact', async () => {
      const mockCatFact = 'Cats sleep 70% of their lives.';
      const mockResponse: AxiosResponse<{ fact: string }> = {
        data: { fact: mockCatFact },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: new AxiosHeaders() },
      };

      (mockHttpService.get as jest.Mock).mockReturnValue(of(mockResponse));

      const result = await service.getProfile();

      expect(result).toHaveProperty('status', 'success');
      expect(result.user.email).toBe('test@example.com');
      expect(result.user.name).toBe('Test User');
      expect(result.user.stack).toBe('Node.js/NestJS');
      expect(result.fact).toBe(mockCatFact);
    });

    it('should return valid ISO 8601 timestamp', async () => {
      const mockResponse: AxiosResponse<{ fact: string }> = {
        data: { fact: 'Test fact' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: new AxiosHeaders() },
      };

      (mockHttpService.get as jest.Mock).mockReturnValue(of(mockResponse));

      const result = await service.getProfile();

      const timestampRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
      expect(result.timestamp).toMatch(timestampRegex);

      const date = new Date(result.timestamp);
      expect(date.toString()).not.toBe('Invalid Date');
    });

    it('should fetch new cat fact on each request', async () => {
      const mockFact1 = 'Cats have 32 muscles in each ear.';
      const mockFact2 = 'Cats can rotate their ears 180 degrees.';

      const mockResponse1: AxiosResponse<{ fact: string }> = {
        data: { fact: mockFact1 },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: new AxiosHeaders() },
      };

      const mockResponse2: AxiosResponse<{ fact: string }> = {
        data: { fact: mockFact2 },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: new AxiosHeaders() },
      };

      (mockHttpService.get as jest.Mock)
        .mockReturnValueOnce(of(mockResponse1))
        .mockReturnValueOnce(of(mockResponse2));

      const result1 = await service.getProfile();
      const result2 = await service.getProfile();

      expect(result1.fact).toBe(mockFact1);
      expect(result2.fact).toBe(mockFact2);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(httpService.get).toHaveBeenCalledTimes(2);
    });

    it('should handle API timeout error gracefully', async () => {
      const timeoutError = new AxiosError('timeout of 5000ms exceeded');
      timeoutError.code = 'ECONNABORTED';

      (mockHttpService.get as jest.Mock).mockReturnValue(
        throwError(() => timeoutError),
      );

      const result = await service.getProfile();

      expect(result.fact).toBe('Unable to fetch cat fact: Request timeout');
      expect(result.status).toBe('success');
    });

    it('should handle API HTTP error gracefully', async () => {
      const httpError = new AxiosError('Request failed');
      httpError.response = {
        status: 500,
        data: {},
        statusText: 'Internal Server Error',
        headers: {},
        config: { headers: new AxiosHeaders() },
      };

      (mockHttpService.get as jest.Mock).mockReturnValue(
        throwError(() => httpError),
      );

      const result = await service.getProfile();

      expect(result.fact).toContain('Unable to fetch cat fact');
      expect(result.fact).toContain('500');
      expect(result.status).toBe('success');
    });

    it('should handle generic errors gracefully', async () => {
      const genericError = new Error('Network error');

      (mockHttpService.get as jest.Mock).mockReturnValue(
        throwError(() => genericError),
      );

      const result = await service.getProfile();

      expect(result.fact).toBe('Unable to fetch cat fact at this time');
      expect(result.status).toBe('success');
    });

    it('should have all required fields in response', async () => {
      const mockResponse: AxiosResponse<{ fact: string }> = {
        data: { fact: 'Test fact' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: new AxiosHeaders() },
      };

      (mockHttpService.get as jest.Mock).mockReturnValue(of(mockResponse));

      const result = await service.getProfile();

      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('fact');

      expect(result.user).toHaveProperty('email');
      expect(result.user).toHaveProperty('name');
      expect(result.user).toHaveProperty('stack');
    });
  });
});
