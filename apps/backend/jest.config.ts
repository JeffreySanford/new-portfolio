import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: 'tsconfig.json', // Adjust this path if your tsconfig file is located elsewhere
    }],
  },
  moduleFileExtensions: ['ts', 'js'],
  transformIgnorePatterns: ['node_modules/(?!(your-esm-package)/)'],
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.spec.json'
    }
  },
  displayName: 'backend',
  coverageDirectory: '../../coverage/apps/backend',
};

export default config;
