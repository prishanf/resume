// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts'
  ],

  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700]
    },
    display: 'swap',
    prefetch: true,
    preconnect: true,
    preload: true,
  },

  content: {
    highlight: {
      theme: 'github-light'
    },
    markdown: {
      // Allow HTML tags including iframes
      html: true
    }
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Prishan Fernando - Technology Leader & Salesforce Architect',
      meta: [
        { name: 'description', content: 'Technology leader and hands-on architect with 20+ years in software development and 12+ years specializing in Salesforce architecture' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Prishan Fernando' },
        { name: 'twitter:card', content: 'summary_large_image' }
      ],
      link: [
        { rel: 'canonical', href: 'https://prishanfernando.com' }
      ],
      script: [
        {
          async: true,
          src: 'https://www.googletagmanager.com/gtag/js?id=G-YL972QXHJ1'
        },
        {
          innerHTML: "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-YL972QXHJ1');"
        }
      ]
    }
  }
})
