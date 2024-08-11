import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class OAuth2Strategy extends PassportStrategy(Strategy, 'oauth2') {
  constructor() {
    super({
      authorizationURL: 'https://your-auth-server.com/auth',
      tokenURL: 'https://your-auth-server.com/token',
      clientID: 'your-client-id',
      clientSecret: 'your-client-secret',
      callbackURL: 'http://localhost:3000/auth/callback',
    });
  }

  validate(accessToken: string, refreshToken: string, profile: any): Observable<any> {
    return of({ accessToken, refreshToken, profile }).pipe(
      map(user => user),
      catchError(err => of(null)) // Handle errors gracefully
    );
  }
}