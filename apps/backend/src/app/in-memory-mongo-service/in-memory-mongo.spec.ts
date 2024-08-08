// mongo-in-memory.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { MongoInMemoryService } from './mongo-in-memory.service';
import { getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, connection } from 'mongoose';

jest.mock('mongodb-memory-server');
jest.mock('mongoose', () => ({
  connect: jest.fn(),
  connection: {
    close: jest.fn(),
  },
}));

describe('MongoInMemoryService', () => {
 
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MongoInMemoryService,
        {
          provide: getModelToken('User'),
          useValue: {},
        },
      ],
    }).compile();
  });

  it('should initialize MongoDB connection', async () => {
    const mockUri = 'mongodb://localhost:27017/test';
    let mongodMock: jest.Mocked<MongoMemoryServer> & { create: jest.Mock<any, any>, emit: jest.Mock<any, any>, on: jest.Mock<any, any> };
    const userModel = {}; // Provide a value for the userModel argument
    const service = new MongoInMemoryService(userModel); // Declare the 'service' variable
    mongodMock.create.mockResolvedValueOnce({
      getUri: jest.fn().mockReturnValue(mockUri),
    } as any);
    (connect as jest.Mock).mockResolvedValueOnce(connection);
  
    await service.onModuleInit();
  
    expect(mongodMock.create).toHaveBeenCalled();
    expect(connect).toHaveBeenCalledWith(mockUri);
    expect(service['connection']).toBe(connection);
    expect(console.log).toHaveBeenCalledWith('Connected to in-memory MongoDB');
  });

  it('should handle MongoDB initialization error', async () => {
    const error = new Error('Initialization error');
    mongodMock.create.mockRejectedValueOnce(error);

    await service.onModuleInit();

    expect(console.error).toHaveBeenCalledWith('Error during MongoDB initialization', error);
  });

  it('should close MongoDB connection on destroy', () => {
    service['connection'] = connection;
    service['mongod'] = new MongoMemoryServer();

    service.onModuleDestroy();

    expect(connection.close).toHaveBeenCalled();
    expect(service['mongod'].stop).toHaveBeenCalled();
  });

  it('should not throw error if connection or mongod is not set on destroy', () => {
    expect(() => service.onModuleDestroy()).not.toThrow();
  });
});

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize MongoDB connection', async () => {
    const mockUri = 'mongodb://localhost:27017/test';
    mongodMock.create.mockResolvedValueOnce({
      getUri: jest.fn().mockReturnValue(mockUri),
    } as any);
    (connect as jest.Mock).mockResolvedValueOnce(connection);

    await service.onModuleInit();

    expect(mongodMock.create).toHaveBeenCalled();
    expect(connect).toHaveBeenCalledWith(mockUri);
    expect(service['connection']).toBe(connection);
    expect(console.log).toHaveBeenCalledWith('Connected to in-memory MongoDB');
  });

  it('should handle MongoDB initialization error', async () => {
    const error = new Error('Initialization error');
    mongodMock.create.mockRejectedValueOnce(error);

    await service.onModuleInit();

    expect(console.error).toHaveBeenCalledWith('Error during MongoDB initialization', error);
  });

  it('should close MongoDB connection on destroy', () => {
    service['connection'] = connection;
    service['mongod'] = new MongoMemoryServer();

    service.onModuleDestroy();

    expect(connection.close).toHaveBeenCalled();
    expect(service['mongod'].stop).toHaveBeenCalled();
  });

  it('should not throw error if connection or mongod is not set on destroy', () => {
    expect(() => service.onModuleDestroy()).not.toThrow();
  });
});