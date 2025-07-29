import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { UserRole } from '../enums/enums';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {

    const mockRepo = {
      FindOnEmail: jest.fn().mockResolvedValue(null),
      FindOnPhone: jest.fn().mockResolvedValue(null),
      CreateUser: jest.fn().mockResolvedValue({
        id: 1,
        email: "soroush@gmail.com",
        username: "soroush1234",
        password: "12345678",
        role: "job_seeker",
        phone: "1234567890",
      })
    };
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService, 
        {
          provide: AuthRepository,
          useValue: mockRepo
        },
        {
          provide: JwtService,
          useValue: null
        },
        {
          provide: ConfigService,
          useValue: null
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a user successfully', async () => {
    const result = await service.Register({
      email: "soroush@gmail.com",
      username: "soroush1234",
      password: "12345678",
      phone: "1234567890",
      role: UserRole.jobSeeker
    });

    expect(result).toBe('user created successfully')
  });

});