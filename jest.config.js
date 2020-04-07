module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts'
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules',
    '.d.ts$'
  ],
  coverageReporters: [
    'lcov',
    'text'
  ],
  transform: {
    '.ts': 'ts-jest'
  },
  globals: {
    'ts-jest': {
      diagnostics: true
    }
  }
};
