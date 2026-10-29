import { Bell, CheckCheck } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import EmptyState from '@/components/ui/EmptyState'
import styles from '@/components/layout/Menus.module.scss'
import { selectTasks } from '@/features/tasks/selectors'
import { openTask } from '@/features/ui/uiSlice'
import { selectUsers } from '@/features/users/usersSlice'
import { timeAgo } from '@/utils/date'
import { byGender } from '@/utils/text'
import { markAllAsRead, markAsRead, selectUnreadNotifications } from './notificationsSlice'

export default function NotificationsMenu() {
  const dispatch = useAppDispatch()
  const notifications = useAppSelector(selectUnreadNotifications)
  const unreadCount = notifications.length
  const users = useAppSelector(selectUsers)
  const tasks = useAppSelector(selectTasks)

  return (
    <Dropdown
      label="Уведомления"
      align="right"
      width={360}
      triggerClassName={styles.iconTrigger}
      trigger={
        <>
          <Bell size={20} />
          {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
        </>
      }
    >
      {(close) => (
        <>
          <div className={styles.header}>
            <strong>Уведомления</strong>
            {unreadCount > 0 && (
              <button type="button" onClick={() => dispatch(markAllAsRead())}>
                Прочитать все
              </button>
            )}
          </div>

          {notifications.length === 0 && (
            <EmptyState icon={<CheckCheck size={32} />}>Все уведомления прочитаны</EmptyState>
          )}

          <ul className={styles.list}>
            {notifications.map((notification) => {
              const actor = users.find((user) => user.id === notification.actorId)
              const task = tasks.find((item) => item.id === notification.taskId)
              if (!task) return null

              const action =
                notification.type === 'assigned'
                  ? `${byGender(actor, 'назначил', 'назначила')} вам задачу`
                  : `${byGender(actor, 'прокомментировал', 'прокомментировала')} задачу`

              return (
                <li key={notification.id}>
                  <button
                    type="button"
                    className={styles.item}
                    onClick={() => {
                      dispatch(markAsRead(notification.id))
                      dispatch(openTask(task.id))
                      close()
                    }}
                  >
                    <Avatar user={actor} size={36} />
                    <div>
                      <p>
                        <strong>{actor?.name}</strong> {action} <strong>«{task.title}»</strong>
                      </p>
                      <time dateTime={notification.createdAt}>{timeAgo(notification.createdAt)}</time>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </Dropdown>
  )
}
