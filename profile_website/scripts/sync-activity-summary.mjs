/**
 * Fetches GitHub commit history for the repo and writes data/activity-summary.json.
 * Run before nuxt build/generate so the static site has activity data at build time.
 *
 * Env (use ACTIVITY_* names in GitHub Actions — GitHub disallows variable names starting with GITHUB_):
 *   ACTIVITY_REPO or GITHUB_REPO (e.g. "owner/repo" or full GitHub URL) — required for real data
 *   ACTIVITY_BRANCH or GITHUB_BRANCH — optional; branch to fetch commits from (default: main)
 *   ACTIVITY_TOKEN or GITHUB_TOKEN — optional; GitHub PAT for rate limit and commit stats
 * If repo is not set, writes minimal placeholder so build still succeeds.
 */
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OUTPUT_PATH = path.join(ROOT, 'data', 'activity-summary.json')

const COMMIT_TYPES = ['feature', 'fix', 'design', 'content', 'tool', 'refactor', 'perf', 'docs']
const TYPE_LABELS = { feature: 'Feature', fix: 'Fix', design: 'Design', content: 'Content', tool: 'Tool', refactor: 'Refactor', perf: 'Perf', docs: 'Docs' }

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

function inferTypes(message) {
  const firstLine = (message || '').split(/\r?\n/)[0].toLowerCase()
  const types = []
  if (/\b(feat(ure)?|add(ed)?|new)\b/.test(firstLine) || /^feat[(\s:]/.test(firstLine)) types.push('feature')
  if (/\b(fix(ed)?|bug|resolve)\b/.test(firstLine) || /^fix[(\s:]/.test(firstLine)) types.push('fix')
  if (/\b(design|ui|style|layout)\b/.test(firstLine)) types.push('design')
  if (/\b(content|blog|post|article|doc(umentation)?|readme)\b/.test(firstLine)) types.push('content')
  if (/\b(tool|calculator|app)\b/.test(firstLine)) types.push('tool')
  if (/\b(refactor|clean|reorg)\b/.test(firstLine)) types.push('refactor')
  if (/\b(perf|speed|optim)\b/.test(firstLine)) types.push('perf')
  if (/\b(docs?|readme|changelog)\b/.test(firstLine) && !types.includes('content')) types.push('docs')
  if (types.length === 0) types.push('refactor')
  return [...new Set(types)].slice(0, 2)
}

function parseCommitMessage(msg) {
  const firstLine = (msg || '').split(/\r?\n/)[0].trim()
  const rest = (msg || '').split(/\r?\n/).slice(1).join('\n').trim()
  const title = firstLine.replace(/^(feat|fix|docs|style|refactor|perf|test|chore)[(\s:]+\s*/i, '').trim()
  return { title: title || 'Update', description: rest || '' }
}

function toDateKey(d) {
  return d.toISOString().slice(0, 10)
}

/** Get Monday 00:00 UTC for the week containing the given date string (YYYY-MM-DD). */
function getMondayUtc(dateStr) {
  const d = new Date(dateStr + 'T12:00:00Z')
  const day = d.getUTCDay()
  const diff = day === 0 ? -6 : 1 - day
  const mon = new Date(d)
  mon.setUTCDate(d.getUTCDate() + diff)
  return mon.toISOString().slice(0, 10)
}

function getWeekRange(dateStr) {
  const mon = new Date(getMondayUtc(dateStr) + 'T00:00:00Z')
  const sun = new Date(mon)
  sun.setUTCDate(mon.getUTCDate() + 6)
  const fmt = (x) => x.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
  return `${fmt(mon)} – ${fmt(sun)}`
}

/** ISO-like week number (1–53) in UTC for consistent grouping. */
function getWeekNumberUtc(dateStr) {
  const d = new Date(dateStr + 'T12:00:00Z')
  const mon = getMondayUtc(dateStr)
  const start = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const monDate = new Date(mon + 'T00:00:00Z')
  const days = Math.floor((monDate - start) / (24 * 60 * 60 * 1000))
  return Math.ceil((days + 1) / 7)
}

function recomputeThisWeek(payload, todayUtc) {
  const thisWeekMonday = getMondayUtc(todayUtc)
  const weekId = `week-${thisWeekMonday}`
  const week = payload.months.flatMap((m) => m.weeks).find((w) => w.id === weekId)
  if (!week) return
  let commits = 0
  let filesChanged = 0
  let linesAdded = 0
  let linesRemoved = 0
  for (const day of week.days) {
    commits += day.commits
    for (const item of day.items) {
      filesChanged += item.files || 0
      linesAdded += item.additions || 0
      linesRemoved += item.deletions || 0
    }
  }
  payload.thisWeek.commits = commits
  payload.thisWeek.filesChanged = filesChanged
  payload.thisWeek.linesAdded = linesAdded
  payload.thisWeek.linesRemoved = linesRemoved
}

async function fetchCommits(owner, repo, token, since, branch = 'main', maxPages = 5) {
  const headers = { Accept: 'application/vnd.github.v3+json' }
  if (token) headers.Authorization = `Bearer ${token}`
  const commits = []
  let page = 1
  const shaParam = branch ? `&sha=${encodeURIComponent(branch)}` : ''
  while (page <= maxPages) {
    const url = `https://api.github.com/repos/${owner}/${repo}/commits?since=${since.toISOString()}&per_page=100&page=${page}${shaParam}`
    const res = await fetch(url, { headers })
    if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`)
    const data = await res.json()
    if (data.length === 0) break
    commits.push(...data)
    if (data.length < 100) break
    page++
  }
  return commits
}

async function fetchCommitDetails(owner, repo, sha, token) {
  const headers = { Accept: 'application/vnd.github.v3+json' }
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits/${sha}`, { headers })
  if (!res.ok) return null
  const data = await res.json()
  const stats = data.stats || {}
  const files = (data.files || []).length
  return { additions: stats.additions ?? 0, deletions: stats.deletions ?? 0, files }
}

function buildActivity(commits) {
  const byDate = {}
  const typeCounts = {}
  COMMIT_TYPES.forEach((t) => { typeCounts[TYPE_LABELS[t]] = 0 })

  for (const c of commits) {
    const dateStr = c.commit?.author?.date?.slice(0, 10)
    if (!dateStr) continue
    const msg = c.commit?.message || ''
    const { title, description } = parseCommitMessage(msg)
    const types = inferTypes(msg)
    types.forEach((t) => { typeCounts[TYPE_LABELS[t]] = (typeCounts[TYPE_LABELS[t]] || 0) + 1 })
    const sha = (c.sha || '').slice(0, 7)
    byDate[dateStr] = byDate[dateStr] || []
    byDate[dateStr].push({
      sha,
      types: types.map((t) => TYPE_LABELS[t]),
      title,
      description,
      files: 0,
      additions: 0,
      deletions: 0,
    })
  }

  const sortedDates = Object.keys(byDate).sort()
  const months = {}
  for (const dateStr of sortedDates) {
    const d = new Date(dateStr + 'T12:00:00Z')
    const monthKey = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }).replace(' ', '').toLowerCase()
    const mondayKey = getMondayUtc(dateStr)
    const weekNum = getWeekNumberUtc(dateStr)
    const monthLabel = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })
    const yearLabel = d.getUTCFullYear().toString()
    if (!months[monthKey]) {
      months[monthKey] = { id: monthKey, label: monthLabel, year: yearLabel, commits: 0, features: 0, activeDays: 0, weeks: {} }
    }
    const weekId = `week-${mondayKey}`
    if (!months[monthKey].weeks[weekId]) {
      months[monthKey].weeks[weekId] = {
        id: weekId,
        weekNum,
        range: getWeekRange(dateStr),
        commits: 0,
        linesAdded: 0,
        linesRemoved: 0,
        days: [],
      }
    }
    const dayCommits = byDate[dateStr]
    const additions = dayCommits.reduce((a, x) => a + (x.additions || 0), 0)
    const deletions = dayCommits.reduce((a, x) => a + (x.deletions || 0), 0)
    months[monthKey].commits += dayCommits.length
    months[monthKey].activeDays += 1
    months[monthKey].features += dayCommits.filter((x) => x.types.includes('Feature')).length
    const week = months[monthKey].weeks[weekId]
    week.commits += dayCommits.length
    week.linesAdded += additions
    week.linesRemoved += deletions
    const todayKey = toDateKey(new Date())
    week.days.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      dateKey: dateStr,
      dayOfWeek: d.toLocaleDateString('en-US', { weekday: 'short' }),
      commits: dayCommits.length,
      isToday: dateStr === todayKey,
      items: dayCommits,
    })
  }

  for (const m of Object.values(months)) {
    m.weeks = Object.values(m.weeks).sort((a, b) => b.id.localeCompare(a.id))
    m.weeks.forEach((w) => {
      w.days.sort((a, b) => b.dateKey.localeCompare(a.dateKey))
    })
  }

  const monthList = Object.entries(months)
    .map(([id, data]) => ({ ...data, id }))
    .sort((a, b) => {
      const lastA = a.weeks.flatMap((w) => w.days.map((d) => d.dateKey)).filter(Boolean).sort().pop() || ''
      const lastB = b.weeks.flatMap((w) => w.days.map((d) => d.dateKey)).filter(Boolean).sort().pop() || ''
      return lastB.localeCompare(lastA)
    })

  const heatmap = {}
  const now = new Date()
  const year = now.getFullYear()
  const monthNum = String(now.getMonth() + 1).padStart(2, '0')
  const daysInMonth = new Date(year, now.getMonth() + 1, 0).getDate()
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${year}-${monthNum}-${String(d).padStart(2, '0')}`
    heatmap[key] = (byDate[key] || []).length
  }

  const totalCommits = commits.length
  const totalFeatures = typeCounts['Feature'] || 0
  const totalTools = typeCounts['Tool'] || 0
  const activeDays = Object.keys(byDate).length

  let thisWeekData = null
  const todayUtc = toDateKey(now)
  const thisWeekMonday = getMondayUtc(todayUtc)
  const weekStart = new Date(thisWeekMonday + 'T00:00:00Z').getTime()
  const weekEndExcl = weekStart + 7 * 24 * 60 * 60 * 1000
  for (const dateStr of sortedDates) {
    const d = new Date(dateStr + 'T12:00:00Z').getTime()
    if (d >= weekStart && d < weekEndExcl) {
      const dayCommits = byDate[dateStr] || []
      if (!thisWeekData) {
        thisWeekData = { commits: 0, filesChanged: 0, linesAdded: 0, linesRemoved: 0, weekLabel: getWeekRange(todayUtc) }
      }
      thisWeekData.commits += dayCommits.length
      dayCommits.forEach((c) => {
        thisWeekData.filesChanged += c.files || 0
        thisWeekData.linesAdded += c.additions || 0
        thisWeekData.linesRemoved += c.deletions || 0
      })
    }
  }

  return {
    lastSync: new Date().toISOString(),
    summary: { totalCommits, totalFeatures, totalTools, activeDays },
    heatmap,
    typeBreakdown: typeCounts,
    thisWeek: thisWeekData || { commits: 0, filesChanged: 0, linesAdded: 0, linesRemoved: 0, weekLabel: getWeekRange(todayUtc) },
    months: monthList,
  }
}

/**
 * If path exists and contains valid activity data (has months with data), return the parsed object; else return null.
 */
async function readExistingIfValid(outputPath) {
  try {
    const raw = await fs.readFile(outputPath, 'utf8')
    const data = JSON.parse(raw)
    if (data && Array.isArray(data.months) && data.months.length > 0) return data
  } catch (_) {}
  return null
}

/**
 * Parse repo from either "owner/repo" or "https://github.com/owner/repo" (with or without trailing slash).
 */
function parseRepoInput(input) {
  const s = (input || '').trim()
  if (!s) return null
  try {
    if (s.startsWith('http://') || s.startsWith('https://')) {
      const u = new URL(s)
      const parts = u.pathname.replace(/^\/+|\/+$/g, '').split('/')
      if (parts.length >= 2) return { owner: parts[0], repo: parts[1] }
      return null
    }
    if (s.includes('/')) {
      const [owner, repo] = s.split('/', 2)
      if (owner && repo) return { owner: owner.trim(), repo: repo.trim() }
    }
  } catch (_) {}
  return null
}

async function run() {
  await loadEnv()
  const repoInput = (process.env.ACTIVITY_REPO || process.env.GITHUB_REPO || '').trim()
  const token = (process.env.ACTIVITY_TOKEN || process.env.GITHUB_TOKEN || '').trim()
  const parsed = parseRepoInput(repoInput)

  let payload

  if (!parsed) {
    console.log('📋 ACTIVITY_REPO / GITHUB_REPO not set or invalid (use owner/repo or https://github.com/owner/repo).')
    const existing = await readExistingIfValid(OUTPUT_PATH)
    if (existing) {
      console.log('   Keeping existing activity-summary.json from repo (not overwriting with placeholder).')
      return
    }
    console.log('   Writing placeholder activity-summary.')
    payload = {
      lastSync: new Date().toISOString(),
      summary: { totalCommits: 0, totalFeatures: 0, totalTools: 0, activeDays: 0 },
      heatmap: {},
      typeBreakdown: {},
      thisWeek: { commits: 0, filesChanged: 0, linesAdded: 0, linesRemoved: 0, weekLabel: '—' },
      months: [],
    }
  } else {
    try {
      const { owner, repo: repoName } = parsed
      const branch = (process.env.ACTIVITY_BRANCH || process.env.GITHUB_BRANCH || 'main').trim() || 'main'
      const since = new Date()
      since.setDate(since.getDate() - 90)
      const commits = await fetchCommits(owner, repoName, token, since, branch)
      console.log('📋 Fetched', commits.length, 'commits from', `${owner}/${repoName}` + (branch !== 'main' ? ` (branch: ${branch})` : ''))

      const todayUtc = toDateKey(new Date())
      payload = buildActivity(commits)

      const maxDetails = token ? 50 : 20
      if (commits.length > 0) {
        let fetched = 0
        const byDate = {}
        commits.forEach((c) => {
          const d = (c.commit?.author?.date || '').slice(0, 10)
          if (!byDate[d]) byDate[d] = []
          byDate[d].push(c)
        })
        for (const dateStr of Object.keys(byDate).sort().reverse()) {
          if (fetched >= maxDetails) break
          for (const c of byDate[dateStr]) {
            if (fetched >= maxDetails) break
            const details = await fetchCommitDetails(owner, repoName, c.sha, token)
            if (details) {
              const week = payload.months.flatMap((m) => m.weeks).find((w) => w.days.some((d) => d.dateKey === dateStr))
              const day = week?.days?.find((d) => d.dateKey === dateStr)
              const item = day?.items?.find((i) => i.sha === (c.sha || '').slice(0, 7))
              if (item) {
                item.files = details.files
                item.additions = details.additions
                item.deletions = details.deletions
                fetched++
              }
            }
          }
        }
        if (!token && fetched > 0) {
          console.log('   Fetched stats for', fetched, 'commits (no token: limited to 20; set ACTIVITY_TOKEN for more)')
        }
        recomputeThisWeek(payload, todayUtc)
      }
    } catch (err) {
      const existing = await readExistingIfValid(OUTPUT_PATH)
      if (existing) {
        console.warn('⚠️ Sync failed:', err.message)
        console.log('   Keeping existing activity-summary.json from repo (not overwriting).')
        return
      }
      throw err
    }
  }

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true })
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(payload, null, 2), 'utf8')
  console.log('   Wrote', OUTPUT_PATH)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
