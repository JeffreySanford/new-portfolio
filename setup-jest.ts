// setup-jest.ts
import 'jest-preset-angular/setup-jest';
// Add any global setup code for Jest here

// Example: Mocking global objects or functions
(global as any).myGlobalFunction = jest.fn();