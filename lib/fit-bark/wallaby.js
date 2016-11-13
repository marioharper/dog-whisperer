module.exports = function (wallaby) {
  return {
    files: [
      'src/**/*.js'
    ],
    tests: [
      'test/**/*.js'
    ],
    testFramework: 'mocha',
    env: {
        type: 'node'
    }
  };
};