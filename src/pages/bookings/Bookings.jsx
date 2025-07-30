import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadBookingsFromStorage, setLoading, setError } from '../../store/bookingSlice'

const Bookings = () => {
  const dispatch = useDispatch()
  const { bookings, loading, error } = useSelector((state) => state.booking)
  const { user } = useSelector((state) => state.user)

  useEffect(() => {
    const fetchBookings = async () => {
      dispatch(setLoading(true))
      try {
        const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]')
        const userBookings = allBookings.filter(booking => booking.userId === user.id)
        dispatch(loadBookingsFromStorage(userBookings))
      } catch (err) {
        dispatch(setError('Failed to fetch bookings'))
      } finally {
        dispatch(setLoading(false))
      }
    }

    if (user) {
      fetchBookings()
    }
  }, [dispatch, user])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSafeString = (value, fallback = '') => {
    if (typeof value === 'string') return value
    if (typeof value === 'number') return value.toString()
    return fallback
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="mt-2 text-gray-600">Manage your hotel reservations</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600">You haven't made any bookings yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {getSafeString(booking.hotel?.name, 'Hotel Name')}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                      {getSafeString(booking.status, 'unknown')}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-in:</span>
                      <span className="font-medium">{formatDate(booking.checkIn)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-out:</span>
                      <span className="font-medium">{formatDate(booking.checkOut)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Guests:</span>
                      <span className="font-medium">{booking.guests}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Room Type:</span>
                      <span className="font-medium capitalize">{getSafeString(booking.roomType, 'standard')}</span>
                    </div>
                    
                    {booking.specialRequests && (
                      <div className="pt-3 border-t border-gray-200">
                        <span className="text-gray-600 text-sm">Special Requests:</span>
                        <p className="text-sm text-gray-700 mt-1">{getSafeString(booking.specialRequests)}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">
                        ${typeof booking.totalPrice === 'number' ? booking.totalPrice : 'N/A'}
                      </span>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Bookings 