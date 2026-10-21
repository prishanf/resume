/**
 * Tools hub catalog.
 *
 * Adding a weekly tool:
 * 1. Create `pages/tools/<slug>.vue` (copy an existing calculator as a starting point).
 * 2. Add one object to TOOLS below — the /tools/ index renders a card from this list.
 * 3. If it is a calculator, add matching SEO copy + FAQs in `data/toolSeo.ts`
 *    and render `<ToolsToolSeoContent seo-key="..." />` below the interactive UI.
 * 4. Add the path to STATIC_PATHS in `server/routes/sitemap.xml.ts`.
 * 5. Link any matching posts (and from those posts back to the tool).
 *
 * See docs/adding-a-tool.md.
 */
export type ToolIcon = 'calculator' | 'document' | 'clipboard'

export type ToolCard = {
  slug: string
  path: string
  title: string
  description: string
  cta: string
  icon: ToolIcon
}

export const TOOLS: ToolCard[] = [
  {
    slug: 'mortgage-calculator',
    path: '/tools/mortgage-calculator',
    title: 'Mortgage Calculator',
    description: 'Amortization, extra principal with an annual cap, term summary, and up to three scenarios with charts.',
    cta: 'Open calculator →',
    icon: 'calculator'
  },
  {
    slug: 'canadian-tax-calculator',
    path: '/tools/canadian-tax-calculator',
    title: 'Canadian Tax Calculator',
    description: 'Federal and provincial estimate. Salary, interest, dividends, capital gains, rental income. RRSP and rental deductions. Compare up to three scenarios.',
    cta: 'Open calculator →',
    icon: 'calculator'
  },
  {
    slug: 'heloc-mortgage-calculator',
    path: '/tools/heloc-mortgage-calculator',
    title: 'HELOC vs Mortgage Calculator',
    description: 'Compare converting a HELOC to a fixed mortgage versus extra principal payments. Monthly cost and multi-year outcomes from your numbers.',
    cta: 'Open calculator →',
    icon: 'calculator'
  },
  {
    slug: 'rental-application',
    path: '/tools/rental-application',
    title: 'Rental Application',
    description: 'Multi-step residential rental application. Progress is saved in your browser; generate a PDF when complete.',
    cta: 'Open form →',
    icon: 'document'
  },
  {
    slug: 'todo-board',
    path: '/tools/todo-board',
    title: 'Todo Board',
    description: 'Organize todos by project with New, Working, and Done columns. Stored in your browser.',
    cta: 'Open board →',
    icon: 'clipboard'
  }
]
