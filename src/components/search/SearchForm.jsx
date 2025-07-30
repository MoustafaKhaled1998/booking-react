import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Search, MapPin, Calendar, Users } from 'lucide-react'

const SearchForm = ({ onSearch }) => {
  const dispatch = useDispatch()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm()

  const onSubmit = (data) => {
    if (onSearch) {
      onSearch(data)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Where are you going?"
              {...register('destination', { 
                required: 'Destination is required' 
              })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.destination && (
              <p className="mt-1 text-sm text-red-600">{errors.destination.message}</p>
            )}
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="date"
              {...register('checkIn', { 
                required: 'Check-in date is required',
                validate: value => {
                  const today = new Date()
                  const selectedDate = new Date(value)
                  return selectedDate >= today || 'Check-in date must be today or later'
                }
              })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.checkIn && (
              <p className="mt-1 text-sm text-red-600">{errors.checkIn.message}</p>
            )}
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="date"
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
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.checkOut && (
              <p className="mt-1 text-sm text-red-600">{errors.checkOut.message}</p>
            )}
          </div>

          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              {...register('guests', { 
                required: 'Number of guests is required',
                min: { value: 1, message: 'At least 1 guest required' },
                max: { value: 10, message: 'Maximum 10 guests allowed' }
              })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Guests</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
              ))}
            </select>
            {errors.guests && (
              <p className="mt-1 text-sm text-red-600">{errors.guests.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center space-x-2"
          >
            <Search className="h-5 w-5" />
            <span>Search Hotels</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default SearchForm 