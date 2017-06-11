module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  extends: 'eslint:recommended',
  parser: 'babel-eslint',
  env: {
    browser: true
  },
  rules: {
    "no-console": 0
}
};
