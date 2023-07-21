/* eslint-env node */
module.exports = {
  root: true,
  env: {
    node: true,
  },
  "parser": "@babel/eslint-parser",
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-prettier",
  ],
};
