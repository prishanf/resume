---
title: "Mortgage Renewal Calculator (Canada 2026)"
seoTitle: "Mortgage Renewal Calculator Canada 2026 | Prishan Fernando"
description: "I built a Canada-wide mortgage renewal calculator for 2026. Here is how to use it, a 2021 5-year fixed at 1.99% renewing now, and the OSFI / FCAC rules I actually keep open."
image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2070&auto=format&fit=crop"
date: "2026-11-02"
excerpt: "A 2021 five-year fixed near 2% is coming due. I built the renewal calculator I wanted — payment shock, three offers, extra payments, and a stress-test check that knows when OSFI actually requires it."
tags: ["Finance", "Canada", "Mortgage", "Mortgage Renewal", "Personal Finance", "2026", "OSFI", "Payment Shock"]
published: true
---

# Mortgage Renewal Calculator (Canada 2026)

I live in Vancouver and I build software for a living. I also build little calculators when a money question will not leave me alone.

This one has been sitting on the kitchen table since 2021.

A lot of us locked a five-year fixed near **2%** in 2021 or 2022. That term is coming due in 2026. The internet is full of “payment shock” headlines, a handful of BC-only widgets, and a stress-test story that changed in late 2024 and then… nobody updated the blog posts. I wanted one page that worked for **every province and territory**, compared a few offers side by side, and did not pretend the OSFI rule from 2018 was still the whole story.

So I built it.

**→ [Open the Mortgage Renewal Calculator (Canada, 2026)](/tools/mortgage-renewal-calculator/) and paste in your remaining balance.**

## How I use it

The page is deliberately boring. You type:

1. Province or territory (British Columbia is the default because that is where I live; the payment math does not change if you pick Nunavut).
2. Remaining balance, remaining amortization, current rate, and payment frequency — the numbers on your renewal statement.
3. Up to three offers. The defaults are example late-2026 rates — a 5-year fixed, a 3-year fixed, and a 5-year variable — not a quote from anyone. Swap the labels and rates for whatever a lender or broker actually sent you.
4. Optional lump sum at renewal, and an extra amount on each payment.
5. Gross household income, other monthly debts, property tax, heating, and condo fees — only if you want the GDS/TDS check.
6. What you are actually doing: stay with this lender, switch lenders on the same balance and remaining amortization, or borrow more / extend amortization / deal with a lender that still stress-tests.

It then shows the new payment versus the current one (payment shock in dollars and percent), interest over that term, the balance at the end of the term, what it would cost to **keep today’s payment by stretching amortization**, and a stress-test block using OSFI’s prescribed minimum qualifying rate.

I do not treat the cheapest offer as a command. I treat it as a way to see, in one sitting, whether the renewal letter is as bad as it felt in the email.

## A worked example: $500k at 1.99%, renewing after five years

Here is the scenario the tool opens on, which is also the one I actually ran.

Say you took out a **$500,000** five-year fixed at **1.99%** in late 2021 — 25-year amortization, monthly payments, Canadian compounding (semi-annual, not in advance; that is the Interest Act formula, not a BC quirk). Five years later, in late 2026:

- Remaining balance: **$418,763**
- Remaining amortization: **20 years**
- Current principal-and-interest payment: **$2,115 / month**

Three *example* rates for late 2026 — not a quote from any lender, just numbers you can edit:

| Offer | Rate | Term | New P&I | Shock | Interest over the term | Balance at end of term |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| **5-year fixed** | 4.49% | 5 years | **$2,638** | **+$523 (+24.7%)** | $85,485 | $345,987 |
| 3-year fixed | 4.29% | 3 years | $2,594 | +$479 (+22.6%) | $50,840 | $376,233 |
| 5-year variable | 3.99% | 5 years | $2,528 | +$413 (+19.6%) | $75,713 | $342,784 |

The rate more than doubled. The payment did not. That is the part the headlines skip: you are amortizing a smaller remaining balance over fewer years, so a jump from ~2% to the mid-4s is a **quarter more per month**, not twice as much. Still $523 a month. Still real. Just not a doubling.

The 3-year looks cheaper per month and cheaper in interest *because the term is shorter*. You will be back at the renewal desk in 2029. The variable wins the 5-year comparison in this table only because I typed a lower example rate and then **held it constant**. Prime can move. The tool will not pretend otherwise.

Household in the default: **$135,000** gross, **$450** of other monthly debts, **$4,200** property tax, **$140** heat, no condo fees. At the 4.49% offer the qualifying rate is **6.49%** (contract + 2%, which is above the 5.25% floor). GDS lands at **31.9%** and TDS at **35.9%** — under the typical 39% / 44% limits. On this income, the stress test is not the thing that keeps you up. The cash flow is.

## The “keep my payment” trap

FCAC puts this at the top of [Renewing your mortgage](https://www.canada.ca/en/financial-consumer-agency/services/mortgages/renew-mortgage.html): think twice before extending amortization to lower the payment.

I wired that into the tool because it is the first thing people ask.

On the 4.49% five-year, holding the payment at **$2,115** means stretching the remaining amortization from **20 years to about 29.8 years**. Extra interest to pay the loan off: **about $124,000**. The balance after this five-year term is also higher, because you are grinding principal more slowly.

Two footnotes I care about:

1. Stretching amortization is **not** a straight switch. If you need that relief, you are usually back in qualification land.
2. Lenders may cap how far they will extend. The calculator solves the math; it does not know your contract.

If you have a lump sum or can add $200–$250 a payment instead, run those boxes. Extra per payment does not change the contractual P&I; it just eats principal. A lump sum *does* change the new payment, because it is applied first.

## The Canada-wide rules I keep open in another tab

I am not a mortgage broker. I am a person in Canada who reads the official pages before moving money. These are the ones this calculator is built around.

### The stress test is still “greater of 5.25% or contract + 2%”

OSFI’s [minimum qualifying rate for uninsured mortgages](https://www.osfi-bsif.gc.ca/en/supervision/financial-institutions/banks/minimum-qualifying-rate-uninsured-mortgages) is the greater of the **contract rate plus 2%** or **5.25%**. That is the floor and the buffer in Guideline [B-20](https://www.osfi-bsif.gc.ca/en/guidance/guidance-library/residential-mortgage-underwriting-practices-procedures-guideline-2017). CMHC uses the same qualifying-rate formula when it calculates GDS/TDS for insured lending — see [Calculating GDS / TDS](https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/calculating-gds-tds). Typical limits there are **39% GDS** and **44% TDS**. GDS housing costs are principal and interest, property tax, heating, and **50% of condo fees**.

The calculator uses those figures. Your lender can be tighter.

### Uninsured straight switches: OSFI, 21 November 2024

This is the rule that most 2021-era blog posts still get wrong.

Effective **21 November 2024**, OSFI **no longer prescribes** the minimum qualifying rate for an uninsured **straight switch** at renewal: a stand-alone, amortizing, non-readvanceable uninsured mortgage moving from one **federally regulated** lender to another, with **no increase** in remaining amortization or loan amount. Up to **$3,000** may be added only for penalties and transaction costs. No equity takeout.

Primary source: [OSFI’s 21 November 2024 letter](https://www.osfi-bsif.gc.ca/en/guidance/guidance-library/osfi-exempts-uninsured-mortgage-straight-switches-prescribed-mqr-implements-portfolio-lti-limits), restated on the [MQR page](https://www.osfi-bsif.gc.ca/en/supervision/financial-institutions/banks/minimum-qualifying-rate-uninsured-mortgages).

That is not “nobody will ever stress-test you again.” OSFI still expects sound B-20 underwriting. A new lender can apply its own qualifying policy. Provincially regulated credit unions are not OSFI-regulated; they set their own rules. Borrow more, or stretch amortization, and you are not in straight-switch land.

### Insured switches: Canadian Mortgage Charter, not a vibe

The strengthened **Canadian Mortgage Charter** in Budget 2024 is the government’s own statement that **insured** mortgage holders can switch lenders at renewal without being subject to another mortgage stress test. Department of Finance, 16 September 2024: [boldest mortgage reforms](https://www.canada.ca/en/department-finance/news/2024/09/government-announces-boldest-mortgage-reforms-in-decades-to-unlock-homeownership-for-more-canadians.html), and again when the December 2024 reforms came into force: [15 December 2024 news release](https://www.canada.ca/en/department-finance/news/2024/12/boldest-mortgage-reforms-in-decades-come-into-force-today.html).

A related Finance Canada note on [straight switches and portfolio insurance](https://www.canada.ca/en/department-finance/news/2024/12/straight-switches-and-portfolio-insurance.html) (effective 16 December 2024) aligns low-ratio / portfolio-insured switches with OSFI’s uninsured change, with the same “no extra amort, no extra principal except up to $3,000 for costs” idea.

FCAC still reminds you that a new lender has to approve the switch, and that **raising the loan amount or extending amortization** can mean a new insurance premium: [Renewing your mortgage — switching lenders](https://www.canada.ca/en/financial-consumer-agency/services/mortgages/renew-mortgage.html).

### Your renewal statement: 21 days, Bank Act

If your mortgage is with a federally regulated institution (a bank, a federal credit union), the lender must give you a renewal statement **at least 21 days** before the term ends — or tell you, by then, that they will not renew. FCAC: [Your renewal statement](https://www.canada.ca/en/financial-consumer-agency/services/mortgages/renew-mortgage.html). The legal hook is [Bank Act s. 627.31](https://laws.justice.gc.ca/eng/acts/b-1.01/section-627.31.html) plus [Financial Consumer Protection Framework Regulations s. 45](https://lois-laws.justice.gc.ca/eng/regulations/SOR-2021-181/section-45.html): the statement includes the remaining principal, rate, frequency, term, and fees; the rate offered cannot be increased before renewal; and the renewal does not take effect until the later of the renewal date and 21 days after you receive the statement.

FCAC’s practical advice, which I actually follow: start shopping **months** before that letter, not the week it arrives. If you do nothing, some lenders auto-renew you onto whatever is in the statement.

## What this is not

It is not a quote, an approval, or advice. Offers in the default scenario are examples. Variable rates are a slider, not a forecast of prime. Prepayment privileges, discharge fees, and whether your charge is standard or collateral are between you and the lender — FCAC’s switching section is worth the five minutes.

If you want the full amortization playground (extra principal caps, term summaries, mortgage vs market), that is still the [Mortgage Calculator](/tools/mortgage-calculator/). HELOC sitting beside the mortgage: [HELOC vs Mortgage Calculator](/tools/heloc-mortgage-calculator/). Tax on the RRSP lump sum you were about to throw at the balance: [Canadian Tax Calculator](/tools/canadian-tax-calculator/). Longer reads: [extra payments vs investing](/posts/mortgage-strategies-save-money-investing-vs-extra-payments/), [HELOC vs fixed](/posts/heloc-vs-mortgage-conversion-analysis/), [debt vs invest 2026](/posts/debt-vs-invest-2026/).

I built the renewal page because I was tired of doing the shock math in a spreadsheet every time a rate email arrived. If your 2021 five-year is coming due, pick your province and borrow the tool.

**→ [Run the Mortgage Renewal Calculator](/tools/mortgage-renewal-calculator/).**
