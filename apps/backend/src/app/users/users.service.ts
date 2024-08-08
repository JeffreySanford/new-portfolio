import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from './user.interface';

@Injectable()
export class UsersService {

    findOne(username: string): Observable<User> {
        
        return new Observable(observer => {
            observer.next({ id: 0, username: username, password: 'changeme' });
            observer.complete();
        });
    }

    create(user: User): Observable<User> {
        
        return new Observable(observer => {
            observer.next(user);
            observer.complete();
        });
    }
}
