import React from 'react'
import Link from 'next/link'
import { Clock, Calendar, Skull, Cloud, Navigation } from 'lucide-react'

interface AppNavigationProps {
  currentPage?: string
  layout?: 'grid-4' | 'grid-5' | 'grid-6' | 'grid-2'
  className?: string
}

export default function AppNavigation({ 
  currentPage, 
  layout = 'grid-5', 
  className = '' 
}: AppNavigationProps) {
  const navigationItems = [
    {
      href: '/minutes',
      icon: Clock,
      label: 'Minutes',
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      href: '/age-calculator',
      icon: Calendar,
      label: 'Age',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      href: '/death-counter',
      icon: Skull,
      label: 'Deaths',
      gradient: 'from-red-600 to-gray-800'
    },
    {
      href: '/weather',
      icon: Cloud,
      label: 'Weather',
      gradient: 'from-sky-500 to-blue-600'
    },
    {
      href: '/maps',
      icon: Navigation,
      label: 'Maps',
      gradient: 'from-green-500 to-teal-600'
    },

  ]

  // Filter out current page if specified
  const filteredItems = currentPage 
    ? navigationItems.filter(item => item.href !== currentPage)
    : navigationItems

  const getGridClass = () => {
    const itemCount = filteredItems.length
    if (layout === 'grid-2' || itemCount === 2) return 'grid-cols-2'
    if (layout === 'grid-4' || itemCount === 4) return 'grid-cols-2 md:grid-cols-4'
    if (layout === 'grid-5' || itemCount === 5) return 'grid-cols-2 md:grid-cols-5'
    if (layout === 'grid-6' || itemCount === 6) return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
    return 'grid-cols-2 md:grid-cols-5' // default
  }

  return (
    <div className={`grid ${getGridClass()} gap-3 ${className}`}>
      {filteredItems.map((item) => {
        const IconComponent = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`text-center bg-gradient-to-r ${item.gradient} hover:scale-105 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform shadow-lg hover:shadow-xl`}
          >
            <IconComponent className="inline-block w-4 h-4 mr-1" />
            {item.label}
          </Link>
        )
      })}
    </div>
  )
} 