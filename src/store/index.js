import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import hotelReducer from './hotelSlice'
import bookingReducer from './bookingSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    hotel: hotelReducer,
    booking: bookingReducer,
  },
}) 