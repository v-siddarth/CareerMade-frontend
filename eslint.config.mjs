import nextVitals from 'eslint-config-next/core-web-vitals.js';

const nextConfig = Array.isArray(nextVitals)
  ? nextVitals
  : (Array.isArray(nextVitals?.default) ? nextVitals.default : [nextVitals]);

export default [
  ...nextConfig,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
