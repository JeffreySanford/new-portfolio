import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UsersService {

    findOne(username: string): Observable<{ username: string, password: string }> {
        return new Observable(observer => {
            observer.next({ username: username, password: 'changeme' });
            observer.complete();
        });
    }

    create(user: string): Observable<{ username: string }> {
        return new Observable(observer => {
            observer.next({ username: user });
            observer.complete();
        });
    }
}
