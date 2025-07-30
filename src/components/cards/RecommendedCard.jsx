import React from 'react'
import { Link } from 'react-router-dom'
import './RecommendedCard.css'
import { SecondaryButton } from '../shared/Button'

const RecommendedCard = ({ hotel }) => {
  const getSafeString = (value, fallback = '') => {
    if (typeof value === 'string') return value
    if (typeof value === 'number') return value.toString()
    return fallback
  }

  const imageUrl = hotel?.images?.main || hotel?.image || 'https://via.placeholder.com/120x80?text=No+Image'
  const location = getSafeString(hotel?.location || hotel?.address?.city, 'Location not available')
  const hotelName = getSafeString(hotel?.name, 'Hotel Name')
  const price = typeof hotel?.price === 'number' ? hotel.price : 0
  
  return (
    <div className="recommended-card p-4 border rounded shadow">
      <div className='flex gap-4 items-center'>
        <div className="flex-shrink-0">
          <img
            src={imageUrl}
            alt={hotelName}
            className="w-24 h-32 object-cover rounded-md border"
          />
        </div>
        <div>
          <h4 className='text-sm text-gray-500'>Hotel</h4>
          <h3 className="font-bold text-lg mb-2">{hotelName}</h3>
          <p className="text-sm text-gray-600">{location}</p>
          <div className='flex gap-2 items-center mt-2'>
            <p className='text-sm text-gray-500 mr-auto'>Cupon: dhshjab09d</p>
            <Link to={`/hotel/${hotel?.id}`}>
              <SecondaryButton>Book Now</SecondaryButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecommendedCard