/**
 * Stock gap simulation algorithms.
 * Each algorithm takes sorted OHLCV rows (oldest first) and returns
 * result rows with a common shape for the simulator UI.
 *
 * ── PREDICTION DEFINITION ──────────────────────────────────────────────────
 * Signal   : Gap direction at open. If today.open > yesterday.close → predict UP.
 *
 * "actual" : close vs open (intraday move), NOT close vs yesterday's close.
 *   • This aligns with the investment simulation: buy at open, sell at close.
 *   • HIT = the intraday direction matched the prediction = the trade was
 *     profitable in direction (before slippage).
 *   • We deliberately do NOT use high vs open, because a stock can spike above
 *     the open and then reverse hard below it by close — that would count as a
 *     false HIT and artificially inflate accuracy.
 *   • close vs yesterday's close is a different (also valid) metric, but it
 *     is NOT what the investment sim trades on, so mixing them would make
 *     accuracy stats inconsistent with P&L.
 *
 * DOWN prediction days generate NO simulated trade (no short selling assumed).
 * ──────────────────────────────────────────────────────────────────────────
 */

function calcMA(data, idx, period) {
  if (idx < period) return null
  return data.slice(idx - period, idx).reduce((s, d) => s + d.close, 0) / period
}

/**
 * Gap + N-day MA confirmation. Same logic as original 5-day, but configurable period.
 */
function buildResultsGapMA(data, maPeriod) {
  const out = []
  const minIdx = Math.max(5, maPeriod)
  for (let i = minIdx; i < data.length; i++) {
    const today = data[i]
    const yesterday = data[i - 1]
    const ma = calcMA(data, i, maPeriod)

    const gap = today.open - yesterday.close
    const gapPct = (gap / yesterday.close) * 100
    const gapSignal = gap > 0 ? 'UP' : gap < 0 ? 'DOWN' : 'FLAT'
    if (gapSignal === 'FLAT') continue

    const aboveMA = ma !== null ? today.open > ma : null
    const maConfirms =
      ma !== null
        ? (gapSignal === 'UP' && aboveMA) || (gapSignal === 'DOWN' && !aboveMA)
        : false

    let confidence = 50 + Math.min(25, Math.abs(gapPct) * 8)
    if (maConfirms) confidence = Math.min(99, confidence + 20)
    else if (ma !== null) confidence = Math.max(30, confidence - 10)

    // actual = intraday direction (close vs open).
    // HIT means the trade (buy open, sell close) moved in the predicted direction.
    // NOTE: NOT close vs yesterday's close — that is a different metric and would
    // decouple accuracy from investment sim P&L.
    const actual =
      today.close > today.open ? 'UP' : today.close < today.open ? 'DOWN' : 'FLAT'
    const correct = actual !== 'FLAT' && gapSignal === actual

    out.push({
      date: today.date,
      yesterdayClose: yesterday.close,
      todayOpen: today.open,
      todayHigh: today.high,
      todayLow: today.low,
      todayClose: today.close,
      gap: gap.toFixed(3),
      gapPct: gapPct.toFixed(2),
      gapPositive: gap > 0,
      predicted: gapSignal,
      actual,
      correct,
      ma5: ma != null ? ma.toFixed(2) : 'N/A',
      aboveMA,
      maConfirms,
      confidence: confidence.toFixed(0),
    })
  }
  return out
}

/**
 * Gap only: predict from open vs prev close, no MA. All rows have maConfirms: false.
 */
function buildResultsGapOnly(data) {
  const out = []
  for (let i = 1; i < data.length; i++) {
    const today = data[i]
    const yesterday = data[i - 1]

    const gap = today.open - yesterday.close
    const gapPct = (gap / yesterday.close) * 100
    const gapSignal = gap > 0 ? 'UP' : gap < 0 ? 'DOWN' : 'FLAT'
    if (gapSignal === 'FLAT') continue

    const confidence = Math.min(99, 50 + Math.min(25, Math.abs(gapPct) * 8))

    const actual =
      today.close > today.open ? 'UP' : today.close < today.open ? 'DOWN' : 'FLAT'
    const correct = actual !== 'FLAT' && gapSignal === actual

    out.push({
      date: today.date,
      yesterdayClose: yesterday.close,
      todayOpen: today.open,
      todayHigh: today.high,
      todayLow: today.low,
      todayClose: today.close,
      gap: gap.toFixed(3),
      gapPct: gapPct.toFixed(2),
      gapPositive: gap > 0,
      predicted: gapSignal,
      actual,
      correct,
      ma5: 'N/A',
      aboveMA: null,
      maConfirms: false,
      confidence: confidence.toFixed(0),
    })
  }
  return out
}

/**
 * Gap + Mid-range: confirm using day's high/low. UP confirmed if close > (high+low)/2, DOWN if close < (high+low)/2.
 */
function buildResultsGapMidRange(data) {
  const out = []
  for (let i = 1; i < data.length; i++) {
    const today = data[i]
    const yesterday = data[i - 1]
    const mid = (today.high + today.low) / 2

    const gap = today.open - yesterday.close
    const gapPct = (gap / yesterday.close) * 100
    const gapSignal = gap > 0 ? 'UP' : gap < 0 ? 'DOWN' : 'FLAT'
    if (gapSignal === 'FLAT') continue

    const aboveMid = today.close > mid
    const maConfirms =
      (gapSignal === 'UP' && aboveMid) || (gapSignal === 'DOWN' && !aboveMid)

    let confidence = 50 + Math.min(25, Math.abs(gapPct) * 8)
    if (maConfirms) confidence = Math.min(99, confidence + 20)
    else confidence = Math.max(30, confidence - 10)

    const actual =
      today.close > today.open ? 'UP' : today.close < today.open ? 'DOWN' : 'FLAT'
    const correct = actual !== 'FLAT' && gapSignal === actual

    out.push({
      date: today.date,
      yesterdayClose: yesterday.close,
      todayOpen: today.open,
      todayHigh: today.high,
      todayLow: today.low,
      todayClose: today.close,
      gap: gap.toFixed(3),
      gapPct: gapPct.toFixed(2),
      gapPositive: gap > 0,
      predicted: gapSignal,
      actual,
      correct,
      ma5: mid.toFixed(2),
      aboveMA: aboveMid,
      maConfirms,
      confidence: confidence.toFixed(0),
    })
  }
  return out
}

export const ALGORITHMS = [
  {
    id: 'gap-ma-5',
    label: 'Gap + 5-day MA',
    description: 'Open vs prev close, confirm with 5-day MA',
    hasMaConfirmation: true,
    maPeriod: 5,
    run(data) {
      return buildResultsGapMA(data, 5)
    },
  },
  {
    id: 'gap-only',
    label: 'Gap only',
    description: 'Predict from open vs prev close only (no MA)',
    hasMaConfirmation: false,
    run(data) {
      return buildResultsGapOnly(data)
    },
  },
  {
    id: 'gap-ma-10',
    label: 'Gap + 10-day MA',
    description: 'Open vs prev close, confirm with 10-day MA',
    hasMaConfirmation: true,
    maPeriod: 10,
    run(data) {
      return buildResultsGapMA(data, 10)
    },
  },
  {
    id: 'gap-ma-20',
    label: 'Gap + 20-day MA',
    description: 'Open vs prev close, confirm with 20-day MA',
    hasMaConfirmation: true,
    maPeriod: 20,
    run(data) {
      return buildResultsGapMA(data, 20)
    },
  },
  {
    id: 'gap-midrange',
    label: 'Gap + Mid-range (High/Low)',
    description: 'Open vs prev close, confirm with close vs (High+Low)/2',
    hasMaConfirmation: true,
    maPeriod: null,
    run(data) {
      return buildResultsGapMidRange(data)
    },
  },
]

export function getAlgorithmById(id) {
  return ALGORITHMS.find((a) => a.id === id) ?? ALGORITHMS[0]
}