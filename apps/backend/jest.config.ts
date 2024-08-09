module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.mjs$': 'babel-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: ['node_modules/(?!(your-esm-package)/)'],
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.spec.json'
    }
  },
  displayName: 'backend',
  coverageDirectory: '../../coverage/apps/backend',
};
