/**
 * @file Configuration file for ESLint.
 * @author DUMONT Benoit <benoit.dumont@contakt.eco>
 */
const path = require('path');

module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
  },
  extends: [
    'airbnb-base',
    'plugin:jsdoc/recommended',
    'plugin:prettier/recommended',
    'plugin:node/recommended',
  ],
  plugins: ['prettier', 'jsdoc'],
  // add your custom rules here
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
    'import/extensions': 'off',
    'jsdoc/check-access': 'off',
    'jsdoc/check-alignment': 2,
    'jsdoc/check-examples': 0,
    'jsdoc/check-indentation': 'off',
    'jsdoc/check-line-alignment': [2, 'always'],
    'jsdoc/check-param-names': [
      2,
      { checkRestProperty: true, allowExtraTrailingParamDocs: false },
    ],
    'jsdoc/check-property-names': 2,
    'jsdoc/check-syntax': 2,
    'jsdoc/check-types': 2,
    'jsdoc/check-values': 2,
    'jsdoc/empty-tags': 2,
    'jsdoc/implements-on-classes': 2,
    'jsdoc/match-description': 'off',
    'jsdoc/match-name': 'off',
    'jsdoc/multiline-blocks': [
      2,
      {
        noZeroLineText: true,
        noSingleLineBlocks: true,
        singleLineTags: ['lends', 'typedef', 'member', 'type'],
        noMultilineBlocks: true,
        minimumLengthForMultiline: 80,
      },
    ],
    'jsdoc/newline-after-description': 'off',
    'jsdoc/no-bad-blocks': 2,
    'jsdoc/no-defaults': 2,
    'jsdoc/no-missing-syntax': 'off',
    'jsdoc/no-multi-asterisks': [2, { allowWhitespace: true }],
    'jsdoc/no-restricted-syntax': 'off',
    'jsdoc/no-types': 'off',
    'jsdoc/no-undefined-types': 2,
    'jsdoc/require-asterisk-prefix': [2, 'always'],
    'jsdoc/require-description-complete-sentence': 2,
    'jsdoc/require-description': [2, { descriptionStyle: 'tag' }],
    'jsdoc/require-example': 'off',
    'jsdoc/require-file-overview': [
      1,
      {
        tags: {
          author: {
            initialCommentsOnly: true,
            mustExist: true,
            preventDuplicates: false,
          },
          file: {
            initialCommentsOnly: true,
            mustExist: true,
            preventDuplicates: true,
          },
        },
      },
    ],
    'jsdoc/require-hyphen-before-param-description': [2, 'always'],
    'jsdoc/require-jsdoc': [
      1,
      {
        require: {
          ArrowFunctionExpression: true,
          ClassDeclaration: true,
          ClassExpression: true,
          FunctionDeclaration: true,
          FunctionExpression: true,
          MethodDefinition: true,
        },
      },
    ],
    'jsdoc/require-param-description': 2,
    'jsdoc/require-param-name': 2,
    'jsdoc/require-param-type': 2,
    'jsdoc/require-param': [2, { checkRestProperty: true }],
    'jsdoc/require-property': 2,
    'jsdoc/require-property-description': 2,
    'jsdoc/require-property-name': 2,
    'jsdoc/require-property-type': 2,
    'jsdoc/require-returns-check': 2,
    'jsdoc/require-returns-description': 2,
    'jsdoc/require-returns-type': 2,
    'jsdoc/require-returns': [2, { checkConstructors: true }],
    'jsdoc/require-throws': 2,
    'jsdoc/require-yields': 2,
    'jsdoc/require-yields-check': 2,
    'jsdoc/sort-tags': 'off',
    'jsdoc/valid-types': 1,
  },
  ignorePatterns: ['node_modules'],
  settings: {
    'import/resolver': {
      alias: {
        extensions: ['.js', '.json'],
        map: [
          ['~', path.resolve(__dirname, './')],
          ['@', path.resolve(__dirname, './')],
        ],
      },
    },
  },
  globals: {
    node: true,
  },
};
