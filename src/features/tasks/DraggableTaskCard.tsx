import { useDraggable, useDroppable } from '@dnd-kit/core'
import type { Task } from '@/types'
import TaskCard from './TaskCard'
import styles from './DraggableTaskCard.module.scss'

interface DraggableTaskCardProps {
  task: Task
  dropLine?: 'before' | 'after'
}

export default function DraggableTaskCard({ task, dropLine }: DraggableTaskCardProps) {
  const { setNodeRef: setDropRef } = useDroppable({
    id: `task-${task.id}`,
    data: { boardId: task.boardId, taskId: task.id },
  })
  const { setNodeRef: setDragRef, attributes, listeners, isDragging } = useDraggable({ id: task.id })

  return (
    <div ref={setDropRef} className={styles.wrapper}>
      {dropLine && <span className={styles.line} data-position={dropLine} />}
      <div ref={setDragRef} {...attributes} {...listeners}>
        <TaskCard task={task} isDragging={isDragging} />
      </div>
    </div>
  )
}
