import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'

export const selectTasks = (state: RootState) => state.tasks.items

export const selectTask = (state: RootState, id: string | null) =>
  state.tasks.items.find((task) => task.id === id)

const selectUserId = (state: RootState) => state.auth.userId ?? ''
const selectSearch = (state: RootState) => state.ui.search
const selectStatus = (state: RootState) => state.ui.status
const selectOnlyMine = (state: RootState) => state.ui.onlyMine
const selectSort = (state: RootState) => state.ui.sort

export const selectVisibleTasks = createSelector(
  [selectTasks, selectSearch, selectStatus, selectOnlyMine, selectSort, selectUserId],
  (tasks, search, status, onlyMine, sort, userId) => {
    const query = search.trim().toLowerCase()

    const result = tasks.filter((task) => {
      if (status && task.status !== status) return false
      if (onlyMine && !task.assigneeIds.includes(userId)) return false
      return task.title.toLowerCase().includes(query) || task.description.toLowerCase().includes(query)
    })

    if (sort === 'created') {
      result.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    }
    if (sort === 'due') {
      result.sort((a, b) => (a.dueDate ?? '9999').localeCompare(b.dueDate ?? '9999'))
    }
    if (sort === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title, 'ru'))
    }
    return result
  },
)
