import { Schema, model, connect, Model } from 'mongoose';
import { from, Observable } from 'rxjs';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { InMemoryMongoService } from './in-memory-mongo.service'; // Adjust the import path as necessary

// Define the User schema
const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
}, {
  timestamps: true,
});

// Create the User model
const UserModel: Model<any> = model('User', userSchema);

// Mock the UserModel for testing
const mockUserModel = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn(),
};

describe('MongoInMemoryService', () => {
  let connection: any;

  beforeAll((done) => {
    from(connect('mongodb://localhost:27017/test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })).subscribe({
      next: (conn) => {
        connection = conn;
        done();
      },
      error: (err) => {
        console.error(err);
        done.fail(err);
      },
    });
  });

  afterAll((done) => {
    from(connection.disconnect()).subscribe({
      next: () => done(),
      error: (err) => {
        console.error(err);
        done.fail(err);
      },
    });
  });

  it('should initialize MongoDB connection', (done) => {
    const mockUri = 'mongodb://localhost:27017/test';
    const mongodMock = new MongoMemoryServer() as jest.Mocked<MongoMemoryServer>;
    const service = new InMemoryMongoService(mockUserModel, UserModel);

    jest.spyOn(mongodMock, 'getUri').mockReturnValue(mockUri);
    jest.spyOn(connect, 'mockImplementation').mockImplementation(() => from(Promise.resolve(connection)));

    from(service.onModuleInit()).subscribe({
      next: () => {
        expect(connect).toHaveBeenCalledWith(mockUri);
        expect(service['connection']).toBe(connection);
        expect(console.log).toHaveBeenCalledWith('Connected to in-memory MongoDB');
        done();
      },
      error: (err) => {
        console.error(err);
        done.fail(err);
      },
    });
  });

  it('should handle MongoDB initialization error', (done) => {
    // Test case for handling MongoDB initialization error
    done();
  });
});