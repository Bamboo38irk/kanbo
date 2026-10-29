import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { dataReset, initialData } from '@/app/initialData'
import type { Comment, Task } from '@/types'

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: { items: initialData.tasks },
  reducers: {
    addTask(state, action: PayloadAction<Task>) {
      state.items.unshift(action.payload)
    },
    updateTask(state, action: PayloadAction<Task>) {
      const index = state.items.findIndex((task) => task.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = action.payload
      }
    },
    moveTask(state, action: PayloadAction<{ taskId: string; boardId: string; beforeTaskId?: string }>) {
      const { taskId, boardId, beforeTaskId } = action.payload
      const index = state.items.findIndex((task) => task.id === taskId)
      if (index === -1) return

      const [task] = state.items.splice(index, 1)
      task.boardId = boardId

      const beforeIndex = state.items.findIndex((item) => item.id === beforeTaskId)
      if (beforeIndex === -1) {
        state.items.push(task)
      } else {
        state.items.splice(beforeIndex, 0, task)
      }
    },
    deleteTask(state, action: PayloadAction<string>) {
      state.items = state.items.filter((task) => task.id !== action.payload)
    },
    addComment(state, action: PayloadAction<{ taskId: string; comment: Comment }>) {
      const task = state.items.find((item) => item.id === action.payload.taskId)
      task?.comments.push(action.payload.comment)
    },
    updateComment(
      state,
      action: PayloadAction<{ taskId: string; commentId: string; text: string; editedAt: string }>,
    ) {
      const task = state.items.find((item) => item.id === action.payload.taskId)
      const comment = task?.comments.find((item) => item.id === action.payload.commentId)
      if (comment) {
        comment.text = action.payload.text
        comment.editedAt = action.payload.editedAt
      }
    },
    deleteComment(state, action: PayloadAction<{ taskId: string; commentId: string }>) {
      const task = state.items.find((item) => item.id === action.payload.taskId)
      if (task) {
        task.comments = task.comments.filter((item) => item.id !== action.payload.commentId)
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(dataReset, (state, action) => {
      state.items = action.payload.tasks
    })
  },
})

export const { addTask, updateTask, moveTask, deleteTask, addComment, updateComment, deleteComment } =
  tasksSlice.actions
export default tasksSlice.reducer
