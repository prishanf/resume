/**
 * Fetches YouTube videos from a Google Sheet (CSV export) and writes
 * data/youtube-videos.json. Run before nuxt generate so the static site
 * (e.g. GitHub Pages) has the data at build time — no server at runtime.
 *
 * Requires: NUXT_PUBLIC_GOOGLE_SHEET_ID_VIDEOS (optional: NUXT_PUBLIC_GOOGLE_SHEET_GID_VIDEOS)
 * If not set, writes { videos: [] } so the build still succeeds.
 */
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OUTPUT_PATH = path.join(ROOT, 'data', 'youtube-videos.json')

/** Load .env from project root so NUXT_PUBLIC_* vars are set when running via npm script */
async function loadEnv() {
  const envPath = path.join(ROOT, '.env')
  try {
    const content = await fs.readFile(envPath, 'utf8')
    for (const line of content.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
      if (match) {
        const value = match[2].replace(/^["']|["']$/g, '').trim()
        process.env[match[1]] = value
      }
    }
  } catch (e) {
    if (e.code !== 'ENOENT') throw e
  }
}

/**
 * Parse CSV with proper handling of quoted fields. Fields that contain commas or
 * newlines are wrapped in double quotes by Google Sheets; we must not split on
 * newlines when inside quotes so one sheet row (one video) stays one row.
 */
function parseSheetCsv(csvText) {
  const rows = []
  let currentRow = []
  let current = ''
  let inQuotes = false
  const pushCell = () => {
    currentRow.push(current.replace(/^"|"$/g, '').replace(/""/g, '"').trim())
    current = ''
  }
  const pushRow = () => {
    if (current.length > 0 || currentRow.length > 0) {
      if (current.length > 0) pushCell()
      rows.push(currentRow)
      currentRow = []
    }
  }
  for (let i = 0; i < csvText.length; i++) {
    const c = csvText[i]
    const next = csvText[i + 1]
    if (inQuotes) {
      if (c === '"') {
        if (next === '"') {
          current += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        current += c
      }
    } else {
      if (c === '"') {
        inQuotes = true
      } else if (c === ',' || c === '\n') {
        pushCell()
        if (c === '\n') pushRow()
      } else if (c !== '\r') {
        current += c
      }
    }
  }
  pushCell()
  pushRow()
  if (rows.length < 2) return []
  const headers = rows[0]
  return rows.slice(1).map((values) => {
    const row = {}
    headers.forEach((h, j) => { row[h] = (values[j] ?? '').trim() })
    return row
  })
}

function get(row, keys) {
  for (const k of keys) {
    const v = row[k] ?? row[k.toLowerCase()] ?? ''
    if (v) return v.trim()
  }
  return ''
}

function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'video'
}

function mapRowToVideo(row, index) {
  const title = get(row, ['Title', 'title'])
  const videoUrl = get(row, ['Video URL', 'Video Url', 'videoUrl', 'url', 'URL'])
  const channel = get(row, ['Channel', 'channel'])
  const summary = get(row, ['Summary', 'summary', 'Description', 'description'])
  const tagsStr = get(row, ['Tags', 'tags'])
  const tags = tagsStr ? tagsStr.split(/[,;|]/).map((t) => t.trim()).filter(Boolean) : []
  const watchedDate = get(row, ['Watched Date', 'WatchedDate', 'Date', 'date', 'watchedDate'])
  return {
    id: `video-${index + 1}-${slug(title || String(index))}`,
    title: title || 'Untitled',
    videoUrl: videoUrl || '',
    channel: channel || '',
    summary: summary || '',
    tags,
    watchedDate: watchedDate || '',
  }
}

async function run() {
  await loadEnv()
  const sheetId = process.env.NUXT_PUBLIC_GOOGLE_SHEET_ID_VIDEOS?.trim()
  const gid = process.env.NUXT_PUBLIC_GOOGLE_SHEET_GID_VIDEOS?.trim() || '0'

  let videos = []

  if (sheetId) {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Nuxt-YouTube-Videos-Sync/1.0' } })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const csv = await res.text()
      const rows = parseSheetCsv(csv)
      videos = rows.map((row, i) => mapRowToVideo(row, i))
      console.log('📺 Synced', videos.length, 'YouTube video(s) from Google Sheet.')
    } catch (err) {
      console.warn('⚠️ Could not fetch Google Sheet (youtube-videos). Writing empty list.', err.message)
    }
  } else {
    console.log('📺 NUXT_PUBLIC_GOOGLE_SHEET_ID_VIDEOS not set — writing empty youtube-videos list.')
  }

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true })
  await fs.writeFile(OUTPUT_PATH, JSON.stringify({ videos }, null, 2), 'utf8')
  console.log('   Wrote', OUTPUT_PATH)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
