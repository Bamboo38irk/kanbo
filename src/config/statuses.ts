import type { Status, Tone } from '@/types'

interface StatusInfo {
  id: Status
  title: string
  tone: Tone
}

export const STATUSES: StatusInfo[] = [
  { id: 'todo', title: 'Сделать', tone: 'red' },
  { id: 'progress', title: 'В процессе', tone: 'blue' },
  { id: 'waiting', title: 'Ожидание', tone: 'yellow' },
  { id: 'done', title: 'Готово', tone: 'green' },
]

export const getStatus = (id: Status) => STATUSES.find((status) => status.id === id) ?? STATUSES[0]
