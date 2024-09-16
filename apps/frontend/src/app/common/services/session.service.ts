import { Injectable } from '@angular/core';

export interface User {
  username: string;
  password: string;
  id: number;
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {


  status() {
    return false;
  }  getUserSession(): string | null {
    return sessionStorage.getItem('username');
  }

  setUserSession(user: User) {
    sessionStorage.setItem('username', user.username)
  }
}

