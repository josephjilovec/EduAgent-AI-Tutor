module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
    '!src/index.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleNameMapper: {
    '^@entities/(.*)$': '<rootDir>/src/entities/$1',
    '^@usecases/(.*)$': '<rootDir>/src/usecases/$1',
    '^@adapters/(.*)$': '<rootDir>/src/adapters/$1',
    '^@frameworks/(.*)$': '<rootDir>/src/frameworks/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1'
  }
};

