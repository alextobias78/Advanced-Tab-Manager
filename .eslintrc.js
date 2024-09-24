// .eslintrc.js
module.exports = {
    env: {
      browser: true,
      es2021: true,
    },
    extends: [
      'airbnb',            // Airbnb's base rules
      'plugin:react/recommended',
      'plugin:prettier/recommended', // Integrates Prettier with ESLint
    ],
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 12,
      sourceType: 'module',
    },
    plugins: ['react', 'prettier'],
    rules: {
      'prettier/prettier': 'error', // Shows Prettier errors as ESLint errors
      'react/jsx-filename-extension': [1, { extensions: ['.jsx', '.js'] }], // Allows JSX in .jsx and .js files
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          jsx: 'never',
        },
      ],
      // Add or override additional rules as needed
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect the react version
      },
    },
  };