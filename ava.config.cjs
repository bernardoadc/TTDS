const path = require('path')

module.exports = {
  require: [
    'esm'
  ],
  files: [
    '!tests/dummy'
  ],
  environmentVariables: {
    INIT_CWD: path.join(__dirname, './tests/dummy')
  }
}
