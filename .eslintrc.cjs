module.exports = {
  env: {
    es6: true,
    node: true
  },
  plugins: [
    'ava'
  ],
  extends: [
    'standard',
    'plugin:ava/recommended'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module'
  },
  rules: {
    curly: ['off'],
    'dot-notation': ['off'],
    eqeqeq: ['off'],
    'no-debugger': ['off'],
    'no-extra-boolean-cast': ['off'],
    'no-mixed-operators': ['off'],
    'no-multiple-empty-lines': ['off'],
    'no-throw-literal': ['off'],
    'object-curly-spacing': ['off'],
    'one-var': ['off'],
    'spaced-comment': ['off'],
    'no-unused-vars': ['error', { vars: 'all', args: 'all' }],
    'ava/no-skip-test': ['warn']
  }
}
