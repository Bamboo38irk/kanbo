import clsx from 'clsx'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useState } from 'react'
import { useAppDispatch } from '@/app/hooks'
import Button from '@/components/ui/Button'
import IconButton from '@/components/ui/IconButton'
import { createTask, openTask } from '@/features/ui/uiSlice'
import type { Board, Task } from '@/types'
import { WEEK_DAYS, formatMonth, getCalendarDays, getMonthStart, toDateKey } from '@/utils/date'
import styles from './CalendarView.module.scss'

interface CalendarViewProps {
  boards: Board[]
  tasks: Task[]
}

export default function CalendarView({ boards, tasks }: CalendarViewProps) {
  const dispatch = useAppDispatch()
  const [month, setMonth] = useState(() => getMonthStart(new Date()))
  const today = toDateKey(new Date())

  function changeMonth(diff: number) {
    setMonth(new Date(month.getFullYear(), month.getMonth() + diff, 1))
  }

  return (
    <div className={styles.calendar}>
      <header className={styles.header}>
        <h2>{formatMonth(month)}</h2>
        <div className={styles.controls}>
          <IconButton label="Предыдущий месяц" onClick={() => changeMonth(-1)}>
            <ChevronLeft size={20} />
          </IconButton>
          <Button variant="secondary" size="sm" onClick={() => setMonth(getMonthStart(new Date()))}>
            Сегодня
          </Button>
          <IconButton label="Следующий месяц" onClick={() => changeMonth(1)}>
            <ChevronRight size={20} />
          </IconButton>
        </div>
      </header>

      <div className={styles.weekDays}>
        {WEEK_DAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className={styles.grid}>
        {getCalendarDays(month).map((day) => {
          const dayTasks = tasks.filter((task) => task.dueDate === day.key)

          return (
            <div
              key={day.key}
              className={clsx(styles.day, !day.isCurrentMonth && styles.otherMonth, day.key === today && styles.today)}
            >
              <div className={styles.dayHeader}>
                <span className={styles.dayNumber}>{day.day}</span>
                <button
                  type="button"
                  className={styles.add}
                  aria-label="Добавить задачу на этот день"
                  data-panel-trigger
                  onClick={() => dispatch(createTask({ boardId: boards[0].id, dueDate: day.key }))}
                >
                  <Plus size={14} />
                </button>
              </div>

              {dayTasks.map((task) => (
                <button
                  key={task.id}
                  type="button"
                  className={clsx(styles.task, task.status === 'done' && styles.taskDone)}
                  data-panel-trigger
                  onClick={() => dispatch(openTask(task.id))}
                >
                  {task.title}
                </button>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
