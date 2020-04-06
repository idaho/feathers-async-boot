module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.ts'
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules',
    '.d.ts$'
  ],
  coverageReporters: [
    'json',
    'lcov',
    'text'
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  transform: {
    '.ts': 'ts-jest'
  },
  globals: {
    'ts-jest': {
      diagnostics: true
    }
  }
};
