import 'jest';

declare global {
  namespace NodeJS {
    interface Global {
      myGlobalFunction: jest.Mock;
    }
  }
}