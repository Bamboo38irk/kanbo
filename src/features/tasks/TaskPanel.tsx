import { nanoid } from '@reduxjs/toolkit'
import clsx from 'clsx'
import { Check, Plus, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import Button from '@/components/ui/Button'
import DatePicker from '@/components/ui/DatePicker'
import IconButton from '@/components/ui/IconButton'
import PeoplePicker from '@/components/ui/PeoplePicker'
import Select from '@/components/ui/Select'
import SidePanel, { SidePanelBody, SidePanelFooter, SidePanelHeader } from '@/components/ui/SidePanel'
import { useCloseSidePanel } from '@/components/ui/sidePanelContext'
import { STATUSES } from '@/config/statuses'
import { selectBoards } from '@/features/boards/boardsSlice'
import { closePanel } from '@/features/ui/uiSlice'
import { selectUser, selectUsers } from '@/features/users/usersSlice'
import type { Status, Subtask } from '@/types'
import { formatDate, toDateKey } from '@/utils/date'
import { byGender } from '@/utils/text'
import { selectTask } from './selectors'
import TaskComments, { CommentForm } from './TaskComments'
import { addTask, deleteTask, updateTask } from './tasksSlice'
import styles from './TaskPanel.module.scss'

interface TaskValues {
  boardId: string
  title: string
  description: string
  status: Status
  dueDate: string
  assigneeIds: string[]
  subtasks: Subtask[]
}

export default function TaskPanel() {
  const dispatch = useAppDispatch()
  const editingTaskId = useAppSelector((state) => state.ui.editingTaskId)

  return (
    <SidePanel label="Задача" onClose={() => dispatch(closePanel())}>
      <TaskPanelContent key={editingTaskId ?? 'new'} />
    </SidePanel>
  )
}

function TaskPanelContent() {
  const dispatch = useAppDispatch()
  const userId = useAppSelector((state) => state.auth.userId) ?? ''
  const editingTaskId = useAppSelector((state) => state.ui.editingTaskId)
  const newTask = useAppSelector((state) => state.ui.newTask)
  const task = useAppSelector((state) => selectTask(state, editingTaskId))
  const creator = useAppSelector((state) => selectUser(state, task?.creatorId))
  const boards = useAppSelector(selectBoards)
  const users = useAppSelector(selectUsers)

  const [values, setValues] = useState<TaskValues>({
    boardId: task?.boardId ?? newTask?.boardId ?? '',
    title: task?.title ?? '',
    description: task?.description ?? '',
    status: task?.status ?? 'todo',
    dueDate: task?.dueDate ?? newTask?.dueDate ?? '',
    assigneeIds: task?.assigneeIds ?? [userId],
    subtasks: task?.subtasks ?? [],
  })
  const [newSubtask, setNewSubtask] = useState('')
  const [error, setError] = useState('')
  const [isCreated, setIsCreated] = useState(false)
  const closeAnimated = useCloseSidePanel()

  const board = boards.find((item) => item.id === values.boardId)
  if (!board) return null

  const members = users.filter((user) => board.memberIds.includes(user.id))
  const isDone = values.status === 'done'
  const doneCount = values.subtasks.filter((item) => item.done).length

  function change(changes: Partial<TaskValues>) {
    const next = { ...values, ...changes }
    setValues(next)

    if (task) {
      dispatch(
        updateTask({
          ...task,
          ...next,
          title: next.title.trim() ? next.title : task.title,
          dueDate: next.dueDate || null,
        }),
      )
    }
  }

  function changeBoard(boardId: string) {
    const nextBoard = boards.find((item) => item.id === boardId)
    change({
      boardId,
      assigneeIds: values.assigneeIds.filter((id) => nextBoard?.memberIds.includes(id)),
    })
  }

  function addSubtask() {
    if (!newSubtask.trim()) return
    change({ subtasks: [...values.subtasks, { id: nanoid(), text: newSubtask.trim(), done: false }] })
    setNewSubtask('')
  }

  function handleCreate() {
    if (!values.title.trim()) {
      setError('Введите название задачи')
      return
    }

    setIsCreated(true)
    dispatch(
      addTask({
        ...values,
        id: nanoid(),
        title: values.title.trim(),
        dueDate: values.dueDate || null,
        creatorId: userId,
        comments: [],
        createdAt: new Date().toISOString(),
      }),
    )
    closeAnimated()
  }

  function handleDelete() {
    if (task && window.confirm(`Удалить задачу «${task.title}»?`)) {
      dispatch(deleteTask(task.id))
      dispatch(closePanel())
    }
  }

  return (
    <>
      <SidePanelHeader>
        {task ? (
          <>
            <button
              type="button"
              className={clsx(styles.doneButton, isDone && styles.doneButtonActive)}
              onClick={() => change({ status: isDone ? 'todo' : 'done' })}
            >
              <Check size={16} />
              {isDone ? 'Выполнено' : 'Отметить выполненной'}
            </button>
            <IconButton label="Удалить задачу" className={styles.delete} onClick={handleDelete}>
              <Trash2 size={18} />
            </IconButton>
          </>
        ) : (
          <h2>Новая задача</h2>
        )}
      </SidePanelHeader>

      <SidePanelBody>
        <textarea
          className={styles.title}
          rows={1}
          value={values.title}
          placeholder="Название задачи"
          autoFocus={!task}
          onChange={(event) => {
            change({ title: event.target.value })
            setError('')
          }}
        />
        {error && <p className={styles.error}>{error}</p>}
        {task && creator && (
          <p className={styles.meta}>
            {byGender(creator, 'Создал', 'Создала')} {creator.name}, {formatDate(toDateKey(new Date(task.createdAt)))}
          </p>
        )}

        <dl className={styles.fields}>
          <div>
            <dt>Исполнители</dt>
            <dd>
              <PeoplePicker
                users={members}
                selectedIds={values.assigneeIds}
                currentUserId={userId}
                addLabel="Назначить"
                onChange={(assigneeIds) => change({ assigneeIds })}
              />
            </dd>
          </div>

          <div>
            <dt>Срок</dt>
            <dd>
              <DatePicker value={values.dueDate} onChange={(dueDate) => change({ dueDate })} />
            </dd>
          </div>

          <div>
            <dt>Доска</dt>
            <dd>
              <Select
                label="Доска"
                variant="inline"
                value={values.boardId}
                options={boards.map((item) => ({ value: item.id, label: item.name }))}
                onChange={changeBoard}
              />
            </dd>
          </div>

          <div>
            <dt>Статус</dt>
            <dd>
              {STATUSES.map((status) => (
                <button
                  key={status.id}
                  type="button"
                  data-tone={status.tone}
                  className={clsx(styles.status, values.status === status.id && styles.statusActive)}
                  onClick={() => change({ status: status.id })}
                >
                  {status.title}
                </button>
              ))}
            </dd>
          </div>
        </dl>

        <section className={styles.section}>
          <h3>Описание</h3>
          <textarea
            className={styles.description}
            value={values.description}
            placeholder="Добавьте детали: адреса, ссылки, что купить"
            onChange={(event) => change({ description: event.target.value })}
          />
        </section>

        <section className={styles.section}>
          <h3>
            Подзадачи
            {values.subtasks.length > 0 && (
              <span>
                {doneCount} из {values.subtasks.length}
              </span>
            )}
          </h3>
          <ul className={styles.subtasks}>
            {values.subtasks.map((item) => (
              <li key={item.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() =>
                      change({
                        subtasks: values.subtasks.map((entry) =>
                          entry.id === item.id ? { ...entry, done: !entry.done } : entry,
                        ),
                      })
                    }
                  />
                  <span className={clsx(item.done && styles.subtaskDone)}>{item.text}</span>
                </label>
                <button
                  type="button"
                  className={styles.removeSubtask}
                  aria-label="Удалить подзадачу"
                  onClick={() => change({ subtasks: values.subtasks.filter((entry) => entry.id !== item.id) })}
                >
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>
          <div className={styles.addSubtask}>
            <Plus size={16} />
            <input
              value={newSubtask}
              placeholder="Добавить подзадачу"
              onChange={(event) => setNewSubtask(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') addSubtask()
              }}
              onBlur={addSubtask}
            />
          </div>
        </section>

        {task && (
          <section className={styles.section}>
            <h3>
              Комментарии
              {task.comments.length > 0 && <span>{task.comments.length}</span>}
            </h3>
            <TaskComments task={task} />
          </section>
        )}
      </SidePanelBody>

      {task ? (
        <CommentForm task={task} />
      ) : (
        <SidePanelFooter>
          <Button variant="secondary" onClick={closeAnimated}>
            Отмена
          </Button>
          <Button disabled={isCreated} onClick={handleCreate}>
            Создать задачу
          </Button>
        </SidePanelFooter>
      )}
    </>
  )
}
