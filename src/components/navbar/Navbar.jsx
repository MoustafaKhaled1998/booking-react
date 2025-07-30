import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../store/userSlice'
import { PrimaryButton, SecondaryButton } from '../shared/Button'
import ServiceIcon from '../shared/ServiceIcon'
import api from '../../utils/axios'
import headerBg from '../../assets/images/Header BG.jpg'
import './Navbar.css'

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector((state) => state.user)

  const [hotelName, setHotelName] = useState('')
  const [country, setCountry] = useState('')
  const [date, setDate] = useState('')
  const [searchError, setSearchError] = useState('')
  const [availableCountries, setAvailableCountries] = useState([])

  useEffect(() => {
    const fetchAvailableCountries = async () => {
      try {
        const response = await api.get('/hotels')
        const countries = [...new Set(response.data
          .map(hotel => hotel.address?.country)
          .filter(Boolean))]
        setAvailableCountries(countries.sort())
      } catch (error) {
        console.error('Error fetching countries:', error)
      }
    }
    fetchAvailableCountries()
  }, [])

  const handleLogout = () => {
    dispatch(logout())
  }

  const handleClear = () => {
    setHotelName('')
    setCountry('')
    setDate('')
    setSearchError('')
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    setSearchError('')
    try {
      const params = {}
      if (hotelName) params.q = hotelName
      if (country) params['address.country'] = country
      const res = await api.get('/hotels', { params })
      navigate('/search-results', { state: { results: res.data, query: { hotelName, country, date } } })
    } catch (err) {
      setSearchError('No results found or error fetching data.')
    }
  }

  return (
    <>
      <nav className="border-b border-gray-200 navbar" style={{ backgroundImage: `url(${headerBg})` }}>
        <div className='w-11/12 ml-auto'> 
          <div className='flex justify-end p-4'>
            {!isAuthenticated && (
              <>
                <Link to="/login" className='px-4 text-white hover:text-gray-200'>Login</Link>
                <Link to="/signup" className='px-4 text-white hover:text-gray-200'>Signup</Link>
              </>
            )}
          </div>
                     <div className='flex mt-20 gap-8'>
             <ServiceIcon type="hotel" label="HOTEL" />
             <ServiceIcon type="villa" label="VILLA" />
             <ServiceIcon type="taxi" label="TAXI" />
             <ServiceIcon type="flights" label="FLIGHTS" />
           </div>
        </div>
      </nav>
      <div className='flex border-b border-gray-200 bg-white search-bar w-5/6 mx-auto py-4 items-center'>
        <form className='flex w-full gap-4 items-center' onSubmit={handleSearch}>
          <input
            type='text'
            placeholder='Search hotel name...'
            value={hotelName}
            onChange={e => setHotelName(e.target.value)}
            className='border rounded px-3 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <select
            value={country}
            onChange={e => setCountry(e.target.value)}
            className='border rounded px-3 py-2 w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value=''>All Countries</option>
            {availableCountries.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            type='date'
            value={date}
            onChange={e => setDate(e.target.value)}
            className='border rounded px-3 py-2 w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <SecondaryButton type='button' onClick={handleClear} className='ml-2'>Clear</SecondaryButton>
          <PrimaryButton type='submit' className='ml-2'>Search</PrimaryButton>
        </form>
        {searchError && <div className='text-red-600 ml-4'>{searchError}</div>}
      </div>
    </>
  )
}

export default Navbar