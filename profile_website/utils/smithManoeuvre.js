/**
 * Smith Manoeuvre / investment-loan interest deduction calculator (Canada, 2026).
 *
 * Models a readvanceable mortgage + HELOC used to invest in a non-registered
 * portfolio that can produce income (dividends). Mortgage math uses the
 * Interest Act convention from mortgageRenewal.js (semi-annual compounding,
 * not in advance). HELOC interest is simple monthly (balance × annual / 12),
 * interest-only. Tax refunds reuse calculateTax() in canadianTax.js:
 *   refund = tax(income) − tax(income − deductible interest)
 * via the same taxable-income deduction path as an RRSP amount. This file
 * does not duplicate federal or provincial brackets.
 *
 * Sources (accessed 2026-11-23):
 * - Income Tax Act s. 20(1)(c)
 *   https://laws-lois.justice.gc.ca/eng/acts/I-3.3/section-20.html
 * - CRA Income Tax Folio S3-F6-C1, Interest Deductibility (tracing / current use)
 *   https://www.canada.ca/en/revenue-agency/services/tax/technical-information/income-tax/income-tax-folios-index/series-3-property-investments-savings-plans/series-3-property-investments-savings-plan-folio-6-interest/income-tax-folio-s3-f6-c1-interest-deductibility.html
 * - Line 22100 — Carrying charges, interest expenses
 *   https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/line-22100-carrying-charges-interest-expenses.html
 *
 * Not financial or tax advice. Default rates are examples, not a quote.
 */

import {
  CANADA_PROVINCE_CODES,
  DEFAULT_TAX_YEAR,
  calculateTax,
  normalizeCanadaProvince
} from './canadianTax.js'
import { amortizingPayment, equivalentPeriodicRate } from './mortgageRenewal.js'

export const SMITH_TAX_YEAR = DEFAULT_TAX_YEAR
export const SMITH_PROVINCE = 'ON'
export const CANADA_SMITH_PROVINCE_CODES = CANADA_PROVINCE_CODES

export const BORROW_MODES = {
  principal: {
    key: 'principal',
    label: 'Re-borrow principal as it is paid down'
  },
  'lump-sum': {
    key: 'lump-sum',
    label: 'Lump sum to borrow and invest'
  }
}

export const REFUND_USES = {
  reinvest: {
    key: 'reinvest',
    label: 'Reinvest the tax refund in the portfolio'
  },
  prepay: {
    key: 'prepay',
    label: 'Use the tax refund as an extra mortgage prepayment'
  }
}

/**
 * Default / companion-post scenario. Rates are examples for late 2026,
 * not a quote from any lender. Ontario is the walkthrough province;
 * switch the dropdown for any other province or territory.
 */
export const WORKED_EXAMPLE = {
  province: SMITH_PROVINCE,
  income: 110000,
  mortgageBalance: 500000,
  mortgageRatePct: 4.49,
  amortYears: 25,
  helocLimit: 500000,
  helocRatePct: 5.7,
  borrowMode: 'principal',
  annualReborrow: null,
  lumpSum: 0,
  dividendYieldPct: 3.2,
  growthPct: 3.8,
  years: 15,
  refundUse: 'reinvest'
}

const EMPTY_INCOME = {
  interest: 0,
  eligibleDividend: 0,
  nonEligibleDividend: 0,
  capitalGains: 0,
  rentalIncome: 0,
  rentalExpenses: 0,
  rrsp: 0
}

function round2 (n) {
  return Math.round((n + Number.EPSILON) * 100) / 100
}

function asNumber (value, fallback = 0) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function clamp (value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function salaryScenario (salary, extras = {}, province = SMITH_PROVINCE) {
  return {
    province: normalizeCanadaProvince(province, SMITH_PROVINCE),
    salary: Math.max(0, asNumber(salary)),
    ...EMPTY_INCOME,
    ...extras
  }
}

/** Federal + provincial income tax only (no CPP/EI). Not exported — registeredAccounts.js already exports incomeTax. */
function incomeTax (scenario, year = SMITH_TAX_YEAR) {
  return calculateTax(scenario, year).totalTax
}

/**
 * Tax refund from deducting `interest` as a carrying charge against employment
 * income. Matches tax(income) − tax(income − interest) on taxable income
 * (line 22100), without changing CPP/EI. Uses the RRSP deduction slot in
 * calculateTax() as the income-reduction path — same engine, no extra brackets.
 */
export function interestTaxRefund (salary, deductibleInterest, year = SMITH_TAX_YEAR, province = SMITH_PROVINCE) {
  const interest = Math.max(0, asNumber(deductibleInterest))
  if (interest <= 0) return 0
  const without = incomeTax(salaryScenario(salary, {}, province), year)
  const withDeduction = incomeTax(salaryScenario(salary, { rrsp: interest }, province), year)
  return round2(Math.max(0, without - withDeduction))
}

/**
 * Combined federal + provincial rate on an extra dollar of deductible interest
 * at the given salary. $1,000 step to stay away from penny rounding.
 */
export function deductionMarginalRate (salary, year = SMITH_TAX_YEAR, province = SMITH_PROVINCE) {
  const step = 1000
  const refund = interestTaxRefund(salary, step, year, province)
  return refund > 0 ? refund / step : 0
}

export function taxOnEligibleDividends (salary, dividends, year = SMITH_TAX_YEAR, province = SMITH_PROVINCE) {
  const d = Math.max(0, asNumber(dividends))
  if (d <= 0) return 0
  const base = incomeTax(salaryScenario(salary, {}, province), year)
  const withDiv = incomeTax(salaryScenario(salary, { eligibleDividend: d }, province), year)
  return round2(Math.max(0, withDiv - base))
}

function taxOnCapitalGain (salary, gain, year = SMITH_TAX_YEAR, province = SMITH_PROVINCE) {
  const g = Math.max(0, asNumber(gain))
  if (g <= 0) return 0
  const base = incomeTax(salaryScenario(salary, {}, province), year)
  const withGain = incomeTax(salaryScenario(salary, { capitalGains: g }, province), year)
  return round2(Math.max(0, withGain - base))
}

/** After-tax cost of borrowing: HELOC rate × (1 − marginal deduction rate). */
export function afterTaxBorrowCost (helocRate, marginalRate) {
  const i = Math.max(0, asNumber(helocRate))
  const m = clamp(asNumber(marginalRate), 0, 1)
  return round2(i * (1 - m) * 10000) / 10000
}

function normalizeBorrowMode (mode) {
  return BORROW_MODES[mode] ? mode : 'principal'
}

function normalizeRefundUse (use) {
  return REFUND_USES[use] ? use : 'reinvest'
}

function monthlyGrowthFactor (annualRate) {
  const r = asNumber(annualRate)
  if (r <= -0.999) return 0
  return Math.pow(1 + r, 1 / 12) - 1
}

function periodsToPayoff (startBalance, periodicRate, payment, extraPerPeriod = 0) {
  const b0 = Math.max(0, asNumber(startBalance))
  const r = asNumber(periodicRate)
  const pmt = Math.max(0, asNumber(payment))
  const extra = Math.max(0, asNumber(extraPerPeriod))
  if (b0 <= 0.005) return 0
  if (pmt + extra <= 0) return Infinity
  let balance = b0
  const cap = 80 * 12
  for (let i = 0; i < cap && balance > 0.005; i++) {
    const interest = balance * r
    const principalFromPmt = Math.min(Math.max(0, pmt - interest), balance)
    const extraApplied = Math.min(extra, Math.max(0, balance - principalFromPmt))
    balance = Math.max(0, balance - principalFromPmt - extraApplied)
    if (i === cap - 1 && balance > 0.005) return Infinity
    if (balance <= 0.005) return i + 1
  }
  return 0
}

function buildWarnings (input, ctx) {
  const warnings = []
  if (ctx.dividendYield <= 0 && ctx.investedTotal > 0) {
    warnings.push(
      'Dividend yield is 0%. CRA’s line 22100 note is that if the only earnings an investment can produce are capital gains, you cannot claim the interest. Growth-only holdings with no income potential can be a problem.'
    )
  }
  if (ctx.borrowMode === 'lump-sum' && ctx.lumpSum <= 0) {
    warnings.push('Lump-sum mode is selected but the lump sum is $0, so nothing is borrowed to invest.')
  }
  if (ctx.helocLimit <= 0) {
    warnings.push('HELOC limit is $0, so there is no room to re-borrow.')
  }
  if (ctx.income <= 0) {
    warnings.push('Employment income is $0, so the modelled tax refund is $0.')
  }
  if (ctx.helocRate > 0 && ctx.totalReturn + 1e-12 < ctx.helocRate) {
    warnings.push(
      'The example portfolio return is below the HELOC rate. After tax, the spread can be negative — the break-even figure on this page is the after-tax cost of borrowing.'
    )
  }
  if (ctx.annualCap != null && ctx.borrowMode === 'principal' && ctx.annualCap <= 0) {
    warnings.push('Annual re-borrow cap is $0, so the HELOC is not drawn.')
  }
  return warnings
}

/**
 * @param {object} input
 * @param {string} [input.province]
 * @param {number} input.income
 * @param {number} input.mortgageBalance
 * @param {number} input.mortgageRatePct
 * @param {number} input.amortYears
 * @param {number} input.helocLimit
 * @param {number} input.helocRatePct
 * @param {'principal'|'lump-sum'} [input.borrowMode]
 * @param {number|null} [input.annualReborrow]  Cap on principal re-borrowed per year. null/blank = all principal repaid.
 * @param {number} [input.lumpSum]
 * @param {number} input.dividendYieldPct
 * @param {number} input.growthPct
 * @param {number} input.years
 * @param {'reinvest'|'prepay'} [input.refundUse]
 */
export function projectSmithManoeuvre (input = {}) {
  const province = normalizeCanadaProvince(input.province, SMITH_PROVINCE)
  const income = Math.max(0, asNumber(input.income))
  const mortgageStart = Math.max(0, asNumber(input.mortgageBalance))
  const mortgageRatePct = clamp(asNumber(input.mortgageRatePct), 0, 30)
  const amortYears = clamp(Math.round(asNumber(input.amortYears, 25)), 1, 40)
  const helocLimit = Math.max(0, asNumber(input.helocLimit))
  const helocRatePct = clamp(asNumber(input.helocRatePct), 0, 30)
  const borrowMode = normalizeBorrowMode(input.borrowMode)
  const rawCap = input.annualReborrow
  const hasCap = rawCap != null && rawCap !== '' && Number.isFinite(Number(rawCap))
  const annualCap = hasCap ? Math.max(0, asNumber(rawCap)) : null
  const lumpSum = Math.max(0, asNumber(input.lumpSum))
  const dividendYieldPct = clamp(asNumber(input.dividendYieldPct), 0, 30)
  const growthPct = clamp(asNumber(input.growthPct), -50, 30)
  const years = clamp(Math.round(asNumber(input.years, 15)), 1, 40)
  const refundUse = normalizeRefundUse(input.refundUse)

  const mortgageRate = mortgageRatePct / 100
  const helocRate = helocRatePct / 100
  const dividendYield = dividendYieldPct / 100
  const growthRate = growthPct / 100
  const totalReturn = dividendYield + growthRate

  const ppy = 12
  const periods = amortYears * ppy
  const mortgagePeriodic = equivalentPeriodicRate(mortgageRate, ppy)
  const payment = amortizingPayment(mortgageStart, mortgagePeriodic, periods)
  const helocMonthlyRate = helocRate / 12
  const growthMonthly = monthlyGrowthFactor(growthRate)
  const dividendMonthly = dividendYield / 12
  const projectionMonths = years * ppy

  let smithMortgage = mortgageStart
  let plainMortgage = mortgageStart
  let helocBalance = 0
  let portfolio = 0
  let costBasis = 0
  let extraPrincipalBudget = 0
  let investedTotal = 0
  let totalDeductibleInterest = 0
  let totalRefund = 0
  let totalDividendTax = 0
  let totalReborrowed = 0
  let totalExtraPrincipal = 0
  let smithPayoffMonth = null
  let plainPayoffMonth = null

  if (borrowMode === 'lump-sum' && lumpSum > 0 && helocLimit > 0) {
    const drawn = Math.min(lumpSum, helocLimit)
    helocBalance += drawn
    portfolio += drawn
    costBasis += drawn
    investedTotal += drawn
    totalReborrowed += drawn
  }

  const yearsOut = []

  for (let month = 1; month <= projectionMonths; month++) {
    const yearIndex = Math.ceil(month / 12)
    const monthInYear = ((month - 1) % 12) + 1
    if (monthInYear === 1) {
      yearsOut[yearIndex - 1] = {
        year: yearIndex,
        deductibleInterest: 0,
        taxRefund: 0,
        reborrowed: 0,
        extraPrincipal: 0,
        dividends: 0,
        dividendTax: 0,
        mortgageEnd: 0,
        helocEnd: 0,
        portfolioEnd: 0,
        plainMortgageEnd: 0,
        principalRepaid: 0
      }
    }
    const row = yearsOut[yearIndex - 1]
    const remainingAnnualCap = borrowMode === 'principal' && annualCap != null
      ? Math.max(0, annualCap - row.reborrowed)
      : Infinity

    // Plain mortgage (no extra, no HELOC).
    if (plainMortgage > 0.005) {
      const pInterest = plainMortgage * mortgagePeriodic
      const pPrincipal = Math.min(Math.max(0, payment - pInterest), plainMortgage)
      plainMortgage = Math.max(0, plainMortgage - pPrincipal)
      if (plainMortgage <= 0.005 && plainPayoffMonth == null) {
        plainMortgage = 0
        plainPayoffMonth = month
      }
    } else {
      plainMortgage = 0
      if (plainPayoffMonth == null) plainPayoffMonth = month
    }

    // Smith mortgage, with optional extra from last year's refund.
    let principalReduction = 0
    if (smithMortgage > 0.005) {
      const sInterest = smithMortgage * mortgagePeriodic
      const sPrincipal = Math.min(Math.max(0, payment - sInterest), smithMortgage)
      const extraWanted = extraPrincipalBudget
      const extraApplied = Math.min(extraWanted, Math.max(0, smithMortgage - sPrincipal))
      extraPrincipalBudget = Math.max(0, extraPrincipalBudget - extraApplied)
      principalReduction = sPrincipal + extraApplied
      smithMortgage = Math.max(0, smithMortgage - principalReduction)
      row.principalRepaid = round2(row.principalRepaid + sPrincipal)
      row.extraPrincipal = round2(row.extraPrincipal + extraApplied)
      totalExtraPrincipal += extraApplied
      if (smithMortgage <= 0.005 && smithPayoffMonth == null) {
        smithMortgage = 0
        smithPayoffMonth = month
      }
    } else {
      smithMortgage = 0
      extraPrincipalBudget = 0
      if (smithPayoffMonth == null) smithPayoffMonth = month
    }

    const helocInterest = helocBalance * helocMonthlyRate
    row.deductibleInterest = round2(row.deductibleInterest + helocInterest)
    totalDeductibleInterest += helocInterest

    if (borrowMode === 'principal' && principalReduction > 0) {
      const room = Math.max(0, helocLimit - helocBalance)
      const borrowed = Math.min(principalReduction, room, remainingAnnualCap)
      if (borrowed > 0) {
        helocBalance += borrowed
        portfolio += borrowed
        costBasis += borrowed
        investedTotal += borrowed
        totalReborrowed += borrowed
        row.reborrowed = round2(row.reborrowed + borrowed)
      }
    }

    if (portfolio > 0) {
      const growthAmount = portfolio * growthMonthly
      portfolio += growthAmount
      const div = portfolio * dividendMonthly
      portfolio += div
      row.dividends = round2(row.dividends + div)
    }

    if (monthInYear === 12 || month === projectionMonths) {
      const divTax = taxOnEligibleDividends(income, row.dividends, SMITH_TAX_YEAR, province)
      row.dividendTax = divTax
      totalDividendTax += divTax
      if (divTax > 0) {
        const paid = Math.min(divTax, Math.max(0, portfolio))
        portfolio = Math.max(0, portfolio - paid)
        costBasis = round2(costBasis + Math.max(0, row.dividends - paid))
      } else if (row.dividends > 0) {
        costBasis = round2(costBasis + row.dividends)
      }

      const refund = interestTaxRefund(income, row.deductibleInterest, SMITH_TAX_YEAR, province)
      row.taxRefund = refund
      totalRefund += refund

      if (refund > 0) {
        if (refundUse === 'reinvest') {
          portfolio += refund
          costBasis += refund
          investedTotal += refund
        } else {
          extraPrincipalBudget += refund
        }
      }

      row.mortgageEnd = round2(smithMortgage)
      row.helocEnd = round2(helocBalance)
      row.portfolioEnd = round2(portfolio)
      row.plainMortgageEnd = round2(plainMortgage)
      row.deductibleInterest = round2(row.deductibleInterest)
    }
  }

  const gain = Math.max(0, portfolio - costBasis)
  const capitalGainsTax = taxOnCapitalGain(income, gain, SMITH_TAX_YEAR, province)
  const afterTaxPortfolio = round2(Math.max(0, portfolio - capitalGainsTax))

  const smithDebt = smithMortgage + helocBalance
  const plainDebt = plainMortgage
  const smithNetWorth = round2(afterTaxPortfolio - smithDebt)
  const plainNetWorth = round2(-plainDebt)
  const netWorthAdvantage = round2(smithNetWorth - plainNetWorth)

  const marginalRate = deductionMarginalRate(income, SMITH_TAX_YEAR, province)
  const breakEvenReturn = afterTaxBorrowCost(helocRate, marginalRate)

  const remainingPlainPeriods = plainMortgage <= 0.005
    ? 0
    : periodsToPayoff(plainMortgage, mortgagePeriodic, payment, 0)
  const remainingSmithPeriods = smithMortgage <= 0.005
    ? 0
    : periodsToPayoff(smithMortgage, mortgagePeriodic, payment, 0)
  const plainPayoffMonths = plainPayoffMonth || (
    Number.isFinite(remainingPlainPeriods)
      ? projectionMonths + remainingPlainPeriods
      : periods
  )
  const smithPayoffMonths = smithPayoffMonth || (
    Number.isFinite(remainingSmithPeriods)
      ? projectionMonths + remainingSmithPeriods
      : periods
  )
  const plainPayoffYears = mortgageStart <= 0 ? 0 : round2(plainPayoffMonths / 12)
  const smithPayoffYears = mortgageStart <= 0 ? 0 : round2(smithPayoffMonths / 12)
  const yearsSaved = round2(Math.max(0, plainPayoffYears - smithPayoffYears))
  const fasterBecausePrepay = refundUse === 'prepay' && totalExtraPrincipal > 0.5

  const last = yearsOut[yearsOut.length - 1] || null

  const warnings = buildWarnings(input, {
    dividendYield,
    investedTotal,
    borrowMode,
    lumpSum,
    helocLimit,
    income,
    helocRate,
    totalReturn,
    annualCap
  })

  return {
    province,
    taxYear: SMITH_TAX_YEAR,
    income: round2(income),
    borrowMode,
    refundUse,
    projectionYears: years,
    amortYears,
    mortgageRatePct,
    helocRatePct,
    dividendYieldPct,
    growthPct,
    totalReturnPct: round2(totalReturn * 10000) / 100,
    helocLimit: round2(helocLimit),
    lumpSum: round2(lumpSum),
    annualReborrow: annualCap,
    payment: round2(payment),
    monthlyHelocRate: helocMonthlyRate,
    current: {
      mortgageStart: round2(mortgageStart),
      mortgagePayment: round2(payment)
    },
    totals: {
      deductibleInterest: round2(totalDeductibleInterest),
      taxRefund: round2(totalRefund),
      reborrowed: round2(totalReborrowed),
      extraPrincipal: round2(totalExtraPrincipal),
      invested: round2(investedTotal),
      dividendTax: round2(totalDividendTax),
      capitalGainsTax: round2(capitalGainsTax),
      costBasis: round2(costBasis)
    },
    portfolio: {
      marketValue: round2(portfolio),
      afterTaxValue: afterTaxPortfolio,
      unrealizedGain: round2(gain)
    },
    debt: {
      smithMortgage: round2(smithMortgage),
      heloc: round2(helocBalance),
      smithTotal: round2(smithDebt),
      plainMortgage: round2(plainMortgage)
    },
    netWorth: {
      smith: smithNetWorth,
      plain: plainNetWorth,
      advantage: netWorthAdvantage
    },
    payoff: {
      plainYears: plainPayoffYears,
      smithYears: smithPayoffYears,
      remainingAmortYearsSmith: smithMortgage <= 0.005
        ? 0
        : round2((Number.isFinite(remainingSmithPeriods) ? remainingSmithPeriods : periods) / 12),
      yearsSaved: fasterBecausePrepay ? yearsSaved : 0,
      fasterBecausePrepay,
      note: fasterBecausePrepay
        ? `Using the tax refund as an extra prepayment pays the non-deductible mortgage down faster. Extra principal also opens HELOC room, which this tool re-borrows in principal mode.`
        : 'The contractual mortgage follows the original amortization unless the tax refund is used as an extra prepayment. Re-borrowing does not add the money back onto the mortgage — it moves the same principal onto the HELOC.'
    },
    tax: {
      marginalRate: round2(marginalRate * 10000) / 10000,
      marginalRatePct: round2(marginalRate * 1000) / 10,
      breakEvenReturn,
      breakEvenReturnPct: round2(breakEvenReturn * 10000) / 100
    },
    schedule: yearsOut,
    lastYear: last,
    warnings
  }
}

export const WORKED_EXAMPLE_RESULT = projectSmithManoeuvre(WORKED_EXAMPLE)
