import React from 'react'
import { Link } from 'react-router-dom'

const HotelCard = ({ hotel }) => {
  const getRatingValue = (rating) => {
    if (typeof rating === 'number') return rating
    if (typeof rating === 'object' && rating.score) return rating.score
    if (typeof rating === 'object' && rating.value) return rating.value
    return 0
  }

  const getMaxRating = (rating) => {
    if (typeof rating === 'number') return 5
    if (typeof rating === 'object' && rating.maxScore) return rating.maxScore
    if (typeof rating === 'object' && rating.max) return rating.max
    return 5
  }

  const ratingValue = getRatingValue(hotel.rating)
  const maxRating = getMaxRating(hotel.rating)

  return (
    <div className="bg-white rounded-lg shadow p-6 flex gap-4 hover:shadow-lg transition-shadow duration-200">
      <img
        src={hotel.images?.main || hotel.image || 'https://via.placeholder.com/120x80?text=No+Image'}
        alt={hotel.name}
        className="w-32 h-32 object-cover rounded-md border"
      />
      <div className="flex-1">
        <h2 className="text-xl font-bold mb-1">{hotel.name}</h2>
        <div className="text-gray-600 mb-1">{hotel.address?.city}, {hotel.address?.country}</div>
        <div className="text-gray-500 mb-2">{hotel.address?.countryIsoCode}</div>
        <div className="flex items-center mb-2">
          <span className="text-sm font-medium mr-2">{ratingValue}</span>
          <div className="flex">
            {[...Array(maxRating)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < Math.floor(ratingValue) ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
        <div className="text-blue-700 font-semibold mb-2">
          {Array.isArray(hotel.pricing) && hotel.pricing[0]
            ? <>
                ${hotel.pricing[0].discountedPrice ?? hotel.pricing[0].originalPrice}
                {' '}{hotel.pricing[0].currency} / {hotel.pricing[0].priceUnit}
              </>
            : hotel.price}
        </div>
        <Link
          to={`/hotel/${hotel.id}`}
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-semibold text-sm"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

export default HotelCard