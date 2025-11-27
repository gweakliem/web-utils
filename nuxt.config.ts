// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-icon'
  ],
  app: {
    head: {
      title: 'Web Utilities',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      script: [
        {
          src: 'https://www.googletagmanager.com/gtag/js?id=G-973WPBLPVH',
          async: true
        },
        {
          children: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-973WPBLPVH');
          `
        }
      ]
    }
  },
  runtimeConfig: {
    public: {
      githubToken: process.env.FEEDBACK_TOKEN
    }
  },
  nitro: {
    awsAmplify: {
      catchAllStaticFallback: true,
      runtime: 'nodejs20.x'
    }
  }
})
