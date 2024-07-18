// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  /**
   * 指定应用的兼容日期。
   *
   * 这用于控制 Nitro、Nuxt Image 和其他模块中预设的行为，这些预设可能会在没有主要版本颠簸的情况下改变行为。 我们计划在未来改进有关此功能的工具。
   * @see https://nuxt.com/docs/api/nuxt-config#compatibilitydate
   */
  compatibilityDate: '2024-07-18',
})
