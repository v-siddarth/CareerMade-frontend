import nextVitals from 'eslint-config-next/core-web-vitals.js';

export default [
  ...nextVitals,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
