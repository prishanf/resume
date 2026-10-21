<template>
  <div class="min-h-screen">
    <section class="relative bg-gradient-to-br from-white via-inverse to-secondary/10 py-12 overflow-hidden">
      <div class="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl">
          <p class="text-xs font-bold text-accent uppercase tracking-[0.3em] mb-6">Vancouver, BC · Slalom</p>
          <h1 class="text-4xl md:text-6xl font-black text-primary mb-6 tracking-tighter leading-[0.95]">
            Salesforce &amp; Agentforce Architect in Vancouver, BC
          </h1>
          <p class="text-xl text-gray-600 max-w-2xl font-medium leading-relaxed">
            Director, Global Salesforce at Slalom. Hands-on architect for Agentforce, enterprise integrations, AI governance, and the Salesforce platform.
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
              Great technology serves people, not the other way around. Whether the work is a multi-cloud integration or introducing AI into a delivery team, the same sequence applies: start with the human need, design backward from there, and measure outcomes that actually matter.
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
      title="Have an Agentforce or integration challenge? Let's talk."
      description="The best way to reach Prishan is on LinkedIn."
      button-label="Connect on LinkedIn"
    />
  </div>
</template>

<script setup>
import { personJsonLd, webPageJsonLd, PROFILE_IMAGE_PATH } from '~/utils/seo'

const pageTitle = 'Salesforce & Agentforce Architect in Vancouver, BC'
const pageDescription = 'Salesforce and Agentforce architect in Vancouver, BC. Agentforce, MuleSoft integration, AI governance, and Salesforce platform architecture at Slalom.'

const sections = [
  {
    id: 'agentforce-ai',
    title: 'Agentforce & AI architecture',
    problems: [
      'Organizations stuck in AI experimentation without a path to production Agentforce or agentic workflows.',
      'Agent sprawl across teams and vendors, with no shared visibility or consistent rules.',
      'Practitioners who need practical upskilling, not another slide deck about generative AI.'
    ],
    approach: 'I treat AI adoption as a people and process change, not a tool rollout. That means hands-on frameworks, clear guardrails, and time spent upskilling practitioners so Agentforce and AI assistants show up in real delivery work. I experiment in the open — Claude, Cursor, custom agents, and Agentforce — then bring what holds up into enterprise architecture.',
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
    id: 'integration-mulesoft',
    title: 'Integration architecture & MuleSoft',
    problems: [
      'Salesforce programs that stall because ERP, files, and quote-to-cash flows were never designed as a system.',
      'Rule-based integration that cannot handle unstructured, off-script work now showing up with agentic AI.',
      'Disconnected agents and APIs with no control plane for discovery, orchestration, or audit.'
    ],
    approach: 'I design integration as architecture, not a pile of point-to-point interfaces: data model, API contracts, migration, and the operating model for change. MuleSoft, Workato, and custom APIs are part of the stack I use. On the agentic side, I write about MuleSoft Agent Fabric as a control plane on top of existing APIs — so agents can use integrations as tools without giving up governance.',
    experience: [
      'Held the Integration Architect role on the Avigilon account, alongside Program Architect and Enterprise Architect, including Fusion X multi-brand CRM consolidation, integration strategy, and data migration.',
      'Led the technical architecture stream for MSI Quote-to-Cash, partnering with the client on integration requirements.',
      'Delivered IG Wealth Management Secure File Exchange and the Splan Integration Project.',
      'Worked the Pelco & IndigoVision Integration Discovery, and earlier TELUS integrations with Apttus and DocuSign plus HSBC SSO integrations.',
      'Integration stack listed in current work: MuleSoft, Workato, and custom APIs. Workato Automation Pro I and II certified.'
    ],
    posts: [
      { href: '/posts/mulesoft-agent-fabric-rethinking-integration/', label: 'Rethinking Integration: Why MuleSoft Agent Fabric Challenges the Status Quo' }
    ]
  },
  {
    id: 'ai-governance',
    title: 'AI governance & data security',
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
      'On the IA account, served as Enterprise Architect covering cross-cloud governance, roadmap alignment, and technical risk management.'
    ],
    posts: [
      { href: '/posts/ai-governance-checklist-by-org-type/', label: 'AI Data & Security Governance Checklist' },
      { href: '/posts/ai-data-security-article/', label: 'Is Your Data Safe with AI?' },
      { href: '/podcasts/is-amazon-bedrock-safer-than-claude/', label: 'Podcast: Is Amazon Bedrock Safer Than Claude?' }
    ]
  },
  {
    id: 'salesforce-platform',
    title: 'Salesforce platform architecture',
    problems: [
      'Multi-cloud programs (Sales, Service, Experience, CPQ) that need one architecture, not four disconnected implementations.',
      'Org mergers, large data volumes, and Experience Cloud portals that have to stay secure under real traffic.',
      'Executives who need demos and options they can decide on, not a solution already locked in the architect’s head.'
    ],
    approach: 'I stay hands-on across the Salesforce ecosystem — Sales Cloud, Service Cloud, Experience Cloud, CPQ, and Agentforce — and translate that into language executives can use. Architectural rigor is balanced with empathy for the people on both sides of the system.',
    experience: [
      '12+ years specializing in Salesforce architecture, delivery, and practice leadership, with 12+ Salesforce certifications including Experience Cloud Consultant.',
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
