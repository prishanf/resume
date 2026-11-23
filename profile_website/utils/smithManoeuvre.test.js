import { describe, expect, it } from 'vitest'
import { CANADA_PROVINCE_CODES, calculateTax } from './canadianTax.js'
import { amortizingPayment, equivalentPeriodicRate } from './mortgageRenewal.js'
import {
  CANADA_SMITH_PROVINCE_CODES,
  SMITH_PROVINCE,
  SMITH_TAX_YEAR,
  WORKED_EXAMPLE,
  WORKED_EXAMPLE_RESULT,
  afterTaxBorrowCost,
  deductionMarginalRate,
  interestTaxRefund,
  projectSmithManoeuvre,
  taxOnEligibleDividends
} from './smithManoeuvre.js'

const salaryOnly = (salary, extras = {}, province = 'ON') => ({
  province,
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

const exampleInput = { ...WORKED_EXAMPLE }

describe('tax refund reuses the Canadian tax calculator', () => {
  it('equals tax(income) minus tax(income reduced by deductible interest) for Ontario $110k', () => {
    const interest = 8000
    const without = calculateTax(salaryOnly(110000, {}, 'ON'), 2026)
    const withDeduction = calculateTax(salaryOnly(110000, { rrsp: interest }, 'ON'), 2026)
    const expected = without.totalTax - withDeduction.totalTax
    expect(interestTaxRefund(110000, 8000, 2026, 'ON')).toBeCloseTo(expected, 2)
    expect(withDeduction.cpp).toBe(without.cpp)
    expect(withDeduction.ei).toBe(without.ei)
  })

  it('does not invent its own brackets — the refund is a calculateTax() totalTax delta', () => {
    const scenario = salaryOnly(110000, {}, 'ON')
    const deducted = salaryOnly(110000, { rrsp: 1000 }, 'ON')
    expect(interestTaxRefund(110000, 1000, 2026, 'ON')).toBeCloseTo(
      calculateTax(scenario, 2026).totalTax - calculateTax(deducted, 2026).totalTax,
      2
    )
  })

  it('zero interest produces a zero refund', () => {
    expect(interestTaxRefund(110000, 0, 2026, 'ON')).toBe(0)
    expect(interestTaxRefund(110000, -50, 2026, 'ON')).toBe(0)
  })

  it('eligible-dividend and capital-gains helpers match calculateTax deltas', () => {
    const base = calculateTax(salaryOnly(110000, {}, 'ON'), 2026)
    const withDiv = calculateTax(salaryOnly(110000, { eligibleDividend: 2000 }, 'ON'), 2026)
    const withGain = calculateTax(salaryOnly(110000, { capitalGains: 10000 }, 'ON'), 2026)
    expect(taxOnEligibleDividends(110000, 2000, 2026, 'ON')).toBeCloseTo(withDiv.totalTax - base.totalTax, 2)
    expect(withGain.totalTax - base.totalTax).toBeGreaterThan(0)
    expect(withGain.taxableIncome - base.taxableIncome).toBeCloseTo(5000, 2)
  })
})

describe('after-tax cost of borrowing', () => {
  it('is HELOC rate times (1 − marginal deduction rate)', () => {
    const m = deductionMarginalRate(110000, 2026, 'ON')
    expect(m).toBeGreaterThan(0.25)
    expect(m).toBeLessThan(0.5)
    expect(afterTaxBorrowCost(0.057, m)).toBeCloseTo(0.057 * (1 - m), 6)
  })
})

describe('projectSmithManoeuvre math', () => {
  it('uses Canadian semi-annual compounding for the mortgage payment', () => {
    const r = projectSmithManoeuvre(exampleInput)
    const periodic = equivalentPeriodicRate(0.0449, 12)
    const pmt = amortizingPayment(500000, periodic, 300)
    expect(r.current.mortgagePayment).toBeCloseTo(pmt, 2)
    expect(r.payment).toBeCloseTo(pmt, 2)
  })

  it('re-borrows (approximately) the principal repaid each year when uncapped', () => {
    const r = projectSmithManoeuvre(exampleInput)
    const year1 = r.schedule[0]
    expect(year1.reborrowed).toBeGreaterThan(0)
    expect(year1.reborrowed).toBeCloseTo(year1.principalRepaid, 0)
    expect(r.debt.heloc).toBeCloseTo(r.totals.reborrowed, 0)
  })

  it('caps the HELOC at the stated limit', () => {
    const r = projectSmithManoeuvre({ ...exampleInput, helocLimit: 25000, years: 15 })
    expect(r.debt.heloc).toBeLessThanOrEqual(25000 + 0.05)
    expect(r.totals.reborrowed).toBeLessThanOrEqual(25000 + 0.05)
  })

  it('respects an annual re-borrow cap', () => {
    const r = projectSmithManoeuvre({ ...exampleInput, annualReborrow: 5000, years: 5 })
    for (const row of r.schedule) {
      expect(row.reborrowed).toBeLessThanOrEqual(5000 + 0.05)
    }
    expect(r.totals.reborrowed).toBeLessThanOrEqual(5 * 5000 + 0.5)
  })

  it('lump-sum mode borrows once up to the HELOC limit and does not re-borrow principal', () => {
    const r = projectSmithManoeuvre({
      ...exampleInput,
      borrowMode: 'lump-sum',
      lumpSum: 80000,
      helocLimit: 60000,
      years: 5
    })
    expect(r.totals.reborrowed).toBeCloseTo(60000, 2)
    expect(r.debt.heloc).toBeCloseTo(60000, 2)
    expect(r.schedule[0].reborrowed).toBe(0)
    expect(r.schedule[1].reborrowed).toBe(0)
  })

  it('each year’s tax refund matches interestTaxRefund on that year’s deductible interest', () => {
    const r = projectSmithManoeuvre(exampleInput)
    for (const row of r.schedule) {
      const expected = interestTaxRefund(110000, row.deductibleInterest, 2026, 'ON')
      expect(row.taxRefund).toBeCloseTo(expected, 2)
    }
  })

  it('reinvesting the refund leaves the mortgage on the original schedule (same as plain)', () => {
    const r = projectSmithManoeuvre({ ...exampleInput, refundUse: 'reinvest' })
    expect(r.debt.smithMortgage).toBeCloseTo(r.debt.plainMortgage, 0)
    expect(r.payoff.yearsSaved).toBe(0)
    expect(r.payoff.fasterBecausePrepay).toBe(false)
  })

  it('using the refund as a prepayment pays the non-deductible mortgage down faster', () => {
    const reinvest = projectSmithManoeuvre({ ...exampleInput, refundUse: 'reinvest' })
    const prepay = projectSmithManoeuvre({ ...exampleInput, refundUse: 'prepay' })
    expect(prepay.debt.smithMortgage).toBeLessThan(reinvest.debt.smithMortgage - 100)
    expect(prepay.totals.extraPrincipal).toBeGreaterThan(0)
    expect(prepay.payoff.fasterBecausePrepay).toBe(true)
    expect(prepay.payoff.yearsSaved).toBeGreaterThan(0)
    expect(prepay.debt.heloc).toBeGreaterThan(reinvest.debt.heloc)
  })

  it('net-worth advantage is after-tax portfolio minus extra HELOC, holding the house constant', () => {
    const r = projectSmithManoeuvre(exampleInput)
    const expected = r.portfolio.afterTaxValue - r.debt.heloc - r.debt.smithMortgage + r.debt.plainMortgage
    expect(r.netWorth.advantage).toBeCloseTo(expected, 2)
  })

  it('after-tax portfolio is market value minus capital-gains tax on the unrealized gain', () => {
    const r = projectSmithManoeuvre(exampleInput)
    const base = calculateTax(salaryOnly(110000, {}, 'ON'), 2026)
    const withGain = calculateTax(salaryOnly(110000, { capitalGains: r.portfolio.unrealizedGain }, 'ON'), 2026)
    const cg = withGain.totalTax - base.totalTax
    expect(r.totals.capitalGainsTax).toBeCloseTo(cg, 2)
    expect(r.portfolio.afterTaxValue).toBeCloseTo(r.portfolio.marketValue - cg, 2)
  })

  it('break-even return is the after-tax cost of the HELOC', () => {
    const r = projectSmithManoeuvre(exampleInput)
    expect(r.tax.breakEvenReturn).toBeCloseTo(
      afterTaxBorrowCost(0.057, r.tax.marginalRate),
      6
    )
    expect(r.tax.breakEvenReturnPct).toBeCloseTo(r.tax.breakEvenReturn * 100, 2)
  })

  it('zero income / zero HELOC / zero years-of-amort still run', () => {
    const zeroIncome = projectSmithManoeuvre({ ...exampleInput, income: 0 })
    expect(zeroIncome.totals.taxRefund).toBe(0)
    expect(zeroIncome.warnings.some((w) => /income is \$0/i.test(w))).toBe(true)

    const zeroHeloc = projectSmithManoeuvre({ ...exampleInput, helocLimit: 0 })
    expect(zeroHeloc.totals.reborrowed).toBe(0)
    expect(zeroHeloc.debt.heloc).toBe(0)

    const zeroMortgage = projectSmithManoeuvre({ ...exampleInput, mortgageBalance: 0 })
    expect(zeroMortgage.payment).toBe(0)
    expect(zeroMortgage.debt.smithMortgage).toBe(0)
  })

  it('growth-only (0% yield) warns that CRA may deny the interest deduction', () => {
    const r = projectSmithManoeuvre({ ...exampleInput, dividendYieldPct: 0, growthPct: 7 })
    expect(r.warnings.some((w) => /capital gains/i.test(w))).toBe(true)
  })

  it('defaults to Ontario and 15 years of schedule rows', () => {
    expect(SMITH_PROVINCE).toBe('ON')
    expect(SMITH_TAX_YEAR).toBe(2026)
    const r = projectSmithManoeuvre(exampleInput)
    expect(r.province).toBe('ON')
    expect(r.schedule).toHaveLength(15)
    expect(r.projectionYears).toBe(15)
  })

  it('ignores an unknown province code', () => {
    const r = projectSmithManoeuvre({ ...exampleInput, province: 'xx' })
    expect(r.province).toBe('ON')
  })
})

describe('Canada-wide: every province and territory is accepted', () => {
  it('exports the same 13 codes as the tax engine', () => {
    expect(CANADA_SMITH_PROVINCE_CODES).toEqual(CANADA_PROVINCE_CODES)
    expect(CANADA_SMITH_PROVINCE_CODES).toHaveLength(13)
  })

  for (const province of CANADA_PROVINCE_CODES) {
    it(`${province} uses the same mortgage payment as Ontario and a province-specific refund`, () => {
      const on = projectSmithManoeuvre({ ...exampleInput, province: 'ON', years: 3 })
      const other = projectSmithManoeuvre({ ...exampleInput, province, years: 3 })
      expect(other.province).toBe(province)
      expect(other.payment).toBe(on.payment)
      expect(other.schedule[0].reborrowed).toBeCloseTo(on.schedule[0].reborrowed, 2)
      const expectedRefund = interestTaxRefund(
        110000,
        other.schedule[0].deductibleInterest,
        2026,
        province
      )
      expect(other.schedule[0].taxRefund).toBeCloseTo(expectedRefund, 2)
      if (province !== 'ON') {
        expect(other.schedule[0].taxRefund).not.toBe(on.schedule[0].taxRefund)
      }
    })
  }
})

describe('worked example snapshot used in the companion post', () => {
  it('locks the Ontario $110k / $500k / 15-year scenario', () => {
    const r = WORKED_EXAMPLE_RESULT
    const y1 = r.schedule[0]
    const y15 = r.schedule[14]

    expect(r.province).toBe('ON')
    expect(r.income).toBe(110000)
    expect(r.current.mortgageStart).toBe(500000)
    expect(r.schedule).toHaveLength(15)

    expect(r.payment).toBe(2764.59)

    expect(y1.principalRepaid).toBe(11157.88)
    expect(y1.reborrowed).toBe(11157.88)
    expect(y1.deductibleInterest).toBe(289.17)
    expect(y1.taxRefund).toBe(98.01)
    expect(y1.mortgageEnd).toBe(488842.13)
    expect(y1.helocEnd).toBe(11157.87)

    expect(y15.deductibleInterest).toBe(12612.82)
    expect(y15.taxRefund).toBe(3974.74)
    expect(y15.mortgageEnd).toBe(267392.22)
    expect(y15.helocEnd).toBe(232607.78)
    expect(y15.portfolioEnd).toBe(410003.04)

    expect(r.totals.deductibleInterest).toBe(87929.82)
    expect(r.totals.taxRefund).toBe(28028.18)
    expect(r.totals.reborrowed).toBe(232607.78)
    expect(r.portfolio.marketValue).toBe(410003.04)
    expect(r.portfolio.afterTaxValue).toBe(391730.41)
    expect(r.debt.smithMortgage).toBe(267392.22)
    expect(r.debt.plainMortgage).toBe(267392.22)
    expect(r.debt.heloc).toBe(232607.78)
    expect(r.netWorth.advantage).toBe(159122.63)
    expect(r.tax.marginalRatePct).toBe(33.892)
    expect(r.tax.breakEvenReturnPct).toBeCloseTo(3.77, 2)
    expect(r.payoff.yearsSaved).toBe(0)
  })
})
