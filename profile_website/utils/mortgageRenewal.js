/**
 * Canadian mortgage renewal calculator (2026).
 *
 * Payment math uses the Interest Act convention: nominal rates compounded
 * semi-annually, not in advance. That formula is the same in every province
 * and territory. Qualification uses OSFI / CMHC figures:
 * - Minimum qualifying rate (MQR) = greater of contract rate + 2% or 5.25%
 *   https://www.osfi-bsif.gc.ca/en/supervision/financial-institutions/banks/minimum-qualifying-rate-uninsured-mortgages
 * - GDS 39% / TDS 44% typical limits (CMHC)
 *   https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/calculating-gds-tds
 * - GDS housing costs = P&I + property tax + heating + 50% of condo fees
 *
 * Stress-test applicability (not a lender decision):
 * - Uninsured straight switches at renewal between federally regulated
 *   lenders: OSFI no longer prescribes the MQR as of 21 Nov 2024, provided
 *   remaining amortization and loan amount do not increase (up to $3,000
 *   may be added for penalties / transaction costs only).
 *   https://www.osfi-bsif.gc.ca/en/guidance/guidance-library/osfi-exempts-uninsured-mortgage-straight-switches-prescribed-mqr-implements-portfolio-lti-limits
 * - Insured holders switching at renewal: Canadian Mortgage Charter /
 *   Budget 2024 (Department of Finance).
 *   https://www.canada.ca/en/department-finance/news/2024/09/government-announces-boldest-mortgage-reforms-in-decades-to-unlock-homeownership-for-more-canadians.html
 * - Extra borrowing, a longer amortization, or a lender that still applies
 *   its own qualifying rate: the prescribed MQR (or a lender stress test)
 *   is still the relevant check.
 *
 * This file does not fetch live rates and is not financial advice.
 */

import { CANADA_PROVINCE_CODES, normalizeCanadaProvince } from './canadianTax.js'

export const MORTGAGE_RENEWAL_PROVINCE = 'BC'
export const CANADA_MORTGAGE_PROVINCE_CODES = CANADA_PROVINCE_CODES

export const MQR_FLOOR = 0.0525
export const MQR_BUFFER = 0.02
export const GDS_LIMIT = 0.39
export const TDS_LIMIT = 0.44
export const CONDO_FEE_GDS_SHARE = 0.5
export const STRAIGHT_SWITCH_COST_CAP = 3000

export const PAYMENT_FREQUENCIES = {
  monthly: { key: 'monthly', label: 'Monthly', paymentsPerYear: 12 },
  'semi-monthly': { key: 'semi-monthly', label: 'Semi-monthly', paymentsPerYear: 24 },
  biweekly: { key: 'biweekly', label: 'Bi-weekly', paymentsPerYear: 26 },
  weekly: { key: 'weekly', label: 'Weekly', paymentsPerYear: 52 }
}

export const RENEWAL_SITUATIONS = {
  'same-lender': {
    key: 'same-lender',
    label: 'Stay with current lender',
    prescribedMqrRequired: false
  },
  'straight-switch': {
    key: 'straight-switch',
    label: 'Switch lenders (same balance, same remaining amortization)',
    prescribedMqrRequired: false
  },
  requalify: {
    key: 'requalify',
    label: 'Extra borrowing, longer amortization, or a lender that still stress-tests',
    prescribedMqrRequired: true
  }
}

/** Example late-2026 rates only — not a quote from any lender. */
export const DEFAULT_RENEWAL_OFFERS = [
  { id: 'a', label: '5-year fixed', ratePct: 4.49, termYears: 5, type: 'fixed' },
  { id: 'b', label: '3-year fixed', ratePct: 4.29, termYears: 3, type: 'fixed' },
  { id: 'c', label: '5-year variable', ratePct: 3.99, termYears: 5, type: 'variable' }
]

/** Worked example: 2021 5-year fixed at 1.99% on $500,000 / 25 years, renewing after 5 years. */
export const WORKED_EXAMPLE_ORIGINATION = {
  originalBalance: 500000,
  originalRatePct: 1.99,
  originalAmortYears: 25,
  elapsedYears: 5,
  paymentFreq: 'monthly'
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

export function paymentsPerYear (freq) {
  return PAYMENT_FREQUENCIES[freq]?.paymentsPerYear || 12
}

export function normalizePaymentFreq (freq) {
  return PAYMENT_FREQUENCIES[freq] ? freq : 'monthly'
}

/**
 * Equivalent rate per payment period under Canadian semi-annual compounding
 * (Interest Act: not in advance).
 */
export function equivalentPeriodicRate (annualRate, ppy) {
  const i = asNumber(annualRate)
  const n = asNumber(ppy)
  if (n <= 0) return 0
  if (i === 0) return 0
  return Math.pow(1 + i / 2, 2 / n) - 1
}

/** Fully amortized principal-and-interest payment for one period. */
export function amortizingPayment (balance, periodicRate, periods) {
  const b = Math.max(0, asNumber(balance))
  const n = asNumber(periods)
  const r = asNumber(periodicRate)
  if (b <= 0 || n <= 0) return 0
  if (r === 0) return b / n
  const pow = Math.pow(1 + r, n)
  return b * (r * pow) / (pow - 1)
}

/** Remaining balance after `paid` contractual payments (no extra / lump sum). */
export function remainingBalanceAfterPayments (balance, periodicRate, payment, paid) {
  const b = Math.max(0, asNumber(balance))
  const r = asNumber(periodicRate)
  const p = asNumber(payment)
  const k = Math.max(0, asNumber(paid))
  if (k === 0) return b
  if (r === 0) return Math.max(0, b - p * k)
  const growth = Math.pow(1 + r, k)
  return Math.max(0, b * growth - p * (growth - 1) / r)
}

/** Periods needed so `payment` amortizes `balance` at `periodicRate`. */
export function periodsForPayment (balance, periodicRate, payment) {
  const b = Math.max(0, asNumber(balance))
  const r = asNumber(periodicRate)
  const p = asNumber(payment)
  if (b <= 0) return 0
  if (p <= 0) return Infinity
  if (r === 0) return b / p
  if (p <= b * r) return Infinity
  return Math.log(p / (p - b * r)) / Math.log(1 + r)
}

export function monthlyEquivalent (periodPayment, freq) {
  const ppy = paymentsPerYear(freq)
  return asNumber(periodPayment) * ppy / 12
}

export function minimumQualifyingRate (contractRate) {
  const i = Math.max(0, asNumber(contractRate))
  return Math.max(i + MQR_BUFFER, MQR_FLOOR)
}

export function remainingPeriods (amortYears, amortMonths, freq) {
  const years = Math.max(0, asNumber(amortYears))
  const months = clamp(asNumber(amortMonths), 0, 11)
  const ppy = paymentsPerYear(freq)
  return Math.round(years * ppy + (months * ppy) / 12)
}

/**
 * Remaining balance and payment after `elapsedYears` on an original loan.
 * Used to seed the 2021 → 2026 worked example.
 */
export function balanceAfterElapsedYears ({
  originalBalance,
  annualRate,
  originalAmortYears,
  elapsedYears,
  paymentFreq = 'monthly'
} = {}) {
  const freq = normalizePaymentFreq(paymentFreq)
  const ppy = paymentsPerYear(freq)
  const r = equivalentPeriodicRate(annualRate, ppy)
  const n = Math.round(asNumber(originalAmortYears) * ppy)
  const paid = Math.round(asNumber(elapsedYears) * ppy)
  const payment = amortizingPayment(originalBalance, r, n)
  const balance = remainingBalanceAfterPayments(originalBalance, r, payment, paid)
  const remaining = Math.max(0, n - paid)
  return {
    payment: round2(payment),
    balance: round2(balance),
    remainingPeriods: remaining,
    remainingAmortYears: remaining / ppy,
    frequency: freq,
    paymentsPerYear: ppy
  }
}

export const WORKED_EXAMPLE_AT_RENEWAL = (() => {
  const elapsed = balanceAfterElapsedYears({
    originalBalance: WORKED_EXAMPLE_ORIGINATION.originalBalance,
    annualRate: WORKED_EXAMPLE_ORIGINATION.originalRatePct / 100,
    originalAmortYears: WORKED_EXAMPLE_ORIGINATION.originalAmortYears,
    elapsedYears: WORKED_EXAMPLE_ORIGINATION.elapsedYears,
    paymentFreq: WORKED_EXAMPLE_ORIGINATION.paymentFreq
  })
  return {
    remainingBalance: elapsed.balance,
    remainingAmortYears: 20,
    remainingAmortMonths: 0,
    currentRatePct: WORKED_EXAMPLE_ORIGINATION.originalRatePct,
    paymentFreq: 'monthly',
    province: MORTGAGE_RENEWAL_PROVINCE,
    lumpSum: 0,
    extraPerPeriod: 0,
    grossAnnualIncome: 135000,
    monthlyDebts: 450,
    annualPropertyTax: 4200,
    monthlyHeating: 140,
    monthlyCondoFees: 0,
    situation: 'straight-switch',
    offers: DEFAULT_RENEWAL_OFFERS
  }
})()

function simulateSchedule ({
  startBalance,
  periodicRate,
  contractualPayment,
  extraPerPeriod,
  periods
}) {
  let balance = Math.max(0, asNumber(startBalance))
  const pmt = Math.max(0, asNumber(contractualPayment))
  const extra = Math.max(0, asNumber(extraPerPeriod))
  const n = Math.max(0, Math.round(asNumber(periods)))
  const r = asNumber(periodicRate)
  let totalInterest = 0
  let totalPrincipal = 0
  let totalExtra = 0
  let paid = 0

  for (let i = 0; i < n && balance > 0.005; i++) {
    const interest = balance * r
    const principalFromPmt = Math.min(Math.max(0, pmt - interest), balance)
    const extraApplied = Math.min(extra, Math.max(0, balance - principalFromPmt))
    const principal = principalFromPmt + extraApplied
    balance = Math.max(0, balance - principal)
    totalInterest += interest
    totalPrincipal += principal
    totalExtra += extraApplied
    paid++
  }

  return {
    periodsPaid: paid,
    totalInterest: round2(totalInterest),
    totalPrincipal: round2(totalPrincipal),
    totalExtra: round2(totalExtra),
    endBalance: round2(balance)
  }
}

function keepPaymentSameTradeoff ({
  startBalance,
  newPeriodicRate,
  currentPayment,
  extraPerPeriod,
  originalPeriods,
  termPeriods,
  ppy
}) {
  const needed = periodsForPayment(startBalance, newPeriodicRate, currentPayment)
  if (!Number.isFinite(needed) || needed <= 0) {
    return {
      possible: false,
      reason: currentPayment <= startBalance * newPeriodicRate
        ? 'The current payment would not cover interest at the new rate, so amortization cannot be extended to keep it.'
        : 'Could not solve for an amortization that keeps the current payment.'
    }
  }

  const extendedPeriods = Math.ceil(needed - 1e-9)
  if (extendedPeriods <= originalPeriods) {
    return {
      possible: false,
      alreadyCovered: true,
      reason: 'The new payment at the remaining amortization is already at or below the current payment, so there is nothing to extend.'
    }
  }

  const originalLife = simulateSchedule({
    startBalance,
    periodicRate: newPeriodicRate,
    contractualPayment: amortizingPayment(startBalance, newPeriodicRate, originalPeriods),
    extraPerPeriod: 0,
    periods: originalPeriods
  })
  const extendedLife = simulateSchedule({
    startBalance,
    periodicRate: newPeriodicRate,
    contractualPayment: currentPayment,
    extraPerPeriod: 0,
    periods: extendedPeriods
  })
  const originalTerm = simulateSchedule({
    startBalance,
    periodicRate: newPeriodicRate,
    contractualPayment: amortizingPayment(startBalance, newPeriodicRate, originalPeriods),
    extraPerPeriod,
    periods: Math.min(termPeriods, originalPeriods)
  })
  const extendedTerm = simulateSchedule({
    startBalance,
    periodicRate: newPeriodicRate,
    contractualPayment: currentPayment,
    extraPerPeriod,
    periods: Math.min(termPeriods, extendedPeriods)
  })

  return {
    possible: true,
    alreadyCovered: false,
    extendedPeriods,
    extendedAmortYears: round2(extendedPeriods / ppy),
    extraYears: round2((extendedPeriods - originalPeriods) / ppy),
    payment: round2(currentPayment),
    interestToPayoff: extendedLife.totalInterest,
    interestToPayoffIfAmortUnchanged: originalLife.totalInterest,
    extraInterestToPayoff: round2(extendedLife.totalInterest - originalLife.totalInterest),
    endBalanceAfterTerm: extendedTerm.endBalance,
    endBalanceAfterTermIfAmortUnchanged: originalTerm.endBalance,
    interestOverTerm: extendedTerm.totalInterest,
    triggersRequalification: true
  }
}

function housingCostsMonthly ({
  qualifyingPiMonthly,
  annualPropertyTax,
  monthlyHeating,
  monthlyCondoFees
}) {
  return (
    Math.max(0, asNumber(qualifyingPiMonthly)) +
    Math.max(0, asNumber(annualPropertyTax)) / 12 +
    Math.max(0, asNumber(monthlyHeating)) +
    CONDO_FEE_GDS_SHARE * Math.max(0, asNumber(monthlyCondoFees))
  )
}

function stressTestForOffer ({
  startBalance,
  remainingPeriodsCount,
  contractRate,
  freq,
  annualPropertyTax,
  monthlyHeating,
  monthlyCondoFees,
  grossAnnualIncome,
  monthlyDebts
}) {
  const qualifyingRate = minimumQualifyingRate(contractRate)
  const ppy = paymentsPerYear(freq)
  const r = equivalentPeriodicRate(qualifyingRate, ppy)
  const qualifyingPeriodPayment = amortizingPayment(startBalance, r, remainingPeriodsCount)
  const qualifyingPiMonthly = monthlyEquivalent(qualifyingPeriodPayment, freq)
  const housing = housingCostsMonthly({
    qualifyingPiMonthly,
    annualPropertyTax,
    monthlyHeating,
    monthlyCondoFees
  })
  const monthlyIncome = Math.max(0, asNumber(grossAnnualIncome)) / 12
  const gds = monthlyIncome > 0 ? housing / monthlyIncome : 0
  const tds = monthlyIncome > 0 ? (housing + Math.max(0, asNumber(monthlyDebts))) / monthlyIncome : 0
  const gdsPass = gds <= GDS_LIMIT + 1e-12
  const tdsPass = tds <= TDS_LIMIT + 1e-12

  return {
    qualifyingRate: round2(qualifyingRate * 10000) / 10000,
    qualifyingRatePct: round2(qualifyingRate * 100),
    qualifyingPeriodPayment: round2(qualifyingPeriodPayment),
    qualifyingMonthlyPi: round2(qualifyingPiMonthly),
    monthlyHousingCosts: round2(housing),
    gds: round2(gds * 10000) / 10000,
    tds: round2(tds * 10000) / 10000,
    gdsPct: round2(gds * 100),
    tdsPct: round2(tds * 100),
    gdsLimit: GDS_LIMIT,
    tdsLimit: TDS_LIMIT,
    gdsPass,
    tdsPass,
    passes: gdsPass && tdsPass
  }
}

function situationNotes (situation, { lumpSum, extraBorrowing, amortExtended }) {
  const key = RENEWAL_SITUATIONS[situation] ? situation : 'straight-switch'
  const prescribedRequired = RENEWAL_SITUATIONS[key].prescribedMqrRequired || extraBorrowing || amortExtended
  let reason
  if (key === 'requalify' || extraBorrowing || amortExtended) {
    reason = 'The prescribed minimum qualifying rate is the relevant check when you borrow more, extend amortization, or move to a lender that still applies a stress test. OSFI still expects sound B-20 underwriting even when the prescribed rate is not required.'
  } else if (key === 'straight-switch') {
    reason = 'As of 21 November 2024, OSFI no longer prescribes the minimum qualifying rate for an uninsured straight switch at renewal between federally regulated lenders (no increase in remaining amortization or loan amount, other than up to $3,000 for penalties and transaction costs). Insured switches at renewal were separately exempted under the Canadian Mortgage Charter. A new lender can still apply its own qualifying policy.'
  } else {
    reason = 'Staying with the same lender on the remaining balance and remaining amortization is typically a renewal, not a new origination. The prescribed minimum qualifying rate is still the relevant check if you borrow more, extend amortization, or the lender chooses to re-qualify you.'
  }
  if (lumpSum > 0 && !extraBorrowing) {
    reason += ' A lump-sum paydown reduces the loan amount; that is not extra borrowing.'
  }
  return {
    situation: key,
    prescribedMqrRequired: Boolean(prescribedRequired),
    reason
  }
}

function normalizeOffers (offers) {
  const list = Array.isArray(offers) && offers.length ? offers : DEFAULT_RENEWAL_OFFERS
  return list.slice(0, 3).map((offer, index) => ({
    id: String(offer.id || ['a', 'b', 'c'][index]),
    label: String(offer.label || `Offer ${index + 1}`).slice(0, 80),
    ratePct: clamp(asNumber(offer.ratePct), 0, 30),
    termYears: clamp(Math.round(asNumber(offer.termYears, 5)), 1, 10),
    type: offer.type === 'variable' ? 'variable' : 'fixed'
  }))
}

/**
 * @param {object} input
 * @param {number} input.remainingBalance
 * @param {number} input.remainingAmortYears
 * @param {number} [input.remainingAmortMonths]
 * @param {number} input.currentRatePct
 * @param {string} [input.paymentFreq]
 * @param {number} [input.lumpSum]
 * @param {number} [input.extraPerPeriod]
 * @param {number} [input.grossAnnualIncome]
 * @param {number} [input.monthlyDebts]
 * @param {number} [input.annualPropertyTax]
 * @param {number} [input.monthlyHeating]
 * @param {number} [input.monthlyCondoFees]
 * @param {string} [input.province]
 * @param {'same-lender'|'straight-switch'|'requalify'} [input.situation]
 * @param {Array} [input.offers]
 */
export function compareMortgageRenewal (input = {}) {
  const freq = normalizePaymentFreq(input.paymentFreq)
  const ppy = paymentsPerYear(freq)
  const province = normalizeCanadaProvince(input.province, MORTGAGE_RENEWAL_PROVINCE)
  const remainingBalance = Math.max(0, asNumber(input.remainingBalance))
  const remainingAmortYears = Math.max(0, asNumber(input.remainingAmortYears))
  const remainingAmortMonths = clamp(asNumber(input.remainingAmortMonths), 0, 11)
  const currentRatePct = clamp(asNumber(input.currentRatePct), 0, 30)
  const lumpSum = Math.max(0, asNumber(input.lumpSum))
  const extraPerPeriod = Math.max(0, asNumber(input.extraPerPeriod))
  const grossAnnualIncome = Math.max(0, asNumber(input.grossAnnualIncome))
  const monthlyDebts = Math.max(0, asNumber(input.monthlyDebts))
  const annualPropertyTax = Math.max(0, asNumber(input.annualPropertyTax))
  const monthlyHeating = Math.max(0, asNumber(input.monthlyHeating))
  const monthlyCondoFees = Math.max(0, asNumber(input.monthlyCondoFees))
  const situation = RENEWAL_SITUATIONS[input.situation] ? input.situation : 'straight-switch'
  const offers = normalizeOffers(input.offers)

  const originalPeriods = remainingPeriods(remainingAmortYears, remainingAmortMonths, freq)
  const currentPeriodicRate = equivalentPeriodicRate(currentRatePct / 100, ppy)
  const currentPayment = amortizingPayment(remainingBalance, currentPeriodicRate, originalPeriods)
  const startBalance = Math.max(0, remainingBalance - lumpSum)
  const extraBorrowing = startBalance > remainingBalance + 0.005

  const current = {
    remainingBalance: round2(remainingBalance),
    startBalance: round2(startBalance),
    lumpSum: round2(lumpSum),
    remainingAmortYears: round2(remainingAmortYears + remainingAmortMonths / 12),
    remainingPeriods: originalPeriods,
    ratePct: currentRatePct,
    paymentFreq: freq,
    paymentsPerYear: ppy,
    payment: round2(currentPayment),
    monthlyEquivalent: round2(monthlyEquivalent(currentPayment, freq)),
    province
  }

  const offerResults = offers.map((offer) => {
    const contractRate = offer.ratePct / 100
    const r = equivalentPeriodicRate(contractRate, ppy)
    const contractualPayment = amortizingPayment(startBalance, r, originalPeriods)
    const termPeriods = Math.min(originalPeriods, Math.round(offer.termYears * ppy))
    const term = simulateSchedule({
      startBalance,
      periodicRate: r,
      contractualPayment,
      extraPerPeriod,
      periods: termPeriods
    })
    const shockDollars = contractualPayment - currentPayment
    const shockPct = currentPayment > 0 ? shockDollars / currentPayment : 0
    const monthlyNew = monthlyEquivalent(contractualPayment, freq)
    const monthlyOld = monthlyEquivalent(currentPayment, freq)
    const monthlyShock = monthlyNew - monthlyOld
    const keepSame = keepPaymentSameTradeoff({
      startBalance,
      newPeriodicRate: r,
      currentPayment,
      extraPerPeriod,
      originalPeriods,
      termPeriods,
      ppy
    })
    const stress = stressTestForOffer({
      startBalance,
      remainingPeriodsCount: originalPeriods,
      contractRate,
      freq,
      annualPropertyTax,
      monthlyHeating,
      monthlyCondoFees,
      grossAnnualIncome,
      monthlyDebts
    })

    return {
      ...offer,
      contractualPayment: round2(contractualPayment),
      monthlyEquivalent: round2(monthlyNew),
      paymentShock: {
        dollars: round2(shockDollars),
        percent: round2(shockPct * 10000) / 10000,
        percentPts: round2(shockPct * 100)
      },
      monthlyShock: {
        dollars: round2(monthlyShock),
        percent: monthlyOld > 0 ? round2((monthlyShock / monthlyOld) * 10000) / 10000 : 0
      },
      interestOverTerm: term.totalInterest,
      extraPaidOverTerm: term.totalExtra,
      endBalance: term.endBalance,
      termYears: offer.termYears,
      termPeriods,
      keepPaymentSame: keepSame,
      stressTest: stress
    }
  })

  const amortExtended = offerResults.some((o) => o.keepPaymentSame?.possible && !o.keepPaymentSame?.alreadyCovered)
  const applicability = situationNotes(situation, { lumpSum, extraBorrowing, amortExtended: false })

  const warnings = []
  if (startBalance <= 0) {
    warnings.push('A lump sum at or above the remaining balance would pay the mortgage off. Enter a smaller lump sum to compare renewal offers.')
  }
  if (originalPeriods <= 0) {
    warnings.push('Remaining amortization must be greater than zero.')
  }
  if (lumpSum > remainingBalance) {
    warnings.push('Lump sum is larger than the remaining balance.')
  }

  const rankedByPayment = [...offerResults].sort((a, b) => a.contractualPayment - b.contractualPayment)
  const rankedByShock = [...offerResults].sort((a, b) => a.paymentShock.dollars - b.paymentShock.dollars)

  return {
    province,
    frequency: freq,
    situation: applicability.situation,
    prescribedMqrRequired: applicability.prescribedMqrRequired,
    applicabilityNote: applicability.reason,
    mqr: {
      floor: MQR_FLOOR,
      buffer: MQR_BUFFER,
      gdsLimit: GDS_LIMIT,
      tdsLimit: TDS_LIMIT,
      condoFeeShare: CONDO_FEE_GDS_SHARE,
      straightSwitchCostCap: STRAIGHT_SWITCH_COST_CAP
    },
    current,
    extraPerPeriod: round2(extraPerPeriod),
    qualification: {
      grossAnnualIncome: round2(grossAnnualIncome),
      monthlyDebts: round2(monthlyDebts),
      annualPropertyTax: round2(annualPropertyTax),
      monthlyHeating: round2(monthlyHeating),
      monthlyCondoFees: round2(monthlyCondoFees)
    },
    offers: offerResults,
    lowestPayment: rankedByPayment[0] || null,
    lowestShock: rankedByShock[0] || null,
    warnings,
    amortExtendedAvailable: amortExtended
  }
}
