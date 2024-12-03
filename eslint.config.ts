import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  formatters: true,
  rules: {
    'vue/no-unused-refs': 'off',
  },
})
