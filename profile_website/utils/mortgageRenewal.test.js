import { describe, expect, it } from 'vitest'
import { CANADA_PROVINCE_CODES } from './canadianTax.js'
import {
  CANADA_MORTGAGE_PROVINCE_CODES,
  CONDO_FEE_GDS_SHARE,
  DEFAULT_RENEWAL_OFFERS,
  GDS_LIMIT,
  MORTGAGE_RENEWAL_PROVINCE,
  MQR_BUFFER,
  MQR_FLOOR,
  TDS_LIMIT,
  WORKED_EXAMPLE_AT_RENEWAL,
  WORKED_EXAMPLE_ORIGINATION,
  amortizingPayment,
  balanceAfterElapsedYears,
  compareMortgageRenewal,
  equivalentPeriodicRate,
  minimumQualifyingRate,
  monthlyEquivalent,
  paymentsPerYear,
  periodsForPayment,
  remainingBalanceAfterPayments
} from './mortgageRenewal.js'

const exampleInput = { ...WORKED_EXAMPLE_AT_RENEWAL }

describe('Canadian compounding and payment formula', () => {
  it('uses semi-annual compounding (Interest Act), not annual/12', () => {
    const canadian = equivalentPeriodicRate(0.05, 12)
    const naive = 0.05 / 12
    expect(canadian).toBeCloseTo(Math.pow(1.025, 1 / 6) - 1, 12)
    expect(canadian).toBeLessThan(naive)
  })

  it('matches a known $300,000 / 5% / 25-year monthly payment', () => {
    const r = equivalentPeriodicRate(0.05, 12)
    const pmt = amortizingPayment(300000, r, 300)
    expect(pmt).toBeCloseTo(1744.81, 2)
  })

  it('zero rate splits the balance evenly', () => {
    expect(amortizingPayment(120000, 0, 24)).toBe(5000)
    expect(equivalentPeriodicRate(0, 12)).toBe(0)
  })

  it('remaining balance after all payments is ~0', () => {
    const r = equivalentPeriodicRate(0.0199, 12)
    const n = 300
    const pmt = amortizingPayment(500000, r, n)
    const left = remainingBalanceAfterPayments(500000, r, pmt, n)
    expect(left).toBeLessThan(0.02)
  })

  it('periodsForPayment inverts amortizingPayment', () => {
    const r = equivalentPeriodicRate(0.0439, 12)
    const pmt = amortizingPayment(415000, r, 240)
    const n = periodsForPayment(415000, r, pmt)
    expect(n).toBeCloseTo(240, 6)
  })

  it('returns Infinity when the payment does not cover interest', () => {
    const r = equivalentPeriodicRate(0.08, 12)
    expect(periodsForPayment(400000, r, 100)).toBe(Infinity)
  })

  it('monthlyEquivalent converts weekly and bi-weekly to a monthly cash figure', () => {
    expect(monthlyEquivalent(600, 'weekly')).toBeCloseTo(2600, 6)
    expect(monthlyEquivalent(1200, 'biweekly')).toBeCloseTo(2600, 6)
    expect(monthlyEquivalent(2000, 'monthly')).toBe(2000)
  })

  it('paymentsPerYear falls back to monthly', () => {
    expect(paymentsPerYear('weekly')).toBe(52)
    expect(paymentsPerYear('nope')).toBe(12)
  })
})

describe('OSFI / CMHC qualification constants', () => {
  it('MQR is the greater of contract + 2% or 5.25%', () => {
    expect(MQR_FLOOR).toBe(0.0525)
    expect(MQR_BUFFER).toBe(0.02)
    expect(minimumQualifyingRate(0.02)).toBeCloseTo(0.0525, 10)
    expect(minimumQualifyingRate(0.0439)).toBeCloseTo(0.0639, 10)
    expect(minimumQualifyingRate(0.05)).toBeCloseTo(0.07, 10)
  })

  it('uses CMHC GDS 39% / TDS 44% and 50% of condo fees', () => {
    expect(GDS_LIMIT).toBe(0.39)
    expect(TDS_LIMIT).toBe(0.44)
    expect(CONDO_FEE_GDS_SHARE).toBe(0.5)
  })
})

describe('2021 origination rolled forward to a 2026 renewal', () => {
  it('after 5 years of a $500k / 1.99% / 25-year monthly mortgage, ~20 years remain', () => {
    const elapsed = balanceAfterElapsedYears({
      originalBalance: WORKED_EXAMPLE_ORIGINATION.originalBalance,
      annualRate: WORKED_EXAMPLE_ORIGINATION.originalRatePct / 100,
      originalAmortYears: WORKED_EXAMPLE_ORIGINATION.originalAmortYears,
      elapsedYears: WORKED_EXAMPLE_ORIGINATION.elapsedYears,
      paymentFreq: 'monthly'
    })
    expect(elapsed.remainingAmortYears).toBe(20)
    expect(elapsed.remainingPeriods).toBe(240)
    expect(elapsed.balance).toBeGreaterThan(400000)
    expect(elapsed.balance).toBeLessThan(470000)
    expect(WORKED_EXAMPLE_AT_RENEWAL.remainingBalance).toBe(elapsed.balance)
    expect(WORKED_EXAMPLE_AT_RENEWAL.currentRatePct).toBe(1.99)
  })
})

describe('compareMortgageRenewal math', () => {
  it('computes payment shock in dollars and percent versus the current payment', () => {
    const r = compareMortgageRenewal(exampleInput)
    const fiveYear = r.offers.find((o) => o.id === 'a')
    expect(fiveYear.contractualPayment).toBeGreaterThan(r.current.payment)
    expect(fiveYear.paymentShock.dollars).toBeCloseTo(
      fiveYear.contractualPayment - r.current.payment,
      2
    )
    expect(fiveYear.paymentShock.percentPts).toBeGreaterThan(20)
  })

  it('interest over the term plus end balance ties back to start balance and payments', () => {
    const r = compareMortgageRenewal({ ...exampleInput, extraPerPeriod: 0, lumpSum: 0 })
    const offer = r.offers[0]
    const paid = offer.contractualPayment * offer.termPeriods
    const principalPaid = r.current.startBalance - offer.endBalance
    expect(principalPaid + offer.interestOverTerm).toBeCloseTo(paid, 1)
    expect(offer.endBalance).toBeGreaterThan(0)
    expect(offer.endBalance).toBeLessThan(r.current.startBalance)
  })

  it('a lump sum lowers the new payment, term interest, and end balance', () => {
    const base = compareMortgageRenewal({ ...exampleInput, lumpSum: 0 })
    const withLump = compareMortgageRenewal({ ...exampleInput, lumpSum: 20000 })
    expect(withLump.current.startBalance).toBeCloseTo(base.current.startBalance - 20000, 2)
    expect(withLump.offers[0].contractualPayment).toBeLessThan(base.offers[0].contractualPayment)
    expect(withLump.offers[0].interestOverTerm).toBeLessThan(base.offers[0].interestOverTerm)
    expect(withLump.offers[0].endBalance).toBeLessThan(base.offers[0].endBalance)
  })

  it('extra per-period payments cut term interest and end balance without changing the contractual P&I', () => {
    const base = compareMortgageRenewal({ ...exampleInput, extraPerPeriod: 0 })
    const extra = compareMortgageRenewal({ ...exampleInput, extraPerPeriod: 250 })
    expect(extra.offers[0].contractualPayment).toBeCloseTo(base.offers[0].contractualPayment, 2)
    expect(extra.offers[0].interestOverTerm).toBeLessThan(base.offers[0].interestOverTerm)
    expect(extra.offers[0].endBalance).toBeLessThan(base.offers[0].endBalance)
    expect(extra.offers[0].extraPaidOverTerm).toBeGreaterThan(0)
  })

  it('keep-payment-the-same extends amortization and costs extra interest', () => {
    const r = compareMortgageRenewal(exampleInput)
    const keep = r.offers[0].keepPaymentSame
    expect(keep.possible).toBe(true)
    expect(keep.extendedAmortYears).toBeGreaterThan(r.current.remainingAmortYears)
    expect(keep.extraInterestToPayoff).toBeGreaterThan(0)
    expect(keep.endBalanceAfterTerm).toBeGreaterThan(r.offers[0].endBalance)
    expect(keep.triggersRequalification).toBe(true)
    expect(keep.payment).toBeCloseTo(r.current.payment, 2)
  })

  it('keep-payment-the-same is unnecessary when the new rate is at or below the current rate', () => {
    const r = compareMortgageRenewal({
      ...exampleInput,
      offers: [{ id: 'a', label: 'Same rate', ratePct: 1.99, termYears: 5, type: 'fixed' }]
    })
    expect(r.offers[0].keepPaymentSame.possible).toBe(false)
    expect(r.offers[0].keepPaymentSame.alreadyCovered).toBe(true)
  })

  it('stress-test GDS includes P&I at the MQR plus tax, heat, and half of condo fees', () => {
    const r = compareMortgageRenewal({
      ...exampleInput,
      grossAnnualIncome: 120000,
      monthlyDebts: 600,
      annualPropertyTax: 4800,
      monthlyHeating: 150,
      monthlyCondoFees: 400
    })
    const offer = r.offers[0]
    const mqr = minimumQualifyingRate(offer.ratePct / 100)
    const qRate = equivalentPeriodicRate(mqr, 12)
    const qPmt = amortizingPayment(r.current.startBalance, qRate, 240)
    const housing = qPmt + 4800 / 12 + 150 + 0.5 * 400
    expect(offer.stressTest.qualifyingRate).toBeCloseTo(mqr, 6)
    expect(offer.stressTest.monthlyHousingCosts).toBeCloseTo(housing, 2)
    expect(offer.stressTest.gds).toBeCloseTo(housing / (120000 / 12), 4)
    expect(offer.stressTest.tds).toBeCloseTo((housing + 600) / (120000 / 12), 4)
  })

  it('fails GDS/TDS when income is too low for the qualifying payment', () => {
    const r = compareMortgageRenewal({
      ...exampleInput,
      grossAnnualIncome: 40000,
      monthlyDebts: 800
    })
    expect(r.offers[0].stressTest.passes).toBe(false)
    expect(r.offers[0].stressTest.gdsPass).toBe(false)
  })

  it('does not require the prescribed MQR on a straight switch or same-lender renewal', () => {
    const sw = compareMortgageRenewal({ ...exampleInput, situation: 'straight-switch' })
    const stay = compareMortgageRenewal({ ...exampleInput, situation: 'same-lender' })
    expect(sw.prescribedMqrRequired).toBe(false)
    expect(stay.prescribedMqrRequired).toBe(false)
    expect(sw.applicabilityNote.toLowerCase()).toContain('21 november 2024')
  })

  it('flags the prescribed MQR when extra borrowing / longer amortization is selected', () => {
    const r = compareMortgageRenewal({ ...exampleInput, situation: 'requalify' })
    expect(r.prescribedMqrRequired).toBe(true)
  })

  it('zero balance / zero amort produce zero payments and warnings', () => {
    const zeroBal = compareMortgageRenewal({ ...exampleInput, remainingBalance: 0 })
    expect(zeroBal.current.payment).toBe(0)
    expect(zeroBal.offers[0].contractualPayment).toBe(0)

    const zeroAmort = compareMortgageRenewal({ ...exampleInput, remainingAmortYears: 0, remainingAmortMonths: 0 })
    expect(zeroAmort.current.payment).toBe(0)
    expect(zeroAmort.warnings.some((w) => /amortization/i.test(w))).toBe(true)
  })

  it('defaults to three example offers and BC', () => {
    expect(DEFAULT_RENEWAL_OFFERS).toHaveLength(3)
    expect(MORTGAGE_RENEWAL_PROVINCE).toBe('BC')
    const r = compareMortgageRenewal(exampleInput)
    expect(r.province).toBe('BC')
    expect(r.offers).toHaveLength(3)
  })

  it('caps offers at three and ignores an unknown province code', () => {
    const r = compareMortgageRenewal({
      ...exampleInput,
      province: 'xx',
      offers: [
        { id: 'a', label: 'A', ratePct: 4, termYears: 5 },
        { id: 'b', label: 'B', ratePct: 4.2, termYears: 4 },
        { id: 'c', label: 'C', ratePct: 4.5, termYears: 3 },
        { id: 'd', label: 'D', ratePct: 5, termYears: 2 }
      ]
    })
    expect(r.province).toBe('BC')
    expect(r.offers).toHaveLength(3)
  })
})

describe('worked example snapshot used in the companion post', () => {
  it('locks remaining balance, current payment, 5-year-fixed shock, and GDS/TDS', () => {
    const r = compareMortgageRenewal(exampleInput)
    const fiveYear = r.offers.find((o) => o.id === 'a')
    const threeYear = r.offers.find((o) => o.id === 'b')
    const variable = r.offers.find((o) => o.id === 'c')

    expect(r.current.remainingBalance).toBe(418762.92)
    expect(r.current.payment).toBe(2114.84)
    expect(r.current.remainingAmortYears).toBe(20)

    expect(fiveYear.contractualPayment).toBe(2615.6)
    expect(fiveYear.paymentShock.dollars).toBe(500.76)
    expect(fiveYear.paymentShock.percentPts).toBe(23.68)
    expect(fiveYear.interestOverTerm).toBe(83526.61)
    expect(fiveYear.endBalance).toBe(345353.53)

    expect(threeYear.contractualPayment).toBe(2571.71)
    expect(variable.contractualPayment).toBe(2549.9)

    expect(fiveYear.keepPaymentSame.extendedAmortYears).toBe(29.17)
    expect(fiveYear.keepPaymentSame.extraInterestToPayoff).toBe(111729.06)

    expect(fiveYear.stressTest.qualifyingRatePct).toBe(6.39)
    expect(fiveYear.stressTest.gdsPct).toBe(31.69)
    expect(fiveYear.stressTest.tdsPct).toBe(35.69)
    expect(fiveYear.stressTest.passes).toBe(true)
  })
})

describe('Canada-wide: every province and territory is accepted', () => {
  it('exports the same 13 codes as the tax engine', () => {
    expect(CANADA_MORTGAGE_PROVINCE_CODES).toEqual(CANADA_PROVINCE_CODES)
    expect(CANADA_MORTGAGE_PROVINCE_CODES).toHaveLength(13)
  })

  for (const province of CANADA_PROVINCE_CODES) {
    it(`${province} runs the same payment math as BC (federal compounding)`, () => {
      const bc = compareMortgageRenewal({ ...exampleInput, province: 'BC' })
      const other = compareMortgageRenewal({ ...exampleInput, province })
      expect(other.province).toBe(province)
      expect(other.offers[0].contractualPayment).toBe(bc.offers[0].contractualPayment)
      expect(other.offers[0].stressTest.gdsPct).toBe(bc.offers[0].stressTest.gdsPct)
      expect(other.current.payment).toBe(bc.current.payment)
    })
  }
})
