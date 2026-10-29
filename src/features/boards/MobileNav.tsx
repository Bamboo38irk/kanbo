import clsx from 'clsx'
import { ChevronRight, List, ListPlus, Plus, SquareKanban, SquarePlus } from 'lucide-react'
import { useState } from 'react'
import { useAppDispatch } from '@/app/hooks'
import BottomSheet from '@/components/ui/BottomSheet'
import { openBoardPanel } from '@/features/ui/uiSlice'
import styles from './MobileNav.module.scss'

interface MobileNavProps {
  view: string
  onViewChange: (view: string) => void
  onCreateTask: () => void
}

export default function MobileNav({ view, onViewChange, onCreateTask }: MobileNavProps) {
  const dispatch = useAppDispatch()
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  return (
    <>
      <nav className={styles.nav}>
        <button
          type="button"
          className={clsx(styles.item, view === 'kanban' && styles.active)}
          onClick={() => onViewChange('kanban')}
        >
          <SquareKanban size={22} />
          Доски
        </button>

        <button type="button" className={styles.create} aria-label="Создать" onClick={() => setIsCreateOpen(true)}>
          <Plus size={24} />
        </button>

        <button
          type="button"
          className={clsx(styles.item, view === 'list' && styles.active)}
          onClick={() => onViewChange('list')}
        >
          <List size={22} />
          Список
        </button>
      </nav>

      {isCreateOpen && (
        <BottomSheet title="Создать" onClose={() => setIsCreateOpen(false)}>
          <div className={styles.options}>
            <button
              type="button"
              className={styles.option}
              onClick={() => {
                setIsCreateOpen(false)
                onCreateTask()
              }}
            >
              <span className={styles.optionIcon}>
                <ListPlus size={22} />
              </span>
              <span className={styles.optionText}>
                <strong>Задачу</strong>
                <small>Добавить задачу в одну из досок</small>
              </span>
              <ChevronRight size={18} />
            </button>
            <button
              type="button"
              className={styles.option}
              onClick={() => {
                setIsCreateOpen(false)
                dispatch(openBoardPanel())
              }}
            >
              <span className={styles.optionIcon}>
                <SquarePlus size={22} />
              </span>
              <span className={styles.optionText}>
                <strong>Доску</strong>
                <small>Новая сфера, например «Здоровье»</small>
              </span>
              <ChevronRight size={18} />
            </button>
          </div>
        </BottomSheet>
      )}
    </>
  )
}
