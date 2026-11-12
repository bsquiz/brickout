module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': ['babel-jest', {
      presets: ['@babel/preset-typescript'],
      plugins: ['@babel/plugin-transform-modules-commonjs']
    }]
  },
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/main.ts',
    '!src/**/*.test.ts',
    '!src/test/**',
    '!src/**/*.d.ts'
  ],
  coverageThreshold: {
    global: { statements: 50, branches: 45, functions: 55, lines: 50 }
  }
};
