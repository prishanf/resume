export interface ActivitySummaryStats {
  totalCommits: number
  totalFeatures: number
  totalTools: number
  activeDays: number
}

export interface ActivityCommitItem {
  sha: string
  types: string[]
  title: string
  description: string
  files: number
  additions: number
  deletions: number
}

export interface ActivityDay {
  date: string
  dateKey: string
  dayOfWeek: string
  commits: number
  isToday: boolean
  items: ActivityCommitItem[]
}

export interface ActivityWeek {
  id: string
  weekNum: number
  range: string
  commits: number
  linesAdded: number
  linesRemoved: number
  days: ActivityDay[]
}

export interface ActivityMonth {
  id: string
  label: string
  year: string
  commits: number
  features: number
  activeDays: number
  weeks: ActivityWeek[]
}

export interface ActivityThisWeek {
  commits: number
  filesChanged: number
  linesAdded: number
  linesRemoved: number
  weekLabel: string
}

export interface ActivitySummaryData {
  lastSync: string
  summary: ActivitySummaryStats
  heatmap: Record<string, number>
  typeBreakdown: Record<string, number>
  thisWeek: ActivityThisWeek
  months: ActivityMonth[]
}
