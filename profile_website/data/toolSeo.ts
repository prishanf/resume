import type { FaqItem } from '~/utils/seo'

export type RelatedPostLink = {
  path: string
  title: string
}

export type ToolSeoEntry = {
  title: string
  description: string
  heading: string
  paragraphs: string[]
  relatedPosts: RelatedPostLink[]
  faqs: FaqItem[]
}

export const TOOL_SEO: Record<string, ToolSeoEntry> = {
  'canadian-tax-calculator': {
    title: 'Canada Tax Calculator 2026 | Prishan Fernando',
    description: 'Estimate 2024–2026 federal and provincial tax in Canada. Salary, dividends, capital gains, RRSP, and rental. Compare up to three scenarios. Not tax advice.',
    heading: 'How this Canadian tax calculator works',
    paragraphs: [
      'This page estimates Canadian federal and provincial income tax plus payroll deductions for numbers you type in. It supports the 2024, 2025, and 2026 tax years (2026 is the default) and four provinces: Ontario, British Columbia, Alberta, and Quebec. It is a planning sketch, not a filing product and not tax advice.',
      'You can enter employment income, interest, eligible dividends, non-eligible dividends, capital gains, and rental income. Optional deductions are an RRSP contribution and rental expenses. The summary shows after-tax take-home, an average (effective) rate, an approximate marginal rate, and a breakdown of federal tax, provincial tax, CPP or QPP, EI, and QPIP.',
      'Total income is the sum of the amounts you enter. Taxable income is different. The calculator includes capital gains at 50%. Eligible dividends are grossed up by 1.38 and non-eligible dividends by 1.15; federal and provincial dividend tax credits are then applied using the rates stored for that year and province. Net rental income is rental income minus rental expenses, and is not taken below zero. An RRSP amount reduces taxable income.',
      'For employment income the model follows the main T4127 / T1 employee items: the federal basic personal amount (phased down between the 29% and 33% brackets), the Canada Employment Amount, non-refundable credits for base CPP or QPP and EI (and QPIP in Quebec) at the lowest rate, and a deduction from income for enhanced CPP/QPP (first additional plus CPP2/QPP2). Ontario adds surtax, the Ontario Health Premium, and the basic Ontario tax reduction. British Columbia applies the low-income tax reduction. Quebec uses QPP instead of CPP, QPIP, the 16.5% federal abatement, and the deduction for workers. Alberta uses its provincial brackets and basic personal amount. Interest, dividends, capital gains, and rental income do not attract CPP/QPP, EI, or QPIP here.',
      'To use it, pick a tax year and province, fill in the boxes that apply, and leave the rest at zero. Use “Add scenario” to keep up to three mixes — for example the same total as salary versus dividends, or the same income with and without an RRSP. Switch tabs to see each result, then scroll to the comparison table for total income, rates, after-tax income, and tax plus payroll side by side.',
      'The model does not include every credit or deduction. It does not apply GST/HST credits, medical expenses, tuition, northern residents amounts, alternative minimum tax, or corporate tax. Only ON, BC, AB, and QC are available. Confirm anything that matters with the CRA and a qualified professional. This is not financial or tax advice.'
    ],
    relatedPosts: [
      { path: '/posts/canadian-income-rrsp-tax-strategies', title: 'Canadian income, RRSP, and tax strategies' },
      { path: '/posts/canadian-20k-investment-tax-guide-2026', title: 'The 2026 Canadian investment playbook' },
      { path: '/posts/debt-vs-invest-2026', title: 'Pay down debt or invest extra cash' }
    ],
    faqs: [
      {
        question: 'Which tax years and provinces does this calculator cover?',
        answer: 'It estimates 2024, 2025, and 2026, for Ontario, British Columbia, Alberta, and Quebec. 2026 is the default. Other years and provinces are not in the tool.'
      },
      {
        question: 'How are capital gains and dividends treated?',
        answer: 'Capital gains are included at 50%. Eligible dividends are grossed up by 1.38 and non-eligible dividends by 1.15, then federal and provincial dividend tax credits are applied. Those are the assumptions in the calculator code.'
      },
      {
        question: 'Does an RRSP contribution reduce tax in the tool?',
        answer: 'Yes. The RRSP amount you enter is subtracted when taxable income is calculated, along with enhanced CPP/QPP contributions and — in Quebec — the deduction for workers. Rental expenses reduce net rental income and are not taken below zero.'
      },
      {
        question: 'Why do CPP and EI only change when I enter salary?',
        answer: 'CPP or QPP (including the second additional contribution), EI, and QPIP are based on employment income. Quebec uses QPP and QPIP instead of CPP, and a lower EI rate. Investment and rental amounts do not add payroll premiums here.'
      },
      {
        question: 'Can I compare salary against dividends or two RRSP amounts?',
        answer: 'Yes. Add up to three scenarios, change the income mix or RRSP in each, and use the comparison table for after-tax income, effective rate, marginal rate, and total tax plus payroll.'
      },
      {
        question: 'What employee credits and payroll items are included?',
        answer: 'For salary, the tool includes the federal basic personal amount with its high-income phase-out, the Canada Employment Amount, credits for base CPP or QPP and EI (and QPIP in Quebec), a deduction for enhanced CPP/QPP, Ontario surtax and Health Premium, the BC tax reduction, the federal Quebec abatement, and the Quebec deduction for workers. It does not include GST/HST credits, tuition, medical, or other optional amounts.'
      },
      {
        question: 'Is this official CRA software or tax advice?',
        answer: 'No. It is an educational estimate for the years and provinces listed. It does not file a return. Check figures with the CRA and a qualified professional before you act.'
      }
    ]
  },
  'mortgage-calculator': {
    title: 'Canada Mortgage Calculator (Amortization) | Prishan Fernando',
    description: 'Compare mortgage amortization, payment frequency, extra principal with an annual cap, term summaries, and extra vs investing. Not financial advice.',
    heading: 'How this mortgage calculator works',
    paragraphs: [
      'This calculator is a planning workspace for a mortgage you already have or are considering. You enter the amount, interest rate, amortization in years, term length, and payment frequency. It then shows the regular principal-and-interest payment, a full amortization path, a term-by-term summary, and — if you add extra principal — how much interest and time that extra might save.',
      'Each scenario builds a payment schedule from the remaining balance. Extra principal is optional. The tool can cap extra principal each year as a percentage of the original amount; the default cap is 15%, and you can change it. You can also add annual property tax and insurance so the displayed payment is closer to principal, interest, tax, and insurance together. Charts show remaining balance and the yearly split between principal and interest. A “Mortgage vs. Market” block compares interest saved by extra payments with a simple future value of the same extra amounts at a return rate you choose. The return slider defaults to 7%; that is an input, not a forecast.',
      'Start with your current or quoted numbers. Switch frequency between monthly, bi-weekly, and weekly to see how the schedule changes. Add an extra amount if you are testing prepayments. Use “Add scenario” to keep up to three versions — for example two extra-payment amounts or two rates. The term summary lists principal paid, interest paid, extra principal, ending balance, and interest saved in each term versus the same loan with no extra. Expand the amortization table when you want payment-level detail.',
      'Interest is applied on the remaining balance each period. Extra principal reduces the balance after the regular principal portion of that payment, and is limited by the annual cap you set. The tool does not add lender fees, prepayment penalties, or insurance beyond the annual amounts you type. The market comparison is a future-value of the extra-payment stream at the return you enter; it does not tax that return or vary the rate over time.',
      'This is not a lender quote and not financial advice. Prepayment privileges, compounding conventions, and discharge rules vary by lender and province. The tool uses the amounts and rates you enter; it does not fetch live offers. Confirm a decision with your lender and a qualified advisor. For strategy context, see the mortgage, HELOC, and debt-versus-invest articles linked below.'
    ],
    relatedPosts: [
      { path: '/posts/mortgage-strategies-save-money-investing-vs-extra-payments', title: 'Mortgage strategies: extra payments vs investing' },
      { path: '/posts/debt-vs-invest-2026', title: 'Pay down debt or invest extra cash' },
      { path: '/posts/heloc-vs-mortgage-conversion-analysis', title: 'HELOC vs fixed mortgage analysis' }
    ],
    faqs: [
      {
        question: 'What does extra principal do in this calculator?',
        answer: 'Each period, extra principal is applied after the regular principal portion of the payment and reduces the remaining balance, which lowers later interest and can shorten the payoff. It is limited by the annual cap you set.'
      },
      {
        question: 'What is the annual extra-payment cap?',
        answer: 'The tool limits extra principal each year to a percentage of the original mortgage amount. The default is 15%. You can change that percentage; it is an input, not a rule from a specific lender.'
      },
      {
        question: 'How does payment frequency change the result?',
        answer: 'Monthly, bi-weekly, and weekly change how many times interest is calculated and principal is reduced each year. More frequent payments usually mean a slightly smaller remaining balance over the same calendar time, all else equal.'
      },
      {
        question: 'What does Mortgage vs. Market compare?',
        answer: 'It compares interest saved by extra principal with a simple future value of those same extra amounts at a return rate you choose. The default return on the slider is 7%. That comparison ignores tax, fees, and changing market returns.'
      },
      {
        question: 'Can I compare more than one scenario?',
        answer: 'Yes. You can keep up to three scenarios and switch between them. When more than one exists, a comparison table highlights total interest and payoff time.'
      },
      {
        question: 'Is this a quote from a lender?',
        answer: 'No. It is an educational schedule from the numbers you enter. It is not an offer, approval, or financial advice. Check terms with your lender before you prepay or refinance.'
      }
    ]
  },
  'heloc-mortgage-calculator': {
    title: 'HELOC vs Mortgage Calculator Canada | Prishan Fernando',
    description: 'Compare converting a Canadian HELOC to a fixed mortgage vs extra principal. Enter balance, rates, and term for monthly and multi-year results.',
    heading: 'How this HELOC vs mortgage calculator works',
    paragraphs: [
      'This calculator compares two ways to handle a home equity line of credit (HELOC) balance: convert some or all of it to a fixed-rate mortgage, or keep the balance on the HELOC and optionally add extra principal each month. The math matches the approach in the HELOC vs fixed mortgage article: a standard amortizing payment on the converted amount, and interest-only carrying cost on the HELOC amount that remains.',
      'You enter HELOC balance, HELOC rate, fixed mortgage rate, amortization in years, and an analysis period in years. The conversion tables show monthly mortgage principal-and-interest, remaining HELOC interest, and total monthly cost at several conversion amounts. The outcomes table shows principal paid, total interest, interest versus leaving everything on the HELOC, and remaining debt over the analysis period. A second strategy keeps the full balance on the HELOC and applies a monthly extra principal amount you choose. The comparison table lines up conversion, HELOC-only, and HELOC plus extra payments.',
      'Enter your own balance and rates. Set how many years you want to inspect. Use “Conversion amount to compare” to test a partial conversion, or the buttons to jump to the tool’s suggested conversion or the full balance. Adjust the extra payment to see how a paydown strategy changes average monthly cost and remaining balance. If the HELOC rate you entered is lower than the fixed rate, the page flags that converting would cost more in interest under those inputs.',
      'The HELOC portion is treated as interest-only unless you add extra principal. The fixed portion uses a standard amortized payment over the amortization you enter. Rates are held constant for the analysis period. There are no fees, penalties, or insurance in the math. Extra payments go to principal.',
      'Variable HELOC rates change in the real world; this tool does not simulate future rate paths. It does not apply a lender’s conversion rules, qualification tests, or tax treatment. Results are estimates for the numbers you type. This is not financial advice. Read the full analysis and speak with your lender or advisor before you convert or prepay.'
    ],
    relatedPosts: [
      { path: '/posts/heloc-vs-mortgage-conversion-analysis', title: 'HELOC vs fixed mortgage analysis' },
      { path: '/posts/mortgage-strategies-save-money-investing-vs-extra-payments', title: 'Mortgage strategies: extra payments vs investing' },
      { path: '/posts/debt-vs-invest-2026', title: 'Pay down debt or invest extra cash' }
    ],
    faqs: [
      {
        question: 'What is the difference between the two strategies?',
        answer: 'Strategy 1 converts part or all of the HELOC to a fixed amortized mortgage. Strategy 2 keeps the balance on the HELOC and, if you choose, adds a fixed extra principal payment each month. The comparison table also shows HELOC-only with no extra.'
      },
      {
        question: 'How does the calculator treat the remaining HELOC?',
        answer: 'The remaining HELOC is treated as interest-only at the HELOC rate you enter, unless you model extra principal in strategy 2. The converted amount uses a standard principal-and-interest payment over the amortization you set.'
      },
      {
        question: 'What if my HELOC rate is already lower than the fixed rate?',
        answer: 'The tool shows a warning and treats “keep the balance on the HELOC” as the lower-interest path under those inputs. Conversion can still change monthly cash flow and principal paid; read both tables before you decide.'
      },
      {
        question: 'Can I model a partial conversion?',
        answer: 'Yes. Set “Conversion amount to compare” to any amount up to the balance, or use the buttons for the tool’s suggested conversion or the full balance. Tables also step through several conversion amounts.'
      },
      {
        question: 'Does the tool include fees or future rate changes?',
        answer: 'No. Rates stay constant for the analysis period. Fees, penalties, insurance, and tax treatment are not included. A real HELOC rate can move; this page does not path that risk.'
      },
      {
        question: 'Is this financial advice?',
        answer: 'No. It is an educational comparison from the numbers you enter. Confirm conversion rules and payments with your lender and a qualified advisor. The matching article walks through the same methodology in more detail.'
      }
    ]
  },
  'rrsp-vs-tfsa-calculator': {
    title: 'RRSP vs TFSA vs FHSA Calculator (Canada, 2026) | Prishan Fernando',
    description: 'Compare after-tax value of an RRSP, TFSA, FHSA, or non-registered account for any Canadian province or territory in 2026. Uses 2026 federal and provincial brackets. Not financial advice.',
    heading: 'How this RRSP vs TFSA vs FHSA calculator works',
    paragraphs: [
      'This page compares one contribution — the same dollars — in an RRSP, a TFSA, an FHSA, or a non-registered account. It is built for a Canadian resident in the 2026 tax year. Pick a province or territory (British Columbia is the default), then enter current employment income, the contribution, expected income or a combined tax rate at withdrawal, years invested, an expected annual return, and whether you are an eligible first-time home buyer. A toggle reinvests the RRSP or FHSA tax refund in a TFSA. The result is after-tax value at the end, plus which account wins in that scenario. It is a planning sketch, not financial, tax, or legal advice.',
      'Federal and provincial income tax come from the same 2026 engine as the Canadian tax calculator on this site: brackets, the federal basic personal amount, the Canada Employment Amount, and province-specific items already in that engine (Ontario surtax and Health Premium, the BC low-income tax reduction, Quebec QPP/QPIP, the 16.5% federal abatement, and the Quebec worker deduction). The other provinces and territories use 2026 CRA brackets and basic personal amounts. The refund on an RRSP or FHSA contribution is the drop in federal plus provincial tax when that amount is deducted. Payroll (CPP and EI) does not change. Rates shown “now” and the tax on an RRSP withdrawal both use the province you selected.',
      'A TFSA contribution grows tax-free and comes out tax-free, so after-tax value is compound growth. An RRSP deducts the contribution today, grows tax-deferred, then the whole balance is taxed as income at withdrawal. If the refund-reinvest toggle is on, that refund is grown in a TFSA at the same return. An FHSA, when you are an eligible first-time home buyer, combines the deduction with a tax-free qualifying home withdrawal. If you are not eligible, the FHSA is excluded. A non-registered account defaults to a capital gain realized at the end (50% inclusion); you can switch that to interest taxed each year at the current income-tax rate on extra investment income.',
      '2026 contribution-limit assumptions, which you should confirm in CRA My Account: RRSP dollar limit $33,810 and the 18% of earned-income rule (this tool uses the income you type as a proxy for prior-year earned income); TFSA annual dollar limit $7,000; FHSA $8,000 a year and $40,000 lifetime. The calculator still runs if you enter more than those figures, and it warns you. Reinvesting a refund in a TFSA assumes you have room for that extra amount.',
      'Pick your province, fill in income and contribution, set years and return, then choose expected income at withdrawal or a combined tax rate. Mark whether you can use an FHSA. Compare the four after-tax values and read the recommendation. Turn the refund toggle off if you would spend the refund. The standalone Canadian tax calculator still lists Ontario, British Columbia, Alberta, and Quebec only; this comparison tool is the one that covers all 13.',
      'The model holds the return constant and ignores fees, inflation, OAS/GIS clawback, RRSP withholding on a cash withdrawal, Home Buyers’ Plan repayments, and non-qualifying FHSA withdrawals. Confirm room, deadlines, and eligibility with the CRA and a qualified professional before you contribute. This is not financial advice.'
    ],
    relatedPosts: [
      { path: '/tools/canadian-tax-calculator', title: 'Canadian Tax Calculator' },
      { path: '/posts/rrsp-vs-tfsa-vs-fhsa-calculator-canada-2026', title: 'RRSP vs TFSA vs FHSA Calculator (Canada 2026)' },
      { path: '/posts/canadian-income-rrsp-tax-strategies', title: 'Canadian income, RRSP, and tax strategies' },
      { path: '/posts/canadian-20k-investment-tax-guide-2026', title: 'The 2026 Canadian investment playbook' },
      { path: '/posts/debt-vs-invest-2026', title: 'Pay down debt or invest extra cash' }
    ],
    faqs: [
      {
        question: 'Which provinces and territories does this calculator cover?',
        answer: 'All 13: British Columbia, Alberta, Saskatchewan, Manitoba, Ontario, Quebec, New Brunswick, Nova Scotia, Prince Edward Island, Newfoundland and Labrador, Yukon, Northwest Territories, and Nunavut. British Columbia is the default. The province you pick is used for both the contribution-year refund and the withdrawal-year tax.'
      },
      {
        question: 'Which account usually wins?',
        answer: 'If you are an eligible first-time home buyer, the FHSA often wins because you get a deduction now and a tax-free qualifying withdrawal later. If you are not buying a first home, the RRSP tends to win when your tax rate now is higher than at withdrawal (especially if you reinvest the refund in a TFSA). The TFSA tends to win when those rates are similar or the withdrawal rate is higher. A non-registered account almost always trails because growth is taxed. Switching province changes the rates, so the ranking can move.'
      },
      {
        question: 'How does the calculator get the tax refund and the withdrawal tax?',
        answer: 'It reuses the 2026 federal and provincial logic from the Canadian tax calculator on this site, including Ontario surtax and Health Premium and the Quebec abatement where they apply. The refund is the drop in federal plus provincial tax when your contribution is deducted. Tax on an RRSP withdrawal is the extra income tax from adding that future value as fully taxable income at the income (or rate) you enter for withdrawal, in the same province. CPP and EI are not included in those deltas.'
      },
      {
        question: 'What 2026 contribution limits does this use?',
        answer: 'RRSP dollar limit $33,810 and the lesser of that and 18% of the income you enter (a proxy for prior-year earned income). TFSA annual limit $7,000. FHSA $8,000 per year and $40,000 lifetime. These are published CRA figures and do not include your unused room, pension adjustment, or over-contribution history. Check CRA My Account before you contribute.'
      },
      {
        question: 'What if I am not a first-time home buyer?',
        answer: 'Uncheck that box. The FHSA is dropped from the ranking because you generally need to be an eligible first-time home buyer to open one and make a qualifying tax-free withdrawal. The comparison then is RRSP vs TFSA vs non-registered.'
      },
      {
        question: 'Does reinvesting the refund assume extra TFSA room?',
        answer: 'Yes. If you contribute the 2026 TFSA annual limit already, the refund only fits if you have unused TFSA room from prior years (or you contribute less than the annual add). The tool warns you. You can turn the toggle off to count the refund as cash that is not invested.'
      },
      {
        question: 'How is a non-registered account taxed here?',
        answer: 'The default is a capital gain realized at withdrawal, with 50% inclusion in the same tax engine. You can switch to interest taxed each year at your current combined federal and provincial income-tax rate on extra investment income. Dividends, superficial-loss rules, and corporate class funds are not modelled.'
      },
      {
        question: 'Is this official CRA software or financial advice?',
        answer: 'No. It is an educational estimate for Canada in 2026 from the numbers you type. It does not file a return or look up your room. Confirm figures with the CRA and a qualified professional before you act.'
      }
    ]
  }
}

export function getToolSeo(slug: string): ToolSeoEntry | undefined {
  return TOOL_SEO[slug]
}
