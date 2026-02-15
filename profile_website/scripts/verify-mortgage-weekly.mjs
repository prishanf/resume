#!/usr/bin/env node
/**
 * Verify mortgage calculator when frequency is weekly.
 * Run: node scripts/verify-mortgage-weekly.mjs
 */

const PAYMENT_FREQ_MAP = { monthly: 12, biweekly: 26, weekly: 52 }

function getPaymentsPerYear (freq) {
  return PAYMENT_FREQ_MAP[freq] ?? 12
}

function calculateSchedule (scen, useExtra = true) {
  let bal = scen.amount
  const ppy = getPaymentsPerYear(scen.paymentFreq)
  const r = (scen.ratePct / 100) / ppy
  const n = scen.amortYears * ppy
  const pmt = bal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)

  const schedule = []
  let totalInt = 0
  let totalExtra = 0
  let period = 0
  const maxExtraYearly = scen.amount * (scen.annualLimitPct / 100)
  let extraThisYear = 0
  const maxPeriods = scen.amortYears * ppy + 52

  while (bal > 0.1 && period < maxPeriods) {
    if (period % ppy === 0) extraThisYear = 0

    const interest = bal * r
    const principal = Math.min(pmt - interest, bal)
    let extra = 0
    if (useExtra && scen.extraAmount > 0) {
      extra = Math.min(scen.extraAmount, bal - principal, maxExtraYearly - extraThisYear)
    }

    totalInt += interest
    totalExtra += extra
    bal -= (principal + extra)

    schedule.push({
      paymentNum: period + 1,
      principal,
      interest,
      extraPrincipal: extra,
      endingBalance: Math.max(0, bal)
    })
    period++
    extraThisYear += extra
  }

  return {
    schedule,
    payment: pmt,
    totalInterest: totalInt,
    totalExtra,
    yearsToPayoff: period / ppy
  }
}

const defaultScenario = {
  amount: 450000,
  ratePct: 5.2,
  amortYears: 25,
  termYears: 5,
  paymentFreq: 'monthly',
  extraAmount: 0,
  annualLimitPct: 15
}

function formatCurrency (val) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val ?? 0)
}

console.log('=== Mortgage calculator verification (weekly frequency) ===\n')

// Monthly baseline
const monthlyScen = { ...defaultScenario, paymentFreq: 'monthly' }
const monthly = calculateSchedule(monthlyScen)
console.log('Monthly:')
console.log('  Payment per period:', formatCurrency(monthly.payment))
console.log('  Schedule length:', monthly.schedule.length, '(expected 300)')
console.log('  Total interest:', formatCurrency(monthly.totalInterest))
console.log('  Years to payoff:', monthly.yearsToPayoff?.toFixed(2))
console.log('  Final balance:', formatCurrency(monthly.schedule[monthly.schedule.length - 1]?.endingBalance))
console.log('')

// Weekly
const weeklyScen = { ...defaultScenario, paymentFreq: 'weekly' }
const weekly = calculateSchedule(weeklyScen)
console.log('Weekly:')
console.log('  Payment per period:', formatCurrency(weekly.payment))
console.log('  Schedule length:', weekly.schedule.length, '(expected 1300 for 25 yr)')
console.log('  Total interest:', formatCurrency(weekly.totalInterest))
console.log('  Years to payoff:', weekly.yearsToPayoff?.toFixed(2))
console.log('  Final balance:', formatCurrency(weekly.schedule[weekly.schedule.length - 1]?.endingBalance))
console.log('')

// Assertions
const expectedWeeklyPmt = 618.73
const expectedWeeklyInterest = 354355
const okSchedule = weekly.schedule.length >= 1299 && weekly.schedule.length <= 1301
const okPmt = Math.abs(weekly.payment - expectedWeeklyPmt) < 1
const okInterest = Math.abs(weekly.totalInterest - expectedWeeklyInterest) < 500
const okPaidOff = (weekly.schedule[weekly.schedule.length - 1]?.endingBalance ?? 1) < 1

let failed = 0
if (!okSchedule) {
  console.error('FAIL: Weekly schedule length should be 1300, got', weekly.schedule.length)
  failed++
}
if (!okPmt) {
  console.error('FAIL: Weekly payment should be ~$618.73, got', weekly.payment.toFixed(2))
  failed++
}
if (!okInterest) {
  console.error('FAIL: Weekly total interest should be ~$354,355, got', weekly.totalInterest.toFixed(0))
  failed++
}
if (!okPaidOff) {
  console.error('FAIL: Loan should be paid off (final balance ~0), got', weekly.schedule[weekly.schedule.length - 1]?.endingBalance)
  failed++
}

if (failed === 0) {
  console.log('All checks passed: weekly frequency calculations are correct.')
} else {
  console.error(failed, 'check(s) failed.')
  process.exit(1)
}
