import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { dataReset, initialData } from '@/app/initialData'
import type { RootState } from '@/app/store'
import type { Board } from '@/types'

const boardsSlice = createSlice({
  name: 'boards',
  initialState: { items: initialData.boards },
  reducers: {
    addBoard(state, action: PayloadAction<Board>) {
      state.items.push(action.payload)
    },
    renameBoard(state, action: PayloadAction<{ boardId: string; name: string }>) {
      const board = state.items.find((item) => item.id === action.payload.boardId)
      if (board) {
        board.name = action.payload.name
      }
    },
    moveBoard(state, action: PayloadAction<{ boardId: string; beforeBoardId?: string }>) {
      const index = state.items.findIndex((board) => board.id === action.payload.boardId)
      if (index === -1) return

      const [board] = state.items.splice(index, 1)
      const beforeIndex = state.items.findIndex((item) => item.id === action.payload.beforeBoardId)
      if (beforeIndex === -1) {
        state.items.push(board)
      } else {
        state.items.splice(beforeIndex, 0, board)
      }
    },
    setBoardMembers(state, action: PayloadAction<{ boardId: string; memberIds: string[] }>) {
      const board = state.items.find((item) => item.id === action.payload.boardId)
      if (board) {
        board.memberIds = action.payload.memberIds
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(dataReset, (state, action) => {
      state.items = action.payload.boards
    })
  },
})

export const { addBoard, renameBoard, moveBoard, setBoardMembers } = boardsSlice.actions
export default boardsSlice.reducer

export const selectBoards = (state: RootState) => state.boards.items
