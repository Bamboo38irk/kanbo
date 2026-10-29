import { useDraggable, useDroppable } from '@dnd-kit/core'
import clsx from 'clsx'
import { Check, Plus } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useAppDispatch } from '@/app/hooks'
import AvatarGroup from '@/components/ui/AvatarGroup'
import IconButton from '@/components/ui/IconButton'
import DraggableTaskCard from '@/features/tasks/DraggableTaskCard'
import { createTask } from '@/features/ui/uiSlice'
import type { Board, Task } from '@/types'
import { renameBoard } from './boardsSlice'
import MembersDialog from './MembersDialog'
import styles from './KanbanColumn.module.scss'

interface KanbanColumnProps {
  board: Board
  tasks: Task[]
  dropBeforeTaskId?: string
}

export default function KanbanColumn({ board, tasks, dropBeforeTaskId }: KanbanColumnProps) {
  const dispatch = useAppDispatch()
  const [isMembersOpen, setIsMembersOpen] = useState(false)
  const [isRenaming, setIsRenaming] = useState(false)
  const [name, setName] = useState(board.name)
  const { setNodeRef, over } = useDroppable({
    id: `board-${board.id}`,
    data: { boardId: board.id },
  })
  const {
    setNodeRef: setHandleRef,
    attributes,
    listeners,
    isDragging,
  } = useDraggable({
    id: `drag-board-${board.id}`,
    data: { type: 'board', boardId: board.id },
    disabled: isRenaming,
  })

  const isOver = over?.data.current?.boardId === board.id

  function startRenaming() {
    setName(board.name)
    setIsRenaming(true)
  }

  function saveName(event: FormEvent) {
    event.preventDefault()
    if (name.trim()) {
      dispatch(renameBoard({ boardId: board.id, name: name.trim() }))
    }
    setIsRenaming(false)
  }

  return (
    <section ref={setNodeRef} className={clsx(styles.column, isOver && styles.over, isDragging && styles.dragging)}>
      <header ref={setHandleRef} className={styles.header} {...attributes} {...listeners}>
        {isRenaming ? (
          <form className={styles.rename} onSubmit={saveName}>
            <input
              value={name}
              autoFocus
              aria-label="Название доски"
              onChange={(event) => setName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') setIsRenaming(false)
              }}
            />
            <IconButton label="Сохранить" type="submit" className={styles.save}>
              <Check size={16} />
            </IconButton>
          </form>
        ) : (
          <>
            <h2>
              <button type="button" className={styles.name} onClick={startRenaming}>
                {board.name}
              </button>
            </h2>
            <span className={styles.count}>{tasks.length}</span>
          </>
        )}
        <button
          type="button"
          className={styles.members}
          aria-label="Участники доски"
          onClick={() => setIsMembersOpen(true)}
        >
          <AvatarGroup userIds={board.memberIds} max={3} size={24} />
        </button>
      </header>

      <div className={styles.cards}>
        {tasks.map((task, index) => {
          let dropLine: 'before' | 'after' | undefined
          if (dropBeforeTaskId === task.id) dropLine = 'before'
          if (dropBeforeTaskId === 'end' && index === tasks.length - 1) dropLine = 'after'
          return <DraggableTaskCard key={task.id} task={task} dropLine={dropLine} />
        })}
        {dropBeforeTaskId === 'end' && tasks.length === 0 && <div className={styles.emptyDrop} />}
      </div>

      <button
        type="button"
        className={styles.add}
        data-panel-trigger
        onClick={() => dispatch(createTask({ boardId: board.id }))}
      >
        <Plus size={16} />
        Добавить задачу
      </button>

      {isMembersOpen && <MembersDialog board={board} onClose={() => setIsMembersOpen(false)} />}
    </section>
  )
}
