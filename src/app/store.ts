import { configureStore } from '@reduxjs/toolkit'
import { saveData, saveSession } from '@/api/storage'
import authReducer from '@/features/auth/authSlice'
import boardsReducer from '@/features/boards/boardsSlice'
import notificationsReducer from '@/features/notifications/notificationsSlice'
import tasksReducer from '@/features/tasks/tasksSlice'
import uiReducer from '@/features/ui/uiSlice'
import usersReducer from '@/features/users/usersSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    boards: boardsReducer,
    tasks: tasksReducer,
    notifications: notificationsReducer,
    ui: uiReducer,
  },
})

let saveTimer: ReturnType<typeof setTimeout>

store.subscribe(() => {
  saveSession(store.getState().auth.userId)

  clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    const state = store.getState()
    saveData({
      users: state.users.items,
      boards: state.boards.items,
      tasks: state.tasks.items,
      notifications: state.notifications.items,
    })
  }, 300)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
