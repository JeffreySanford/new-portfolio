import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Connection, AnyObject, Collection } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { from, Observable, of } from 'rxjs';
import { tap, switchMap, catchError } from 'rxjs/operators';
import { User } from '../users/user.interface';

@Injectable()
export class MongoInMemoryService implements OnModuleInit, OnModuleDestroy {
  private mongod: MongoMemoryServer;
  private connection: Connection;

  constructor(@InjectModel('User') private userModel: Model<User>, private mongoConnection: Connection) {}

  /**
   * Initializes the in-memory MongoDB server and establishes a connection.
   * 
   * @returns {Observable<void>} An observable that resolves when the connection is established.
   */
  onModuleInit(): AnyObject {
    return from(MongoMemoryServer.create()).pipe(
      switchMap(mongod => {
        this.mongod = mongod;
        return this.mongoConnection.createCollection(mongod.getUri());
      }),
      catchError(err => {
        console.error('Error during MongoDB initialization', err);
        return of(undefined);
      })
    );
  }

  /**
   * Destroys the in-memory MongoDB server and closes the connection.
   */
  onModuleDestroy(): void {
    if (this.connection) {
      this.connection.close();
    }
    if (this.mongod) {
      this.mongod.stop();
    }
  }
}
