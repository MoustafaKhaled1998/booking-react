import React from 'react'
import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <div className="text-9xl font-bold text-gray-300 mb-4">404</div>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8 text-lg">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors duration-200 font-semibold"
          >
            <Home size={20} className="mr-2" />
            Go to Homepage
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-300 transition-colors duration-200 font-semibold"
          >
            <ArrowLeft size={20} className="mr-2" />
            Go Back
          </button>
        </div>

        <div className="mt-12 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Need Help?</h3>
          <p className="text-sm text-blue-700 mb-3">
            You can also try searching for what you're looking for.
          </p>
          <Link
            to="/search-results"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Search Hotels →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound 