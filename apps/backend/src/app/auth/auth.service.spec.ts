import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { JWTAuthService } from './jwt.service';
import { UsersService } from '../users/users.service';
import { Observable, of } from 'rxjs';
import * as bcrypt from 'bcrypt';


describe('AuthService', () => {
  let service: JWTAuthService;
  let usersService: UsersService;

  beforeEach(async () => {
        
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JWTAuthService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useClass: CustomJwtService, // Use the custom JwtService
        },
      ],
    }).compile();

    service = module.get<JWTAuthService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
  });;

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return a user if validation is successful', (done) => {
      const user = { id: 1, username: 'test', password: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36Zf4z5aW8y6FZ6FZ6FZ6FZ' }; // bcrypt hash for 'test'
      jest.spyOn(usersService, 'findOne').mockReturnValue(of(user));

      service.validateUser('test', 'test').subscribe(result => {
        expect(result).toEqual({ id: 1, username: 'test', password: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36Zf4z5aW8y6FZ6FZ6FZ6FZ' });
        done();
      });
    });
  });
});