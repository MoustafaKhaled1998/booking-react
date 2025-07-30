import React, { Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { setUser, setAuthToken } from './store/userSlice'
import Navbar from './components/navbar/Navbar'
import Sidebar from './components/sidebar/Sidebar'
import './App.css'

const Home = React.lazy(() => import('./pages/home/Home'))
const Login = React.lazy(() => import('./pages/auth/Login'))
const SignUp = React.lazy(() => import('./pages/auth/SignUp'))
const Bookings = React.lazy(() => import('./pages/bookings/Bookings'))
const HotelDetails = React.lazy(() => import('./pages/hotel-details/HotelDetails'))
const BookingDetails = React.lazy(() => import('./pages/booking-details/BookingDetails'))
const ProtectedRoute = React.lazy(() => import('./components/shared/ProtectedRoute'))
const HotelsSearch = React.lazy(() => import('./pages/search/HotelsSearch'))
const NotFound = React.lazy(() => import('./pages/not-found/NotFound'))

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
  </div>
)

function App() {
  const dispatch = useDispatch()
  const location = useLocation()

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) {
      try {
        const tokenData = JSON.parse(atob(token))
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        const user = users.find(u => u.id === tokenData.userId)
        
        if (user) {
          dispatch(setUser(user))
          dispatch(setAuthToken(token))
        }
      } catch (error) {
        localStorage.removeItem('authToken')
      }
    }
  }, [dispatch])

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup'

  return (
    <div className="App">
      <Sidebar />
      {!isAuthPage && <Navbar />}
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route 
            path="/bookings" 
            element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            } 
          />
          <Route path="/hotel/:id" element={<HotelDetails />} />
          <Route
            path="/booking/:id"
            element={
              <ProtectedRoute>
                <BookingDetails />
              </ProtectedRoute>
            }
          />
          <Route path="/search-results" element={<HotelsSearch />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App 