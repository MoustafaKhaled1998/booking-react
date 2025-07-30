import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null,
}

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setBookings: (state, action) => {
      state.bookings = action.payload
    },
    addBooking: (state, action) => {
      state.bookings.push(action.payload)
      const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]')
      allBookings.push(action.payload)
      localStorage.setItem('bookings', JSON.stringify(allBookings))
    },
    updateBooking: (state, action) => {
      const index = state.bookings.findIndex(booking => booking.id === action.payload.id)
      if (index !== -1) {
        state.bookings[index] = action.payload
        const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]')
        const bookingIndex = allBookings.findIndex(booking => booking.id === action.payload.id)
        if (bookingIndex !== -1) {
          allBookings[bookingIndex] = action.payload
          localStorage.setItem('bookings', JSON.stringify(allBookings))
        }
      }
    },
    removeBooking: (state, action) => {
      state.bookings = state.bookings.filter(booking => booking.id !== action.payload)
      const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]')
      const filteredBookings = allBookings.filter(booking => booking.id !== action.payload)
      localStorage.setItem('bookings', JSON.stringify(filteredBookings))
    },
    setCurrentBooking: (state, action) => {
      state.currentBooking = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    clearBookings: (state) => {
      state.bookings = []
      state.currentBooking = null
      state.error = null
    },
    loadBookingsFromStorage: (state, action) => {
      state.bookings = action.payload
    },
  },
})

export const { 
  setBookings, 
  addBooking, 
  updateBooking, 
  removeBooking, 
  setCurrentBooking, 
  setLoading, 
  setError, 
  clearBookings,
  loadBookingsFromStorage
} = bookingSlice.actions

export default bookingSlice.reducer 