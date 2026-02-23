/**
 * Stock gap simulation algorithms.
 * Each algorithm takes sorted OHLCV rows (oldest first) and returns
 * result rows with a common shape for the simulator UI.
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

    const actual =
      today.close > yesterday.close ? 'UP' : today.close < yesterday.close ? 'DOWN' : 'FLAT'
    const correct = actual !== 'FLAT' && gapSignal === actual

    out.push({
      date: today.date,
      yesterdayClose: yesterday.close,
      todayOpen: today.open,
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
      today.close > yesterday.close ? 'UP' : today.close < yesterday.close ? 'DOWN' : 'FLAT'
    const correct = actual !== 'FLAT' && gapSignal === actual

    out.push({
      date: today.date,
      yesterdayClose: yesterday.close,
      todayOpen: today.open,
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
]

export function getAlgorithmById(id) {
  return ALGORITHMS.find((a) => a.id === id) ?? ALGORITHMS[0]
}
