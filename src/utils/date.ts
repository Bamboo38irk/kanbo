const DAY = 24 * 60 * 60 * 1000

export const WEEK_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

export function toDateKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function fromDateKey(key: string) {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function addDays(date: Date, days: number) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function daysUntil(key: string) {
  const today = fromDateKey(toDateKey(new Date()))
  return Math.round((fromDateKey(key).getTime() - today.getTime()) / DAY)
}

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

export function formatDate(key: string) {
  return fromDateKey(key).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

export function formatLongDate(key: string) {
  return fromDateKey(key).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
}

export function getMonthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function formatDue(key: string) {
  const days = daysUntil(key)
  if (days === 0) return 'Сегодня'
  if (days === 1) return 'Завтра'
  if (days === -1) return 'Вчера'
  return formatDate(key)
}

export function formatMonth(date: Date) {
  return capitalize(date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }))
}

const relativeFormat = new Intl.RelativeTimeFormat('ru-RU', { numeric: 'auto' })

export function timeAgo(iso: string) {
  const seconds = Math.round((new Date(iso).getTime() - Date.now()) / 1000)
  if (Math.abs(seconds) < 60) return 'только что'
  if (Math.abs(seconds) < 3600) return relativeFormat.format(Math.round(seconds / 60), 'minute')
  if (Math.abs(seconds) < DAY / 1000) return relativeFormat.format(Math.round(seconds / 3600), 'hour')
  return relativeFormat.format(Math.round((seconds * 1000) / DAY), 'day')
}

export function getCalendarDays(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  const shift = (first.getDay() + 6) % 7
  const start = addDays(first, -shift)

  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(start, index)
    return {
      key: toDateKey(date),
      day: date.getDate(),
      isCurrentMonth: date.getMonth() === month.getMonth(),
    }
  })
}
