module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'max-len': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'object-curly-newline': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-alert': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'prefer-destructuring': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vuejs-accessibility/label-has-for': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vuejs-accessibility/form-control-has-label': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vuejs-accessibility/click-events-have-key-events': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'import/prefer-default-export': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
};
