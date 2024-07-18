import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['/dist', '/node_modules', '/packages/**/dist', '/packages/**/node_modules', 'README.md'],
  rules: {
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/consistent-type-definitions': 'off',
    'import/first': 'off',
    'import/order': 'off',
    'symbol-description': 'off',
    'no-console': 'warn',
    'max-statements-per-line': ['error', { max: 2 }],
    'vue/one-component-per-file': 'off',
  },
})
