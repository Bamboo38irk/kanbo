import { ArrowUpDown, ListFilter, Search } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import Select from '@/components/ui/Select'
import { SORT_OPTIONS } from '@/config/sorting'
import { STATUSES } from '@/config/statuses'
import { setOnlyMine, setSearch, setSort, setStatusFilter, type SortOrder } from '@/features/ui/uiSlice'
import type { Status } from '@/types'
import styles from './BoardsPage.module.scss'

const statusOptions = [
  { value: '', label: 'Все статусы' },
  ...STATUSES.map((status) => ({ value: status.id, label: status.title, tone: status.tone })),
]

export default function BoardFilters({ showSort }: { showSort: boolean }) {
  const dispatch = useAppDispatch()
  const { search, status, onlyMine, sort } = useAppSelector((state) => state.ui)

  return (
    <div className={styles.filters}>
      <label className={styles.search}>
        <Search size={17} />
        <input
          type="search"
          placeholder="Поиск по задачам"
          value={search}
          onChange={(event) => dispatch(setSearch(event.target.value))}
        />
      </label>

      <Select
        label="Фильтр по статусу"
        icon={<ListFilter size={17} />}
        value={status}
        options={statusOptions}
        width={200}
        onChange={(value) => dispatch(setStatusFilter(value as Status | ''))}
      />

      {showSort && (
        <Select
          label="Сортировка"
          icon={<ArrowUpDown size={17} />}
          value={sort}
          options={SORT_OPTIONS}
          width={200}
          onChange={(value) => dispatch(setSort(value as SortOrder))}
        />
      )}

      <label className={styles.checkbox}>
        <input type="checkbox" checked={onlyMine} onChange={(event) => dispatch(setOnlyMine(event.target.checked))} />
        Только мои
      </label>
    </div>
  )
}
