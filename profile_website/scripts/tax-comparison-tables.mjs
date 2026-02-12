/**
 * Generate tax comparison numbers for the article (Ontario, 2025).
 * Run from profile_website: node scripts/tax-comparison-tables.mjs
 */
import { calculateTax } from '../utils/canadianTax.js'

const year = 2025
const province = 'ON'
const amounts = [50000, 75000, 100000, 150000, 200000]
const types = [
  { name: 'Employment', fn: (a) => ({ province, salary: a, interest: 0, eligibleDividend: 0, nonEligibleDividend: 0, capitalGains: 0, rentalIncome: 0, rentalExpenses: 0, rrsp: 0 }) },
  { name: 'Interest', fn: (a) => ({ province, salary: 0, interest: a, eligibleDividend: 0, nonEligibleDividend: 0, capitalGains: 0, rentalIncome: 0, rentalExpenses: 0, rrsp: 0 }) },
  { name: 'Eligible dividend', fn: (a) => ({ province, salary: 0, interest: 0, eligibleDividend: a, nonEligibleDividend: 0, capitalGains: 0, rentalIncome: 0, rentalExpenses: 0, rrsp: 0 }) },
  { name: 'Non-eligible dividend', fn: (a) => ({ province, salary: 0, interest: 0, eligibleDividend: 0, nonEligibleDividend: a, capitalGains: 0, rentalIncome: 0, rentalExpenses: 0, rrsp: 0 }) },
  { name: 'Capital gains', fn: (a) => ({ province, salary: 0, interest: 0, eligibleDividend: 0, nonEligibleDividend: 0, capitalGains: a, rentalIncome: 0, rentalExpenses: 0, rrsp: 0 }) },
]

const fmt = (n) => new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(n)

console.log('Ontario, tax year', year)
console.log('')

for (const amt of amounts) {
  console.log(`## Total income: ${fmt(amt)}`)
  console.log('')
  console.log('| Income type | Take-home | Tax + CPP + EI | Effective rate |')
  console.log('|-------------|-----------|----------------|----------------|')
  for (const t of types) {
    const r = calculateTax(t.fn(amt), year)
    const totalDeductions = r.totalTax + r.cpp + r.ei
    const eff = r.effectiveRate != null ? r.effectiveRate.toFixed(1) + '%' : '—'
    console.log(`| ${t.name} | ${fmt(r.afterTaxIncome)} | ${fmt(totalDeductions)} | ${eff} |`)
  }
  console.log('')
}
