module.exports = {
  projects: [
    '<rootDir>/apps/frontend', // Path to Angular app's Jest config
    '<rootDir>/apps/backend', // Path to NestJS app's Jest config
  ],
  // Optionally, set global Jest options that apply across the whole monorepo
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['html', 'lcov', 'text-summary'],
};
