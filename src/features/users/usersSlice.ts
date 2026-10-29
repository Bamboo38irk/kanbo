import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { dataReset, initialData } from '@/app/initialData'
import type { RootState } from '@/app/store'

const usersSlice = createSlice({
  name: 'users',
  initialState: { items: initialData.users },
  reducers: {
    updateProfile(state, action: PayloadAction<{ id: string; name: string; avatarUrl?: string }>) {
      const user = state.items.find((item) => item.id === action.payload.id)
      if (user) {
        user.name = action.payload.name
        user.avatarUrl = action.payload.avatarUrl
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(dataReset, (state, action) => {
      state.items = action.payload.users
    })
  },
})

export const { updateProfile } = usersSlice.actions
export default usersSlice.reducer

export const selectUsers = (state: RootState) => state.users.items

export const selectUser = (state: RootState, id: string | null | undefined) =>
  state.users.items.find((user) => user.id === id)

export const selectCurrentUser = (state: RootState) => selectUser(state, state.auth.userId)

export const selectTeammates = createSelector(
  [selectUsers, (state: RootState) => state.auth.userId],
  (users, userId) => users.filter((user) => user.id !== userId),
)
