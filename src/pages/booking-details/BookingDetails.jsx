import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import api from '../../utils/axios'

const BookingDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.user)
  const [hotel, setHotel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)
  const [nights, setNights] = useState(1)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm()

  const watchCheckIn = watch('checkIn')
  const watchCheckOut = watch('checkOut')

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await api.get(`/hotels/${id}`)
        setHotel(response.data)
        const price = Array.isArray(response.data.pricing) && response.data.pricing[0]
          ? response.data.pricing[0].discountedPrice ?? response.data.pricing[0].originalPrice
          : response.data.price
        setTotalPrice(price)
      } catch (error) {
        console.error('Error fetching hotel:', error)
        navigate('/')
      } finally {
        setLoading(false)
      }
    }

    fetchHotel()
  }, [id, navigate])

  useEffect(() => {
    if (user) {
      setValue('firstName', user.firstName || '')
      setValue('lastName', user.lastName || '')
      setValue('email', user.email || '')
      setValue('phone', user.phone || '')
      setValue('country', user.country || '')
    }
  }, [user, setValue])

  useEffect(() => {
    if (hotel && watchCheckIn && watchCheckOut) {
      const checkIn = new Date(watchCheckIn)
      const checkOut = new Date(watchCheckOut)
      const diffTime = Math.abs(checkOut - checkIn)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays > 0) {
        setNights(diffDays)
        const price = Array.isArray(hotel.pricing) && hotel.pricing[0]
          ? hotel.pricing[0].discountedPrice ?? hotel.pricing[0].originalPrice
          : hotel.price
        setTotalPrice(price * diffDays)
      }
    }
  }, [watchCheckIn, watchCheckOut, hotel])

  const validateCardNumber = (value) => {
    const cardNumber = value.replace(/\s/g, '')
    const cardRegex = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$/
    return cardRegex.test(cardNumber) || 'Please enter a valid card number'
  }

  const validateExpiryDate = (value) => {
    const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/
    if (!expiryRegex.test(value)) {
      return 'Please enter a valid expiry date (MM/YY)'
    }
    
    const [month, year] = value.split('/')
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear() % 100
    const currentMonth = currentDate.getMonth() + 1
    
    if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
      return 'Card has expired'
    }
    
    return true
  }

  const validateCVV = (value) => {
    const cvvRegex = /^[0-9]{3,4}$/
    return cvvRegex.test(value) || 'Please enter a valid CVV'
  }

  const onSubmit = async (data) => {
    try {
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]')
      const newBooking = {
        id: Date.now().toString(),
        userId: user.id,
        hotelId: hotel.id,
        hotelName: hotel.name,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        nights,
        totalPrice,
        guestInfo: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          country: data.country
        },
        paymentInfo: {
          cardNumber: data.cardNumber.replace(/\s/g, '').slice(-4), 
          cardType: data.cardType
        },
        bookingDate: new Date().toISOString(),
        status: 'confirmed'
      }
      
      bookings.push(newBooking)
      localStorage.setItem('bookings', JSON.stringify(bookings))
      
      setShowSuccess(true)
      setTimeout(() => {
        navigate('/bookings')
      }, 2000)
    } catch (error) {
      console.error('Booking error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Hotel Not Found</h2>
          <p className="text-gray-600">The hotel you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Book Hotel</h1>
          <p className="text-gray-600 mt-2">Complete your booking for {hotel.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Guest Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      {...register('firstName', { required: 'First name is required' })}
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <input
                      type="text"
                      {...register('lastName', { required: 'Last name is required' })}
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input
                      type="tel"
                      {...register('phone', { 
                        required: 'Phone is required',
                        pattern: {
                          value: /^[0-9]{10,12}$/,
                          message: 'Please enter a valid phone number'
                        }
                      })}
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                    <input
                      type="text"
                      {...register('country', { required: 'Country is required' })}
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number *</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      {...register('cardNumber', { 
                        required: 'Card number is required',
                        validate: validateCardNumber
                      })}
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date *</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      {...register('expiryDate', { 
                        required: 'Expiry date is required',
                        validate: validateExpiryDate
                      })}
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV *</label>
                    <input
                      type="text"
                      placeholder="123"
                      {...register('cvv', { 
                        required: 'CVV is required',
                        validate: validateCVV
                      })}
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Type *</label>
                    <select
                      {...register('cardType', { required: 'Card type is required' })}
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select card type</option>
                      <option value="visa">Visa</option>
                      <option value="mastercard">Mastercard</option>
                      <option value="amex">American Express</option>
                      <option value="discover">Discover</option>
                    </select>
                    {errors.cardType && <p className="text-red-500 text-sm mt-1">{errors.cardType.message}</p>}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 font-semibold text-lg"
              >
                Pay ${totalPrice}
              </button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h2>
              
              <div className="mb-6">
                <img
                  src={hotel.images?.main || hotel.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                  alt={hotel.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h3 className="font-semibold text-lg">{hotel.name}</h3>
                <p className="text-gray-600">{hotel.address?.city}, {hotel.address?.country}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date *</label>
                  <input
                    type="date"
                    {...register('checkIn', { required: 'Check-in date is required' })}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.checkIn && <p className="text-red-500 text-sm mt-1">{errors.checkIn.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date *</label>
                  <input
                    type="date"
                    {...register('checkOut', { required: 'Check-out date is required' })}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.checkOut && <p className="text-red-500 text-sm mt-1">{errors.checkOut.message}</p>}
                </div>
              </div>

              <div className="border-t pt-4 mt-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Price per night:</span>
                  <span className="font-medium">
                    ${Array.isArray(hotel.pricing) && hotel.pricing[0]
                      ? hotel.pricing[0].discountedPrice ?? hotel.pricing[0].originalPrice
                      : hotel.price}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Nights:</span>
                  <span className="font-medium">{nights}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                  <span>Total Price:</span>
                  <span className="text-blue-600">${totalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Successful!</h3>
            <p className="text-gray-600 mb-4">Your booking has been confirmed. You will be redirected to your bookings page.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingDetails 