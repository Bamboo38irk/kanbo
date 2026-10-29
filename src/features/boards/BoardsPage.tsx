import clsx from 'clsx'
import { CalendarDays, List, Plus, SquareKanban } from 'lucide-react'
import { useSearchParams } from 'react-router'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import Button from '@/components/ui/Button'
import { selectTasks, selectVisibleTasks } from '@/features/tasks/selectors'
import { createTask, openBoardPanel } from '@/features/ui/uiSlice'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { plural } from '@/utils/text'
import BoardFilters from './BoardFilters'
import { selectBoards } from './boardsSlice'
import CalendarView from './CalendarView'
import KanbanView from './KanbanView'
import ListView from './ListView'
import MobileFiltersButton from './MobileFiltersButton'
import MobileNav from './MobileNav'
import styles from './BoardsPage.module.scss'

const VIEWS = [
  { id: 'kanban', title: 'Доски', icon: SquareKanban },
  { id: 'list', title: 'Список', icon: List },
  { id: 'calendar', title: 'Календарь', icon: CalendarDays },
]

export default function BoardsPage() {
  useDocumentTitle('Мои задачи')

  const dispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const userId = useAppSelector((state) => state.auth.userId) ?? ''
  const boards = useAppSelector(selectBoards)
  const allTasks = useAppSelector(selectTasks)
  const tasks = useAppSelector(selectVisibleTasks)
  const isMobile = useMediaQuery('(max-width: 640px)')
  const requestedView = searchParams.get('view') ?? 'kanban'
  const view = isMobile && requestedView === 'calendar' ? 'kanban' : requestedView
  const activeIndex = Math.max(
    VIEWS.findIndex((item) => item.id === view),
    0,
  )

  const myCount = allTasks.filter((task) => task.status !== 'done' && task.assigneeIds.includes(userId)).length

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>Мои задачи</h1>
          <p>
            {boards.length} {plural(boards.length, ['доска', 'доски', 'досок'])} · {allTasks.length}{' '}
            {plural(allTasks.length, ['задача', 'задачи', 'задач'])} · {myCount} ждут вас
          </p>
        </div>
        <MobileFiltersButton />
        <div className={styles.actions}>
          <Button
            variant="secondary"
            icon={<Plus size={18} />}
            data-panel-trigger
            onClick={() => dispatch(openBoardPanel())}
          >
            Новая доска
          </Button>
          <Button
            icon={<Plus size={18} />}
            data-panel-trigger
            disabled={boards.length === 0}
            onClick={() => dispatch(createTask({ boardId: boards[0].id }))}
          >
            Новая задача
          </Button>
        </div>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.views}>
          <span className={styles.viewPill} style={{ transform: `translateX(${activeIndex * 100}%)` }} />
          {VIEWS.map(({ id, title, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className={clsx(styles.view, view === id && styles.viewActive)}
              onClick={() => setSearchParams(id === 'kanban' ? {} : { view: id })}
            >
              <Icon size={17} />
              {title}
            </button>
          ))}
        </div>
        <BoardFilters showSort={view !== 'calendar'} />
      </div>

      {view === 'kanban' && <KanbanView boards={boards} tasks={tasks} />}
      {view === 'list' && <ListView boards={boards} tasks={tasks} />}
      {view === 'calendar' && <CalendarView boards={boards} tasks={tasks} />}

      <MobileNav
        view={view}
        onViewChange={(id) => setSearchParams(id === 'kanban' ? {} : { view: id })}
        onCreateTask={() => boards.length > 0 && dispatch(createTask({ boardId: boards[0].id }))}
      />
    </div>
  )
}
