/**
 * Parse a CSV string (e.g. from Google Sheets export) into an array of objects.
 * First row is treated as headers. Handles quoted fields.
 */
export function parseSheetCsv(csvText: string): Record<string, string>[] {
  const lines = csvText.trim().split(/\r?\n/)
  if (lines.length < 2) return []
  const headers = parseCsvLine(lines[0])
  const rows: Record<string, string>[] = []
  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i])
    const row: Record<string, string> = {}
    headers.forEach((h, j) => {
      row[h] = (values[j] ?? '').trim()
    })
    rows.push(row)
  }
  return rows
}

function parseCsvLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (c === '"') {
      inQuotes = !inQuotes
    } else if ((c === ',' && !inQuotes) || (c === '\r' && !inQuotes)) {
      result.push(current.trim().replace(/^"|"$/g, ''))
      current = ''
    } else if (c !== '\r') {
      current += c
    }
  }
  result.push(current.trim().replace(/^"|"$/g, ''))
  return result
}

/** Normalize sheet row to video entry: map common column names to camelCase. */
export function mapSheetRowToVideo(
  row: Record<string, string>,
  index: number
): {
  id: string
  title: string
  videoUrl: string
  channel: string
  summary: string
  tags: string[]
  watchedDate: string
} {
  const get = (keys: string[]) => {
    for (const k of keys) {
      const v = row[k] ?? row[k.toLowerCase()] ?? ''
      if (v) return v.trim()
    }
    return ''
  }
  const title = get(['Title', 'title'])
  const videoUrl = get(['Video URL', 'Video Url', 'videoUrl', 'url', 'URL'])
  const channel = get(['Channel', 'channel'])
  const summary = get(['Summary', 'summary', 'Description', 'description'])
  const tagsStr = get(['Tags', 'tags'])
  const tags = tagsStr
    ? tagsStr.split(/[,;|]/).map((t) => t.trim()).filter(Boolean)
    : []
  const watchedDate = get(['Watched Date', 'WatchedDate', 'Date', 'date', 'watchedDate'])
  const id = `video-${index + 1}-${slug(title || String(index))}`
  return {
    id,
    title: title || 'Untitled',
    videoUrl: videoUrl || '',
    channel: channel || '',
    summary: summary || '',
    tags,
    watchedDate: watchedDate || '',
  }
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'video'
}
