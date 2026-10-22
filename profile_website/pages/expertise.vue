<template>
  <div class="min-h-screen">
    <section class="relative bg-gradient-to-br from-white via-inverse to-secondary/10 py-12 overflow-hidden">
      <div class="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
      <div class="hidden lg:block absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl">
          <p class="text-xs font-bold text-accent uppercase tracking-[0.3em] mb-6">Vancouver, BC · Slalom</p>
          <h1 class="text-4xl md:text-6xl font-bold text-primary mb-6 tracking-tighter leading-[0.95]">
            AI Solutions Architect &amp; Builder in Vancouver, BC
          </h1>
          <p class="text-xl text-gray-600 max-w-2xl font-medium leading-relaxed">
            I solve real business problems with AI — not the other way around. Director, Global Salesforce at Slalom. Salesforce and Agentforce are the enterprise platform I work on.
          </p>
        </div>
      </div>
    </section>

    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        <article
          v-for="section in sections"
          :id="section.id"
          :key="section.id"
          class="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-12"
        >
          <div class="lg:col-span-4">
            <h2 class="text-3xl md:text-4xl font-black text-primary tracking-tight">{{ section.title }}</h2>
          </div>
          <div class="lg:col-span-8 space-y-8">
            <div>
              <h3 class="text-xs font-bold text-accent uppercase tracking-[0.3em] mb-3">Problems I solve</h3>
              <ul class="space-y-3">
                <li v-for="item in section.problems" :key="item" class="text-gray-700 leading-relaxed pl-4 border-l-2 border-accent/40">
                  {{ item }}
                </li>
              </ul>
            </div>
            <div>
              <h3 class="text-xs font-bold text-accent uppercase tracking-[0.3em] mb-3">How I approach it</h3>
              <p class="text-gray-700 leading-relaxed">{{ section.approach }}</p>
            </div>
            <div>
              <h3 class="text-xs font-bold text-accent uppercase tracking-[0.3em] mb-3">Relevant experience</h3>
              <ul class="space-y-3">
                <li v-for="item in section.experience" :key="item" class="text-gray-700 leading-relaxed">
                  {{ item }}
                </li>
              </ul>
            </div>
            <div v-if="section.posts?.length">
              <h3 class="text-xs font-bold text-accent uppercase tracking-[0.3em] mb-3">Related insights</h3>
              <div class="flex flex-col gap-2">
                <NuxtLink
                  v-for="post in section.posts"
                  :key="post.href"
                  :to="post.href"
                  class="font-bold text-primary hover:text-accent transition-colors"
                >
                  {{ post.label }} →
                </NuxtLink>
              </div>
            </div>
          </div>
        </article>

        <article id="how-i-work" class="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8 border-t border-gray-100">
          <div class="lg:col-span-4">
            <h2 class="text-3xl md:text-4xl font-black text-primary tracking-tight">How I work</h2>
          </div>
          <div class="lg:col-span-8 space-y-4 text-gray-700 leading-relaxed">
            <p>
              Great technology serves people, not the other way around. Whether the work is introducing AI into a delivery team or architecting on an enterprise platform, the same sequence applies: start with the human need, design backward from there, and measure outcomes that actually matter.
            </p>
            <p>
              AI adoption fails when it is treated as a technology project. It succeeds when it is treated as a people and process transformation — with governance, guardrails, and leaders who can bring skeptics along.
            </p>
            <p>
              That is also how I lead. At Groundswell I learned people leadership by doing, starting with co-op students. At Slalom I have grown the Western Canada Salesforce practice, mentored developers into architects, and stayed hands-on as Program Architect, Integration Architect, and Enterprise Architect on strategic accounts.
            </p>
          </div>
        </article>
      </div>
    </section>

    <LayoutGetInTouch
      variant="page"
      title="Have a real business problem AI could solve? Let's talk."
      description="The best way to reach Prishan is on LinkedIn."
      button-label="Connect on LinkedIn"
    />
  </div>
</template>

<script setup>
import { personJsonLd, webPageJsonLd, PROFILE_IMAGE_PATH } from '~/utils/seo'

const pageTitle = 'AI Solutions Architect & Builder · Vancouver, BC'
const pageDescription = 'AI Solutions Architect & Builder in Vancouver, BC. Agents, automation, testing, and governance — Salesforce and Agentforce among the platforms I work on.'

const sections = [
  {
    id: 'ai-solutions',
    title: 'AI for real business problems',
    problems: [
      'Teams looking for AI uses instead of starting from a business problem that needs a better answer.',
      'AI experiments that never become working agents, automation, or production workflows — including Agentforce at work.',
      'Practitioners who need practical upskilling, not another slide deck about generative AI.'
    ],
    approach: 'I treat AI as a way to solve a real business problem, not as a solution looking for a home. That means agents and automation that show up in delivery work — including Agentforce on the Salesforce platform — with clear guardrails and time spent upskilling practitioners. I experiment in the open, then bring what holds up into enterprise architecture.',
    experience: [
      'Director, Global Salesforce at Slalom, sitting at the intersection of enterprise delivery and AI transformation.',
      'Spearheaded Slalom’s internal AI Task Team to scale AI capabilities and adoption across the Western Canada practice.',
      'Earned Agentforce credentials, including Salesforce Certified AI Associate (Agentforce), Agentblazer Innovator 2025, and the Agentforce Service and Prompt Builder Templates superbadges.',
      'Currently architecting production Agentforce deployments for enterprise clients, with 2025 work expanding into AI enablement and agentic workflows.',
      'Built AI-assisted delivery frameworks used on data migration work, including the Duravant migration, and reusable toolkits reused across engagements.'
    ],
    posts: [
      { href: '/posts/ai-cloud-transformation/', label: 'The Future of AI-Enabled Cloud Transformation' },
      { href: '/posts/ai-coding-assistants-comparison-2026/', label: 'Cline vs Copilot vs Claude Code vs Cursor' }
    ]
  },
  {
    id: 'ai-assisted-development',
    title: 'AI-assisted development',
    problems: [
      'Delivery teams that want AI in the software lifecycle — development, automation, and testing — without a toy demo.',
      'Too many coding assistants, not enough clarity on which workflow actually fits how people work.',
      'Manual scripting and repeatable delivery steps that still have not been turned into reusable AI-assisted frameworks.'
    ],
    approach: 'I use AI the way I use any other tool: on real software. Hands-on with Cursor, Claude Code, GitHub Copilot, and custom agents for development, automation, and testing. The test is whether the work ships — a site, a calculator, a migration framework — not whether the prompt looked clever.',
    experience: [
      'Built this profile site with AI-assisted development (Nuxt 3, Nuxt Content, Tailwind, GitHub Pages), documented in the open.',
      'Published a same-model comparison of Cline, GitHub Copilot, Claude Code, and Cursor for 2026 — interface, context, agentic behaviour, and cost.',
      'Built AI-assisted delivery frameworks used on data migration work, including the Duravant migration, now reused across engagements.',
      '70+ GitHub repositories spanning Claude integrations, custom AI agents, Next.js, Vue/Nuxt, and experimental frameworks. Current tools include Cursor, Claude Code, Copilot, OpenRouter, and OpenAI APIs.'
    ],
    posts: [
      { href: '/posts/ai-coding-assistants-comparison-2026/', label: 'Cline vs Copilot vs Claude Code vs Cursor' },
      { href: '/posts/building-my-profile-website/', label: 'Building this profile website with AI-assisted development' }
    ]
  },
  {
    id: 'ai-governance',
    title: 'AI governance & security',
    problems: [
      'Teams shipping prompts before legal, security, and compliance have a repeatable way to say yes or no.',
      'Shadow AI, unclear data residency, and vendor risk treated as an AI-specific panic instead of ordinary cloud due diligence.',
      'Healthcare, financial services, and public-sector constraints that generic AI policies do not cover.'
    ],
    approach: 'I help teams move fast and move safely: data classification, vendor assessment, access controls, and the regulations that actually apply. The goal is governance that prevents shadow AI and protects sensitive data without becoming a policy document nobody uses.',
    experience: [
      'Written a practical AI data and security governance checklist organized by organisation type, including healthcare, financial services, government, enterprise, and small business.',
      'Published a detailed breakdown of Claude, Anthropic, and cloud security — including when Amazon Bedrock is the more appropriate control plane — and recorded a podcast episode on the same question.',
      'Delivery work in regulated and high-trust environments, including Fraser Health, IG Wealth Management secure file exchange, and earlier HSBC Trade & Supply Chain platforms.',
      'Served as Enterprise Architect on a long-running enterprise account, covering cross-cloud governance, roadmap alignment, and technical risk management.'
    ],
    posts: [
      { href: '/posts/ai-governance-checklist-by-org-type/', label: 'AI Data & Security Governance Checklist' },
      { href: '/posts/ai-data-security-article/', label: 'Is Your Data Safe with AI?' },
      { href: '/podcasts/is-amazon-bedrock-safer-than-claude/', label: 'Podcast: Is Amazon Bedrock Safer Than Claude?' }
    ]
  },
  {
    id: 'ai-experiments',
    title: 'Experiments with AI tools',
    problems: [
      'AI enthusiasm that never turns into a business use case someone can actually run.',
      'New tools shipping every week, with no habit of trying them on real work before recommending them.',
      'Side projects and production work treated as separate worlds, so experiments never inform delivery.'
    ],
    approach: 'I am an AI enthusiast who tests tools by building with them. This site, the Canadian finance calculators, and live experiments — including an AI assistant that prepares weekday trading tickets — are how I learn what is useful, then bring the pattern back to business automation.',
    experience: [
      'Built and maintain this site as a living profile: Nuxt 3, markdown content, and GitHub Pages, with AI pair programming in the loop.',
      'Shipped free Canada-focused tools — mortgage, tax, and HELOC calculators, plus a rental application and todo board — as practical software, not slides.',
      'Ran a live micro-trading experiment with Malli, an AI assistant in the Muse app: weekday tickets, two Canadian stocks, real brokerage orders.',
      '70+ GitHub repositories and ongoing experiments with Claude, Cursor, custom agents, Next.js, Vue/Nuxt, Supabase, and related tools.'
    ],
    posts: [
      { href: '/posts/ai-micro-trading-experiment/', label: 'My AI assistant micro-trades while I work' },
      { href: '/posts/building-my-profile-website/', label: 'Building this profile website' },
      { href: '/tools/', label: 'Calculators and utilities' }
    ]
  },
  {
    id: 'salesforce-agentforce',
    title: 'Salesforce & Agentforce at work',
    problems: [
      'Multi-cloud programs (Sales, Service, Experience, CPQ) that need one architecture, not four disconnected implementations.',
      'Org mergers, large data volumes, and Experience Cloud portals that have to stay secure under real traffic.',
      'Executives who need demos and options they can decide on, not a solution already locked in the architect’s head.'
    ],
    approach: 'Salesforce and Agentforce are the enterprise platform I work on — experience and proof, not the headline. I stay hands-on across Sales Cloud, Service Cloud, Experience Cloud, CPQ, and Agentforce, and translate that into language executives can use.',
    experience: [
      '12+ years specializing in Salesforce architecture, delivery, and practice leadership, with 12+ Salesforce certifications including Experience Cloud Consultant.',
      'Director, Global Salesforce at Slalom. Currently architecting production Agentforce deployments for enterprise clients.',
      'Program Architect for Avigilon (Motorola Solutions) Fusion X, a multi-brand CRM consolidation spanning cross-cloud governance and data migration.',
      'Led technical architecture streams for Rockwell Automation and Fraser Health discoveries, including PRM work and demos for non-technical stakeholders.',
      '2025 platform work included FCL Sales Cloud and Distributed Marketing, 407 Express Phase 1 platform stabilization and data architecture, and reusable Map Point Management for desktop and mobile.',
      'Earlier: Director of Development Services at Groundswell Cloud Solutions in Vancouver, and Salesforce / Force.com delivery at TELUS.'
    ],
    posts: [
      { href: '/posts/high-trust-teams/', label: 'Building High-Trust Teams in Technical Environments' },
      { href: '/experience/', label: 'Full experience and evidence' }
    ]
  }
]

const seoConfig = useRuntimeConfig()
const siteUrl = seoConfig.public.siteUrl

usePageSeo({
  title: pageTitle,
  description: pageDescription,
  image: PROFILE_IMAGE_PATH,
  jsonLd: () => [
    personJsonLd(siteUrl),
    webPageJsonLd({
      siteUrl,
      path: '/expertise/',
      name: pageTitle,
      description: pageDescription
    })
  ]
})
</script>
