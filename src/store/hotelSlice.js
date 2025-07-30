import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  hotels: [],
  bestOffers: [],
  recommendedHotels: [],
  selectedHotel: null,
  bookings: [],
  loading: false,
  error: null,
}

const hotelSlice = createSlice({
  name: 'hotel',
  initialState,
  reducers: {
    setHotels: (state, action) => {
      state.hotels = action.payload
    },
    setBestOffers: (state, action) => {
      state.bestOffers = action.payload
    },
    setRecommendedHotels: (state, action) => {
      state.recommendedHotels = action.payload
    },
    setSelectedHotel: (state, action) => {
      state.selectedHotel = action.payload
    },
    setBookings: (state, action) => {
      state.bookings = action.payload
    },
    addBooking: (state, action) => {
      state.bookings.push(action.payload)
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const {
  setHotels,
  setBestOffers,
  setRecommendedHotels,
  setSelectedHotel,
  setBookings,
  addBooking,
  setLoading,
  setError,
} = hotelSlice.actions

export default hotelSlice.reducer 