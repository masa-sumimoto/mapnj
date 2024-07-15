module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  rules: {
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    quotes: ['error', 'single'],
  },
  env: {
    node: true, // Node.js環境を認識
    commonjs: true, // CommonJS形式のモジュールを認識
  },
  overrides: [
    {
      files: ['*.js', '*.ts'], // JavaScript/TypeScriptファイルに対する設定
      env: {
        node: true,
      },
    },
    {
      files: ['webpack.config.js', 'jest.config.js'], // Webpack/Jest設定ファイルに対する設定
      rules: {
        '@typescript-eslint/no-var-requires': 'off', // require文を許可
      },
    },
  ],
};
