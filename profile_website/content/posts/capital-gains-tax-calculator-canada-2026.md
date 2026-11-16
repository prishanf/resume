---
title: "Capital Gains Tax Calculator (Canada 2026)"
seoTitle: "Capital Gains Tax Calculator Canada 2026 | Prishan Fernando"
description: "I built a Canada-wide 2026 capital gains tax calculator with a year-end tax-loss harvesting estimator. Here is how to use it, a $95k BC example with the math, and the CRA rules I keep open."
image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2070&auto=format&fit=crop"
date: "2026-11-16"
excerpt: "Mid-November is when the year-end sell decision gets real. I built a 2026 capital gains calculator for every province — 50% inclusion, a harvest estimator, and the December 30 settlement deadline."
tags: ["Finance", "Canada", "Capital Gains", "Tax-Loss Harvesting", "Tax", "Personal Finance", "2026"]
published: true
---

# Capital Gains Tax Calculator (Canada 2026)

I live in Vancouver and I build software for a living. I also build little calculators when a money question will not leave me alone.

This one showed up in mid-November, which is exactly when it should.

I had already sold some ETF units in a taxable account. There is a Canadian bank stock sitting below what I paid for it. Every December I tell myself I will “look at tax-loss harvesting,” then I open a spreadsheet, forget whether the inclusion rate is still 50%, and lose an evening to the 30-day rule. The 2/3 inclusion hike that scared people in 2024 was [cancelled on 21 March 2025](https://www.pm.gc.ca/en/news/news-releases/2025/03/21/prime-minister-mark-carney-cancels-proposed-capital-gains-tax-increase). Half the gain is still what you include. I wanted one page that used that enacted rate, reused the 2026 tax engine I already had, and did not pretend a December 31 TSX trade still settles this year.

So I built it.

**→ [Open the Capital Gains Tax Calculator (Canada, 2026)](/tools/capital-gains-tax-calculator/) and paste in a sale.**

## What it does

You give it:

- Province or territory (all 13; British Columbia is the default because that is where I live)
- Other taxable income for 2026
- One or more positions you already sold — proceeds of disposition, adjusted cost base, commissions
- Optional unrealized losers you could still sell — current value and ACB
- Optional net capital losses carried forward (the allowable amount on your notice of assessment)

It gives back the capital gain or loss, the taxable capital gain at **50%**, the extra federal + provincial tax on that slice, after-tax proceeds, and — if you include the harvest — tax saved now, a superficial-loss warning, and a note that leftover losses carry back three years or forward forever.

It is the same 2026 bracket engine as the [Canadian tax calculator](/tools/canadian-tax-calculator/). I did not copy the tables into a second file. Tax on the gain is literally **tax(other income + taxable capital gain) − tax(other income)**, so a credit that phases out or an Ontario Health Premium bump is in the number instead of a napkin marginal rate.

## How I use it

The page is deliberately boring. You type:

1. Province or territory — residence on 31 December 2026.
2. Other taxable income. In my case that is employment income. The engine treats it that way so the employee credits stay in the baseline.
3. Each sold position: what you received, what it cost you (ACB), what you paid to sell it.
4. Optional harvest rows: what the loser is worth today, its ACB, estimated commission.
5. Net capital losses of other years, if you have any sitting on a notice of assessment. That amount is already the 50% (allowable) figure. It only reduces taxable capital gains. It does not shelter salary.

I do not treat the “tax saved now” line as a command to sell. I treat it as the cost of *not* selling, sitting next to the 30-day rule I would have to live with if I still wanted the same bank.

## A worked example: $95k in BC, a $12,000 ETF gain, a $4,000 bank-stock loss

Here is the scenario the tool opens on, which is also the one I actually ran.

- Province: **British Columbia**
- Other taxable income: **$95,000** (2026 employment income)
- Sold: Canadian equity ETF units
  - Proceeds **$42,150**
  - ACB **$30,000**
  - Commission **$150**
  - Gain = 42,150 − 30,000 − 150 = **$12,000**
- Unrealized loser: a Canadian bank stock
  - Current value **$16,100**
  - ACB **$20,000**
  - Estimated commission **$100**
  - Loss if sold = 16,100 − 20,000 − 100 = **−$4,000**
- Net capital losses carried forward: **$0**

Without harvesting, half of $12,000 is included:

**Taxable capital gain = $6,000**

The 2026 engine says adding $6,000 of taxable income on top of $95,000 costs **$1,692** of federal + BC income tax. That is a **28.2%** combined rate on the included amount, or **14.1%** of the $12,000 gain. Payroll does not change — capital gains are not CPP or EI.

After-tax proceeds of the ETF sale: $42,150 − $150 − $1,692 = **$40,308**.

If I also sell the bank stock this year:

- Net capital gain = 12,000 − 4,000 = **$8,000**
- Taxable capital gain = **$4,000**
- Tax on that slice = **$1,128**
- **Tax saved now = $564**

I also receive $16,000 of cash from the bank stock ($16,100 − $100). After-tax proceeds of both sales: $42,000 + $16,000 − $1,128 = **$56,872**.

The $564 is not free money. I gave up a stock I might have wanted to keep, I will pay commission, and I cannot buy that bank — or an identical property — back in my account, my spouse’s account, or a TFSA/RRSP for 30 days on either side of the sale. If I do, the loss is a [superficial loss](https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/personal-income/line-12700-capital-gains/capital-losses-deductions.html) and the $564 vanishes.

Same $12,000 gain in **Ontario** costs about **$1,823** ($630 saved if I harvest). In **Alberta** it costs **$1,830** ($610 saved). The TFSA comparison tool already showed that $95k is not the same tax pile in every province. This one does too. Pick yours.

## The Canadian rules I keep open in another tab

I am not an accountant. I am a person in Canada who reads the official pages before moving money. These are the ones this calculator is built around.

**What a capital gain is.** [CRA line 12700](https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/personal-income/line-12700-capital-gains.html): proceeds of disposition minus ACB minus outlays and expenses. Report it on [Schedule 3](https://www.canada.ca/en/revenue-agency/services/forms-publications/tax-packages-years/general-income-tax-benefit-package/5000-s3.html).

**Inclusion rate.** [CRA’s definition](https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/personal-income/line-12700-capital-gains/definitions-capital-gains.html) still describes the inclusion rate as one-half. [Income Tax Act s. 38](https://laws-lois.justice.gc.ca/eng/acts/I-3.3/section-38.html) still says ½. The 2/3 proposal was cancelled in March 2025. If someone is still modelling 66.67% for 2026, they are modelling a law that was never passed.

**ACB on identical properties.** Shares of the same class, and units of the same ETF, are identical properties. You average the cost when you buy more; selling does not reset it. [CRA special rules](https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/personal-income/line-12700-capital-gains/special-rules-other-transactions.html). The calculator asks you for the ACB. It will not invent one from a pile of DRIP lots.

**Superficial loss.** 30 calendar days before the sale and 30 after. You, a spouse or common-law partner, a corporation you control, and identical property bought in a **TFSA or RRSP** all count. [CRA capital losses](https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/personal-income/line-12700-capital-gains/capital-losses-deductions.html). Selling RBC and buying RY, or selling an ETF and stuffing the same ticker into a TFSA the next week, is how people donate the loss to the CRA.

**Loss carryover.** A net capital loss this year does not reduce salary. You apply it against taxable capital gains. Carry back up to three years on [Form T1A](https://www.canada.ca/en/revenue-agency/services/forms-publications/forms/t1a.html), or forward indefinitely. If you already have unused losses, type the allowable amount into the carry-forward box.

**Out of scope, on purpose.** The [principal residence exemption](https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/personal-income/line-12700-capital-gains/principal-residence-other-real-estate.html) and the [lifetime capital gains exemption](https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/personal-income/line-12700-capital-gains/capital-gains-deduction.html) on qualified small-business, farm, or fishing property. If that is your fact pattern, this page is the wrong tool.

## The year-end deadline is settlement, not the trade ticket

Canadian equities moved to **T+1** on 27 May 2024. A sale counts for 2026 if it **settles** by 31 December 2026.

[TMX’s 2026 holiday settlement schedule](https://www.tsx.com/en/resource/3407/) is the page I actually checked. Christmas Day is Friday 25 December. Boxing Day is observed Monday 28 December. Thursday 31 December is a trading day, and that schedule puts a 31 December trade on **Monday 4 January 2027**. Tuesday 29 and Wednesday 30 are ordinary T+1 days, so:

| Trade date | Settles | Counts for |
| --- | --- | --- |
| Tuesday, 29 December 2026 | Wednesday, 30 December | 2026 |
| **Wednesday, 30 December 2026** | **Thursday, 31 December** | **2026** |
| Thursday, 31 December 2026 | Monday, 4 January 2027 | 2027 |

**Wednesday, 30 December 2026** is the last regular TSX trade that still lands in 2026. A US-listed name can follow a different holiday calendar. Mutual funds were not all forced onto T+1. Your broker may cut off earlier than the exchange. I would rather be a day early than explain a 2027 T5008 in April.

If you miss it, the loss is not gone. It is a 2027 loss. You can still carry it back to 2026 later on a T1A. You just do not get it on this year’s return as a same-year offset.

## What this is not

It is not a filing product, a broker ticket, or advice. It does not know your ACB if you have not been tracking it. It does not simulate “sell the bank and buy a similar ETF that is not identical.” It does not apply the superficial-loss add-to-ACB mechanics if you are the one who bought the substitute — it just warns you.

If you want the broader income mix (salary vs dividends vs gains), that is still the [Canadian tax calculator](/tools/canadian-tax-calculator/). If the question is which registered account the replacement purchase should live in, that is the [RRSP vs TFSA vs FHSA calculator](/tools/rrsp-vs-tfsa-calculator/). Longer reads: the [$20k investment playbook](/posts/canadian-20k-investment-tax-guide-2026/) and [pay down debt or invest](/posts/debt-vs-invest-2026/).

I built this because mid-November is when “I should harvest that loss” either becomes a trade or becomes next year’s problem. If you are staring at a gain and a loser, pick your province and borrow the tool.

**→ [Run the Capital Gains Tax Calculator](/tools/capital-gains-tax-calculator/).**
