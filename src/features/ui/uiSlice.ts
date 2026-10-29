import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Status } from '@/types'

export type SortOrder = 'manual' | 'created' | 'due' | 'title'

interface NewTaskParams {
  boardId: string
  dueDate?: string
}

interface UiState {
  search: string
  status: Status | ''
  onlyMine: boolean
  sort: SortOrder
  editingTaskId: string | null
  newTask: NewTaskParams | null
  isBoardPanelOpen: boolean
}

const initialState: UiState = {
  search: '',
  status: '',
  onlyMine: false,
  sort: 'manual',
  editingTaskId: null,
  newTask: null,
  isBoardPanelOpen: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload
    },
    setStatusFilter(state, action: PayloadAction<Status | ''>) {
      state.status = action.payload
    },
    setOnlyMine(state, action: PayloadAction<boolean>) {
      state.onlyMine = action.payload
    },
    setSort(state, action: PayloadAction<SortOrder>) {
      state.sort = action.payload
    },
    resetFilters(state) {
      state.search = ''
      state.status = ''
      state.onlyMine = false
      state.sort = 'manual'
    },
    openTask(state, action: PayloadAction<string>) {
      state.editingTaskId = action.payload
      state.newTask = null
      state.isBoardPanelOpen = false
    },
    createTask(state, action: PayloadAction<NewTaskParams>) {
      state.newTask = action.payload
      state.editingTaskId = null
      state.isBoardPanelOpen = false
    },
    openBoardPanel(state) {
      state.isBoardPanelOpen = true
      state.editingTaskId = null
      state.newTask = null
    },
    closePanel(state) {
      state.editingTaskId = null
      state.newTask = null
      state.isBoardPanelOpen = false
    },
  },
})

export const {
  setSearch,
  setStatusFilter,
  setOnlyMine,
  setSort,
  resetFilters,
  openTask,
  createTask,
  openBoardPanel,
  closePanel,
} = uiSlice.actions
export default uiSlice.reducer
