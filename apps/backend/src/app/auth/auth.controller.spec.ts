import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JWTAuthService } from './jwt.service';
import { User } from '../users/user.interface';
import { of } from 'rxjs';
import * as bcrypt from 'bcrypt';


describe('AuthService', () => {
  let service: AuthService;
  let userService: UsersService;

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
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return a user if validation is successful', (done) => {
      const hashedPassword = bcrypt.hashSync('test', 10);
      const user = { id: 1, username: 'test', password: hashedPassword };
      jest.spyOn(userService, 'findOne').mockReturnValue(of(user));

      service.validateUser('test', 'test').subscribe(result => {
        expect(result).toEqual({ id: 1, username: 'test' });
        done();
      });
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return a user if validation is successful', (done) => {
      const hashedPassword = bcrypt.hashSync('test', 10);
      const user = { id: 1, username: 'test', password: hashedPassword };
      jest.spyOn(userService, 'findOne').mockReturnValue(of(user));

      service.validateUser('test', 'test').subscribe(result => {
        expect(result).toEqual({ id: 1, username: 'test', password: hashedPassword });
        done();
      });
    });

    it('should return null if validation fails', (done) => {
      const hashedPassword = bcrypt.hashSync('test', 10);
      const user = { id: 1, username: 'test', password: hashedPassword };
      jest.spyOn(userService, 'findOne').mockReturnValue(of(user));

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
      jest.spyOn(JWTAuthService, 'sign').mockReturnValue(token);

      service.login(user).subscribe(result => {
        expect(result).toEqual({ access_token: token });
        done();
      });
    });
  });
});