// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://prishanfernando.com',
      /** GitHub profile URL (e.g. for Activity Summary footer link). */
      githubProfileUrl: process.env.NUXT_PUBLIC_GITHUB_PROFILE_URL || 'https://github.com/prishanf',
      /** Google Sheet ID for YouTube videos (from the sheet URL: .../d/SHEET_ID/edit). Sheet must be shared "Anyone with the link can view". */
      googleSheetIdVideos: process.env.NUXT_PUBLIC_GOOGLE_SHEET_ID_VIDEOS || '1Etit50X5tAj4Zh4d9WH23QHoCgSbdo4Qm6c4_XWM01A',
      /** Optional: sheet tab GID (default 0 = first tab). */
      googleSheetGidVideos: process.env.NUXT_PUBLIC_GOOGLE_SHEET_GID_VIDEOS || '0'
    }
  },

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
        { rel: 'canonical', href: 'https://prishanfernando.com' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicons/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicons/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicons/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicons/favicon-16x16.png' },
        { rel: 'manifest', href: '/favicons/site.webmanifest' },
        { rel: 'shortcut icon', href: '/favicons/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/favicons/android-chrome-192x192.png' },
        { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/favicons/android-chrome-512x512.png' },
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
