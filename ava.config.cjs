const path = require('path')

module.exports = {
  require: [
    'esm'
  ],
  files: [
    '!tests/dummy'
  ],
  match: ['*.test.js'],
  environmentVariables: {
    INIT_CWD: path.join(__dirname, './tests/dummy')
  }
}
