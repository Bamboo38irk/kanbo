import { Check, Ellipsis, Pencil, Trash2 } from 'lucide-react'
import { useAppDispatch } from '@/app/hooks'
import Dropdown, { DropdownItem, DropdownLabel } from '@/components/ui/Dropdown'
import { STATUSES } from '@/config/statuses'
import { openTask } from '@/features/ui/uiSlice'
import type { Task } from '@/types'
import { deleteTask, updateTask } from './tasksSlice'
import styles from './TaskMenu.module.scss'

export default function TaskMenu({ task }: { task: Task }) {
  const dispatch = useAppDispatch()

  function handleDelete() {
    if (window.confirm(`Удалить задачу «${task.title}»?`)) {
      dispatch(deleteTask(task.id))
    }
  }

  return (
    <div className={styles.menu}>
      <Dropdown
        label="Действия с задачей"
        align="right"
        width={220}
        triggerClassName={styles.trigger}
        trigger={<Ellipsis size={18} />}
      >
        {(close) => (
          <>
            <DropdownItem
              icon={<Pencil size={16} />}
              onClick={() => {
                close()
                dispatch(openTask(task.id))
              }}
            >
              Открыть
            </DropdownItem>
            <DropdownLabel>Статус</DropdownLabel>
            {STATUSES.map((status) => (
              <DropdownItem
                key={status.id}
                onClick={() => {
                  close()
                  dispatch(updateTask({ ...task, status: status.id }))
                }}
              >
                <span className={styles.status} data-tone={status.tone}>
                  {status.title}
                </span>
                {status.id === task.status && <Check size={16} className={styles.check} />}
              </DropdownItem>
            ))}
            <DropdownItem
              icon={<Trash2 size={16} />}
              danger
              onClick={() => {
                close()
                handleDelete()
              }}
            >
              Удалить
            </DropdownItem>
          </>
        )}
      </Dropdown>
    </div>
  )
}
