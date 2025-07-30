import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Menu, X, Home, MapPin, HelpCircle, UserPlus, LogOut, Calendar } from 'lucide-react'
import { logout } from '../../store/userSlice'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector((state) => state.user)

  const handleLogout = () => {
    dispatch(logout())
    setIsOpen(false)
    navigate('/')
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Menu</h2>
          </div>

          <nav className="flex-1 p-6">
            <ul className="space-y-4">
              <li>
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <Home size={20} className="text-gray-600" />
                  <span className="text-gray-700 font-medium">Home</span>
                </Link>
              </li>
              
              <li>
                <Link
                  to="/search-results"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <MapPin size={20} className="text-gray-600" />
                  <span className="text-gray-700 font-medium">Explore</span>
                </Link>
              </li>
              
              <li>
                <Link
                  to="/support"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <HelpCircle size={20} className="text-gray-600" />
                  <span className="text-gray-700 font-medium">Support</span>
                </Link>
              </li>
            </ul>

            

            <div className="mt-8 space-y-4">
              {!isAuthenticated ? (
                <div className="space-y-3">
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center space-x-2 w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    <UserPlus size={20} />
                    <span className="font-medium">Sign Up</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/bookings"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <Calendar size={20} className="text-gray-600" />
                    <span className="text-gray-700 font-medium">My Bookings</span>
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-red-50 transition-colors duration-200 text-red-600"
                  >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </nav>

          <div className="p-6 border-t border-gray-200">
            <div className="text-center text-sm text-gray-500">
              {isAuthenticated && user && (
                <p>Welcome, {user.firstName}!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar 