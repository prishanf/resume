/**
 * Canadian federal and provincial tax data and calculator.
 * Supports multiple tax years; add new years by extending TAX_DATA.
 */

export const TAX_YEAR_OPTIONS = [2025, 2024]

const TAX_DATA = {
  2024: {
    federal: {
      brackets: [[55867, 0.15], [111733, 0.205], [173205, 0.26], [246752, 0.2932], [1e9, 0.33]],
      basicPersonalAmount: 14156,
      basicPersonalAmountRate: 0.15,
      dividendEligibleCreditRate: 0.150198,
      dividendNonEligibleCreditRate: 0.090301,
      grossUpEligible: 1.38,
      grossUpNonEligible: 1.15
    },
    payroll: {
      cpp: { rate: 0.0595, maxEarnings: 68500, exemption: 3500 },
      cpp2: { rate: 0.04, maxEarnings: 73200, threshold: 68500 },
      ei: { rate: 0.0166, maxEarnings: 63200, maxPremium: 1049, qcRate: 0.0132, qcMaxPremium: 781 }
    },
    provinces: {
      ON: { name: 'Ontario', brackets: [[51446, 0.0505], [102894, 0.0915], [150000, 0.1116], [220000, 0.1216], [1e9, 0.1316]], bpa: 12399, divElig: 0.1, divNon: 0.0334 },
      BC: { name: 'British Columbia', brackets: [[47937, 0.0506], [95875, 0.077], [110076, 0.105], [133664, 0.1229], [181232, 0.147], [252752, 0.168], [1e9, 0.205]], bpa: 12580, divElig: 0.12, divNon: 0.02 },
      AB: { name: 'Alberta', brackets: [[148269, 0.10], [177922, 0.12], [237230, 0.13], [355845, 0.14], [1e9, 0.15]], bpa: 21885, divElig: 0.08, divNon: 0.025 },
      QC: { name: 'Quebec', brackets: [[51780, 0.14], [103545, 0.19], [126000, 0.24], [1e9, 0.2575]], bpa: 17535, divElig: 0.117, divNon: 0.0487 }
    }
  },
  2025: {
    federal: {
      brackets: [[57375, 0.145], [114750, 0.205], [177882, 0.26], [253414, 0.2931], [1e9, 0.33]],
      basicPersonalAmount: 14538,
      basicPersonalAmountRate: 0.145,
      dividendEligibleCreditRate: 0.150198,
      dividendNonEligibleCreditRate: 0.090301,
      grossUpEligible: 1.38,
      grossUpNonEligible: 1.15
    },
    payroll: {
      cpp: { rate: 0.0595, maxEarnings: 71300, exemption: 3500 },
      cpp2: { rate: 0.04, maxEarnings: 81200, threshold: 71300 },
      ei: { rate: 0.0164, maxEarnings: 65700, maxPremium: 1077.48, qcRate: 0.0131, qcMaxPremium: 860.67 }
    },
    provinces: {
      ON: { name: 'Ontario', brackets: [[52886, 0.0505], [105775, 0.0915], [150000, 0.1116], [220000, 0.1216], [1e9, 0.1316]], bpa: 12747, divElig: 0.1, divNon: 0.0334 },
      BC: { name: 'British Columbia', brackets: [[49279, 0.0506], [98560, 0.077], [113158, 0.105], [137407, 0.1229], [186306, 0.147], [259829, 0.168], [1e9, 0.205]], bpa: 12932, divElig: 0.12, divNon: 0.02 },
      AB: { name: 'Alberta', brackets: [[60000, 0.08], [151234, 0.10], [181481, 0.12], [241974, 0.13], [362961, 0.14], [1e9, 0.15]], bpa: 22323, divElig: 0.08, divNon: 0.025 },
      QC: { name: 'Quebec', brackets: [[53178, 0.14], [106339, 0.19], [129402, 0.24], [1e9, 0.2575]], bpa: 18263, divElig: 0.1175, divNon: 0.0487 }
    }
  }
}

function getTaxData (year) {
  const data = TAX_DATA[year]
  if (!data) throw new Error(`Tax year ${year} is not supported. Use one of: ${TAX_YEAR_OPTIONS.join(', ')}.`)
  return data
}

export function getProvincesList (year) {
  const data = getTaxData(year)
  return Object.entries(data.provinces).map(([code, p]) => ({ code, name: p.name }))
}

export function getProvinceName (year, provinceCode) {
  const data = getTaxData(year)
  return data.provinces[provinceCode]?.name ?? provinceCode
}

function taxFromBrackets (taxable, brackets) {
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

/**
 * Calculate federal + provincial tax and payroll for a scenario.
 * @param {Object} scenario - { province, salary, interest, eligibleDividend, nonEligibleDividend, capitalGains, rentalIncome, rentalExpenses, rrsp }
 * @param {number} year - Tax year (e.g. 2024 or 2025)
 * @returns {Object} - { totalIncome, taxableIncome, federalTax, provincialTax, totalTax, cpp, ei, afterTaxIncome, effectiveRate, marginalRate }
 */
export function calculateTax (scenario, year) {
  const data = getTaxData(year)
  const federal = data.federal
  const payroll = data.payroll
  const provinces = data.provinces

  const s = { ...scenario }
  const netRental = Math.max(0, (s.rentalIncome || 0) - (s.rentalExpenses || 0))
  const taxableCapGains = (s.capitalGains || 0) * 0.5
  const grossEligibleDiv = (s.eligibleDividend || 0) * federal.grossUpEligible
  const grossNonEligibleDiv = (s.nonEligibleDividend || 0) * federal.grossUpNonEligible

  const totalIncome = (s.salary || 0) + (s.interest || 0) + (s.eligibleDividend || 0) + (s.nonEligibleDividend || 0) + (s.capitalGains || 0) + (s.rentalIncome || 0)
  const taxableIncome = Math.max(0, (s.salary || 0) + (s.interest || 0) + grossEligibleDiv + grossNonEligibleDiv + taxableCapGains + netRental - (s.rrsp || 0))

  const salary = s.salary || 0
  const ei = Math.min(
    salary * (s.province === 'QC' ? payroll.ei.qcRate : payroll.ei.rate),
    s.province === 'QC' ? payroll.ei.qcMaxPremium : payroll.ei.maxPremium
  )
  const cppBase = Math.max(0, Math.min(salary, payroll.cpp.maxEarnings) - payroll.cpp.exemption) * payroll.cpp.rate
  const cpp2 = Math.max(0, Math.min(salary, payroll.cpp2.maxEarnings) - payroll.cpp2.threshold) * payroll.cpp2.rate
  const totalCpp = cppBase + cpp2

  const prov = provinces[s.province] || provinces.ON
  const bpaRate = federal.basicPersonalAmountRate ?? 0.15
  let fedTax = Math.max(0, taxFromBrackets(taxableIncome, federal.brackets) - (federal.basicPersonalAmount * bpaRate))
  let provTax = Math.max(0, taxFromBrackets(taxableIncome, prov.brackets) - (prov.bpa * prov.brackets[0][1]))

  fedTax -= (grossEligibleDiv * federal.dividendEligibleCreditRate + grossNonEligibleDiv * federal.dividendNonEligibleCreditRate)
  provTax -= (grossEligibleDiv * prov.divElig + grossNonEligibleDiv * prov.divNon)

  const totalTax = Math.max(0, fedTax) + Math.max(0, provTax)

  const step = 100
  const tax1 = taxFromBrackets(taxableIncome, federal.brackets) + taxFromBrackets(taxableIncome, prov.brackets)
  const tax2 = taxFromBrackets(taxableIncome + step, federal.brackets) + taxFromBrackets(taxableIncome + step, prov.brackets)
  const marginalRate = (((tax2 - tax1) / step) * 100).toFixed(1)

  return {
    totalIncome,
    afterTaxIncome: totalIncome - totalTax - totalCpp - ei,
    totalTax: Math.max(0, totalTax),
    federalTax: Math.max(0, fedTax),
    provincialTax: Math.max(0, provTax),
    cpp: totalCpp,
    ei,
    effectiveRate: totalIncome > 0 ? ((totalTax + totalCpp + ei) / totalIncome) * 100 : null,
    marginalRate
  }
}
