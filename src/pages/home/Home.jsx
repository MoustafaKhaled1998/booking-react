import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Slider from 'react-slick'
import { setRecommendedHotels, setLoading, setError, setBestOffers } from '../../store/hotelSlice'
import RecommendedCard from '../../components/cards/RecommendedCard'
import api from '../../utils/axios'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const Home = () => {
  const dispatch = useDispatch()
  const { recommendedHotels, bestOffers, loading, error } = useSelector((state) => state.hotel)

  useEffect(() => {
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

    const fetchBestOffers = async () => {
      try {
        const res = await api.get('/best_offer')
        console.log('API response for best offers:', res.data)
        dispatch(setBestOffers(res.data))
      } catch (err) {
        dispatch(setError('Failed to fetch best offers'))
      }
    }

    fetchRecommended()
    fetchBestOffers()
  }, [dispatch])

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">

        <h2 className="text-2xl font-bold mb-6">Recommended Hotels</h2>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
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
        
        <div className='mt-10 bg-white p-4 rounded-lg shadow-md'>
        <h2 className="text-2xl font-bold mb-4">Best Offers</h2>
        <div className="flex flex-wrap  mb-10">
          {bestOffers && bestOffers.length > 0 ? (
            bestOffers.map((offer) => (
              <div key={offer.id} className="flex  items-center bg-grey p-3 rounded-full  shadow w-2/6">
                <img
                  src={offer?.image || 'https://via.placeholder.com/48?text=No+Image'}
                  alt={offer?.name || 'Hotel'}
                  className="w-12 h-12 object-cover rounded-full mb-2 border"
                />
                <div className='flex flex-col pl-4'>
                <span className="text-sm font-medium text-gray-700 ">{offer?.location || 'Hotel'}</span>
                <span className="text-sm font-medium text-gray-700 ">{offer?.name || 'Hotel'}</span>
              </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500">No best offers found.</div>
          )}
        </div>
        </div>
      </div>
    </div>
  )
}

export default Home