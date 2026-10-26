import { describe, expect, it } from 'vitest'
import { calculateTax, CANADA_PROVINCE_CODES } from './canadianTax.js'
import {
  CONTRIBUTION_LIMITS_2026,
  REGISTERED_ACCOUNT_PROVINCE,
  compareRegisteredAccounts,
  contributionRefund,
  futureValue,
  rrspRoomProxy,
  taxOnCapitalGain,
  taxOnFullyTaxableAmount
} from './registeredAccounts.js'

const salaryOnly = (salary, extras = {}) => ({
  province: 'BC',
  salary,
  interest: 0,
  eligibleDividend: 0,
  nonEligibleDividend: 0,
  capitalGains: 0,
  rentalIncome: 0,
  rentalExpenses: 0,
  rrsp: 0,
  ...extras
})

const exampleInput = {
  income: 95000,
  contribution: 7000,
  years: 20,
  annualReturn: 0.06,
  withdrawalMode: 'income',
  withdrawalIncome: 55000,
  firstTimeHomeBuyer: true,
  reinvestRefundInTfsa: true,
  nonRegisteredTreatment: 'capital-gains'
}

describe('2026 contribution limits (CRA)', () => {
  it('matches the published RRSP dollar limit, 18% rule, TFSA, and FHSA figures', () => {
    expect(CONTRIBUTION_LIMITS_2026.rrspDollarLimit).toBe(33810)
    expect(CONTRIBUTION_LIMITS_2026.rrspEarnedIncomeRate).toBe(0.18)
    expect(CONTRIBUTION_LIMITS_2026.tfsaAnnual).toBe(7000)
    expect(CONTRIBUTION_LIMITS_2026.fhsaAnnual).toBe(8000)
    expect(CONTRIBUTION_LIMITS_2026.fhsaLifetime).toBe(40000)
  })

  it('RRSP room proxy is the lesser of 18% of income and the dollar limit', () => {
    expect(rrspRoomProxy(95000)).toBe(17100)
    expect(rrspRoomProxy(300000)).toBe(33810)
    expect(rrspRoomProxy(0)).toBe(0)
  })
})

describe('refund and withdrawal tax reuse the Canadian tax calculator', () => {
  it('contribution refund equals the drop in federal + BC tax from an RRSP deduction', () => {
    const without = calculateTax(salaryOnly(95000), 2026)
    const withRrsp = calculateTax(salaryOnly(95000, { rrsp: 7000 }), 2026)
    const expected = without.totalTax - withRrsp.totalTax
    expect(contributionRefund(95000, 7000)).toBeCloseTo(expected, 2)
  })

  it('RRSP withdrawal tax is extra income tax from adding the future value as interest (no CPP/EI)', () => {
    const fv = futureValue(7000, 0.06, 20)
    const base = calculateTax(salaryOnly(55000), 2026)
    const withInterest = calculateTax(salaryOnly(55000, { interest: fv }), 2026)
    expect(taxOnFullyTaxableAmount(55000, fv)).toBeCloseTo(withInterest.totalTax - base.totalTax, 2)
    expect(withInterest.cpp).toBe(base.cpp)
    expect(withInterest.ei).toBe(base.ei)
  })

  it('non-registered capital-gains tax uses the 50% inclusion in calculateTax', () => {
    const fv = futureValue(7000, 0.06, 20)
    const gain = fv - 7000
    const base = calculateTax(salaryOnly(55000), 2026)
    const withGain = calculateTax(salaryOnly(55000, { capitalGains: gain }), 2026)
    expect(taxOnCapitalGain(55000, gain)).toBeCloseTo(withGain.totalTax - base.totalTax, 2)
    expect(withGain.taxableIncome - base.taxableIncome).toBeCloseTo(gain * 0.5, 2)
  })
})

describe('compareRegisteredAccounts math', () => {
  it('TFSA after-tax value is the compounded contribution', () => {
    const r = compareRegisteredAccounts(exampleInput)
    expect(r.accounts.tfsa.afterTaxValue).toBeCloseTo(7000 * 1.06 ** 20, 2)
    expect(r.accounts.tfsa.taxOnWithdrawal).toBe(0)
    expect(r.accounts.tfsa.refund).toBe(0)
  })

  it('FHSA after-tax value is TFSA growth plus the grown refund when eligible and reinvested', () => {
    const r = compareRegisteredAccounts(exampleInput)
    const expected = r.accounts.tfsa.afterTaxValue + r.refundFutureValue
    expect(r.accounts.fhsa.eligible).toBe(true)
    expect(r.accounts.fhsa.taxOnWithdrawal).toBe(0)
    expect(r.accounts.fhsa.afterTaxValue).toBeCloseTo(expected, 2)
    expect(r.accounts.fhsa.refund).toBe(r.accounts.rrsp.refund)
  })

  it('RRSP after-tax value is growth minus withdrawal tax plus refund (optionally grown)', () => {
    const r = compareRegisteredAccounts(exampleInput)
    const expected = r.grownContribution - r.accounts.rrsp.taxOnWithdrawal + r.refundFutureValue
    expect(r.accounts.rrsp.afterTaxValue).toBeCloseTo(expected, 2)
    expect(r.accounts.rrsp.taxOnWithdrawal).toBeGreaterThan(0)
  })

  it('FHSA is ineligible when the person is not a first-time home buyer', () => {
    const r = compareRegisteredAccounts({ ...exampleInput, firstTimeHomeBuyer: false })
    expect(r.accounts.fhsa.eligible).toBe(false)
    expect(r.accounts.fhsa.afterTaxValue).toBe(0)
    expect(r.winner.key).not.toBe('fhsa')
    expect(r.ranking.find((row) => row.key === 'fhsa')).toBeUndefined()
  })

  it('recommends FHSA for the $95k BC / $7,000 / first-home example', () => {
    const r = compareRegisteredAccounts(exampleInput)
    expect(r.winner.key).toBe('fhsa')
    expect(r.ranking[0].key).toBe('fhsa')
    expect(r.accounts.fhsa.afterTaxValue).toBeGreaterThan(r.accounts.rrsp.afterTaxValue)
    expect(r.accounts.rrsp.afterTaxValue).toBeGreaterThan(r.accounts.tfsa.afterTaxValue)
    expect(r.accounts.tfsa.afterTaxValue).toBeGreaterThan(r.accounts.nonRegistered.afterTaxValue)
  })

  it('recommends RRSP over TFSA when current tax savings beat the withdrawal rate (no FHSA)', () => {
    const r = compareRegisteredAccounts({
      ...exampleInput,
      firstTimeHomeBuyer: false,
      withdrawalIncome: 40000
    })
    expect(r.winner.key).toBe('rrsp')
    expect(r.contributionRefundRate).toBeGreaterThan(r.withdrawalRate)
    expect(r.accounts.rrsp.afterTaxValue).toBeGreaterThan(r.accounts.tfsa.afterTaxValue)
  })

  it('recommends TFSA over RRSP when withdrawal income is in a higher bracket (no FHSA)', () => {
    const r = compareRegisteredAccounts({
      ...exampleInput,
      firstTimeHomeBuyer: false,
      withdrawalIncome: 180000
    })
    expect(r.winner.key).toBe('tfsa')
    expect(r.withdrawalRate).toBeGreaterThan(r.contributionRefundRate)
    expect(r.accounts.tfsa.afterTaxValue).toBeGreaterThan(r.accounts.rrsp.afterTaxValue)
  })

  it('counts the refund at face value when it is not reinvested', () => {
    const grown = compareRegisteredAccounts(exampleInput)
    const cash = compareRegisteredAccounts({ ...exampleInput, reinvestRefundInTfsa: false })
    expect(cash.refundFutureValue).toBeCloseTo(cash.refund, 2)
    expect(grown.refundFutureValue).toBeGreaterThan(cash.refundFutureValue)
    expect(grown.accounts.fhsa.afterTaxValue).toBeGreaterThan(cash.accounts.fhsa.afterTaxValue)
  })

  it('non-registered capital-gains result is below TFSA by the tax on the gain', () => {
    const r = compareRegisteredAccounts(exampleInput)
    expect(r.accounts.nonRegistered.afterTaxValue).toBeCloseTo(
      r.accounts.nonRegistered.futureValue - r.accounts.nonRegistered.taxOnWithdrawal,
      2
    )
    expect(r.accounts.nonRegistered.afterTaxValue).toBeLessThan(r.accounts.tfsa.afterTaxValue)
  })

  it('annual interest treatment applies the current income-tax rate each year', () => {
    const r = compareRegisteredAccounts({
      ...exampleInput,
      nonRegisteredTreatment: 'interest'
    })
    const rAfter = 0.06 * (1 - r.currentRate)
    expect(r.accounts.nonRegistered.futureValue).toBeCloseTo(7000 * (1 + rAfter) ** 20, 2)
    expect(r.accounts.nonRegistered.afterTaxValue).toBe(r.accounts.nonRegistered.futureValue)
  })

  it('withdrawal-rate mode taxes the RRSP future value at the entered rate', () => {
    const r = compareRegisteredAccounts({
      ...exampleInput,
      withdrawalMode: 'rate',
      withdrawalRate: 0.20
    })
    expect(r.accounts.rrsp.taxOnWithdrawal).toBeCloseTo(r.grownContribution * 0.20, 2)
    expect(r.withdrawalRate).toBeCloseTo(0.20, 4)
  })

  it('zero contribution yields zero values and no winner key', () => {
    const r = compareRegisteredAccounts({ ...exampleInput, contribution: 0 })
    expect(r.accounts.tfsa.afterTaxValue).toBe(0)
    expect(r.accounts.rrsp.afterTaxValue).toBe(0)
    expect(r.refund).toBe(0)
    expect(r.winner.key).toBeNull()
  })

  it('warns when the contribution exceeds the 2026 annual TFSA and FHSA limits', () => {
    const r = compareRegisteredAccounts({ ...exampleInput, contribution: 12000 })
    expect(r.warnings.some((w) => w.includes('TFSA'))).toBe(true)
    expect(r.warnings.some((w) => w.includes('FHSA'))).toBe(true)
  })
})

describe('worked example snapshot: BC $95k, $7,000, 20 years, 6%, withdrawal income $55k', () => {
  it('locks the after-tax values used in the companion post', () => {
    const r = compareRegisteredAccounts(exampleInput)
    expect(r.province).toBe('BC')
    expect(r.refund).toBe(1974)
    expect(r.grownContribution).toBe(22449.95)
    expect(r.refundFutureValue).toBe(6330.89)
    expect(r.currentRate).toBeCloseTo(0.282, 3)
    expect(r.winner.key).toBe('fhsa')
    expect(r.accounts.fhsa.afterTaxValue).toBe(28780.84)
    expect(r.accounts.rrsp.afterTaxValue).toBe(22712.42)
    expect(r.accounts.tfsa.afterTaxValue).toBe(22449.95)
    expect(r.accounts.nonRegistered.afterTaxValue).toBe(20533.98)
  })
})

describe('province selection applies to contribution-year and withdrawal-year tax', () => {
  it('defaults to BC', () => {
    expect(REGISTERED_ACCOUNT_PROVINCE).toBe('BC')
    expect(compareRegisteredAccounts(exampleInput).province).toBe('BC')
    expect(compareRegisteredAccounts({ ...exampleInput, province: 'xx' }).province).toBe('BC')
  })

  it('ON and AB change the $7,000 refund and the RRSP withdrawal tax versus BC', () => {
    const bc = compareRegisteredAccounts({ ...exampleInput, province: 'BC' })
    const on = compareRegisteredAccounts({ ...exampleInput, province: 'ON' })
    const ab = compareRegisteredAccounts({ ...exampleInput, province: 'AB' })
    expect(on.refund).not.toBe(bc.refund)
    expect(ab.refund).not.toBe(bc.refund)
    expect(on.accounts.rrsp.taxOnWithdrawal).not.toBe(bc.accounts.rrsp.taxOnWithdrawal)
    expect(ab.accounts.rrsp.taxOnWithdrawal).not.toBe(bc.accounts.rrsp.taxOnWithdrawal)
    expect(on.accounts.fhsa.afterTaxValue).not.toBe(bc.accounts.fhsa.afterTaxValue)
    expect(ab.accounts.fhsa.afterTaxValue).not.toBe(bc.accounts.fhsa.afterTaxValue)
  })

  it('locks Ontario and Alberta after-tax values used in the companion post', () => {
    const on = compareRegisteredAccounts({ ...exampleInput, province: 'ON' })
    const ab = compareRegisteredAccounts({ ...exampleInput, province: 'AB' })
    expect(on.refund).toBe(2075.5)
    expect((on.currentRate * 100).toFixed(1)).toBe('29.6')
    expect(on.accounts.fhsa.afterTaxValue).toBe(29106.36)
    expect(on.accounts.rrsp.afterTaxValue).toBe(22562.42)
    expect(ab.refund).toBe(2135)
    expect((ab.currentRate * 100).toFixed(1)).toBe('30.5')
    expect(ab.accounts.fhsa.afterTaxValue).toBe(29297.18)
    expect(ab.accounts.rrsp.afterTaxValue).toBe(22846.72)
  })

  for (const province of CANADA_PROVINCE_CODES) {
    it(`${province} $95k example: rate now, withdrawal tax, and after-tax sanity`, () => {
      const r = compareRegisteredAccounts({ ...exampleInput, province })
      expect(r.province).toBe(province)
      expect(r.currentRate).toBeGreaterThan(0.20)
      expect(r.currentRate).toBeLessThan(0.45)
      expect(r.refund).toBeGreaterThan(1000)
      expect(r.accounts.rrsp.taxOnWithdrawal).toBeGreaterThan(0)
      expect(r.accounts.tfsa.afterTaxValue).toBeCloseTo(7000 * 1.06 ** 20, 2)
      expect(r.accounts.fhsa.afterTaxValue).toBeGreaterThan(r.accounts.tfsa.afterTaxValue)
      expect(r.accounts.tfsa.afterTaxValue).toBeGreaterThan(r.accounts.nonRegistered.afterTaxValue)
      expect(r.winner.key).toBeTruthy()
      expect(r.winner.afterTaxValue).toBe(r.accounts[r.winner.key].afterTaxValue)
    })
  }
})
