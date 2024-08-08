import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JWTAuthService } from '../auth/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtAuthService: JWTAuthService;

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
          provide: JWTAuthService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
      imports: [JwtModule.register({ secret: 'test' })],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtAuthService = module.get<JWTAuthService>(JWTAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return a user if validation is successful', (done) => {
      const user = { id: 1, username: 'test', password: 'test' };
      jest.spyOn(usersService, 'findOne').mockReturnValue(of(user));

      service.validateUser('test', 'test').subscribe(result => {
        expect(result).toEqual(user);
        done();
      });
    });

    it('should return null if validation fails', (done) => {
      jest.spyOn(usersService, 'findOne').mockReturnValue(of(null));

      service.validateUser('test', 'wrong').subscribe(result => {
        expect(result).toBeNull();
        done();
      });
    });
  });

  describe('login', () => {
    it('should return an access token', (done) => {
      const user = { id: 1, username: 'test', password: 'test' };
      const token = 'testToken';
      jest.spyOn(jwtAuthService, 'sign').mockReturnValue(of(token));

      service.login(user).subscribe(result => {
        expect(result).toEqual({ access_token: token });
        done();
      });
    });
  });
});