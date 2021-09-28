module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/test/utils/importsForJest.ts'],
    globals: {
        "ts-jest": {
            tsconfig: "tsconfig.test.json"
        }
    },
};