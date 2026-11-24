---
title: "Smith Manoeuvre Calculator (Canada 2026)"
seoTitle: "Smith Manoeuvre Calculator Canada 2026 | Prishan Fernando"
description: "I built a Canada-wide Smith Manoeuvre calculator for 2026. Here is how to use it, an Ontario $110k / $500k example from the tool itself, and the CRA interest-deductibility rules I keep open."
image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2070&auto=format&fit=crop"
date: "2026-11-23"
excerpt: "Is HELOC interest tax deductible in Canada? I built the calculator I wanted — deductible interest, the 2026 tax refund, and net worth versus a plain mortgage, for every province and territory."
tags: ["Finance", "Canada", "Smith Manoeuvre", "HELOC", "Mortgage", "Personal Finance", "2026", "Tax", "Investing"]
published: true
---

# Smith Manoeuvre Calculator (Canada 2026)

I live in Vancouver and I build software for a living. I also build little calculators when a money question will not leave me alone.

This one is the question I kept seeing next to my own HELOC notes: **is HELOC interest tax deductible in Canada?** The honest answer is “only if you borrowed to earn income, you can trace the money, and you did not dump it in a TFSA.” That is a lot of footnotes for a search box.

I already had a [HELOC vs mortgage calculator](/tools/heloc-mortgage-calculator/), a [borrowed-money experiment](/posts/borrowed-money-investing-experiment-333-five-weeks/), and a [debt vs invest](/posts/debt-vs-invest-2026/) write-up that mentions the Smith Manoeuvre. What I did not have was one page that ran the conversion — principal off the mortgage, onto a readvanceable HELOC, into a dividend-paying account — and showed the tax refund with real 2026 federal and provincial brackets. For every province and territory, not just BC.

So I built it.

**→ [Open the Smith Manoeuvre & Investment Loan Interest Deduction Calculator (Canada, 2026)](/tools/smith-manoeuvre-calculator/) and paste in your mortgage.**

## How I use it

The page is deliberately boring. You type:

1. Province or territory. Ontario is the default because that is the walkthrough below. I live in BC; the mortgage math does not change if you pick Nunavut. The tax refund does.
2. Annual employment income — the 2026 engine uses this for the interest deduction. Payroll (CPP/EI) does not move.
3. Mortgage balance, rate, and amortization. The rate that loads is an **example** late-2026 five-year, not a quote from anyone.
4. Readvanceable HELOC limit and rate. The HELOC rate is also an example, and the tool **holds it constant**. Prime can move.
5. How you borrow: re-borrow principal as it is paid down (the classic Smith Manoeuvre; that is the default), or a lump sum to borrow and invest. You can cap the annual re-borrow if you do not want every dollar of principal drawn.
6. Expected portfolio return, split into **dividend yield** and **capital growth**. I split it on purpose. CRA cares whether the investment can produce income.
7. Years to project, and whether the tax refund is reinvested in the portfolio or used as an extra mortgage prepayment.

It then shows deductible interest each year, the tax refund that interest creates, how the non-deductible mortgage is doing versus a plain mortgage, after-tax portfolio value, a net-worth comparison, and a simple break-even return (the after-tax cost of borrowing). The year-by-year table stacks into cards on a phone.

I do not treat a green “advantage” as a command. I treat it as a way to see, in one sitting, whether the spread even exists after tax.

## A worked example: $110k in Ontario, $500k mortgage

Here is the scenario the tool opens on, which is also the one I actually ran.

- Province: **Ontario**
- Employment income: **$110,000** (2026)
- Mortgage: **$500,000** remaining, **25-year** amortization
- Mortgage rate: **4.49%** — *example* late-2026 five-year, not a quote
- HELOC limit: **$500,000** (fully readvanceable)
- HELOC rate: **5.70%** — *example* variable, held constant
- Borrow: re-borrow the principal repaid each year
- Portfolio: **3.2%** dividend yield + **3.8%** growth (7% combined) — *example* Canadian dividend ETF, not a forecast
- Horizon: **15 years**
- Tax refund: **reinvested** in the portfolio

Canadian compounding (semi-annual, not in advance) puts the monthly principal-and-interest payment at **$2,765**.

Year one, the mortgage pays down **$11,158** of principal. That amount is re-borrowed on the HELOC and invested. Deductible HELOC interest that year is only **$289**, because the line starts at zero and fills as the year goes. The 2026 engine says deducting $289 at $110,000 of Ontario employment income saves **$98** of federal + Ontario income tax.

Fifteen years later, from the same engine:

| | Smith Manoeuvre | Plain mortgage |
| --- | ---: | ---: |
| Non-deductible mortgage left | **$267,392** | **$267,392** |
| HELOC (deductible) | **$232,608** | — |
| Portfolio (market) | **$410,003** | — |
| After-tax portfolio if sold | **$391,730** | — |
| Net worth vs plain (house held constant) | **+$159,123** | — |

Over those 15 years you deducted **$87,930** of HELOC interest and the engine returned **$28,028** of tax refunds, which in this run were reinvested. Combined marginal rate on the deduction at this income: about **33.9%**. Break-even return — the after-tax cost of the 5.70% HELOC — is **3.77%**. The example 7% total return is above that line. A real year at −15% is not.

A few years from the table, rounded the way the page rounds:

| Year | Deductible interest | Tax refund | HELOC | Mortgage left | Portfolio |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | $289 | $98 | $11,158 | $488,842 | $11,658 |
| 5 | $3,068 | $992 | $61,091 | $438,909 | $74,960 |
| 10 | $7,313 | $2,328 | $137,368 | $362,632 | $203,597 |
| 15 | $12,613 | $3,975 | $232,608 | $267,392 | $410,003 |

Because the refund was reinvested, the non-deductible mortgage is on the **same** remaining schedule as the plain mortgage. Re-borrowing does not put the money back on the mortgage; it moves that principal onto the HELOC. If I flip the toggle to “use the tax refund as an extra mortgage prepayment,” the same engine pays the non-deductible mortgage down about **1.4 years** faster (roughly 23.6 years instead of 25) and the HELOC is larger, because extra principal also opens room that the tool re-borrows. That is the accelerated version. Still not a command.

I used Ontario because a lot of the “is HELOC interest deductible” searches come from there. Flip the dropdown to British Columbia and year-one’s $289 deduction refunds **$90** instead of $98 — same mortgage, different provincial tax. The payment does not move.

None of this is a forecast of 7% markets or 5.70% prime. It is a wrapper comparison. Same house, different debt, a taxable portfolio on the side.

## The CRA rules I actually keep open in another tab

I am not a tax advisor. I am a person in Canada who reads the official pages before treating interest as a deduction. These are the ones this calculator is built around.

### Interest is deductible only when you borrowed to earn income

[Income Tax Act s. 20(1)(c)](https://laws-lois.justice.gc.ca/eng/acts/I-3.3/section-20.html) lets you deduct interest paid or payable on borrowed money **used for the purpose of earning income from a business or property** (other than exempt-income property or a life insurance policy). CRA’s walkthrough is [Income Tax Folio S3-F6-C1, Interest Deductibility](https://www.canada.ca/en/revenue-agency/services/tax/technical-information/income-tax/income-tax-folios-index/series-3-property-investments-savings-plans/series-3-property-investments-savings-plan-folio-6-interest/income-tax-folio-s3-f6-c1-interest-deductibility.html). Mortgage interest on the house you live in does not qualify. Interest on the HELOC *might*, if the current use of that money is an eligible investment.

### Tracing / direct use matters

The folio is blunt: you have to trace the borrowed funds to a specific eligible use, and the test is the **current** use, not a vibe about what you meant. Keep the investment HELOC as its own slice. Never mix a vacation, a car, or a kitchen reno into that balance. If you cannot point at the investment, you cannot point at the deduction.

### The investment has to be able to produce income

[Line 22100 — Carrying charges, interest expenses](https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/line-22100-carrying-charges-interest-expenses.html) is where you claim it. The same page says: **if the only earnings your investment can produce are capital gains, you cannot claim the interest you paid.** A Canadian dividend ETF with a real yield is the usual Smith Manoeuvre holding for a reason. A growth-only ticker with no income potential is how people get surprised at audit time. That is why the calculator splits yield and growth, and warns you at 0% yield.

### TFSA and RRSP: do not do this in a registered account

Same line 22100 page: you **cannot** deduct interest on money borrowed to contribute to an RRSP, TFSA, FHSA, RESP, or the other registered plans listed there. Borrowed-to-invest only works, for this deduction, in a **non-registered** account. If you want the wrapper comparison without leverage, that is still the [RRSP vs TFSA vs FHSA calculator](/tools/rrsp-vs-tfsa-calculator/).

### Claim it on line 22100

Carrying charges, interest expenses. Keep the statements. The calculator’s refund is `tax(income) − tax(income − interest)` from the 2026 engine — a sketch of combined federal + provincial income tax, not a T1.

## The risks I will not bury

**The market can drop while the HELOC stays.** In the table above, year 15 still has **$232,608** of deductible debt. If the portfolio is worth less than that, you are negatively leveraged with a house attached. I have a cheerful five-week [borrowed-money experiment](/posts/borrowed-money-investing-experiment-333-five-weeks/) on this site. That was $8,500. This is a mortgage.

**HELOC rates are variable.** The 5.70% in the example is a slider I typed and then froze. Prime does not freeze.

**You need a readvanceable product.** A regular mortgage plus a separate unsecured line of credit is not automatically the Smith Manoeuvre. Lenders have rules, limits as a share of home value, and the right to freeze a HELOC. This page does not know your charge type.

**Cash flow is real.** You still make the mortgage payment **and** the HELOC interest. The tax refund shows up when you file, not on the first of the month.

If the after-tax cost of borrowing is 3.77% and you would not be happy owning the ETF at that hurdle without a house on the line, do not start.

## What this is not

It is not a quote, an approval, or advice. Default rates are examples. Dividends are taxed as eligible Canadian dividends; your actual distribution mix may differ. Fees, penalties, and insurance are not in the math.

If you want conversion-versus-extra-payment without the investing layer, that is the [HELOC vs Mortgage Calculator](/tools/heloc-mortgage-calculator/). The underlying tax engine is the [Canadian Tax Calculator](/tools/canadian-tax-calculator/). For “should I even invest extra cash,” I still point people at [debt vs invest 2026](/posts/debt-vs-invest-2026/) and the [HELOC vs fixed analysis](/posts/heloc-vs-mortgage-conversion-analysis/).

I built the page because I was tired of doing the interest-deduction arithmetic in a scratch file every time someone asked whether a HELOC is “tax deductible.” If you are staring at a readvanceable mortgage, pick your province and borrow the tool.

**→ [Run the Smith Manoeuvre Calculator](/tools/smith-manoeuvre-calculator/).**
