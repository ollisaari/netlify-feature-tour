// Use '@netlify/eslint-config-node/esm' if the repository is using pure ES modules
const { overrides } = require('@netlify/eslint-config-node')

module.exports = {
    extends: '@netlify/eslint-config-node',
    rules: {
      "max-lines-per-function": ["off"],
      max-statements: ["error", 15, { "ignoreTopLevelFunctions": true }],
      "indent": ["error", 4]
    },
    overrides: [...overrides],
}
