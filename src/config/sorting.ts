import type { SortOrder } from '@/features/ui/uiSlice'

export const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: 'manual', label: 'Без сортировки' },
  { value: 'created', label: 'По созданию' },
  { value: 'due', label: 'По сроку' },
  { value: 'title', label: 'По алфавиту' },
]
