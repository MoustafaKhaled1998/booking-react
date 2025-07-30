import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.error = null
      localStorage.removeItem('authToken')
    },
    setAuthToken: (state, action) => {
      localStorage.setItem('authToken', action.payload)
    },
  },
})

export const { setUser, setLoading, setError, logout, setAuthToken } = userSlice.actions
export default userSlice.reducer 