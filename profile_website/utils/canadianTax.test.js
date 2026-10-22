import { describe, expect, it } from 'vitest'
import {
  calculateTax,
  federalBpa,
  getTaxYearData,
  ontarioHealthPremium,
  TAX_YEAR_OPTIONS
} from './canadianTax.js'

const salaryScenario = (province, salary) => ({
  province,
  salary,
  interest: 0,
  eligibleDividend: 0,
  nonEligibleDividend: 0,
  capitalGains: 0,
  rentalIncome: 0,
  rentalExpenses: 0,
  rrsp: 0
})

const r2026 = (province, salary) => calculateTax(salaryScenario(province, salary), 2026)

/** Expected 2026 employee results from the T4127/T1 engine (rounded to cents). */
const SNAPSHOTS = {
  BC: {
    30000: { after: 26254.38, fed: 1397.38, prov: 282.5, cpp: 1576.75, ei: 489, qpip: 0 },
    60000: { after: 47754.57, fed: 5338.29, prov: 2567.39, cpp: 3361.75, ei: 978, qpip: 0 },
    100000: { after: 75373.36, fed: 13301.6, prov: 5555.52, cpp: 4646.45, ei: 1123.07, qpip: 0 },
    150000: { after: 107376.56, fed: 25302.14, prov: 11551.78, cpp: 4646.45, ei: 1123.07, qpip: 0 },
    250000: { after: 163226.86, fed: 53524.01, prov: 27479.61, cpp: 4646.45, ei: 1123.07, qpip: 0 }
  },
  ON: {
    30000: { after: 25482.14, fed: 1397.38, prov: 1054.74, cpp: 1576.75, ei: 489, qpip: 0, ohp: 300 },
    60000: { after: 47339.75, fed: 5338.29, prov: 2982.2, cpp: 3361.75, ei: 978, qpip: 0, ohp: 600 },
    100000: { after: 74206.13, fed: 13301.6, prov: 6722.75, cpp: 4646.45, ei: 1123.07, qpip: 0, ohp: 750 },
    150000: { after: 104319.89, fed: 25302.14, prov: 14608.45, cpp: 4646.45, ei: 1123.07, qpip: 0, ohp: 750 },
    250000: { after: 156545.59, fed: 53524.01, prov: 34160.89, cpp: 4646.45, ei: 1123.07, qpip: 0, ohp: 900 }
  },
  AB: {
    30000: { after: 26123.65, fed: 1397.38, prov: 413.22, cpp: 1576.75, ei: 489, qpip: 0 },
    60000: { after: 47690.65, fed: 5338.29, prov: 2631.3, cpp: 3361.75, ei: 978, qpip: 0 },
    100000: { after: 74458.5, fed: 13301.6, prov: 6470.38, cpp: 4646.45, ei: 1123.07, qpip: 0 },
    150000: { after: 107457.96, fed: 25302.14, prov: 11470.38, cpp: 4646.45, ei: 1123.07, qpip: 0 },
    250000: { after: 166685.59, fed: 53524.01, prov: 24020.88, cpp: 4646.45, ei: 1123.07, qpip: 0 }
  },
  QC: {
    30000: { after: 25621.71, fed: 1152.46, prov: 1037.33, cpp: 1669.5, ei: 390, qpip: 129 },
    60000: { after: 45893.08, fed: 4427.35, prov: 5082.07, cpp: 3559.5, ei: 780, qpip: 258 },
    100000: { after: 70298.26, fed: 11054.06, prov: 12426.68, cpp: 4895.3, ei: 895.7, qpip: 430 },
    150000: { after: 98565.46, fed: 21073, prov: 24127.64, cpp: 4895.3, ei: 895.7, qpip: 442.9 },
    250000: { after: 149250.2, fed: 44638.26, prov: 49877.64, cpp: 4895.3, ei: 895.7, qpip: 442.9 }
  }
}

function expectClose (actual, expected, digits = 2) {
  expect(Number(actual.toFixed(digits))).toBe(expected)
}

describe('2026 employee snapshots by province and income', () => {
  for (const province of Object.keys(SNAPSHOTS)) {
    for (const [income, expected] of Object.entries(SNAPSHOTS[province])) {
      it(`${province} $${Number(income).toLocaleString('en-CA')}`, () => {
        const r = r2026(province, Number(income))
        expectClose(r.afterTaxIncome, expected.after)
        expectClose(r.federalTax, expected.fed)
        expectClose(r.provincialTax, expected.prov)
        expectClose(r.cpp, expected.cpp)
        expectClose(r.ei, expected.ei)
        expectClose(r.qpip, expected.qpip)
        if (expected.ohp != null) expectClose(r.ontarioHealthPremium, expected.ohp)
      })
    }
  }
})

describe('edge cases 2026', () => {
  it('zero income is zero tax and payroll', () => {
    for (const p of ['BC', 'ON', 'AB', 'QC']) {
      const r = r2026(p, 0)
      expect(r.afterTaxIncome).toBe(0)
      expect(r.federalTax).toBe(0)
      expect(r.provincialTax).toBe(0)
      expect(r.cpp).toBe(0)
      expect(r.ei).toBe(0)
      expect(r.qpip).toBe(0)
      expect(r.effectiveRate).toBeNull()
    }
  })

  it('federal BPA is max below the 29% threshold and phases toward min', () => {
    const fed = getTaxYearData(2026).federal
    expect(federalBpa(181440, fed)).toBe(16452)
    expect(federalBpa(258482, fed)).toBe(14829)
    const mid = federalBpa(219961, fed)
    expect(mid).toBeGreaterThan(14829)
    expect(mid).toBeLessThan(16452)
  })

  it('CPP hits YMPE then CPP2 up to YAMPE', () => {
    const atYmpe = r2026('ON', 74600)
    expectClose(atYmpe.cpp, 4230.45)
    const atYampe = r2026('ON', 85000)
    expectClose(atYampe.cpp, 4646.45)
    const above = r2026('ON', 200000)
    expectClose(above.cpp, 4646.45)
  })

  it('EI hits the 2026 maximum at MIE', () => {
    const below = r2026('ON', 68900)
    expectClose(below.ei, 1123.07)
    const above = r2026('ON', 150000)
    expectClose(above.ei, 1123.07)
    const qc = r2026('QC', 150000)
    expectClose(qc.ei, 895.7)
    expectClose(qc.qpip, 442.9)
  })

  it('Ontario Health Premium steps', () => {
    expect(ontarioHealthPremium(20000)).toBe(0)
    expect(ontarioHealthPremium(20001)).toBeCloseTo(0.06, 5)
    expect(ontarioHealthPremium(30000)).toBe(300)
    expect(ontarioHealthPremium(75000)).toBe(750)
    expect(ontarioHealthPremium(250000)).toBe(900)
  })

  it('just below and above the first federal bracket', () => {
    const below = r2026('ON', 58523)
    const above = r2026('ON', 58524)
    expect(above.federalTax).toBeGreaterThan(below.federalTax)
    expect(above.afterTaxIncome).toBeGreaterThan(below.afterTaxIncome)
  })

  it('2024 and 2025 still calculate', () => {
    expect(TAX_YEAR_OPTIONS).toEqual([2026, 2025, 2024])
    const y25 = calculateTax(salaryScenario('ON', 75000), 2025)
    const y24 = calculateTax(salaryScenario('ON', 75000), 2024)
    expect(y25.afterTaxIncome).toBeGreaterThan(50000)
    expect(y24.afterTaxIncome).toBeGreaterThan(50000)
    expect(y25.cpp).toBeGreaterThan(0)
    expect(y24.ei).toBeGreaterThan(0)
  })
})

describe('cross-check vs published 2026 calculators (≤ $50 take-home)', () => {
  // Rounded annual take-home for a single employee, salary only.
  // Independent sources: salarycosts.com, mytaxcalculator.ca, CanPay Insights, CalcTax.ca.
  const refs = [
    { province: 'ON', salary: 30000, after: 25482, source: 'mytaxcalculator.ca' },
    { province: 'ON', salary: 60000, after: 47340, source: 'salarycosts.com / mytaxcalculator.ca' },
    { province: 'ON', salary: 75000, after: 56926, source: 'salarycosts.com / yieldmaple' },
    { province: 'ON', salary: 100000, after: 74206, source: 'salarycosts.com / CanPay Insights / OpenTaxCalculator' },
    { province: 'ON', salary: 150000, after: 104320, source: 'salarycosts.com / mytaxcalculator.ca' },
    { province: 'ON', salary: 250000, after: 156546, source: 'mytaxcalculator.ca' },
    { province: 'BC', salary: 30000, after: 26254, source: 'mytaxcalculator.ca' },
    { province: 'BC', salary: 60000, after: 47755, source: 'CalcTax.ca / mytaxcalculator.ca' },
    { province: 'BC', salary: 100000, after: 75373, source: 'CanPay Insights / CalcTax.ca' },
    { province: 'BC', salary: 150000, after: 107377, source: 'CalcTax.ca / mytaxcalculator.ca' },
    { province: 'BC', salary: 250000, after: 163227, source: 'mytaxcalculator.ca' },
    { province: 'AB', salary: 30000, after: 26124, source: 'mytaxcalculator.ca' },
    { province: 'AB', salary: 60000, after: 47691, source: 'mytaxcalculator.ca' },
    { province: 'AB', salary: 75000, after: 57362, source: 'salarycosts.com / mytaxcalculator.ca' },
    { province: 'AB', salary: 100000, after: 74459, source: 'CanPay Insights / mytaxcalculator.ca' },
    { province: 'AB', salary: 150000, after: 107458, source: 'mytaxcalculator.ca' },
    { province: 'AB', salary: 250000, after: 166686, source: 'mytaxcalculator.ca' }
  ]

  for (const row of refs) {
    it(`${row.province} $${row.salary} vs ${row.source}`, () => {
      const r = r2026(row.province, row.salary)
      expect(Math.abs(r.afterTaxIncome - row.after)).toBeLessThanOrEqual(50)
    })
  }

  it('Quebec $100k is ~$713 above CanPay because we credit base QPP/EI/QPIP provincially', () => {
    // CanPay / mytaxcalculator QC provincial tax omits non-refundable credits on base QPP, EI, and QPIP
    // (Revenu Québec TP-1.D lines). At $100k those credits are (3764.30+895.70+430)*14% = $712.60.
    const r = r2026('QC', 100000)
    const canpayTakeHome = 69585
    const delta = r.afterTaxIncome - canpayTakeHome
    expect(delta).toBeGreaterThan(700)
    expect(delta).toBeLessThan(730)
    expectClose(r.federalTax, 11054.06)
  })
})
