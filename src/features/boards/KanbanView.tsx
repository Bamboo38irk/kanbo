import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  pointerWithin,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragMoveEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import TaskCard from '@/features/tasks/TaskCard'
import { moveTask } from '@/features/tasks/tasksSlice'
import { moveBoard } from './boardsSlice'
import { openBoardPanel } from '@/features/ui/uiSlice'
import type { Board, Task } from '@/types'
import KanbanColumn from './KanbanColumn'
import styles from './KanbanView.module.scss'

const findDropTarget: CollisionDetection = (args) => {
  const collisions = pointerWithin(args)

  if (args.active.data.current?.type === 'board') {
    return collisions.filter((item) => String(item.id).startsWith('board-'))
  }

  const overTask = collisions.find((item) => String(item.id).startsWith('task-'))
  return overTask ? [overTask] : collisions
}

interface DropTarget {
  boardId: string
  beforeTaskId?: string
}

interface KanbanViewProps {
  boards: Board[]
  tasks: Task[]
}

export default function KanbanView({ boards, tasks }: KanbanViewProps) {
  const dispatch = useAppDispatch()
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const [draggedBoard, setDraggedBoard] = useState<Board | null>(null)
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null)
  const isManualOrder = useAppSelector((state) => state.ui.sort === 'manual')

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  )

  function getBoardTasks(boardId: string) {
    const boardTasks = tasks.filter((task) => task.boardId === boardId)
    return [
      ...boardTasks.filter((task) => task.status !== 'done'),
      ...boardTasks.filter((task) => task.status === 'done'),
    ]
  }

  function findTarget({ active, over }: DragMoveEvent): DropTarget | null {
    const draggedTask = tasks.find((task) => task.id === active.id)
    if (!over || !draggedTask) return null

    const data = over.data.current as { boardId: string; taskId?: string }
    if (data.taskId === active.id) {
      return { boardId: data.boardId, beforeTaskId: data.taskId }
    }

    const column = getBoardTasks(data.boardId).filter((task) => task.id !== active.id)
    let beforeTaskId = data.taskId

    const dragged = active.rect.current.translated
    const isLowerHalf = dragged !== null && dragged.top + dragged.height / 2 > over.rect.top + over.rect.height / 2
    if (data.taskId && isLowerHalf) {
      const index = column.findIndex((task) => task.id === data.taskId)
      beforeTaskId = column[index + 1]?.id
    }

    const before = column.find((task) => task.id === beforeTaskId)
    const firstDone = column.find((task) => task.status === 'done')
    const isDone = draggedTask.status === 'done'
    if ((!isDone && (!before || before.status === 'done')) || (isDone && before && before.status !== 'done')) {
      beforeTaskId = firstDone?.id
    }

    return { boardId: data.boardId, beforeTaskId }
  }

  function handleDragMove(event: DragMoveEvent) {
    const next = findTarget(event)
    if (next?.boardId !== dropTarget?.boardId || next?.beforeTaskId !== dropTarget?.beforeTaskId) {
      setDropTarget(next)
    }
  }

  function handleDragStart({ active }: DragStartEvent) {
    if (active.data.current?.type === 'board') {
      setDraggedBoard(boards.find((board) => board.id === active.data.current?.boardId) ?? null)
    } else {
      setDraggedTask(tasks.find((task) => task.id === active.id) ?? null)
    }
  }

  function handleDragCancel() {
    setDraggedTask(null)
    setDraggedBoard(null)
    setDropTarget(null)
  }

  function handleBoardDrop(boardId: string, targetBoardId: string) {
    const from = boards.findIndex((board) => board.id === boardId)
    const to = boards.findIndex((board) => board.id === targetBoardId)
    if (from === to) return

    const beforeBoardId = from < to ? boards[to + 1]?.id : targetBoardId
    dispatch(moveBoard({ boardId, beforeBoardId }))
  }

  function handleDragEnd(event: DragEndEvent) {
    handleDragCancel()
    const { active, over } = event
    if (!over) return

    if (active.data.current?.type === 'board') {
      handleBoardDrop(active.data.current.boardId, over.data.current?.boardId)
      return
    }

    const target = findTarget(event)
    if (!target || target.beforeTaskId === active.id) return

    dispatch(moveTask({ taskId: String(active.id), boardId: target.boardId, beforeTaskId: target.beforeTaskId }))
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={findDropTarget}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className={styles.board}>
        {boards.map((board) => (
          <KanbanColumn
            key={board.id}
            board={board}
            tasks={getBoardTasks(board.id)}
            dropBeforeTaskId={
              isManualOrder && dropTarget?.boardId === board.id ? (dropTarget.beforeTaskId ?? 'end') : undefined
            }
          />
        ))}

        <button type="button" className={styles.addBoard} data-panel-trigger onClick={() => dispatch(openBoardPanel())}>
          <span className={styles.addIcon}>
            <Plus size={20} />
          </span>
          Добавить доску
        </button>
      </div>

      <DragOverlay dropAnimation={null}>
        {draggedTask && <TaskCard task={draggedTask} isOverlay />}
        {draggedBoard && (
          <div className={styles.boardPreview}>
            <strong>{draggedBoard.name}</strong>
            <span>{tasks.filter((task) => task.boardId === draggedBoard.id).length}</span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
