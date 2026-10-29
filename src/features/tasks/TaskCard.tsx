import clsx from 'clsx'
import { CalendarDays, CircleCheck, MessageSquare } from 'lucide-react'
import { useAppDispatch } from '@/app/hooks'
import AvatarGroup from '@/components/ui/AvatarGroup'
import { getStatus } from '@/config/statuses'
import { openTask } from '@/features/ui/uiSlice'
import type { Task } from '@/types'
import { daysUntil, formatDate, formatDue } from '@/utils/date'
import TaskMenu from './TaskMenu'
import styles from './TaskCard.module.scss'

interface TaskCardProps {
  task: Task
  isDragging?: boolean
  isOverlay?: boolean
}

export default function TaskCard({ task, isDragging = false, isOverlay = false }: TaskCardProps) {
  const dispatch = useAppDispatch()
  const status = getStatus(task.status)
  const isOverdue = task.dueDate !== null && task.status !== 'done' && daysUntil(task.dueDate) < 0

  const className = clsx(styles.card, isDragging && styles.placeholder, isOverlay && styles.overlay)

  if (task.status === 'done') {
    return (
      <article className={clsx(className, styles.done)} data-panel-trigger onClick={() => dispatch(openTask(task.id))}>
        <div className={styles.doneRow}>
          <CircleCheck size={18} className={styles.doneIcon} />
          <h3 className={styles.doneTitle}>{task.title}</h3>
          {!isOverlay && <TaskMenu task={task} />}
        </div>
        <div className={styles.doneMeta}>
          <AvatarGroup userIds={task.assigneeIds} size={20} />
          {task.dueDate && <span>{formatDate(task.dueDate)}</span>}
        </div>
      </article>
    )
  }

  return (
    <article className={className} data-tone={status.tone} data-panel-trigger onClick={() => dispatch(openTask(task.id))}>
      <div className={styles.top}>
        <span className={styles.status}>{status.title}</span>
        {!isOverlay && <TaskMenu task={task} />}
      </div>

      <h3 className={styles.title}>{task.title}</h3>
      {task.description && <p className={styles.description}>{task.description}</p>}

      <footer className={styles.footer}>
        <AvatarGroup userIds={task.assigneeIds} size={24} />
        <div className={styles.meta}>
          {task.dueDate && (
            <span className={clsx(isOverdue && styles.overdue)}>
              <CalendarDays size={14} />
              {formatDue(task.dueDate)}
            </span>
          )}
          {task.comments.length > 0 && (
            <span>
              <MessageSquare size={14} />
              {task.comments.length}
            </span>
          )}
        </div>
      </footer>
    </article>
  )
}
