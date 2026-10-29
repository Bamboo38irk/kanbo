import clsx from 'clsx'
import { Search } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import BottomSheet from '@/components/ui/BottomSheet'
import Button from '@/components/ui/Button'
import { SORT_OPTIONS } from '@/config/sorting'
import { STATUSES } from '@/config/statuses'
import { selectVisibleTasks } from '@/features/tasks/selectors'
import { resetFilters, setOnlyMine, setSearch, setSort, setStatusFilter } from '@/features/ui/uiSlice'
import { plural } from '@/utils/text'
import styles from './FiltersSheet.module.scss'

export default function FiltersSheet({ onClose }: { onClose: () => void }) {
  const dispatch = useAppDispatch()
  const { search, status, onlyMine, sort } = useAppSelector((state) => state.ui)
  const count = useAppSelector(selectVisibleTasks).length

  return (
    <BottomSheet title="Фильтры" onClose={onClose}>
      <label className={styles.search}>
        <Search size={18} />
        <input
          type="search"
          placeholder="Поиск по задачам"
          value={search}
          onChange={(event) => dispatch(setSearch(event.target.value))}
        />
      </label>

      <p className={styles.label}>Статус</p>
      <div className={styles.chips}>
        <button
          type="button"
          className={clsx(styles.chip, status === '' && styles.chipActive)}
          onClick={() => dispatch(setStatusFilter(''))}
        >
          Все
        </button>
        {STATUSES.map((item) => (
          <button
            key={item.id}
            type="button"
            data-tone={item.tone}
            className={clsx(styles.chip, styles.statusChip, status === item.id && styles.chipActive)}
            onClick={() => dispatch(setStatusFilter(item.id))}
          >
            {item.title}
          </button>
        ))}
      </div>

      <p className={styles.label}>Сортировка</p>
      <div className={styles.chips}>
        {SORT_OPTIONS.map((item) => (
          <button
            key={item.value}
            type="button"
            className={clsx(styles.chip, sort === item.value && styles.chipActive)}
            onClick={() => dispatch(setSort(item.value))}
          >
            {item.label}
          </button>
        ))}
      </div>

      <label className={styles.toggle}>
        <span>Только мои задачи</span>
        <input type="checkbox" checked={onlyMine} onChange={(event) => dispatch(setOnlyMine(event.target.checked))} />
      </label>

      <div className={styles.actions}>
        <Button variant="secondary" size="lg" onClick={() => dispatch(resetFilters())}>
          Сбросить
        </Button>
        <Button size="lg" onClick={onClose}>
          Показать {count} {plural(count, ['задачу', 'задачи', 'задач'])}
        </Button>
      </div>
    </BottomSheet>
  )
}
