module.exports = {
    globalSetup: './tests/jest.setup.js',
    globalTeardown: './tests/jest.teardown.js',
    testEnvironment: 'node',
    testTimeout: 30000, // Timeout pour donner du temps au conteneur
};