import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt/jwt-payload.interface';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.interface';
import { Observable, from, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    validateUser(username: string, pass: string): Observable<User | null> {
        return this.usersService.findOne(username).pipe(
            switchMap((user: User) =>
                user ? from(bcrypt.compare(pass, user.password)).pipe(
                    map(isMatch => isMatch ? { ...user, password: user.password } : null)
                ) : of(null)
            )
        );
    }

    login(user: User): Observable<{ access_token: string }> {
        const payload: JwtPayload = { username: user.username, sub: user.id };
        return from(this.jwtService.signAsync(payload)).pipe(
            map(access_token => ({ access_token }))
        );
    }

    create(user: User): Observable<{ username: string }> {
        return new Observable(observer => {
            observer.next({ username: user.username });
            observer.complete();
        });
    }
}