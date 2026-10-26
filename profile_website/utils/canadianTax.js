/**
 * Canadian federal and provincial tax calculator for employees.
 *
 * Models standard T1 / T4127 items for a single resident employee:
 * federal BPA (with 29–33% phase-out), Canada Employment Amount, base CPP/QPP
 * and EI (and QPIP in Quebec) non-refundable credits at the lowest rate,
 * deduction of enhanced CPP/QPP (first additional + CPP2/QPP2) from income,
 * Ontario surtax + Health Premium + tax reduction, BC low-income tax reduction,
 * Quebec QPP/QPIP, 16.5% federal abatement, and the Quebec worker deduction.
 *
 * Sources (accessed 2026-10-22; additional provinces 2026-10-26):
 * - T4127 122nd ed. (Jan 2026) and 123rd ed. (Jul 2026) payroll formulas
 * - T4032-ON / T4032-AB / T4032-BC January 2026
 * - CRA current-year T1 brackets (2026 tax return):
 *   https://www.canada.ca/en/revenue-agency/services/tax/individuals/tax-rates-brackets/current-year.html
 * - T4032-SK/MB/NB/NS/PE/NL/YT/NT/NU January 2026 (and T4032-NL / T4032-PE July 2026)
 * - CRA CPP, CPP2, EI tables
 * - gov.bc.ca personal tax rates and basic credits (2026 rate 5.60%, tax reduction $690)
 * - alberta.ca personal income tax
 * - Revenu Québec 2026 rates, QPP, QPIP, deduction for workers
 *
 * 2026 coverage: all 13 provinces and territories. The Canadian Tax Calculator UI
 * still lists only ON, BC, AB, QC (see TAX_CALCULATOR_PROVINCE_CODES). The RRSP vs
 * TFSA vs FHSA tool uses getCanadaProvincesList().
 */

export const DEFAULT_TAX_YEAR = 2026
export const TAX_YEAR_OPTIONS = [2026, 2025, 2024]

const TAX_DATA = {
  2024: {
    federal: {
      // T4032-ON Jan 2024. Lowest rate 15% for the 2024 T1.
      brackets: [[55867, 0.15], [111733, 0.205], [173205, 0.26], [246752, 0.29], [1e9, 0.33]],
      lowestRate: 0.15,
      bpaMax: 15705,
      bpaMin: 14156,
      bpaPhaseStart: 173205,
      bpaPhaseEnd: 246752,
      cea: 1433,
      quebecAbatement: 0.165,
      dividendEligibleCreditRate: 0.150198,
      dividendNonEligibleCreditRate: 0.090301,
      grossUpEligible: 1.38,
      grossUpNonEligible: 1.15
    },
    payroll: {
      // CPP: 4.95% base + 1% first additional = 5.95%. CPP2 4% YMPE–YAMPE.
      cpp: { baseRate: 0.0495, additionalRate: 0.01, ympe: 68500, yampe: 73200, exemption: 3500, cpp2Rate: 0.04 },
      ei: { rate: 0.0166, maxPremium: 1049.12, qcRate: 0.0132, qcMaxPremium: 834.24 },
      // QPP 2024: 5.40% base + 1% additional = 6.40%.
      qpp: { baseRate: 0.054, additionalRate: 0.01, ympe: 68500, yampe: 73200, exemption: 3500, qpp2Rate: 0.04 },
      qpip: { rate: 0.00494, maxEarnings: 94000, maxPremium: 464.36 }
    },
    provinces: {
      ON: {
        name: 'Ontario',
        brackets: [[51446, 0.0505], [102894, 0.0915], [150000, 0.1116], [220000, 0.1216], [1e9, 0.1316]],
        bpa: 12399, divElig: 0.1, divNon: 0.0334,
        surtax1: 5554, surtax2: 7108, taxReductionBasic: 286
      },
      BC: {
        name: 'British Columbia',
        brackets: [[47937, 0.0506], [95875, 0.077], [110076, 0.105], [133664, 0.1229], [181232, 0.147], [252752, 0.168], [1e9, 0.205]],
        bpa: 12580, divElig: 0.12, divNon: 0.02,
        // T4032-BC Jan 2024
        taxReduction: { max: 547, threshold: 24338, rate: 0.0356, zeroAt: 39703 }
      },
      AB: {
        name: 'Alberta',
        brackets: [[148269, 0.10], [177922, 0.12], [237230, 0.13], [355845, 0.14], [1e9, 0.15]],
        bpa: 21885, divElig: 0.08, divNon: 0.025
      },
      QC: {
        name: 'Quebec',
        brackets: [[51780, 0.14], [103545, 0.19], [126000, 0.24], [1e9, 0.2575]],
        bpa: 18056, divElig: 0.117, divNon: 0.0487,
        // TaxTips.ca / Revenu Québec: 6% of eligible work income, max $1,380
        workerDeductionMax: 1380, workerDeductionRate: 0.06
      }
    }
  },
  2025: {
    federal: {
      // Full-year 2025 T1: lowest rate 14.5% (T4127 Jul 2025 uses 14% for withholding only).
      brackets: [[57375, 0.145], [114750, 0.205], [177882, 0.26], [253414, 0.29], [1e9, 0.33]],
      lowestRate: 0.145,
      bpaMax: 16129,
      bpaMin: 14538,
      bpaPhaseStart: 177882,
      bpaPhaseEnd: 253414,
      cea: 1471,
      quebecAbatement: 0.165,
      dividendEligibleCreditRate: 0.150198,
      dividendNonEligibleCreditRate: 0.090301,
      grossUpEligible: 1.38,
      grossUpNonEligible: 1.15
    },
    payroll: {
      cpp: { baseRate: 0.0495, additionalRate: 0.01, ympe: 71300, yampe: 81200, exemption: 3500, cpp2Rate: 0.04 },
      ei: { rate: 0.0164, maxPremium: 1077.48, qcRate: 0.0131, qcMaxPremium: 860.67 },
      qpp: { baseRate: 0.054, additionalRate: 0.01, ympe: 71300, yampe: 81200, exemption: 3500, qpp2Rate: 0.04 },
      qpip: { rate: 0.00494, maxEarnings: 98000, maxPremium: 484.12 }
    },
    provinces: {
      ON: {
        name: 'Ontario',
        brackets: [[52886, 0.0505], [105775, 0.0915], [150000, 0.1116], [220000, 0.1216], [1e9, 0.1316]],
        bpa: 12747, divElig: 0.1, divNon: 0.0334,
        surtax1: 5710, surtax2: 7307, taxReductionBasic: 294
      },
      BC: {
        name: 'British Columbia',
        brackets: [[49279, 0.0506], [98560, 0.077], [113158, 0.105], [137407, 0.1229], [186306, 0.147], [259829, 0.168], [1e9, 0.205]],
        bpa: 12932, divElig: 0.12, divNon: 0.0196,
        taxReduction: { max: 562, threshold: 25020, rate: 0.0356, zeroAt: 40807 }
      },
      AB: {
        name: 'Alberta',
        brackets: [[60000, 0.08], [151234, 0.10], [181481, 0.12], [241974, 0.13], [362961, 0.14], [1e9, 0.15]],
        bpa: 22323, divElig: 0.08, divNon: 0.025
      },
      QC: {
        name: 'Quebec',
        // Revenu Québec principal changes 2025
        brackets: [[53255, 0.14], [106495, 0.19], [129590, 0.24], [1e9, 0.2575]],
        bpa: 18571, divElig: 0.1175, divNon: 0.0487,
        workerDeductionMax: 1420, workerDeductionRate: 0.06
      }
    }
  },
  2026: {
    federal: {
      // CRA current-year brackets; T4127 Jan 2026 Chart 1; BPAF formula.
      brackets: [[58523, 0.14], [117045, 0.205], [181440, 0.26], [258482, 0.29], [1e9, 0.33]],
      lowestRate: 0.14,
      bpaMax: 16452,
      bpaMin: 14829,
      bpaPhaseStart: 181440,
      bpaPhaseEnd: 258482,
      cea: 1501,
      quebecAbatement: 0.165,
      dividendEligibleCreditRate: 0.150198,
      dividendNonEligibleCreditRate: 0.090301,
      grossUpEligible: 1.38,
      grossUpNonEligible: 1.15
    },
    payroll: {
      cpp: { baseRate: 0.0495, additionalRate: 0.01, ympe: 74600, yampe: 85000, exemption: 3500, cpp2Rate: 0.04 },
      ei: { rate: 0.0163, maxPremium: 1123.07, qcRate: 0.013, qcMaxPremium: 895.70 },
      // Revenu Québec 2026: 5.30% base + 1% first additional = 6.30%.
      qpp: { baseRate: 0.053, additionalRate: 0.01, ympe: 74600, yampe: 85000, exemption: 3500, qpp2Rate: 0.04 },
      qpip: { rate: 0.0043, maxEarnings: 103000, maxPremium: 442.90 }
    },
    provinces: {
      ON: {
        name: 'Ontario',
        brackets: [[53891, 0.0505], [107785, 0.0915], [150000, 0.1116], [220000, 0.1216], [1e9, 0.1316]],
        bpa: 12989, divElig: 0.1, divNon: 0.029863,
        surtax1: 5818, surtax2: 7446, taxReductionBasic: 300
      },
      BC: {
        name: 'British Columbia',
        // Full-year 2026 T1: lowest rate 5.60% (Budget 2026). Payroll withheld 5.06% Jan–Jun then a 6.14% prorate.
        brackets: [[50363, 0.056], [100728, 0.077], [115648, 0.105], [140430, 0.1229], [190405, 0.147], [265545, 0.168], [1e9, 0.205]],
        bpa: 13216, divElig: 0.12, divNon: 0.0196,
        taxReduction: { max: 690, threshold: 25570, rate: 0.0356, zeroAt: 44952 }
      },
      AB: {
        name: 'Alberta',
        brackets: [[61200, 0.08], [154259, 0.10], [185111, 0.12], [246813, 0.13], [370220, 0.14], [1e9, 0.15]],
        bpa: 22769, divElig: 0.0812, divNon: 0.0218
      },
      QC: {
        name: 'Quebec',
        brackets: [[54345, 0.14], [108680, 0.19], [132245, 0.24], [1e9, 0.2575]],
        bpa: 18952, divElig: 0.117, divNon: 0.0342,
        workerDeductionMax: 1450, workerDeductionRate: 0.06
      },
      // --- Added 2026-10-26 for the all-Canada RRSP/TFSA/FHSA tool. Brackets from
      // CRA current-year T1 rates; BPA from T4032 / T4127 Jul 2026 Table 8.2. ---
      SK: {
        name: 'Saskatchewan',
        // CRA T1 2026 / T4032-SK Jan 2026 Chart 2. BPA $20,381 includes the
        // Saskatchewan Affordability Act +$500 (T4032-SK).
        // https://www.canada.ca/en/revenue-agency/services/forms-publications/payroll/t4032-payroll-deductions-tables/t4032sk-jan/t4032sk-january-general-information.html
        brackets: [[54532, 0.105], [155805, 0.125], [1e9, 0.145]],
        bpa: 20381
      },
      MB: {
        name: 'Manitoba',
        // T4032-MB Jan 2026 Chart 2 and the 20 Mar 2025 announcement that 2026
        // brackets and BPA are not indexed: $47,000 / $100,000, BPA $15,780.
        // CRA's current-year T1 page lists $47,564 / $101,200; this engine follows
        // T4032 Chart 2. https://www.canada.ca/en/revenue-agency/services/forms-publications/payroll/t4032-payroll-deductions-tables/t4032mb-jan/t4032mb-january-general-information.html
        brackets: [[47000, 0.108], [100000, 0.1275], [1e9, 0.174]],
        bpa: 15780
      },
      NB: {
        name: 'New Brunswick',
        // CRA T1 2026 / T4032-NB Jan 2026 Chart 2. BPA $13,664.
        // https://www.canada.ca/en/revenue-agency/services/forms-publications/payroll/t4032-payroll-deductions-tables/t4032nb-jan/t4032nb-january-general-information.html
        brackets: [[52333, 0.094], [104666, 0.14], [193861, 0.16], [1e9, 0.195]],
        bpa: 13664
      },
      NS: {
        name: 'Nova Scotia',
        // CRA T1 2026 / T4032-NS Jan 2026 Chart 2. BPA $11,932 (low-income
        // enhancement is fully phased out well below the $95k scenarios here).
        // https://www.canada.ca/en/revenue-agency/services/forms-publications/payroll/t4032-payroll-deductions-tables/t4032ns-jan/t4032ns-january-general-information.html
        brackets: [[30995, 0.0879], [61991, 0.1495], [97417, 0.1667], [157124, 0.175], [1e9, 0.21]],
        bpa: 11932
      },
      PE: {
        name: 'Prince Edward Island',
        // CRA T1 2026: top rate 20% above $200,000 (full-year). T4032-PE Jul 2026
        // withholds a 21% prorate for Jul–Dec after the 14 Apr 2026 new bracket.
        // BPA $15,000 (T4032-PE). Same T1-vs-payroll split as BC's 5.60%.
        // https://www.canada.ca/en/revenue-agency/services/tax/individuals/tax-rates-brackets/current-year.html
        // https://www.canada.ca/en/revenue-agency/services/forms-publications/payroll/t4032-payroll-deductions-tables/t4032pe-july/t4032pe-july-general-information.html
        brackets: [[33928, 0.095], [65820, 0.1347], [106890, 0.166], [142520, 0.1762], [200000, 0.19], [1e9, 0.20]],
        bpa: 15000
      },
      NL: {
        name: 'Newfoundland and Labrador',
        // CRA T1 2026 brackets. BPA $13,094 full-year (T4127 123rd ed. Jul 2026):
        // 29 Apr 2026 announcement raised BPA from $11,188 to $13,094 effective
        // 1 Jan 2026. Payroll uses a $15,000 Jul–Dec prorate; Option 2 / T1 is $13,094.
        // https://www.canada.ca/en/revenue-agency/services/forms-publications/payroll/t4127-payroll-deductions-formulas/t4127-jul/t4127-jul-payroll-deductions-formulas.html
        brackets: [[44678, 0.087], [89354, 0.145], [159528, 0.158], [223340, 0.178], [285319, 0.198], [570638, 0.208], [1141275, 0.213], [1e9, 0.218]],
        bpa: 13094
      },
      YT: {
        name: 'Yukon',
        // CRA T1 2026 / T4032-YT Jan 2026 Chart 2. Territorial BPA matches federal
        // (max $16,452, min $14,829, same 29%/33% phase-out). Territorial CEA $1,501.
        // https://www.canada.ca/en/revenue-agency/services/forms-publications/payroll/t4032-payroll-deductions-tables/t4032yt-jan/t4032yt-january-general-information.html
        brackets: [[58523, 0.064], [117045, 0.09], [181440, 0.109], [500000, 0.128], [1e9, 0.15]],
        bpa: 16452, bpaMin: 14829, bpaPhaseStart: 181440, bpaPhaseEnd: 258482,
        cea: 1501
      },
      NT: {
        name: 'Northwest Territories',
        // CRA T1 2026 / T4032-NT Jan 2026. BPA $18,198.
        // https://www.canada.ca/en/revenue-agency/services/forms-publications/payroll/t4032-payroll-deductions-tables/t4032nt-jan/t4032nt-january-general-information.html
        brackets: [[53003, 0.059], [106009, 0.086], [172346, 0.122], [1e9, 0.1405]],
        bpa: 18198
      },
      NU: {
        name: 'Nunavut',
        // CRA T1 2026 / T4032-NU Jan 2026. BPA $19,659.
        // https://www.canada.ca/en/revenue-agency/services/forms-publications/payroll/t4032-payroll-deductions-tables/t4032nu-jan/t4032nu-january-general-information.html
        brackets: [[55801, 0.04], [111602, 0.07], [181439, 0.09], [1e9, 0.115]],
        bpa: 19659
      }
    }
  }
}

export function getTaxYearData (year) {
  const data = TAX_DATA[year]
  if (!data) throw new Error(`Tax year ${year} is not supported. Use one of: ${TAX_YEAR_OPTIONS.join(', ')}.`)
  return data
}

function getTaxData (year) {
  return getTaxYearData(year)
}

/** Provinces shown in the Canadian Tax Calculator UI. Do not expand without a dedicated follow-up. */
export const TAX_CALCULATOR_PROVINCE_CODES = ['ON', 'BC', 'AB', 'QC']

/** All 13 provinces and territories, west-to-east, matching the RRSP/TFSA/FHSA selector. */
export const CANADA_PROVINCE_CODES = ['BC', 'AB', 'SK', 'MB', 'ON', 'QC', 'NB', 'NS', 'PE', 'NL', 'YT', 'NT', 'NU']

export function getProvincesList (year) {
  const data = getTaxData(year)
  return TAX_CALCULATOR_PROVINCE_CODES
    .filter((code) => data.provinces[code])
    .map((code) => ({ code, name: data.provinces[code].name }))
}

export function getCanadaProvincesList (year) {
  const data = getTaxData(year)
  return CANADA_PROVINCE_CODES
    .filter((code) => data.provinces[code])
    .map((code) => ({ code, name: data.provinces[code].name }))
}

export function normalizeCanadaProvince (code, fallback = 'BC') {
  const c = String(code || '').toUpperCase()
  return CANADA_PROVINCE_CODES.includes(c) ? c : fallback
}

export function getProvinceName (year, provinceCode) {
  const data = getTaxData(year)
  return data.provinces[provinceCode]?.name ?? provinceCode
}

function round2 (n) {
  return Math.round((n + Number.EPSILON) * 100) / 100
}

export function taxFromBrackets (taxable, brackets) {
  let tax = 0
  let prev = 0
  for (const [to, rate] of brackets) {
    const inBracket = Math.max(0, Math.min(taxable, to) - prev)
    tax += inBracket * rate
    if (taxable <= to) break
    prev = to
  }
  return tax
}

/** T4127 BPAF: max below 29% threshold, min at/above 33%, linear in between. */
export function federalBpa (netIncome, federal) {
  const ni = Math.max(0, netIncome)
  if (ni <= federal.bpaPhaseStart) return federal.bpaMax
  if (ni >= federal.bpaPhaseEnd) return federal.bpaMin
  const span = federal.bpaPhaseEnd - federal.bpaPhaseStart
  const extra = federal.bpaMax - federal.bpaMin
  return round2(federal.bpaMax - (ni - federal.bpaPhaseStart) * (extra / span))
}

function pensionableSplit (salary, plan) {
  const contributory = Math.max(0, Math.min(salary, plan.ympe) - plan.exemption)
  const base = contributory * plan.baseRate
  const additional = contributory * plan.additionalRate
  const second = Math.max(0, Math.min(salary, plan.yampe) - plan.ympe) * (plan.cpp2Rate ?? plan.qpp2Rate)
  return { base, additional, second, total: base + additional + second }
}

/** Ontario Health Premium — T4032-ON / T4127 V2. Thresholds are not indexed. */
export function ontarioHealthPremium (taxableIncome) {
  const a = Math.max(0, taxableIncome)
  if (a <= 20000) return 0
  if (a <= 36000) return Math.min(300, 0.06 * (a - 20000))
  if (a <= 48000) return Math.min(450, 300 + 0.06 * (a - 36000))
  if (a <= 72000) return Math.min(600, 450 + 0.25 * (a - 48000))
  if (a <= 200000) return Math.min(750, 600 + 0.25 * (a - 72000))
  return Math.min(900, 750 + 0.25 * (a - 200000))
}

function ontarioSurtax (basicTax, prov) {
  if (basicTax <= prov.surtax1) return 0
  if (basicTax <= prov.surtax2) return 0.20 * (basicTax - prov.surtax1)
  return 0.20 * (basicTax - prov.surtax1) + 0.36 * (basicTax - prov.surtax2)
}

function ontarioTaxReduction (basicPlusSurtax, prov) {
  // Single filer, basic amount only (Y = 0). S = min(T4+V1, 2×$300 − (T4+V1)), floor 0.
  const twice = 2 * (prov.taxReductionBasic || 0)
  const s = twice - basicPlusSurtax
  if (s <= 0) return 0
  return Math.min(basicPlusSurtax, s)
}

function bcTaxReduction (netIncome, taxBefore, reduction) {
  if (!reduction) return 0
  let credit = 0
  if (netIncome <= reduction.threshold) credit = reduction.max
  else if (netIncome < reduction.zeroAt) credit = Math.max(0, reduction.max - reduction.rate * (netIncome - reduction.threshold))
  return Math.min(taxBefore, credit)
}

/** Yukon (and any province with bpaMin) uses the federal-style BPA phase-out. */
function provincialBpa (netIncome, prov) {
  if (prov.bpaMin != null && prov.bpaPhaseStart != null && prov.bpaPhaseEnd != null) {
    return federalBpa(netIncome, {
      bpaMax: prov.bpa,
      bpaMin: prov.bpaMin,
      bpaPhaseStart: prov.bpaPhaseStart,
      bpaPhaseEnd: prov.bpaPhaseEnd
    })
  }
  return prov.bpa || 0
}

function calculateCore (scenario, year) {
  const data = getTaxData(year)
  const federal = data.federal
  const payroll = data.payroll
  const s = { ...scenario }
  const provinceCode = s.province || 'ON'
  const prov = data.provinces[provinceCode] || data.provinces.ON
  const isQc = provinceCode === 'QC'
  const lowestFed = federal.lowestRate
  const lowestProv = prov.brackets[0][1]

  const salary = Math.max(0, s.salary || 0)
  const interest = Math.max(0, s.interest || 0)
  const eligibleDiv = Math.max(0, s.eligibleDividend || 0)
  const nonEligibleDiv = Math.max(0, s.nonEligibleDividend || 0)
  const capGains = Math.max(0, s.capitalGains || 0)
  const rentalIncome = Math.max(0, s.rentalIncome || 0)
  const rentalExpenses = Math.max(0, s.rentalExpenses || 0)
  const rrsp = Math.max(0, s.rrsp || 0)

  const netRental = Math.max(0, rentalIncome - rentalExpenses)
  const grossEligibleDiv = eligibleDiv * federal.grossUpEligible
  const grossNonEligibleDiv = nonEligibleDiv * federal.grossUpNonEligible
  const taxableCapGains = capGains * 0.5

  const plan = isQc ? payroll.qpp : payroll.cpp
  const pension = pensionableSplit(salary, plan)
  const eiRate = isQc ? payroll.ei.qcRate : payroll.ei.rate
  const eiMax = isQc ? payroll.ei.qcMaxPremium : payroll.ei.maxPremium
  const ei = Math.min(salary * eiRate, eiMax)
  const qpip = isQc ? Math.min(salary * payroll.qpip.rate, payroll.qpip.maxPremium) : 0

  // F5 / F5Q: first additional + second additional CPP/QPP are deductions from income.
  const enhancedPensionDeduction = pension.additional + pension.second
  const workerDeduction = isQc
    ? Math.min(prov.workerDeductionMax, (prov.workerDeductionRate || 0) * salary)
    : 0

  const totalIncome = salary + interest + eligibleDiv + nonEligibleDiv + capGains + rentalIncome
  const federalTaxable = Math.max(
    0,
    salary + interest + grossEligibleDiv + grossNonEligibleDiv + taxableCapGains + netRental - rrsp - enhancedPensionDeduction
  )
  const quebecTaxable = Math.max(0, federalTaxable - workerDeduction)
  const provincialTaxable = isQc ? quebecTaxable : federalTaxable
  const netIncomeForBpa = federalTaxable

  const bpa = federalBpa(netIncomeForBpa, federal)
  const ceaAmount = Math.min(salary, federal.cea)

  let fedTax = taxFromBrackets(federalTaxable, federal.brackets)
  fedTax -= bpa * lowestFed
  fedTax -= ceaAmount * lowestFed
  fedTax -= pension.base * lowestFed
  fedTax -= ei * lowestFed
  if (isQc) fedTax -= qpip * lowestFed
  fedTax -= grossEligibleDiv * federal.dividendEligibleCreditRate + grossNonEligibleDiv * federal.dividendNonEligibleCreditRate
  fedTax = Math.max(0, fedTax)
  if (isQc) fedTax = Math.max(0, fedTax - federal.quebecAbatement * fedTax)

  let provTax = taxFromBrackets(provincialTaxable, prov.brackets)
  provTax -= provincialBpa(netIncomeForBpa, prov) * lowestProv
  if (prov.cea) provTax -= Math.min(salary, prov.cea) * lowestProv
  provTax -= pension.base * lowestProv
  provTax -= ei * lowestProv
  // Revenu Québec TP-1.D: base QPP, EI, and QPIP are provincial non-refundable credits
  // at the lowest rate. Some public paycheck tables omit these (~$713 at $100k salary).
  if (isQc) provTax -= qpip * lowestProv
  const basicProvBeforeDtc = Math.max(0, provTax)
  // TaxTips: Ontario surtax is calculated before dividend tax credits.
  let surtax = 0
  if (provinceCode === 'ON') surtax = ontarioSurtax(basicProvBeforeDtc, prov)
  provTax = basicProvBeforeDtc
  provTax -= grossEligibleDiv * (prov.divElig || 0) + grossNonEligibleDiv * (prov.divNon || 0)
  provTax = Math.max(0, provTax)

  let ohp = 0
  if (provinceCode === 'ON') {
    const withSurtax = provTax + surtax
    const otr = ontarioTaxReduction(basicProvBeforeDtc + surtax, prov)
    ohp = ontarioHealthPremium(provincialTaxable)
    provTax = Math.max(0, withSurtax - otr) + ohp
  } else if (provinceCode === 'BC') {
    provTax = Math.max(0, provTax - bcTaxReduction(netIncomeForBpa, provTax, prov.taxReduction))
  } else {
    provTax = Math.max(0, provTax + surtax)
  }

  const totalTax = fedTax + provTax
  const payrollTotal = pension.total + ei + qpip
  const afterTaxIncome = totalIncome - totalTax - payrollTotal

  return {
    totalIncome,
    taxableIncome: federalTaxable,
    provincialTaxableIncome: provincialTaxable,
    afterTaxIncome,
    totalTax: Math.max(0, totalTax),
    federalTax: Math.max(0, fedTax),
    provincialTax: Math.max(0, provTax),
    cpp: pension.total,
    cppBase: pension.base,
    cppEnhanced: enhancedPensionDeduction,
    ei,
    qpip,
    ontarioHealthPremium: ohp,
    quebecWorkerDeduction: workerDeduction,
    federalBpa: bpa,
    effectiveRate: totalIncome > 0 ? ((totalTax + payrollTotal) / totalIncome) * 100 : null,
    payrollTotal,
    totalDeductions: totalTax + payrollTotal
  }
}

/**
 * Calculate federal + provincial tax and payroll for a scenario.
 * @param {Object} scenario
 * @param {number} year
 */
export function calculateTax (scenario, year) {
  const result = calculateCore(scenario, year)
  const step = 100
  const bumped = {
    ...scenario,
    salary: (scenario.salary || 0) > 0 ? (scenario.salary || 0) + step : 0,
    interest: (scenario.salary || 0) > 0 ? (scenario.interest || 0) : (scenario.interest || 0) + step
  }
  const next = calculateCore(bumped, year)
  const deltaIncome = next.totalIncome - result.totalIncome
  const deltaBurden = (next.totalTax + next.payrollTotal) - (result.totalTax + result.payrollTotal)
  const marginalRate = deltaIncome > 0 ? ((deltaBurden / deltaIncome) * 100).toFixed(1) : '0.0'

  return {
    ...result,
    marginalRate
  }
}
