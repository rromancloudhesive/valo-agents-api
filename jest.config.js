require('dotenv').config();

module.exports = {
  testEnvironment: 'node', // O 'jsdom' para pruebas de navegador
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
};