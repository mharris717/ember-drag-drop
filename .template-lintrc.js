'use strict';

module.exports = {
  extends: 'recommended',

  overrides: [
    {
      files: ['./app/templates/components/sortable-objects.hbs'],
      rules: {
        'no-yield-only': 'warn',
      },
    },
  ],
};
