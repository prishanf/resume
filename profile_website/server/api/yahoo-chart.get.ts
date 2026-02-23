const YAHOO_ENDPOINT = 'https://query2.finance.yahoo.com/v8/finance/chart'

function formatChartDate(ts: number): string {
  return new Date(ts * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default defineEventHandler(async (event) => {
  const symbol = getQuery(event).symbol as string | undefined
  const months = Math.min(12, Math.max(1, Number(getQuery(event).months) || 2))

  if (!symbol || !symbol.trim()) {
    throw createError({ statusCode: 400, message: 'Query parameter "symbol" is required' })
  }

  const period2 = Math.floor(Date.now() / 1000)
  const period1 = period2 - months * 30 * 24 * 60 * 60

  const url = `${YAHOO_ENDPOINT}/${encodeURIComponent(symbol.trim())}?interval=1d&period1=${period1}&period2=${period2}&events=capitalGain%7Cdiv%7Csplit&useYfid=true`

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; StockGapSimulator/1.0)',
    },
  })

  if (!res.ok) {
    throw createError({ statusCode: res.status, message: `Yahoo chart request failed: ${res.statusText}` })
  }

  const data = (await res.json()) as {
    chart?: {
      result?: Array<{
        meta?: { symbol?: string }
        timestamp?: number[]
        indicators?: {
          quote?: Array<{
            open?: (number | null)[]
            high?: (number | null)[]
            low?: (number | null)[]
            close?: (number | null)[]
            volume?: (number | null)[]
          }>
        }
      }>
      error?: { description?: string }
    }
  }

  const err = data.chart?.error
  if (err?.description) {
    throw createError({ statusCode: 400, message: err.description })
  }

  const result = data.chart?.result?.[0]
  if (!result) {
    throw createError({ statusCode: 404, message: 'No chart data for this symbol' })
  }

  const timestamps = result.timestamp ?? []
  const quote = result.indicators?.quote?.[0]
  if (!quote) {
    throw createError({ statusCode: 404, message: 'No quote data in chart' })
  }

  const opens = quote.open ?? []
  const highs = quote.high ?? []
  const lows = quote.low ?? []
  const closes = quote.close ?? []
  const volumes = quote.volume ?? []

  const rows: string[] = ['Date,Open,High,Low,Close,Adj Close,Volume']

  for (let i = 0; i < timestamps.length; i++) {
    const o = opens[i] ?? ''
    const h = highs[i] ?? ''
    const l = lows[i] ?? ''
    const c = closes[i] ?? ''
    const v = volumes[i] ?? ''
    if (o === null || o === undefined || c === null || c === undefined) continue
    const date = formatChartDate(timestamps[i])
    const volStr = typeof v === 'number' ? v.toLocaleString() : String(v)
    rows.push(`"${date}",${o},${h},${l},${c},${c},"${volStr}"`)
  }

  if (rows.length < 7) {
    throw createError({ statusCode: 400, message: 'Not enough data points (need at least 6 trading days)' })
  }

  setHeader(event, 'Content-Type', 'text/csv; charset=utf-8')
  setHeader(event, 'Cache-Control', 'private, max-age=300')
  return rows.join('\n')
})
