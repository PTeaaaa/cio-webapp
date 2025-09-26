// jest.config.js
const nextJest = require('next/jest');
const createJestConfig = nextJest({ dir: './frontend-public' });

const customJestConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    // Adjust this if your alias/path is different
    '^@/(.*)$': '<rootDir>/frontend-public/src/$1',
  },
  testMatch: ['**/*.test.(ts|tsx)'],
};

module.exports = createJestConfig(customJestConfig);
