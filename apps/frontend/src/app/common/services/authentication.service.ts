import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject,} from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';
import { SessionService, User } from './session.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  currentUserSubject = new BehaviorSubject<User>({
    id: 0,
    username: '',
    password: 'not provided',
    firstName: 'Sam',
    lastName: 'Sam Sample'
  });
  isAdminSubject = new BehaviorSubject<boolean>(false);
  user?: User;
  token: any;
  isLoggedIn = new BehaviorSubject(false);
  isAuthenticated = new BehaviorSubject(false);

  constructor(
    private http: HttpClient,
    private router: Router,
    private notifyService: NotificationService,
    private sessionService: SessionService,
  ) { }

  setUser(user: User) {
    const local = sessionStorage.getItem('username');

    if (local && user.id) {
      this.currentUserSubject = new BehaviorSubject<User>({
        id: user.id,
        username: user.username,
        password: user.password,
        firstName: user.firstName,
        lastName: user.firstName
      });
      this.isAuthenticated.next(true);
      this.notifyService.showSuccess('User Authenticated', 'Authentication')
    }
  }
  isUserAuthenticated(user: User): BehaviorSubject<boolean> {
    if (user) {
      this.isAuthenticated.next(true);
    }

    return this.isAuthenticated;
  }

  isAdmin(user: User): Subject<boolean> {
    let isAdmin = false;
    if (user.username === 'admin') {
      isAdmin = true;
      this.isAdminSubject.next(true);

    } else {
      isAdmin = false;
      this.isAdminSubject.next(false);
    }

    return this.isAdminSubject;
  }
  authenticate(): BehaviorSubject<boolean> {
    return this.isAuthenticated;

  }

  login(username: string, password: string): void  {
    const api = 'http://jeffreysanford.us:3000/';

    this.http.get(api + 'users/:' + username).subscribe((next) => {
      const user = Object.values(next)[0];
      if (user) {
        this.getUser(user).subscribe((next) => {
          if (next.username === '') {
            throw { message: 'User not found', value: 'User.username not found' }

          } else {
            const username = next.username;
            const password = next.password;

            this.http.post<Response>(api + 'users/authenticate', { username, password }).subscribe((auth)=>{
              console.log(user.username + ' authenticated: ' + user.username + ' is ' + auth);
              this.isLoggedIn.next(true);
              this.isAuthenticated.next(true);
              this.user = user;
            });
            
          }
        }, (error) => { console.log(error) });
      }
    });
  }

  getUser(user: User): Observable<User> {
    if (user) {
      this.currentUserSubject.next(user);
    }

    return this.currentUserSubject;
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject?.unsubscribe();
  }
}