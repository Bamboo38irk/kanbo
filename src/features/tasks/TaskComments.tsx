import { nanoid } from '@reduxjs/toolkit'
import clsx from 'clsx'
import { ArrowUp, Pencil, Trash2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import IconButton from '@/components/ui/IconButton'
import { selectCurrentUser, selectUsers } from '@/features/users/usersSlice'
import type { Comment, Task } from '@/types'
import { timeAgo } from '@/utils/date'
import { addComment, deleteComment, updateComment } from './tasksSlice'
import styles from './TaskComments.module.scss'

export default function TaskComments({ task }: { task: Task }) {
  if (task.comments.length === 0) {
    return <p className={styles.empty}>Пока никто ничего не написал</p>
  }

  return (
    <ul className={styles.list}>
      {task.comments.map((comment) => (
        <CommentItem key={comment.id} taskId={task.id} comment={comment} />
      ))}
    </ul>
  )
}

function CommentItem({ taskId, comment }: { taskId: string; comment: Comment }) {
  const dispatch = useAppDispatch()
  const userId = useAppSelector((state) => state.auth.userId)
  const author = useAppSelector(selectUsers).find((user) => user.id === comment.authorId)
  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState(comment.text)

  const isMine = comment.authorId === userId

  function save() {
    if (!text.trim()) return
    dispatch(
      updateComment({ taskId, commentId: comment.id, text: text.trim(), editedAt: new Date().toISOString() }),
    )
    setIsEditing(false)
  }

  function cancel() {
    setText(comment.text)
    setIsEditing(false)
  }

  function remove() {
    if (window.confirm('Удалить комментарий?')) {
      dispatch(deleteComment({ taskId, commentId: comment.id }))
    }
  }

  return (
    <li className={clsx(styles.comment, isMine && styles.mine)}>
      <Avatar user={author} size={32} />
      <div className={styles.content}>
        <div className={styles.header}>
          <strong>{author?.name}</strong>
          <time dateTime={comment.createdAt}>{timeAgo(comment.createdAt)}</time>
          {comment.editedAt && <span className={styles.edited}>изменено</span>}
          {isMine && !isEditing && (
            <div className={styles.actions}>
              <IconButton label="Изменить комментарий" onClick={() => setIsEditing(true)}>
                <Pencil size={15} />
              </IconButton>
              <IconButton label="Удалить комментарий" className={styles.danger} onClick={remove}>
                <Trash2 size={15} />
              </IconButton>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className={styles.editor}>
            <textarea
              value={text}
              autoFocus
              onChange={(event) => setText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  save()
                }
                if (event.key === 'Escape') {
                  event.stopPropagation()
                  cancel()
                }
              }}
            />
            <div className={styles.editorButtons}>
              <Button size="sm" variant="secondary" onClick={cancel}>
                Отмена
              </Button>
              <Button size="sm" onClick={save} disabled={!text.trim()}>
                Сохранить
              </Button>
            </div>
          </div>
        ) : (
          <p className={styles.text}>{comment.text}</p>
        )}
      </div>
    </li>
  )
}

export function CommentForm({ task }: { task: Task }) {
  const dispatch = useAppDispatch()
  const currentUser = useAppSelector(selectCurrentUser)
  const [text, setText] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!text.trim() || !currentUser) return

    dispatch(
      addComment({
        taskId: task.id,
        comment: {
          id: nanoid(),
          authorId: currentUser.id,
          text: text.trim(),
          createdAt: new Date().toISOString(),
        },
      }),
    )
    setText('')
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Avatar user={currentUser} size={32} />
      <div className={styles.field}>
        <input value={text} placeholder="Написать комментарий" onChange={(event) => setText(event.target.value)} />
        <button type="submit" className={styles.send} aria-label="Отправить" disabled={!text.trim()}>
          <ArrowUp size={18} />
        </button>
      </div>
    </form>
  )
}
