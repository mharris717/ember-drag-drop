'use strict';

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },
  plugins: ['ember'],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended',
    'plugin:prettier/recommended',
  ],
  env: {
    browser: true,
  },
  rules: {},
  overrides: [
    // node files
    {
      files: [
        './.eslintrc.js',
        './.prettierrc.js',
        './.template-lintrc.js',
        './ember-cli-build.js',
        './index.js',
        './testem.js',
        './blueprints/*/index.js',
        './config/**/*.js',
        './tests/dummy/config/**/*.js',
      ],
      parserOptions: {
        sourceType: 'script',
      },
      env: {
        browser: false,
        node: true,
      },
      plugins: ['node'],
      extends: ['plugin:node/recommended'],
    },
    {
      // test files
      files: ['tests/**/*-test.{js,ts}'],
      extends: ['plugin:qunit/recommended'],
    },
    // TODO delete when files are compliant (refactored to native class / glimmer)
    {
      files: ['addon-test-support/helpers/data-transfer.js'],
      rules: {
        'ember/no-classic-classes': 1,
      },
    },
    {
      files: ['addon/components/draggable-object-target.js'],
      rules: {
        'ember/no-actions-hash': 1,
        'ember/no-classic-classes': 1,
        'ember/no-classic-components': 1,
        'ember/no-component-lifecycle-hooks': 1,
        'ember/no-get': 1,
        'ember/no-mixins': 1,
        'ember/require-tagless-components': 1,
      },
    },
    {
      files: ['addon/components/draggable-object.js'],
      rules: {
        'ember/no-actions-hash': 1,
        'ember/no-classic-classes': 1,
        'ember/no-classic-components': 1,
        'ember/no-component-lifecycle-hooks': 1,
        'ember/no-get': 1,
        'ember/no-incorrect-calls-with-inline-anonymous-functions': 1,
        'ember/require-tagless-components': 1,
      },
    },
    {
      files: ['addon/components/sortable-objects.js'],
      rules: {
        'ember/no-classic-classes': 1,
        'ember/no-classic-components': 1,
        'ember/no-component-lifecycle-hooks': 1,
        'ember/require-tagless-components': 1,
      },
    },
    {
      files: ['addon/mixins/droppable.js'],
      rules: {
        'ember/no-get': 1,
        'ember/no-new-mixins': 1,
      },
    },
    {
      files: ['addon/services/drag-coordinator.js'],
      rules: {
        'ember/no-classic-classes': 1,
        'ember/no-get': 1,
      },
    },
    {
      files: ['app/models/coordinator.js'],
      rules: {
        'ember/no-classic-classes': 1,
      },
    },
    {
      files: ['app/models/obj-hash.js'],
      rules: {
        'ember/no-classic-classes': 1,
      },
    },
  ],
};
