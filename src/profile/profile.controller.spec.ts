import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

describe('ProfileController', () => {
  let controller: ProfileController;
  let service: ProfileService;

  const mockProfileService = {
    getProfile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: mockProfileService,
        },
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    service = module.get<ProfileService>(ProfileService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /me', () => {
    it('should return profile data', async () => {
      const mockProfile = {
        status: 'success',
        user: {
          email: 'test@example.com',
          name: 'Test User',
          stack: 'Node.js/NestJS',
        },
        timestamp: '2025-10-17T15:30:45.123Z',
        fact: 'Cats sleep 70% of their lives.',
      };

      mockProfileService.getProfile.mockResolvedValue(mockProfile);

      const result = await controller.getMe();

      expect(result).toEqual(mockProfile);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.getProfile).toHaveBeenCalledTimes(1);
    });

    it('should call service.getProfile', async () => {
      const mockProfile = {
        status: 'success',
        user: {
          email: 'test@example.com',
          name: 'Test User',
          stack: 'Node.js/NestJS',
        },
        timestamp: '2025-10-17T15:30:45.123Z',
        fact: 'Test fact',
      };

      mockProfileService.getProfile.mockResolvedValue(mockProfile);

      await controller.getMe();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.getProfile).toHaveBeenCalled();
    });

    it('should return data with correct structure', async () => {
      const mockProfile = {
        status: 'success',
        user: {
          email: 'test@example.com',
          name: 'Test User',
          stack: 'Node.js/NestJS',
        },
        timestamp: '2025-10-17T15:30:45.123Z',
        fact: 'Test fact',
      };

      mockProfileService.getProfile.mockResolvedValue(mockProfile);

      const result = await controller.getMe();

      expect(result).toHaveProperty('status', 'success');
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('fact');
      expect(result.user).toHaveProperty('email');
      expect(result.user).toHaveProperty('name');
      expect(result.user).toHaveProperty('stack');
    });
  });
});
