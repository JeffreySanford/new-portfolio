// apps/frontend/setup-jest.ts
import 'jest-preset-angular/setup-jest'; // Angular-specific Jest setup

// Add any global setup or mocks for Jest
(global as any).myGlobalFunction = jest.fn(); // Example of a global mock function
