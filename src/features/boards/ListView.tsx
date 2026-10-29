import clsx from 'clsx'
import { SearchX } from 'lucide-react'
import { useAppDispatch } from '@/app/hooks'
import AvatarGroup from '@/components/ui/AvatarGroup'
import EmptyState from '@/components/ui/EmptyState'
import { getStatus } from '@/config/statuses'
import { openTask } from '@/features/ui/uiSlice'
import type { Board, Task } from '@/types'
import { daysUntil, formatDue } from '@/utils/date'
import styles from './ListView.module.scss'

interface ListViewProps {
  boards: Board[]
  tasks: Task[]
}

export default function ListView({ boards, tasks }: ListViewProps) {
  const dispatch = useAppDispatch()

  if (tasks.length === 0) {
    return <EmptyState icon={<SearchX size={32} />}>Задач не найдено</EmptyState>
  }

  return (
    <div className={styles.groups}>
      {boards.map((board) => {
        const boardTasks = tasks.filter((task) => task.boardId === board.id)
        if (boardTasks.length === 0) return null

        return (
          <section key={board.id} className={styles.group}>
            <h2 className={styles.groupTitle}>
              {board.name}
              <span className={styles.count}>{boardTasks.length}</span>
            </h2>

            <div className={styles.wrapper}>
              <table className={styles.table}>
                <colgroup>
                  <col />
                  <col className={styles.colStatus} />
                  <col className={styles.colPeople} />
                  <col className={styles.colDue} />
                </colgroup>
                <thead>
                  <tr>
                    <th>Задача</th>
                    <th>Статус</th>
                    <th>Исполнители</th>
                    <th>Срок</th>
                  </tr>
                </thead>
                <tbody>
                  {boardTasks.map((task) => {
                    const status = getStatus(task.status)
                    const isOverdue = task.dueDate && task.status !== 'done' && daysUntil(task.dueDate) < 0

                    return (
                      <tr key={task.id} data-panel-trigger onClick={() => dispatch(openTask(task.id))}>
                        <td>
                          <strong className={styles.title}>{task.title}</strong>
                          <span className={styles.description}>{task.description}</span>
                        </td>
                        <td>
                          <span className={styles.status} data-tone={status.tone}>
                            {status.title}
                          </span>
                        </td>
                        <td>
                          <AvatarGroup userIds={task.assigneeIds} size={24} />
                        </td>
                        <td className={clsx(styles.due, isOverdue && styles.overdue)}>
                          {task.dueDate ? formatDue(task.dueDate) : '—'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )
      })}
    </div>
  )
}
