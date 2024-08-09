import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a user if validation is successful', () => {
    const mockUser = { id: 1, username: 'test', password: 'test' };
    spyOn(service, 'validateUser').and.returnValue(of(mockUser));
    service.login(mockUser).subscribe(user => {
      expect(user).toEqual(mockUser);
    });
  });
});
