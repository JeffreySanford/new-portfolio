import { from, Observable } from 'rxjs';
import { tap, switchMap, catchError } from 'rxjs/operators';
import { User } from '../users/user.interface';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

@Injectable()
export class InMemoryMongoService implements OnModuleInit, OnModuleDestroy {
  private mongod: MongoMemoryServer | null = null;
  private connection: Connection  | null = null;

  constructor(@InjectModel('User') private userModel: Model<User>, private mongoConnection: Connection) {}

  /**
   * Initializes the in-memory MongoDB server and establishes a connection.
   * 
   * @returns {Observable<Connection>} An observable that resolves when the connection is established.
   */
  onModuleInit(): Observable<Connection> {
    return from(MongoMemoryServer.create()).pipe(
      switchMap(mongod => {
        this.mongod = mongod;
        // Additional logic to establish the connection
        return from(this.mongoConnection.openUri(mongod.getUri()));
      }),
      tap(connection => {
        this.connection = connection;
        console.log('Connected to in-memory MongoDB');
      }),
      catchError(error => {
        console.error('Error connecting to in-memory MongoDB', error);
        throw error;
      })
    );
  }

  onModuleDestroy(): void {
    if (this.mongod) {
      this.mongod.stop();
    }
  }
}