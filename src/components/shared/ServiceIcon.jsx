import React from 'react'
import { Building2, Home, Car, Plane } from 'lucide-react'

const ServiceIcon = ({ type, label, onClick }) => {
  const getIcon = () => {
    switch (type) {
      case 'hotel':
        return <Building2 size={24} />
      case 'villa':
        return <Home size={24} />
      case 'taxi':
        return <Car size={24} />
      case 'flights':
        return <Plane size={24} />
      default:
        return <Building2 size={24} />
    }
  }

  return (
    <div 
      className="flex flex-col items-center cursor-pointer group transition-all duration-200 hover:scale-105"
      onClick={onClick}
    >
      <div className="p-3 rounded-lg bg-transparent group-hover:bg-white/20 transition-colors duration-200 mb-2">
        <div className="text-white group-hover:text-white transition-colors duration-200">
          {getIcon()}
        </div>
      </div>
      <p className="text-sm font-medium text-white group-hover:text-white transition-colors duration-200">
        {label}
      </p>
    </div>
  )
}

export default ServiceIcon 