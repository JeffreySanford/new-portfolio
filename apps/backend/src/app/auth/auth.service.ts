import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../user/users.service';
import { JwtPayload } from './jwt-payload.interface';
import * as bcrypt from 'bcrypt';
import { User } from '../../user/user.interface';
import { from, Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    validateUser(username: string, pass: string): Observable<User | null> {
        return this.usersService.findOne(username).pipe(
            switchMap((user: User) =>
                user ? from(bcrypt.compare(pass, user.password)).pipe(
                    map(isMatch => isMatch ? { ...user, password: undefined } : null)
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

    create(user: Partial<User>): Observable<{ username: string }> {
        return new Observable(observer => {

            observer.next({ username: user.username });
            observer.complete();
        });
    }
}