/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: 'jsdom', // Simulate DOM
  transform: {
    '^.+.tsx?$': ['ts-jest', {}],
  },
};
