const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
] as const

const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
] as const

/** Parse a date as a calendar Y-M-D without applying the local timezone. */
export function calendarParts(value: unknown): { year: number; month: number; day: number } | null {
  if (!value) return null

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return {
      year: value.getUTCFullYear(),
      month: value.getUTCMonth() + 1,
      day: value.getUTCDate()
    }
  }

  const raw = String(value).trim()
  if (!raw) return null

  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (iso) {
    return {
      year: Number(iso[1]),
      month: Number(iso[2]),
      day: Number(iso[3])
    }
  }

  const parsed = new Date(raw)
  if (Number.isNaN(parsed.getTime())) return null
  return {
    year: parsed.getUTCFullYear(),
    month: parsed.getUTCMonth() + 1,
    day: parsed.getUTCDate()
  }
}

/** Stable long date, e.g. "February 5, 2026" — same on server and client. */
export function formatDisplayDate(value: unknown): string {
  const parts = calendarParts(value)
  if (!parts) return ''
  return `${MONTHS_LONG[parts.month - 1]} ${parts.day}, ${parts.year}`
}

/** Stable short month + year, e.g. "Feb 2026". */
export function formatMonthYear(value: unknown): string {
  const parts = calendarParts(value)
  if (!parts) return ''
  return `${MONTHS_SHORT[parts.month - 1]} ${parts.year}`
}
