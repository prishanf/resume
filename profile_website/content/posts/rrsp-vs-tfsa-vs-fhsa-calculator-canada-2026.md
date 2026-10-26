---
title: "RRSP vs TFSA vs FHSA Calculator (Canada 2026)"
seoTitle: "RRSP vs TFSA vs FHSA (Canada 2026) | Prishan Fernando"
description: "I built a Canada-wide 2026 calculator to compare RRSP, TFSA, FHSA, and a taxable account. Here is how to use it, a $95k / $7,000 BC example, and how Ontario and Alberta shift the numbers."
image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2070&auto=format&fit=crop"
date: "2026-10-26"
excerpt: "Same $7,000, four wrappers, every province. I built the calculator I kept wishing I had — then ran a $95k Vancouver scenario and flipped Ontario and Alberta to see what actually moves."
tags: ["Finance", "Canada", "RRSP", "TFSA", "FHSA", "Tax", "Personal Finance", "2026"]
published: true
---

# RRSP vs TFSA vs FHSA Calculator (Canada 2026)

I live in Vancouver and I build software for a living — AI solutions, architecture, the unglamorous glue that makes a system actually ship. I also build little calculators for myself when a money question will not leave me alone.

This one would not leave me alone.

Every winter I stare at the same pile of cash and ask the same question: does this $7,000 go into an RRSP, a TFSA, or — if I am still allowed — an FHSA? The internet answer is always “it depends on your tax rate now versus later,” which is true and also not a number. I wanted a number. So I wired this year’s federal and provincial tax engine from my [Canadian tax calculator](/tools/canadian-tax-calculator/) into a side-by-side comparison, then let you pick any of the 13 provinces and territories. British Columbia is the default because that is where I actually live.

**→ [Open the RRSP vs TFSA vs FHSA Calculator (Canada, 2026)](/tools/rrsp-vs-tfsa-calculator/) and run your own income.**

## How I use it

The page is deliberately boring. You type:

1. Province or territory (residence on 31 December 2026 — this rate is used both for the deduction now and for tax at withdrawal).
2. Current employment income.
3. The contribution — the same dollars, one account at a time.
4. Expected income at withdrawal, *or* a combined tax rate if you already know the bracket you are aiming at.
5. Years invested and an expected annual return.
6. Whether you are an eligible first-time home buyer (that is the on/off switch for the FHSA).
7. Whether the RRSP or FHSA tax refund gets reinvested in a TFSA.

It then shows after-tax value in four wrappers: RRSP (refund included), TFSA, FHSA if you qualify, and a non-registered account. The recommendation is just “which pile is biggest, and why.” Limits are 2026 CRA figures with a note to check your real room in [CRA My Account](https://www.canada.ca/en/revenue-agency/services/e-services/digital-services-individuals/account-individuals.html).

I do not treat the winner as a command. I treat it as a sanity check before I move money.

## A worked example: $95k in BC, $7,000 to invest

Here is the scenario I actually ran, which is also the default on the tool:

- Province: **British Columbia**
- Employment income: **$95,000** (2026)
- Contribution: **$7,000**
- Time: **20 years** at **6%** per year
- Other income in the withdrawal year: **$55,000**
- Eligible first-time home buyer: **yes**
- Reinvest the tax refund in a TFSA: **yes**
- Non-registered side: capital gain realized at the end (50% inclusion)

The 2026 engine says a $7,000 deduction at $95,000 saves **$1,974** of federal + BC income tax — a **28.2%** savings rate. That is the combined 20.5% federal bracket plus 7.7% BC bracket on that slice of income. Payroll does not change.

At 6% for 20 years, $7,000 grows to **$22,450**. The $1,974 refund, if it also compounds in a TFSA, grows to **$6,331**.

| Account | After-tax value | What happened |
| --- | ---: | --- |
| **FHSA** | **$28,781** | Deduction now, tax-free qualifying withdrawal, refund grown in a TFSA |
| RRSP | $22,712 | $22,450 of RRSP minus $6,068 of tax at withdrawal, plus the $6,331 refund |
| TFSA | $22,450 | No deduction, no tax later |
| Non-registered | $20,534 | Same growth, then tax on the capital gain (~$1,916) |

**The FHSA wins by about $6,000** in this setup, which is almost entirely the grown refund sitting on top of tax-free growth. That is the whole FHSA pitch in one table: RRSP-style deduction *and* TFSA-style qualifying withdrawal.

If I uncheck “first-time home buyer,” the FHSA drops out. Then the RRSP barely beats the TFSA ($22,712 vs $22,450) because I save 28.2% now and only pay about 27.0% on the withdrawal at $55,000 of other income. Close enough that the refund-in-TFSA assumption matters. If I expected $180,000 of income in the withdrawal year instead, the TFSA would jump ahead — the tool is built so you can see that flip instead of arguing about it.

None of this is a forecast of 6% markets. It is a wrapper comparison. Same return, different tax.

## Same $7,000 in Ontario and Alberta

I kept the BC numbers as the worked example because they are mine. Flipping the province dropdown — same income, same contribution, same $55k withdrawal year — moves the refund and the RRSP tax, not the TFSA pile.

| Province | Tax saved now | FHSA after-tax | RRSP after-tax |
| --- | ---: | ---: | ---: |
| British Columbia | $1,974 (28.2%) | **$28,781** | $22,712 |
| Ontario | $2,076 (29.6%) | **$29,106** | $22,562 |
| Alberta | $2,135 (30.5%) | **$29,297** | $22,847 |

Ontario and Alberta save a bit more on the deduction, so the FHSA (and the refund-grown-in-a-TFSA story) gets a slightly bigger pile. Ontario’s RRSP result is actually a hair *worse* than BC’s because the withdrawal at $55k plus the grown RRSP gets hit with Ontario’s Health Premium and surtax. Alberta’s RRSP edges BC because you save more now than you pay later. The TFSA stays $22,450 everywhere: no deduction, no tax later, province does not matter.

That is the whole point of the dropdown. If you are not in BC, pick your province and ignore my Vancouver row.

## The CRA rules I actually keep open in another tab

I am not a tax advisor. I am a person in Canada who reads the CRA pages before moving money. These are the ones this calculator is built around.

### RRSP deadline for the 2026 tax year

You get the calendar year **plus the first 60 days of 2027**. For 2026 that window ends on **1 March 2027** (2027 is not a leap year, and 1 March 2027 is a Monday, so there is no weekend bump in the usual pattern). CRA publishes the current-year date on [important dates for RRSPs, HBP, LLP and FHSAs](https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/rrsps-related-plans/important-dates-rrsp-rrif-rdsp.html) and explains the 60-day contribution year in [Contribution year](https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/completing-slips-summaries/financial-slips-summaries/rrsp-contribution-receipt-return/contribution-year.html).

Deductible room is the lesser of **18% of prior-year earned income** and the annual dollar limit — **$33,810 for 2026** — plus unused room, minus pension adjustment. Sources: [how your RRSP deduction limit is determined](https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/rrsps-related-plans/contributing-a-rrsp-prpp/contributions-affect-your-rrsp-prpp-deduction-limit.html) and the [MP, RRSP, TFSA limits table](https://www.canada.ca/en/revenue-agency/services/tax/registered-plans-administrators/pspa/mp-rrsp-dpsp-tfsa-limits-ympe.html). The calculator uses the income you type as a *proxy* for that 18% figure. Your notice of assessment is the real number.

### FHSA is a calendar-year deadline

FHSA contributions are **1 January to 31 December of the same year**. There is no 60-day hangover into January. CRA is explicit on [tax deductions for FHSA contributions](https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/first-home-savings-account/tax-deductions-fhsa-contributions.html). Annual participation room starts at **$8,000** the year you open the account, with a **$40,000 lifetime** cap — see [participating in your FHSAs](https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/first-home-savings-account/contributing-your-fhsa.html). Qualifying withdrawals to buy a first home are tax-free. If you are not an eligible first-time home buyer, I hide the FHSA from the ranking because you generally cannot open one.

### TFSA room is not “$7,000, trust me”

The **2026 TFSA dollar limit is $7,000**, added on 1 January, on top of unused room, minus this year’s contributions. Withdrawals only come back as room on 1 January of the *next* year. CRA’s walkthrough is [Calculate your TFSA contribution room](https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/tax-free-savings-account/contributing/calculate-room.html). If you already used the 2026 add, the “reinvest the refund in a TFSA” toggle only works if you have leftover room from earlier years.

### RRSP withholding is not your final tax

If you cash an RRSP (outside the Home Buyers’ Plan or Lifelong Learning Plan), the issuer withholds tax on the spot: **10% / 20% / 30%** for residents of Canada on amounts up to $5,000, $5,001–$15,000, and over $15,000. That is a prepayment. You still report the withdrawal as income. CRA: [tax rates on withdrawals](https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/rrsps-related-plans/making-withdrawals/tax-rates-on-withdrawals.html). The calculator models the tax at filing, not the withholding haircut.

### Home Buyers’ Plan is a different door

The [Home Buyers’ Plan](https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/rrsps-related-plans/what-home-buyers-plan.html) lets you withdraw up to **$60,000** from an RRSP to buy or build a qualifying home, with no withholding if you stay under that cap, and you generally repay it over 15 years. Details: [how to participate in the HBP](https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/rrsps-related-plans/what-home-buyers-plan/participate-home-buyers-plan.html). I did not fold HBP repayments into this comparison. FHSA is the cleaner first-home wrapper when you still qualify; HBP is the RRSP-side option if the money is already in an RRSP.

## What this is not

It is not a forecast, a filing product, or advice. Returns are a slider. Your room is in My Account, not in my JavaScript. OAS clawback, GIS, unused FHSA-to-RRSP transfers, and “I might need this cash in three years” are all real life and none of them are in the table.

If you want the underlying tax math, use the [Canadian tax calculator](/tools/canadian-tax-calculator/) — that page still lists Ontario, BC, Alberta, and Quebec. This comparison tool is the one that covers all 13. For the broader “how is this income even taxed” walkthrough, I still point people at [Canadian income, RRSP, and tax strategies](/posts/canadian-income-rrsp-tax-strategies/), the [$20k investment playbook](/posts/canadian-20k-investment-tax-guide-2026/), and [pay down debt or invest](/posts/debt-vs-invest-2026/).

I built the comparison because I was tired of doing it in a scratch file. If you are staring at the same $7,000, pick your province and borrow the tool.

**→ [Run the RRSP vs TFSA vs FHSA Calculator](/tools/rrsp-vs-tfsa-calculator/).**
