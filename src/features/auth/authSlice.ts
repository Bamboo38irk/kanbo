import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { loginRequest } from '@/api/auth'
import { loadSession } from '@/api/storage'

interface AuthState {
  userId: string | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  userId: loadSession(),
  loading: false,
  error: null,
}

export const login = createAsyncThunk<string, { login: string; password: string }, { rejectValue: string }>(
  'auth/login',
  async ({ login, password }, { rejectWithValue }) => {
    try {
      return await loginRequest(login, password)
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.userId = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.userId = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Не удалось войти'
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
