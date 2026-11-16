import { describe, expect, it } from 'vitest'
import { calculateTax, CANADA_PROVINCE_CODES } from './canadianTax.js'
import {
  CAPITAL_GAINS_PROVINCE,
  INCLUSION_RATE_2026,
  LAST_TRADE_DATE_2026,
  LOSS_CARRYBACK_YEARS,
  SUPERFICIAL_LOSS_WINDOW_DAYS,
  WORKED_EXAMPLE_INPUT,
  compareCapitalGains,
  harvestGainLoss,
  includedAmount,
  positionGainLoss,
  taxOnTaxableCapitalGain
} from './capitalGains.js'

const salaryOnly = (salary, extras = {}, province = 'BC') => ({
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

describe('2026 capital gains rules', () => {
  it('keeps the enacted 50% inclusion rate (2/3 increase cancelled March 2025)', () => {
    expect(INCLUSION_RATE_2026).toBe(0.5)
    expect(includedAmount(12000)).toBe(6000)
    expect(includedAmount(-4000)).toBe(-2000)
  })

  it('uses Wednesday 30 December 2026 as the last regular TSX trade that settles in 2026', () => {
    expect(LAST_TRADE_DATE_2026).toBe('2026-12-30')
    expect(SUPERFICIAL_LOSS_WINDOW_DAYS).toBe(30)
    expect(LOSS_CARRYBACK_YEARS).toBe(3)
  })
})

describe('Schedule 3 gain or loss', () => {
  it('is proceeds minus ACB minus outlays', () => {
    expect(positionGainLoss({ proceeds: 42150, acb: 30000, outlays: 150 })).toBe(12000)
    expect(harvestGainLoss({ currentValue: 16100, acb: 20000, outlays: 100 })).toBe(-4000)
  })

  it('can be a loss when ACB plus outlays exceed proceeds', () => {
    expect(positionGainLoss({ proceeds: 8000, acb: 10000, outlays: 50 })).toBe(-2050)
  })
})

describe('tax on the taxable capital gain reuses the Canadian tax calculator', () => {
  it('equals tax(income + taxable gain) − tax(income) via calculateTax', () => {
    const income = 95000
    const taxable = 6000
    const base = calculateTax(salaryOnly(income), 2026)
    const withGain = calculateTax(salaryOnly(income, { interest: taxable }), 2026)
    expect(taxOnTaxableCapitalGain(income, taxable)).toBeCloseTo(withGain.totalTax - base.totalTax, 2)
    expect(base.totalTax).toBeGreaterThan(0)
  })

  it('matches passing twice the taxable amount as capitalGains (engine 50% inclusion)', () => {
    const income = 95000
    const taxable = 6000
    const viaInterest = calculateTax(salaryOnly(income, { interest: taxable }), 2026)
    const viaGains = calculateTax(salaryOnly(income, { capitalGains: taxable / INCLUSION_RATE_2026 }), 2026)
    expect(viaInterest.totalTax).toBeCloseTo(viaGains.totalTax, 2)
    expect(viaGains.taxableIncome - calculateTax(salaryOnly(income), 2026).taxableIncome).toBeCloseTo(taxable, 2)
  })

  it('does not change CPP or EI when the extra amount is a capital gain', () => {
    const base = calculateTax(salaryOnly(95000), 2026)
    const withGain = calculateTax(salaryOnly(95000, { interest: 6000 }), 2026)
    expect(withGain.cpp).toBe(base.cpp)
    expect(withGain.ei).toBe(base.ei)
    expect(withGain.totalTax).toBeGreaterThan(base.totalTax)
  })

  it('returns 0 when there is no taxable capital gain', () => {
    expect(taxOnTaxableCapitalGain(95000, 0)).toBe(0)
    expect(taxOnTaxableCapitalGain(95000, -1000)).toBe(0)
  })
})

describe('compareCapitalGains math', () => {
  it('nets multiple sold positions before applying the inclusion rate', () => {
    const r = compareCapitalGains({
      ...WORKED_EXAMPLE_INPUT,
      harvestIncluded: false,
      positions: [
        { id: 'a', label: 'Winner', proceeds: 20000, acb: 10000, outlays: 0 },
        { id: 'b', label: 'Loser', proceeds: 5000, acb: 7000, outlays: 0 }
      ]
    })
    expect(r.withoutHarvest.capitalGainOrLoss).toBe(8000)
    expect(r.withoutHarvest.taxableCapitalGain).toBe(4000)
  })

  it('applies net capital losses of other years against the taxable capital gain only', () => {
    const r = compareCapitalGains({
      ...WORKED_EXAMPLE_INPUT,
      harvestIncluded: false,
      netCapitalLossesCF: 2500
    })
    expect(r.withoutHarvest.taxableBeforeCarryforward).toBe(6000)
    expect(r.withoutHarvest.appliedCarryforward).toBe(2500)
    expect(r.withoutHarvest.taxableCapitalGain).toBe(3500)
    expect(r.withoutHarvest.unusedCarryforward).toBe(0)
    expect(r.withoutHarvest.tax).toBe(taxOnTaxableCapitalGain(95000, 3500))
  })

  it('does not apply more carry-forward than this year’s taxable capital gain', () => {
    const r = compareCapitalGains({
      ...WORKED_EXAMPLE_INPUT,
      harvestIncluded: false,
      netCapitalLossesCF: 20000
    })
    expect(r.withoutHarvest.appliedCarryforward).toBe(6000)
    expect(r.withoutHarvest.taxableCapitalGain).toBe(0)
    expect(r.withoutHarvest.unusedCarryforward).toBe(14000)
    expect(r.withoutHarvest.tax).toBe(0)
  })

  it('harvesting a $4,000 loss cuts the $12,000 gain to $8,000 and saves tax now', () => {
    const r = compareCapitalGains(WORKED_EXAMPLE_INPUT)
    expect(r.withoutHarvest.capitalGainOrLoss).toBe(12000)
    expect(r.withHarvest.capitalGainOrLoss).toBe(8000)
    expect(r.withHarvest.taxableCapitalGain).toBe(4000)
    expect(r.taxSavedNow).toBeCloseTo(r.withoutHarvest.tax - r.withHarvest.tax, 2)
    expect(r.taxSavedNow).toBeGreaterThan(0)
    expect(r.withHarvest.tax).toBeLessThan(r.withoutHarvest.tax)
  })

  it('after-tax proceeds are net proceeds minus the tax on the taxable gain', () => {
    const r = compareCapitalGains(WORKED_EXAMPLE_INPUT)
    expect(r.withoutHarvest.afterTaxProceeds).toBeCloseTo(
      r.withoutHarvest.totalNetProceeds - r.withoutHarvest.tax,
      2
    )
    expect(r.withHarvest.afterTaxProceeds).toBeCloseTo(
      r.withHarvest.totalNetProceeds - r.withHarvest.tax,
      2
    )
    expect(r.withHarvest.totalNetProceeds).toBeGreaterThan(r.withoutHarvest.totalNetProceeds)
  })

  it('warns about the 30-day superficial-loss rule when a harvest loss is included', () => {
    const r = compareCapitalGains(WORKED_EXAMPLE_INPUT)
    expect(r.warnings.some((w) => w.includes('Superficial-loss'))).toBe(true)
    expect(r.warnings.some((w) => w.includes('TFSA or RRSP'))).toBe(true)
  })

  it('does not show the superficial-loss warning when harvest is turned off', () => {
    const r = compareCapitalGains({ ...WORKED_EXAMPLE_INPUT, harvestIncluded: false })
    expect(r.warnings.some((w) => w.includes('Superficial-loss'))).toBe(false)
    expect(r.withHarvest.tax).toBe(r.withoutHarvest.tax)
    expect(r.taxSavedNow).toBe(0)
  })

  it('notes carry-back / carry-forward when harvesting produces a net capital loss', () => {
    const r = compareCapitalGains({
      ...WORKED_EXAMPLE_INPUT,
      harvest: [{ id: 'big', label: 'Loser', currentValue: 5000, acb: 25000, outlays: 0 }]
    })
    expect(r.withHarvest.capitalGainOrLoss).toBe(-8000)
    expect(r.withHarvest.taxableCapitalGain).toBe(0)
    expect(r.withHarvest.netCapitalLossForCarry).toBe(4000)
    expect(r.leftoverAllowableLoss).toBe(4000)
    expect(r.warnings.some((w) => w.includes('Form T1A'))).toBe(true)
  })

  it('clamps negative money inputs and defaults the province to BC', () => {
    const r = compareCapitalGains({
      province: 'xx',
      income: -10,
      netCapitalLossesCF: -5,
      harvestIncluded: false,
      positions: [{ proceeds: -1, acb: -2, outlays: -3 }]
    })
    expect(r.province).toBe(CAPITAL_GAINS_PROVINCE)
    expect(r.income).toBe(0)
    expect(r.netCapitalLossesCF).toBe(0)
    expect(r.positions[0].proceeds).toBe(0)
    expect(r.positions[0].acb).toBe(0)
    expect(r.positions[0].outlays).toBe(0)
  })
})

describe('worked example snapshot: BC $95k, $12,000 ETF gain, $4,000 bank-stock harvest', () => {
  it('locks the numbers used in the companion post', () => {
    const r = compareCapitalGains(WORKED_EXAMPLE_INPUT)
    expect(r.province).toBe('BC')
    expect(r.inclusionRate).toBe(0.5)
    expect(r.positions[0].gainLoss).toBe(12000)
    expect(r.harvest[0].gainLoss).toBe(-4000)
    expect(r.withoutHarvest.taxableCapitalGain).toBe(6000)
    expect(r.withHarvest.taxableCapitalGain).toBe(4000)
    expect(r.withoutHarvest.tax).toBe(taxOnTaxableCapitalGain(95000, 6000))
    expect(r.withHarvest.tax).toBe(taxOnTaxableCapitalGain(95000, 4000))
    expect(r.withoutHarvest.tax).toBe(1692)
    expect(r.withHarvest.tax).toBe(1128)
    expect(r.taxSavedNow).toBe(564)
    expect(r.withoutHarvest.afterTaxProceeds).toBe(40308)
    expect(r.withHarvest.afterTaxProceeds).toBe(56872)
    expect(r.withoutHarvest.marginalRateOnIncluded).toBeCloseTo(0.282, 3)
    expect(r.withHarvest.marginalRateOnIncluded).toBeCloseTo(0.282, 3)
  })
})

describe('province selection changes the tax on the same gain', () => {
  it('defaults to BC', () => {
    expect(CAPITAL_GAINS_PROVINCE).toBe('BC')
    expect(compareCapitalGains(WORKED_EXAMPLE_INPUT).province).toBe('BC')
  })

  it('Ontario and Alberta do not match the BC tax on the $12,000 gain', () => {
    const bc = compareCapitalGains({ ...WORKED_EXAMPLE_INPUT, province: 'BC' })
    const on = compareCapitalGains({ ...WORKED_EXAMPLE_INPUT, province: 'ON' })
    const ab = compareCapitalGains({ ...WORKED_EXAMPLE_INPUT, province: 'AB' })
    expect(on.withoutHarvest.tax).not.toBe(bc.withoutHarvest.tax)
    expect(ab.withoutHarvest.tax).not.toBe(bc.withoutHarvest.tax)
    expect(on.taxSavedNow).toBeGreaterThan(0)
    expect(ab.taxSavedNow).toBeGreaterThan(0)
    expect(on.withoutHarvest.tax).toBe(1823.09)
    expect(on.taxSavedNow).toBe(629.6)
    expect(ab.withoutHarvest.tax).toBe(1830)
    expect(ab.taxSavedNow).toBe(610)
  })

  for (const province of CANADA_PROVINCE_CODES) {
    it(`${province} $95k / $12,000 gain: tax, harvest savings, and after-tax sanity`, () => {
      const r = compareCapitalGains({ ...WORKED_EXAMPLE_INPUT, province })
      expect(r.province).toBe(province)
      expect(r.withoutHarvest.taxableCapitalGain).toBe(6000)
      expect(r.withHarvest.taxableCapitalGain).toBe(4000)
      expect(r.withoutHarvest.tax).toBeGreaterThan(0)
      expect(r.withHarvest.tax).toBeGreaterThan(0)
      expect(r.withHarvest.tax).toBeLessThan(r.withoutHarvest.tax)
      expect(r.taxSavedNow).toBeCloseTo(r.withoutHarvest.tax - r.withHarvest.tax, 2)
      expect(r.withoutHarvest.afterTaxProceeds).toBeLessThan(r.withoutHarvest.totalNetProceeds)
      expect(r.warnings.some((w) => w.includes('Superficial-loss'))).toBe(true)
    })
  }
})
