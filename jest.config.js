module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleFileExtensions: ["ts", "js", "json", "node"],
    roots: ["<rootDir>/test"],
    testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
    verbose: true,
    maxWorkers: 1,
};
