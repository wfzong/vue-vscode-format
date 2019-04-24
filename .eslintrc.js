module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: ['airbnb-base', 'plugin:vue/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: ['vue'],
  rules: {
    'linebreak-style': ['error', 'windows'],
    'comma-dangle': ['error', 'never'], // 修正 eslint-plugin-vue 带来的问题
  }
};
