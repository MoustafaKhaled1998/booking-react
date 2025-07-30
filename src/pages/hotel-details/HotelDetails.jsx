import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Slider from 'react-slick'
import { setRecommendedHotels, setLoading, setError } from '../../store/hotelSlice'
import RecommendedCard from '../../components/cards/RecommendedCard'
import api from '../../utils/axios'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const HotelDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user)
  const { recommendedHotels, loading: hotelsLoading, error: hotelsError } = useSelector((state) => state.hotel)
  const [hotel, setHotel] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const response = await api.get(`/hotels/${id}`)
        setHotel(response.data)
      } catch (error) {
        console.error('Error fetching hotel details:', error)
      } finally {
        setLoading(false)
      }
    }

    const fetchRecommended = async () => {
      dispatch(setLoading(true))
      try {
        const res = await api.get('/recommended_hotels')
        dispatch(setRecommendedHotels(res.data))
        dispatch(setLoading(false))
      } catch (err) {
        dispatch(setError('Failed to fetch recommended hotels'))
        dispatch(setLoading(false))
      }
    }

    fetchHotelDetails()
    fetchRecommended()
  }, [id, dispatch])

  const handleBookNow = () => {
    if (user) {
      navigate(`/booking/${id}`)
    } else {
      navigate('/login', { state: { from: { pathname: `/booking/${id}` } } })
    }
  }

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

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading hotel details...</p>
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

  const ratingValue = getRatingValue(hotel.rating)
  const maxRating = getMaxRating(hotel.rating)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-96">
            <img
              src={hotel.images?.main || hotel.image || 'https://via.placeholder.com/800x400?text=No+Image'}
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h1 className="text-4xl font-bold mb-2">{hotel.name}</h1>
              <p className="text-xl">{hotel.address?.city}, {hotel.address?.country}</p>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About this hotel</h2>
                  <p className="text-gray-600 leading-relaxed">{hotel.description}</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {hotel.amenities && hotel.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Hotel Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600">Location:</span>
                      <p className="font-medium">{hotel.address?.city}, {hotel.address?.country}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Rating:</span>
                      <div className="flex items-center">
                        <span className="font-medium mr-1">{ratingValue}</span>
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
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="text-center mb-6">
                    <span className="text-3xl font-bold text-gray-900">
                      {Array.isArray(hotel.pricing) && hotel.pricing[0]
                        ? `$${hotel.pricing[0].discountedPrice ?? hotel.pricing[0].originalPrice}`
                        : `$${hotel.price}`}
                    </span>
                    <span className="text-gray-600">/night</span>
                  </div>
                  <div className="text-center text-sm text-gray-600 mb-6">
                    <p>Free cancellation</p>
                    <p>No prepayment needed</p>
                  </div>
                  
                  <button
                    onClick={handleBookNow}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 font-semibold text-lg"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Recommended Hotels</h2>
          {hotelsLoading ? (
            <div className="text-center">Loading...</div>
          ) : hotelsError ? (
            <div className="text-center text-red-500">{hotelsError}</div>
          ) : (
            <Slider {...settings}>
              {recommendedHotels && recommendedHotels.length > 0 ? (
                recommendedHotels.map((hotel) => (
                  <div key={hotel.id} className="px-2">
                    <RecommendedCard hotel={hotel} />
                  </div>
                ))
              ) : (
                <div className="text-center">No recommended hotels found.</div>
              )}
            </Slider>
          )}
        </div>
      </div>
    </div>
  )
}

export default HotelDetails 