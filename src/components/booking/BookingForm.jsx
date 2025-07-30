import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { addBooking, setLoading, setError } from '../../store/bookingSlice'
import api from '../../utils/axios'

const BookingForm = ({ hotelId, onSuccess }) => {
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.booking)
  const { user } = useSelector((state) => state.user)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm()

  const onSubmit = async (data) => {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    try {
      const hotelResponse = await api.get(`/hotels/${hotelId}`)
      const hotel = hotelResponse.data

      const checkIn = new Date(data.checkIn)
      const checkOut = new Date(data.checkOut)
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
      const totalPrice = nights * hotel.price

      const newBooking = {
        id: Date.now().toString(),
        hotelId: hotelId,
        hotel: hotel,
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        guests: parseInt(data.guests),
        roomType: data.roomType,
        specialRequests: data.specialRequests || '',
        totalPrice: totalPrice,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      }
      
      dispatch(addBooking(newBooking))
      reset()
      if (onSuccess) {
        onSuccess(newBooking)
      }
    } catch (err) {
      dispatch(setError('Booking failed'))
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Book Your Stay</h3>
      
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-1">
              Check-in Date
            </label>
            <input
              type="date"
              id="checkIn"
              {...register('checkIn', { 
                required: 'Check-in date is required',
                validate: value => {
                  const today = new Date()
                  const selectedDate = new Date(value)
                  return selectedDate >= today || 'Check-in date must be today or later'
                }
              })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.checkIn ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.checkIn && (
              <p className="mt-1 text-sm text-red-600">{errors.checkIn.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-1">
              Check-out Date
            </label>
            <input
              type="date"
              id="checkOut"
              {...register('checkOut', { 
                required: 'Check-out date is required',
                validate: value => {
                  const checkIn = watch('checkIn')
                  if (!checkIn) return true
                  const checkInDate = new Date(checkIn)
                  const checkOutDate = new Date(value)
                  return checkOutDate > checkInDate || 'Check-out date must be after check-in date'
                }
              })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.checkOut ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.checkOut && (
              <p className="mt-1 text-sm text-red-600">{errors.checkOut.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Guests
            </label>
            <select
              id="guests"
              {...register('guests', { 
                required: 'Number of guests is required',
                min: { value: 1, message: 'At least 1 guest required' },
                max: { value: 10, message: 'Maximum 10 guests allowed' }
              })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.guests ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select guests</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
              ))}
            </select>
            {errors.guests && (
              <p className="mt-1 text-sm text-red-600">{errors.guests.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="roomType" className="block text-sm font-medium text-gray-700 mb-1">
              Room Type
            </label>
            <select
              id="roomType"
              {...register('roomType', { 
                required: 'Room type is required'
              })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.roomType ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select room type</option>
              <option value="standard">Standard Room</option>
              <option value="deluxe">Deluxe Room</option>
              <option value="suite">Suite</option>
              <option value="presidential">Presidential Suite</option>
            </select>
            {errors.roomType && (
              <p className="mt-1 text-sm text-red-600">{errors.roomType.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">
            Special Requests (Optional)
          </label>
          <textarea
            id="specialRequests"
            rows="3"
            {...register('specialRequests')}
            placeholder="Any special requests or preferences..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Book Now'}
        </button>
      </form>
    </div>
  )
}

export default BookingForm 