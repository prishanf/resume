/**
 * Canadian capital gains tax calculator (2026) with a year-end
 * tax-loss harvesting estimator.
 *
 * Capital gain or loss on a disposition (Schedule 3):
 *   proceeds of disposition − adjusted cost base − outlays and expenses
 *   https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/personal-income/line-12700-capital-gains.html
 *
 * Inclusion rate for 2026 is 1/2. The proposed increase to 2/3 was
 * cancelled on 21 March 2025 and never became law. Income Tax Act s. 38(a)
 * still says 1/2; CRA administers that enacted rate.
 *   https://www.pm.gc.ca/en/news/news-releases/2025/03/21/prime-minister-mark-carney-cancels-proposed-capital-gains-tax-increase
 *   https://laws-lois.justice.gc.ca/eng/acts/I-3.3/section-38.html
 *   https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/personal-income/line-12700-capital-gains/definitions-capital-gains.html
 *
 * Tax on the gain is calculateTax(income + taxable gain) − calculateTax(income)
 * using the 2026 federal + provincial engine in canadianTax.js. This file
 * does not duplicate bracket tables. The already-included (50%) amount is
 * added as extra fully taxable income so the engine does not apply 50% twice.
 *
 * Net capital losses of other years (line 25300) offset taxable capital
 * gains only. Unused current-year net capital losses carry back 3 years
 * (Form T1A) or forward indefinitely.
 *   https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/personal-income/line-12700-capital-gains/capital-losses-deductions.html
 *   https://www.canada.ca/en/revenue-agency/services/forms-publications/forms/t1a.html
 *
 * Year-end 2026: T+1 settlement since 27 May 2024. TMX’s 2026 holiday
 * settlement schedule lists Thursday 31 December 2026 settling Monday
 * 4 January 2027, so the last regular TSX trade that settles in 2026 is
 * Wednesday 30 December 2026.
 *   https://www.tsx.com/en/resource/3407/
 *
 * Superficial-loss rule: 30 calendar days before and after the sale,
 * including affiliated persons (spouse / common-law partner) and
 * identical property bought in a registered account such as a TFSA or RRSP.
 *   https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/personal-income/line-12700-capital-gains/capital-losses-deductions.html
 *
 * Principal residence exemption and the lifetime capital gains exemption
 * are out of scope.
 */

import { calculateTax, DEFAULT_TAX_YEAR, normalizeCanadaProvince } from './canadianTax.js'

export const CAPITAL_GAINS_TAX_YEAR = DEFAULT_TAX_YEAR
export const CAPITAL_GAINS_PROVINCE = 'BC'
export const INCLUSION_RATE_2026 = 0.5
export const LAST_TRADE_DATE_2026 = '2026-12-30'
export const LAST_TRADE_LABEL_2026 = 'Wednesday, 30 December 2026'
export const SETTLEMENT_DEADLINE_2026 = 'Thursday, 31 December 2026'
export const SUPERFICIAL_LOSS_WINDOW_DAYS = 30
export const LOSS_CARRYBACK_YEARS = 3

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

function money (value) {
  return round2(Math.max(0, asNumber(value)))
}

function salaryScenario (salary, extras = {}, province = CAPITAL_GAINS_PROVINCE) {
  return {
    province: normalizeCanadaProvince(province, CAPITAL_GAINS_PROVINCE),
    salary: Math.max(0, asNumber(salary)),
    ...EMPTY_INCOME,
    ...extras
  }
}

/** Federal + provincial income tax only (no CPP/EI). Not exported — registeredAccounts.js already exports incomeTax. */
function incomeTax (scenario, year = CAPITAL_GAINS_TAX_YEAR) {
  return calculateTax(scenario, year).totalTax
}

export function positionGainLoss ({ proceeds = 0, acb = 0, outlays = 0 } = {}) {
  return round2(asNumber(proceeds) - asNumber(acb) - asNumber(outlays))
}

export function harvestGainLoss ({ currentValue = 0, acb = 0, outlays = 0 } = {}) {
  return positionGainLoss({ proceeds: currentValue, acb, outlays })
}

export function includedAmount (capitalGainOrLoss, rate = INCLUSION_RATE_2026) {
  return round2(asNumber(capitalGainOrLoss) * rate)
}

/**
 * Extra federal + provincial income tax from adding an already-included
 * taxable capital gain (or zero) on top of employment income.
 */
export function taxOnTaxableCapitalGain (income, taxableGain, year = CAPITAL_GAINS_TAX_YEAR, province = CAPITAL_GAINS_PROVINCE) {
  const extra = Math.max(0, asNumber(taxableGain))
  if (extra <= 0) return 0
  const base = incomeTax(salaryScenario(income, {}, province), year)
  const withGain = incomeTax(salaryScenario(income, { interest: extra }, province), year)
  return round2(Math.max(0, withGain - base))
}

function normalizePositions (positions) {
  const list = Array.isArray(positions) && positions.length
    ? positions
    : [WORKED_EXAMPLE_INPUT.positions[0]]
  return list.map((row, index) => {
    const proceeds = money(row.proceeds)
    const acb = money(row.acb)
    const outlays = money(row.outlays)
    const gainLoss = positionGainLoss({ proceeds, acb, outlays })
    return {
      id: String(row.id || `p${index + 1}`),
      label: String(row.label || `Position ${index + 1}`).slice(0, 80),
      proceeds,
      acb,
      outlays,
      netProceeds: round2(proceeds - outlays),
      gainLoss,
      taxable: includedAmount(Math.max(0, gainLoss)),
      allowableLoss: includedAmount(Math.max(0, -gainLoss))
    }
  })
}

function normalizeHarvest (positions) {
  const list = Array.isArray(positions) ? positions : []
  return list.map((row, index) => {
    const currentValue = money(row.currentValue)
    const acb = money(row.acb)
    const outlays = money(row.outlays)
    const gainLoss = harvestGainLoss({ currentValue, acb, outlays })
    return {
      id: String(row.id || `h${index + 1}`),
      label: String(row.label || `Harvest ${index + 1}`).slice(0, 80),
      currentValue,
      acb,
      outlays,
      netProceeds: round2(currentValue - outlays),
      gainLoss,
      isLoss: gainLoss < 0
    }
  })
}

function summarizeNet (gainLoss, netCapitalLossesCF) {
  const taxableBeforeCF = Math.max(0, includedAmount(gainLoss))
  const allowableLoss = Math.max(0, includedAmount(-gainLoss))
  const appliedCarryforward = round2(Math.min(taxableBeforeCF, Math.max(0, asNumber(netCapitalLossesCF))))
  const taxableAfterCF = round2(taxableBeforeCF - appliedCarryforward)
  const unusedCarryforward = round2(Math.max(0, asNumber(netCapitalLossesCF) - appliedCarryforward))
  const netCapitalLossForCarry = allowableLoss
  return {
    capitalGainOrLoss: round2(gainLoss),
    taxableCapitalGain: taxableAfterCF,
    taxableBeforeCarryforward: taxableBeforeCF,
    allowableCapitalLoss: allowableLoss,
    appliedCarryforward,
    unusedCarryforward,
    netCapitalLossForCarry
  }
}

function buildResultSlice (income, province, positions, harvestPositions, netCapitalLossesCF) {
  const realizedGain = positions.reduce((sum, row) => sum + row.gainLoss, 0)
  const harvestGain = harvestPositions.reduce((sum, row) => sum + row.gainLoss, 0)
  const netGain = round2(realizedGain + harvestGain)
  const summary = summarizeNet(netGain, netCapitalLossesCF)
  const tax = taxOnTaxableCapitalGain(income, summary.taxableCapitalGain, CAPITAL_GAINS_TAX_YEAR, province)
  const realizedNetProceeds = round2(positions.reduce((sum, row) => sum + row.netProceeds, 0))
  const harvestNetProceeds = round2(harvestPositions.reduce((sum, row) => sum + row.netProceeds, 0))
  const totalNetProceeds = round2(realizedNetProceeds + harvestNetProceeds)
  const effectiveRateOnGain = netGain > 0 ? tax / netGain : 0
  const marginalRateOnIncluded = summary.taxableCapitalGain > 0 ? tax / summary.taxableCapitalGain : 0

  return {
    realizedGainLoss: round2(realizedGain),
    harvestGainLoss: round2(harvestGain),
    ...summary,
    tax,
    realizedNetProceeds,
    harvestNetProceeds,
    totalNetProceeds,
    afterTaxProceeds: round2(totalNetProceeds - tax),
    effectiveRateOnGain: round2(effectiveRateOnGain * 10000) / 10000,
    marginalRateOnIncluded: round2(marginalRateOnIncluded * 10000) / 10000
  }
}

function buildWarnings ({ harvest, harvestIncluded, net, withoutHarvest }) {
  const warnings = []
  if (harvestIncluded && harvest.some((row) => row.isLoss)) {
    warnings.push(
      `Superficial-loss rule: if you, your spouse or common-law partner, or another affiliated person buys the same or identical property (including in a TFSA or RRSP) in the ${SUPERFICIAL_LOSS_WINDOW_DAYS} calendar days before or after the sale, and still owns it ${SUPERFICIAL_LOSS_WINDOW_DAYS} days later, the loss is denied.`
    )
  }
  if (harvestIncluded && harvest.some((row) => !row.isLoss && row.currentValue + row.acb > 0)) {
    warnings.push('A harvest row that is not a loss is included in the net. Tax-loss harvesting only helps when you actually realize a capital loss.')
  }
  if (net.netCapitalLossForCarry > 0) {
    warnings.push(
      `This year produces a net capital loss of ${net.netCapitalLossForCarry.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })} (allowable amount). You can carry it back up to ${LOSS_CARRYBACK_YEARS} years on Form T1A, or forward indefinitely, against taxable capital gains only.`
    )
  }
  if (withoutHarvest.taxableCapitalGain === 0 && harvestIncluded && net.tax === 0 && net.harvestGainLoss >= 0) {
    warnings.push('There is no taxable capital gain to offset this year, so harvesting a loss does not save tax now. The loss can still be carried back or forward.')
  }
  return warnings
}

/**
 * Worked example: a BC employee at $95,000 who sold ETF units for a
 * $12,000 gain and has a $4,000 unrealized loss on a Canadian bank stock.
 */
export const WORKED_EXAMPLE_INPUT = {
  province: CAPITAL_GAINS_PROVINCE,
  income: 95000,
  netCapitalLossesCF: 0,
  harvestIncluded: true,
  positions: [
    {
      id: 'etf',
      label: 'Canadian equity ETF',
      proceeds: 42150,
      acb: 30000,
      outlays: 150
    }
  ],
  harvest: [
    {
      id: 'bank',
      label: 'Canadian bank stock',
      currentValue: 16100,
      acb: 20000,
      outlays: 100
    }
  ]
}

/**
 * @param {object} input
 * @param {string} [input.province]
 * @param {number} [input.income] Other taxable income for 2026 (modelled as employment income).
 * @param {number} [input.netCapitalLossesCF] Net capital losses of other years (allowable / line 25300 amount).
 * @param {boolean} [input.harvestIncluded]
 * @param {Array} [input.positions]
 * @param {Array} [input.harvest]
 */
export function compareCapitalGains (input = {}) {
  const province = normalizeCanadaProvince(input.province, CAPITAL_GAINS_PROVINCE)
  const income = money(input.income)
  const netCapitalLossesCF = money(input.netCapitalLossesCF)
  const harvestIncluded = input.harvestIncluded !== false
  const positions = normalizePositions(input.positions)
  const harvestAll = normalizeHarvest(input.harvest)
  const harvestApplied = harvestIncluded ? harvestAll : []

  const withoutHarvest = buildResultSlice(income, province, positions, [], netCapitalLossesCF)
  const withHarvest = buildResultSlice(income, province, positions, harvestApplied, netCapitalLossesCF)
  const taxSavedNow = round2(Math.max(0, withoutHarvest.tax - withHarvest.tax))
  const leftoverAllowableLoss = withHarvest.netCapitalLossForCarry
  const warnings = buildWarnings({
    harvest: harvestAll,
    harvestIncluded,
    net: withHarvest,
    withoutHarvest
  })

  return {
    year: CAPITAL_GAINS_TAX_YEAR,
    province,
    income,
    netCapitalLossesCF,
    harvestIncluded,
    inclusionRate: INCLUSION_RATE_2026,
    lastTradeDate: LAST_TRADE_DATE_2026,
    lastTradeLabel: LAST_TRADE_LABEL_2026,
    settlementDeadline: SETTLEMENT_DEADLINE_2026,
    positions,
    harvest: harvestAll,
    withoutHarvest,
    withHarvest,
    taxSavedNow,
    leftoverAllowableLoss,
    carrybackYears: LOSS_CARRYBACK_YEARS,
    superficialLossWindowDays: SUPERFICIAL_LOSS_WINDOW_DAYS,
    warnings
  }
}
