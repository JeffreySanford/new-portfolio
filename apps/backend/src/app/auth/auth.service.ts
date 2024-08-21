import { Injectable } from '@nestjs/common';
import { JWTAuthService } from './jwt/jwt.service';
import { JwtPayload } from './jwt/jwt-payload.interface';
import { User } from '../users/user.interface';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JWTAuthService
    ) {}


    login(user: User): Observable<{ access_token: string }> {
        const payload: JwtPayload = { username: user.username, sub: user.id };
        return from(this.jwtService.login(user)).pipe(
            map(response => ({ access_token: response.access_token }))
        );
    }

    create(user: User): Observable<{ username: string }> {
        return new Observable(observer => {
            observer.next({ username: user.username });
            observer.complete();
        });
    }
}