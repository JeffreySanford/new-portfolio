import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { of } from 'rxjs';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.interface'; 

describe('AuthService', () => {
  let service: AuthService;
  let userService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return a user if validation is successful', (done) => {
      const user: User = { id: 1, username: 'test', password: 'test' };
      jest.spyOn(userService, 'findOne').mockReturnValue(of(user));

      service.validateUser('test', 'test').subscribe(result => {
        expect(result).toEqual(user);
        done();
      });
    });

    it('should return null if validation fails', (done) => {
      jest.spyOn(userService, 'findOne').mockReturnValue(of(null));

      service.validateUser('test', 'wrong').subscribe(result => {
        expect(result).toBeNull();
        done();
      });
    });
  });

  describe('login', () => {
    it('should return an access token', (done) => {
      const user: User = { id: 1, username: 'test', password: 'test' };
      const token = 'testToken';
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      service.login(user).subscribe(result => {
        expect(result).toEqual({ access_token: token });
        done();
      });
    });
  });
});