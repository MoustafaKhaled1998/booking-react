import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../../utils/axios'
import HotelCard from '../../components/cards/HotelCard'

const HotelsSearch = () => {
  const location = useLocation()
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (location.state?.results) {
      setHotels(location.state.results)
    } else if (location.state?.query?.hotelName || location.state?.query?.country) {
      fetchHotels(location.state.query)
    } else {
      fetchHotels()
    }
  }, [location.state])

  const fetchHotels = async (params = {}) => {
    setLoading(true)
    setError('')
    try {
      let url = '/hotels'
      const searchParams = []
      if (params.hotelName) searchParams.push(`q=${encodeURIComponent(params.hotelName)}`)
      if (params.country) searchParams.push(`address.country=${encodeURIComponent(params.country)}`)
      if (searchParams.length) url += '?' + searchParams.join('&')
      const res = await api.get(url)
      setHotels(res.data)
    } catch (err) {
      setError('Failed to fetch hotels')
      setHotels([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Search Results</h1>
        {loading && <div className="text-center text-gray-500">Loading hotels...</div>}
        {error && <div className="text-center text-red-600 mb-4">{error}</div>}
        {!loading && hotels.length === 0 && (
          <div className="text-center text-gray-500">No result found</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hotels.map(hotel => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default HotelsSearch