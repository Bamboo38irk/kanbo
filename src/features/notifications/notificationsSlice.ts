import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { dataReset, initialData } from '@/app/initialData'
import type { RootState } from '@/app/store'
import { deleteTask } from '@/features/tasks/tasksSlice'

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: { items: initialData.notifications },
  reducers: {
    markAsRead(state, action: PayloadAction<string>) {
      const notification = state.items.find((item) => item.id === action.payload)
      if (notification) notification.read = true
    },
    markAllAsRead(state) {
      state.items.forEach((item) => {
        item.read = true
      })
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteTask, (state, action) => {
        state.items = state.items.filter((item) => item.taskId !== action.payload)
      })
      .addCase(dataReset, (state, action) => {
        state.items = action.payload.notifications
      })
  },
})

export const { markAsRead, markAllAsRead } = notificationsSlice.actions
export default notificationsSlice.reducer

export const selectUnreadNotifications = createSelector([(state: RootState) => state.notifications.items], (items) =>
  items.filter((item) => !item.read),
)
