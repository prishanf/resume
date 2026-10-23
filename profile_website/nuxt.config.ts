// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://prishanfernando.com',
      /** GitHub profile URL (e.g. for Activity Summary footer link). */
      githubProfileUrl: process.env.NUXT_PUBLIC_GITHUB_PROFILE_URL || 'https://github.com/prishanf'
    }
  },

  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts'
  ],

  // main.css already includes @tailwind; the module default also injects
  // tailwind.css, which inlined ~50KB of CSS twice and inflated mobile LCP.
  tailwindcss: {
    cssPath: '~/assets/css/main.css'
  },

  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700]
    },
    display: 'optional',
    subsets: ['latin'],
    prefetch: false,
    preconnect: false,
    preload: true,
    download: true,
    inject: true
  },

  experimental: {
    defaults: {
      nuxtLink: {
        trailingSlash: 'append'
      }
    }
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

  nitro: {
    prerender: {
      routes: ['/sitemap.xml', '/expertise/', '/speaking/'],
      // Directory placeholder from summaries with no PDF file; not a real page.
      // Unpublished / draft content must not be generated as public HTML.
      ignore: [
        '/pdfs',
        '/pdfs/',
        '/posts/welcome',
        '/posts/welcome/',
        '/posts/experience-cloud-mastery',
        '/posts/experience-cloud-mastery/',
        '/posts/linkedin-embed',
        '/posts/linkedin-embed/'
      ]
    }
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Prishan Fernando — AI Solutions Architect & Builder',
      meta: [
        { name: 'description', content: 'AI Solutions Architect & Builder. I solve real business problems with AI — not the other way around. Insights, tools and experiments from Vancouver, BC.' },
        { property: 'og:description', content: 'AI Solutions Architect & Builder. I solve real business problems with AI — not the other way around. Insights, tools and experiments from Vancouver, BC.' },
        { name: 'twitter:description', content: 'AI Solutions Architect & Builder. I solve real business problems with AI — not the other way around. Insights, tools and experiments from Vancouver, BC.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Prishan Fernando' },
        { property: 'og:image', content: 'https://prishanfernando.com/images/og-default.jpg' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: 'https://prishanfernando.com/images/og-default.jpg' }
      ],
      link: [
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
          key: 'gtag-src',
          src: 'https://www.googletagmanager.com/gtag/js?id=G-YL972QXHJ1',
          async: true,
          defer: true,
          tagPosition: 'bodyClose'
        },
        {
          key: 'gtag-init',
          innerHTML: "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-YL972QXHJ1');",
          tagPosition: 'bodyClose'
        }
      ]
    }
  }
})
