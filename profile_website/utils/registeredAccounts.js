/**
 * After-tax comparison of a single contribution in an RRSP, TFSA, FHSA,
 * or non-registered account for a Canadian resident in 2026.
 *
 * Tax, credits, and brackets come from calculateTax() in canadianTax.js
 * (2026 federal + the chosen province or territory). This file does not
 * duplicate rate tables. Default province is BC.
 *
 * Contribution limit assumptions (CRA, accessed 2026-10-26):
 * - RRSP dollar limit $33,810; room is the lesser of 18% of prior-year
 *   earned income and that dollar limit, plus unused room, minus PA.
 *   https://www.canada.ca/en/revenue-agency/services/tax/registered-plans-administrators/pspa/mp-rrsp-dpsp-tfsa-limits-ympe.html
 * - TFSA annual dollar limit $7,000.
 *   https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/tax-free-savings-account/contributing/calculate-room.html
 * - FHSA $8,000 annual participation room, $40,000 lifetime.
 *   https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/first-home-savings-account/contributing-your-fhsa.html
 */

import { calculateTax, DEFAULT_TAX_YEAR, normalizeCanadaProvince } from './canadianTax.js'

export const REGISTERED_ACCOUNT_TAX_YEAR = DEFAULT_TAX_YEAR
export const REGISTERED_ACCOUNT_PROVINCE = 'BC'

export const CONTRIBUTION_LIMITS_2026 = {
  rrspDollarLimit: 33810,
  rrspEarnedIncomeRate: 0.18,
  tfsaAnnual: 7000,
  fhsaAnnual: 8000,
  fhsaLifetime: 40000
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

function salaryScenario (salary, extras = {}, province = REGISTERED_ACCOUNT_PROVINCE) {
  return {
    province: normalizeCanadaProvince(province, REGISTERED_ACCOUNT_PROVINCE),
    salary: Math.max(0, asNumber(salary)),
    ...EMPTY_INCOME,
    ...extras
  }
}

/** Federal + provincial income tax only (no CPP/EI). */
export function incomeTax (scenario, year = REGISTERED_ACCOUNT_TAX_YEAR) {
  return calculateTax(scenario, year).totalTax
}

/**
 * Combined federal + provincial income-tax rate on an extra dollar of fully taxable
 * non-employment income (interest / RRSP withdrawal), at the given salary.
 * Uses a $100 increment to match calculateTax()'s marginal step size.
 */
export function combinedIncomeTaxRate (salary, year = REGISTERED_ACCOUNT_TAX_YEAR, province = REGISTERED_ACCOUNT_PROVINCE) {
  const base = incomeTax(salaryScenario(salary, {}, province), year)
  const bumped = incomeTax(salaryScenario(salary, { interest: 100 }, province), year)
  const delta = bumped - base
  return delta > 0 ? delta / 100 : 0
}

/** Tax refund from deducting `contribution` against current salary (RRSP or FHSA). */
export function contributionRefund (salary, contribution, year = REGISTERED_ACCOUNT_TAX_YEAR, province = REGISTERED_ACCOUNT_PROVINCE) {
  const c = Math.max(0, asNumber(contribution))
  if (c <= 0) return 0
  const without = incomeTax(salaryScenario(salary, {}, province), year)
  const withDeduction = incomeTax(salaryScenario(salary, { rrsp: c }, province), year)
  return round2(Math.max(0, without - withDeduction))
}

/** Extra income tax from adding fully taxable income (RRSP withdrawal) at `salary`. */
export function taxOnFullyTaxableAmount (salary, amount, year = REGISTERED_ACCOUNT_TAX_YEAR, province = REGISTERED_ACCOUNT_PROVINCE) {
  const extra = Math.max(0, asNumber(amount))
  if (extra <= 0) return 0
  const base = incomeTax(salaryScenario(salary, {}, province), year)
  const withExtra = incomeTax(salaryScenario(salary, { interest: extra }, province), year)
  return round2(Math.max(0, withExtra - base))
}

/** Extra income tax from a capital gain (50% inclusion via calculateTax). */
export function taxOnCapitalGain (salary, gain, year = REGISTERED_ACCOUNT_TAX_YEAR, province = REGISTERED_ACCOUNT_PROVINCE) {
  const g = Math.max(0, asNumber(gain))
  if (g <= 0) return 0
  const base = incomeTax(salaryScenario(salary, {}, province), year)
  const withGain = incomeTax(salaryScenario(salary, { capitalGains: g }, province), year)
  return round2(Math.max(0, withGain - base))
}

export function futureValue (principal, annualRate, years) {
  const p = Math.max(0, asNumber(principal))
  const r = asNumber(annualRate)
  const n = asNumber(years)
  if (n <= 0) return round2(p)
  return round2(p * (1 + r) ** n)
}

/** Proxy for 2026 RRSP dollar room from the income entered (prior-year earned income is the real CRA input). */
export function rrspRoomProxy (income) {
  const earned = Math.max(0, asNumber(income))
  return round2(Math.min(
    CONTRIBUTION_LIMITS_2026.rrspDollarLimit,
    CONTRIBUTION_LIMITS_2026.rrspEarnedIncomeRate * earned
  ))
}

function pctLabel (rate) {
  return `${(rate * 100).toFixed(1)}%`
}

function buildWarnings (input, contribution) {
  const warnings = []
  const room = rrspRoomProxy(input.income)
  if (contribution > room) {
    warnings.push(
      `This contribution is above the 2026 RRSP dollar-room proxy of ${room.toLocaleString('en-CA')} (the lesser of 18% of the income you entered and $${CONTRIBUTION_LIMITS_2026.rrspDollarLimit.toLocaleString('en-CA')}). Unused room from prior years can raise that; check CRA My Account.`
    )
  }
  if (contribution > CONTRIBUTION_LIMITS_2026.tfsaAnnual) {
    warnings.push(
      `This contribution is above the 2026 TFSA annual limit of $${CONTRIBUTION_LIMITS_2026.tfsaAnnual.toLocaleString('en-CA')}. Unused TFSA room from prior years can cover the rest; check CRA My Account.`
    )
  }
  if (contribution > CONTRIBUTION_LIMITS_2026.fhsaAnnual) {
    warnings.push(
      `This contribution is above the FHSA annual participation room of $${CONTRIBUTION_LIMITS_2026.fhsaAnnual.toLocaleString('en-CA')} (lifetime $${CONTRIBUTION_LIMITS_2026.fhsaLifetime.toLocaleString('en-CA')}).`
    )
  }
  if (input.reinvestRefundInTfsa) {
    warnings.push(
      'Reinvesting the refund in a TFSA assumes you have TFSA room for that extra amount (including unused room). The 2026 annual add is $7,000.'
    )
  }
  return warnings
}

function withdrawalTaxRate (taxOnWithdrawal, futureValueInAccount) {
  if (futureValueInAccount <= 0) return 0
  return taxOnWithdrawal / futureValueInAccount
}

function recommend (accounts, ctx) {
  const eligible = accounts.filter((a) => a.eligible)
  eligible.sort((a, b) => b.afterTaxValue - a.afterTaxValue)
  const winner = eligible[0]
  if (!winner) {
    return { key: null, name: null, afterTaxValue: 0, reason: 'Enter a contribution greater than zero to compare accounts.' }
  }

  const now = pctLabel(ctx.contributionRefundRate || ctx.currentRate)
  const later = pctLabel(ctx.withdrawalRate)
  const years = ctx.years
  let reason

  if (winner.key === 'fhsa') {
    reason = `As an eligible first-time home buyer, the FHSA gives you a ${now} tax deduction now and a tax-free qualifying withdrawal later. After ${years} years that combination is the highest after-tax result in this scenario.`
  } else if (winner.key === 'rrsp') {
    reason = ctx.reinvestRefundInTfsa
      ? `You save tax at ${now} now and would pay ${later} on the RRSP withdrawal. Reinvesting the refund in a TFSA makes the RRSP path the highest after-tax result here.`
      : `You save tax at ${now} now and would pay ${later} on the RRSP withdrawal. That rate gap makes the RRSP the highest after-tax result in this scenario.`
  } else if (winner.key === 'tfsa') {
    reason = `Your tax rate on an RRSP withdrawal (${later}) is at least as high as the rate you save by contributing now (${now}), so tax-free TFSA growth and withdrawal wins. RRSP withdrawals would be fully taxable.`
  } else {
    reason = 'In this scenario the non-registered account has the highest after-tax value. Registered accounts are usually better when you have room; check the limits and eligibility notes.'
  }

  const second = eligible[1]
  if (second && Math.abs(winner.afterTaxValue - second.afterTaxValue) < 1) {
    reason += ` It is effectively a tie with the ${second.name}.`
  }

  return {
    key: winner.key,
    name: winner.name,
    afterTaxValue: winner.afterTaxValue,
    reason
  }
}

/**
 * @param {object} input
 * @param {number} input.income Current employment income (2026).
 * @param {string} [input.province] Province or territory code; defaults to BC.
 * @param {number} input.contribution Amount to place in one account.
 * @param {number} input.years Years invested.
 * @param {number} input.annualReturn Expected annual return as a decimal (0.06 = 6%).
 * @param {'income'|'rate'} [input.withdrawalMode]
 * @param {number} [input.withdrawalIncome] Expected income at withdrawal (when mode is income).
 * @param {number} [input.withdrawalRate] Combined tax rate 0–1 (when mode is rate).
 * @param {boolean} [input.firstTimeHomeBuyer]
 * @param {boolean} [input.reinvestRefundInTfsa]
 * @param {'capital-gains'|'interest'} [input.nonRegisteredTreatment]
 */
export function compareRegisteredAccounts (input = {}) {
  const income = Math.max(0, asNumber(input.income))
  const province = normalizeCanadaProvince(input.province, REGISTERED_ACCOUNT_PROVINCE)
  const contribution = Math.max(0, asNumber(input.contribution))
  const years = clamp(asNumber(input.years), 0, 60)
  const annualReturn = clamp(asNumber(input.annualReturn), -0.5, 0.5)
  const withdrawalMode = input.withdrawalMode === 'rate' ? 'rate' : 'income'
  const withdrawalIncome = Math.max(0, asNumber(input.withdrawalIncome))
  const withdrawalRateInput = clamp(asNumber(input.withdrawalRate), 0, 0.8)
  const firstTimeHomeBuyer = Boolean(input.firstTimeHomeBuyer)
  const reinvestRefundInTfsa = Boolean(input.reinvestRefundInTfsa)
  const nonRegisteredTreatment = input.nonRegisteredTreatment === 'interest' ? 'interest' : 'capital-gains'

  const currentRate = combinedIncomeTaxRate(income, REGISTERED_ACCOUNT_TAX_YEAR, province)
  const refund = contributionRefund(income, contribution, REGISTERED_ACCOUNT_TAX_YEAR, province)
  const contributionRefundRate = contribution > 0 ? refund / contribution : 0
  const grownContribution = futureValue(contribution, annualReturn, years)
  const refundFutureValue = reinvestRefundInTfsa
    ? futureValue(refund, annualReturn, years)
    : round2(refund)

  let rrspTaxOnWithdrawal
  let withdrawalRate
  if (withdrawalMode === 'rate') {
    rrspTaxOnWithdrawal = round2(grownContribution * withdrawalRateInput)
    withdrawalRate = withdrawalRateInput
  } else {
    rrspTaxOnWithdrawal = taxOnFullyTaxableAmount(withdrawalIncome, grownContribution, REGISTERED_ACCOUNT_TAX_YEAR, province)
    withdrawalRate = withdrawalTaxRate(rrspTaxOnWithdrawal, grownContribution)
  }

  const tfsa = {
    key: 'tfsa',
    name: 'TFSA',
    eligible: true,
    contribution,
    futureValue: grownContribution,
    taxOnWithdrawal: 0,
    refund: 0,
    refundFutureValue: 0,
    afterTaxValue: grownContribution,
    note: 'After-tax dollars grow and come out tax-free. No deduction today.'
  }

  const rrspAfterTax = round2(grownContribution - rrspTaxOnWithdrawal + refundFutureValue)
  const rrsp = {
    key: 'rrsp',
    name: 'RRSP',
    eligible: true,
    contribution,
    futureValue: grownContribution,
    taxOnWithdrawal: rrspTaxOnWithdrawal,
    refund,
    refundFutureValue,
    afterTaxValue: rrspAfterTax,
    note: reinvestRefundInTfsa
      ? 'Deduction today; the withdrawal is fully taxable. The refund is modelled as reinvested in a TFSA.'
      : 'Deduction today; the withdrawal is fully taxable. The refund is counted at face value (not reinvested).'
  }

  const fhsa = firstTimeHomeBuyer
    ? {
        key: 'fhsa',
        name: 'FHSA',
        eligible: true,
        contribution,
        futureValue: grownContribution,
        taxOnWithdrawal: 0,
        refund,
        refundFutureValue,
        afterTaxValue: round2(grownContribution + refundFutureValue),
        note: reinvestRefundInTfsa
          ? 'Deduction today plus a tax-free qualifying home withdrawal. The refund is modelled as reinvested in a TFSA.'
          : 'Deduction today plus a tax-free qualifying home withdrawal. The refund is counted at face value (not reinvested).'
      }
    : {
        key: 'fhsa',
        name: 'FHSA',
        eligible: false,
        contribution,
        futureValue: 0,
        taxOnWithdrawal: 0,
        refund: 0,
        refundFutureValue: 0,
        afterTaxValue: 0,
        note: 'You must be an eligible first-time home buyer to open an FHSA and make a qualifying tax-free withdrawal.'
      }

  let nonRegFuture
  let nonRegTax
  let nonRegNote
  if (nonRegisteredTreatment === 'interest') {
    const rAfter = annualReturn * (1 - currentRate)
    nonRegFuture = futureValue(contribution, rAfter, years)
    nonRegTax = round2(Math.max(0, grownContribution - nonRegFuture))
    nonRegNote = 'Interest taxed each year at your current combined federal + provincial income-tax rate on extra investment income.'
  } else {
    nonRegFuture = grownContribution
    const gain = Math.max(0, grownContribution - contribution)
    if (withdrawalMode === 'rate') {
      nonRegTax = round2(0.5 * gain * withdrawalRateInput)
    } else {
      nonRegTax = taxOnCapitalGain(withdrawalIncome, gain, REGISTERED_ACCOUNT_TAX_YEAR, province)
    }
    nonRegNote = 'Capital gain realized at withdrawal; 50% inclusion using the same 2026 federal + provincial engine as the tax calculator.'
  }

  const nonRegistered = {
    key: 'nonRegistered',
    name: 'Non-registered',
    eligible: true,
    contribution,
    futureValue: nonRegFuture,
    taxOnWithdrawal: nonRegTax,
    refund: 0,
    refundFutureValue: 0,
    afterTaxValue: nonRegisteredTreatment === 'interest'
      ? nonRegFuture
      : round2(nonRegFuture - nonRegTax),
    note: nonRegNote
  }

  const accounts = [fhsa, rrsp, tfsa, nonRegistered]
  const ranking = accounts
    .filter((a) => a.eligible)
    .sort((a, b) => b.afterTaxValue - a.afterTaxValue)
    .map((a, i) => ({ key: a.key, name: a.name, afterTaxValue: a.afterTaxValue, rank: i + 1 }))

  const winner = contribution <= 0
    ? { key: null, name: null, afterTaxValue: 0, reason: 'Enter a contribution greater than zero to compare accounts.' }
    : recommend(accounts, {
      years,
      currentRate,
      contributionRefundRate,
      withdrawalRate,
      reinvestRefundInTfsa
    })

  return {
    income,
    province,
    contribution,
    years,
    annualReturn,
    withdrawalMode,
    withdrawalIncome,
    firstTimeHomeBuyer,
    reinvestRefundInTfsa,
    nonRegisteredTreatment,
    currentRate: round2(currentRate * 10000) / 10000,
    contributionRefundRate: round2(contributionRefundRate * 10000) / 10000,
    withdrawalRate: round2(withdrawalRate * 10000) / 10000,
    refund,
    refundFutureValue,
    grownContribution,
    limits: {
      ...CONTRIBUTION_LIMITS_2026,
      rrspRoomProxy: rrspRoomProxy(income)
    },
    warnings: buildWarnings({ income, reinvestRefundInTfsa }, contribution),
    accounts: {
      rrsp,
      tfsa,
      fhsa,
      nonRegistered
    },
    ranking,
    winner
  }
}
