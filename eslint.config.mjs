import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

export default [
  ...nextCoreWebVitals,
  {
    ignores: ["android/**/build/**"],
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/immutability": "off",
      "react-hooks/preserve-manual-memoization": "off",
      "react/no-unescaped-entities": "off",
      "import/no-anonymous-default-export": "off",
    },
  },
];
