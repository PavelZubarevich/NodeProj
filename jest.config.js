'use strict';
module.exports = {
  roots: ['<rootDir>/src', '<rootDir>'],
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  collectCoverage: true,
  clearMocks: true
};
