'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  MapPin, ArrowLeft, Clock, Calendar, Skull, Cloud, Navigation,
  Search, Globe, Compass, AlertCircle, RefreshCw, Camera, Map
} from 'lucide-react'

// Declare Google Maps types
declare global {
  interface Window {
    google: any
  }
  
  namespace JSX {
    interface IntrinsicElements {
      'gmpx-api-loader': any
      'gmp-map': any
      'gmp-advanced-marker': any
      'gmpx-place-picker': any
    }
  }
}

export default function MapsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentLocation, setCurrentLocation] = useState('Times Square, New York')
  const [isLoading, setIsLoading] = useState(false)
  const [streetViewUrl, setStreetViewUrl] = useState('')
  const [mapUrl, setMapUrl] = useState('')
  const [coordinates, setCoordinates] = useState({ lat: 40.758, lng: -73.9855 }) // Times Square default
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null)


  // Popular preset locations
  const presetLocations = [
    'Times Square, New York',
    'Eiffel Tower, Paris',
    'Big Ben, London', 
    'Galata Tower, Istanbul',
    'Colosseum, Rome',
    'Sydney Opera House',
    'Machu Picchu, Peru',
    'Mount Fuji, Japan',
    'Golden Gate Bridge, San Francisco',
    'Petra, Jordan'
  ]

  // Generate Street View URL that opens full Google Maps with Street View
  const generateStreetViewUrl = (location: string) => {
    const encodedLocation = encodeURIComponent(location)
    // Direct Google Maps link that will show Street View button
    return `https://www.google.com/maps/search/${encodedLocation}`
  }

  // Generate embedded map URL for preview
  const generateMapUrl = (location: string) => {
    const encodedLocation = encodeURIComponent(location)
    return `https://maps.google.com/maps?width=100%25&height=600&hl=en&q=${encodedLocation}&t=&z=15&ie=UTF8&iwloc=&output=embed`
  }

  // Generate direct Street View URL using coordinates
  const generateDirectStreetViewUrl = (lat: number, lng: number) => {
    // Using the URL pattern you provided for direct Street View access
    return `https://www.google.com/maps/@${lat},${lng},3a,75y,0h,90t/data=!3m6!1e1!3m4!1s0x0:0x0!2e0!7i16384!8i8192`
  }



  // Create working Street View embed using the user's provided embed code format
  const createStreetViewEmbed = (lat: number, lng: number, locationName?: string) => {
    // Add a small delay to ensure DOM is ready
    setTimeout(() => {
      const streetViewContainer = document.getElementById('street-view')
      if (!streetViewContainer) {
        console.log('Street View container not found, retrying...')
        return
      }

      // Always use coordinates for Street View API (more reliable than location names)
      // Ensure coordinates are valid numbers
      if (isNaN(lat) || isNaN(lng)) {
        console.error(`Invalid coordinates: lat=${lat}, lng=${lng}`)
        streetViewContainer.innerHTML = `
          <div class="h-full rounded-xl overflow-hidden relative bg-gray-200 flex items-center justify-center">
            <p class="text-gray-600">Invalid location coordinates</p>
          </div>
        `
        return
      }
      
      // Use coordinates only - more reliable for Street View API
      const streetViewEmbedUrl = `https://www.google.com/maps/embed/v1/streetview?key=AIzaSyCr7EuYgkvYzFCxuaDJbzqIO8Fi2DPQcug&location=${lat.toFixed(6)},${lng.toFixed(6)}&heading=210&pitch=10&fov=90`
      const displayInfo = `📍 ${lat.toFixed(6)}, ${lng.toFixed(6)}`
      
      console.log(`Street View URL: ${streetViewEmbedUrl}`)
      console.log(`Creating Street View for: ${locationName || 'coordinates'} at ${lat}, ${lng}`)
      
      streetViewContainer.innerHTML = `
        <div class="h-full rounded-xl overflow-hidden relative">
          <iframe
            src="${streetViewEmbedUrl}"
            width="100%"
            height="400"
            style="border:0; border-radius: 12px;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Street View of ${locationName || `${lat}, ${lng}`}">
          </iframe>
          <div class="absolute bottom-2 left-2 bg-black/70 text-white px-3 py-1 rounded-lg text-xs backdrop-blur-sm">
            ${displayInfo}
          </div>
          <div class="absolute top-2 right-2 bg-green-600/90 text-white px-3 py-1 rounded-lg text-xs backdrop-blur-sm">
            🚶‍♂️ Live Street View
          </div>
        </div>
      `
    }, 100) // Small delay to ensure DOM is ready
  }

  // Generate a panorama ID based on coordinates (simplified version)
  const generatePanoramaId = () => {
    return 'eAk8mGq5p9phBwSCMXvJrA' // Default panorama ID, could be made dynamic
  }

  // Fetch coordinates for a location using Google Geocoding API
  const fetchCoordinates = async (location: string) => {
    try {
      // First try Google Geocoding API for better accuracy
      const googleResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=AIzaSyCr7EuYgkvYzFCxuaDJbzqIO8Fi2DPQcug`)
      const googleData = await googleResponse.json()
      
      if (googleData.status === 'OK' && googleData.results.length > 0) {
        const result = googleData.results[0]
        const lat = result.geometry.location.lat
        const lng = result.geometry.location.lng
        console.log(`Google Geocoding: ${location} -> ${lat}, ${lng}`)
        return { lat, lng }
      }
      
      // Fallback to OpenStreetMap Nominatim
      console.log('Google Geocoding failed, trying OpenStreetMap...')
      const osmResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`)
      const osmData = await osmResponse.json()
      
      if (osmData && osmData.length > 0) {
        const lat = parseFloat(osmData[0].lat)
        const lng = parseFloat(osmData[0].lon)
        console.log(`OpenStreetMap: ${location} -> ${lat}, ${lng}`)
        return { lat, lng }
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error)
    }
    console.log(`No coordinates found for: ${location}`)
    return null
  }

  // Handle search with debouncing for live updates
  const handleSearch = async (query: string = searchQuery) => {
    if (!query.trim()) return
    
    console.log(`🔍 Starting search for: "${query}"`)
    setIsLoading(true)
    setCurrentLocation(query)
    
    // Fetch coordinates and update all URLs
    const coords = await fetchCoordinates(query)
    console.log(`📍 Coordinates received:`, coords)
    
    setTimeout(() => {
      const newMapUrl = generateMapUrl(query)
      
      if (coords) {
        // Update coordinates state - this will trigger the useEffect to update Street View
        setCoordinates({ lat: coords.lat, lng: coords.lng })
        // Use coordinates for direct Street View access
        const coordBasedStreetViewUrl = generateDirectStreetViewUrl(coords.lat, coords.lng)
        setStreetViewUrl(coordBasedStreetViewUrl)
      } else {
        // Fallback to location-based URL
        const newStreetViewUrl = generateStreetViewUrl(query)
        setStreetViewUrl(newStreetViewUrl)
      }
      
      setMapUrl(newMapUrl)
      setIsLoading(false)
    }, 300)
  }

  // Handle live typing with debounce
  const handleTyping = (value: string) => {
    setSearchQuery(value)
    
    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }
    
    // Only search if query is substantial (3+ characters)
    if (value.trim().length >= 3) {
      const newTimeout = setTimeout(() => {
        handleSearch(value)
      }, 1000) // Wait 1 second after user stops typing
      
      setTypingTimeout(newTimeout)
    }
  }

  // Handle preset location click
  const selectPresetLocation = async (location: string) => {
    setCurrentLocation(location)
    setSearchQuery('')
    setIsLoading(true)
    
    // Fetch coordinates and update all URLs
    const coords = await fetchCoordinates(location)
    
    setTimeout(() => {
      const newMapUrl = generateMapUrl(location)
      
      if (coords) {
        // Update coordinates state - this will trigger the useEffect to update Street View
        setCoordinates({ lat: coords.lat, lng: coords.lng })
        // Use coordinates for direct Street View access
        const coordBasedStreetViewUrl = generateDirectStreetViewUrl(coords.lat, coords.lng)
        setStreetViewUrl(coordBasedStreetViewUrl)
      } else {
        // Fallback to location-based URL
        const newStreetViewUrl = generateStreetViewUrl(location)
        setStreetViewUrl(newStreetViewUrl)
      }
      
      setMapUrl(newMapUrl)
      setIsLoading(false)
    }, 800)
  }

  // Initialize Street View embed when coordinates change
  useEffect(() => {
    createStreetViewEmbed(coordinates.lat, coordinates.lng, currentLocation)
  }, [coordinates, currentLocation])

  // Initialize with default location
  useEffect(() => {
    const initializeDefault = async () => {
      const defaultMapUrl = generateMapUrl(currentLocation)
      const defaultStreetViewUrl = generateDirectStreetViewUrl(coordinates.lat, coordinates.lng)
      
      setStreetViewUrl(defaultStreetViewUrl)
      setMapUrl(defaultMapUrl)
    }
    
    initializeDefault()
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout)
      }
    }
  }, [typingTimeout])

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-green-400 via-teal-500 to-blue-600">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-blue-900/20" />
      <div className="absolute inset-0 bg-[url('/images/gradient-bg.webp')] bg-cover bg-center opacity-20" />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col p-4">
        {/* Header */}
        <div className="text-center mb-6 animate-fade-in">
          <div className="flex items-center justify-center mb-4 relative">
            <Link 
              href="/"
              className="absolute left-4 top-4 p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 backdrop-blur-sm border border-white/20"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </Link>
            <div className="relative w-16 h-16 mr-4">
              <Camera className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Instant Street View
            </h1>
          </div>
          <p className="text-xl text-green-100">
            Type any location and instantly view it in Google Street View
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-4 animate-slide-up">
          <div className="max-w-2xl mx-auto">
                          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Search className="w-6 h-6 text-gray-600" />
                  <span className="text-gray-700 font-bold text-lg">Search Any Location</span>
                </div>
                <div className="text-sm text-gray-500 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live Search</span>
                </div>
              </div>
              
              <div className="flex space-x-3 mb-4">
                <input
                  type="text"
                  placeholder="Enter address, landmark, or place name..."
                  value={searchQuery}
                  onChange={(e) => handleTyping(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-green-500 focus:outline-none text-lg text-gray-800 bg-white"
                />
                <button
                  onClick={() => handleSearch()}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl transition-all duration-300 font-semibold text-lg"
                >
                  {isLoading ? 'Loading...' : 'View'}
                </button>
              </div>

              {/* Current Location Display */}
              <div className="flex items-center justify-center space-x-2 mb-4">
                <MapPin className="w-5 h-5 text-green-600" />
                <span className="text-gray-700 font-medium">Currently viewing: {currentLocation}</span>
              </div>

                             {/* Preset Locations */}
               <div>
                 <p className="text-gray-600 text-sm mb-2 font-semibold">Quick Access Locations:</p>
                 <p className="text-gray-500 text-xs mb-3">💡 Type 3+ characters above for live search updates</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {presetLocations.map((location) => (
                    <button
                      key={location}
                      onClick={() => selectPresetLocation(location)}
                      className="text-sm bg-gray-100 hover:bg-green-100 text-gray-700 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105"
                    >
                      {location.split(',')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Street View Container */}
        <div className="flex-1 glass rounded-3xl p-6 shadow-2xl animate-slide-up border border-green-500/20 min-h-[700px]">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <RefreshCw className="w-16 h-16 text-white animate-spin mx-auto mb-4" />
                <p className="text-white text-xl">Loading Street View...</p>
                <p className="text-green-200 text-sm mt-2">Searching for: {searchQuery || currentLocation}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
              {/* Left Panel - Map Preview */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Map className="mr-2 text-blue-600" />
                  Map Preview
                </h3>
                <div className="rounded-xl overflow-hidden">
                  <iframe
                    src={mapUrl}
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Map preview of ${currentLocation}`}
                  />
                </div>
                <div className="mt-3 text-center">
                  <div className="text-sm text-gray-600 flex items-center justify-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {currentLocation}
                  </div>
                </div>
              </div>

                             {/* Right Panel - Street View */}
               <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
                 <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                   <Camera className="mr-2 text-green-600" />
                   Street View
                 </h3>
                 
                 <div className="rounded-xl overflow-hidden relative">
                   {/* Google Street View Container */}
                   <div 
                     id="street-view" 
                     className="w-full h-[400px] bg-gray-100"
                     style={{ minHeight: '400px' }}
                   />
                   
                   {/* Overlay with coordinates info */}
                   <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                     📍 {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
                   </div>
                 </div>
                 
                 <div className="mt-3 text-center">
                   <div className="text-sm text-gray-600">
                     🚶‍♂️ Live Street View • Updates as you type
                   </div>
                   <div className="text-xs text-gray-500 mt-1">
                     360° panoramic view with live coordinate updates
                   </div>
                 </div>
               </div>
            </div>
          )}
        </div>

        {/* Features Info - Compressed */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center border border-white/20">
            <Globe className="w-6 h-6 text-white mx-auto mb-1" />
            <h3 className="text-white font-semibold text-sm">Global Coverage</h3>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center border border-white/20">
            <Camera className="w-6 h-6 text-white mx-auto mb-1" />
            <h3 className="text-white font-semibold text-sm">360° Street View</h3>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center border border-white/20">
            <Search className="w-6 h-6 text-white mx-auto mb-1" />
            <h3 className="text-white font-semibold text-sm">Instant Search</h3>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
          <Link
            href="/"
            className="text-center bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Clock className="inline-block w-4 h-4 mr-1" />
            Minutes
          </Link>
          <Link
            href="/age-calculator"
            className="text-center bg-gradient-to-r from-purple-600 to-pink-700 hover:from-purple-700 hover:to-pink-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Calendar className="inline-block w-4 h-4 mr-1" />
            Age
          </Link>
          <Link
            href="/death-counter"
            className="text-center bg-gradient-to-r from-red-600 to-gray-800 hover:from-red-700 hover:to-gray-900 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Skull className="inline-block w-4 h-4 mr-1" />
            Deaths
          </Link>
          <Link
            href="/weather"
            className="text-center bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Cloud className="inline-block w-4 h-4 mr-1" />
            Weather
          </Link>
          <Link
            href="/mobese"
            className="text-center bg-gradient-to-r from-gray-600 to-slate-800 hover:from-gray-700 hover:to-slate-900 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Navigation className="inline-block w-4 h-4 mr-1" />
            MOBESE
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-green-100 animate-fade-in">
          <p>Powered by Google Street View • Instant location search • Global exploration</p>
          <p className="text-sm mt-1">Inspired by <a href="https://www.instantstreetview.com/" target="_blank" rel="noopener noreferrer" className="text-green-200 hover:text-white underline">Instant Street View</a></p>
        </div>
      </div>
    </div>
  )
} 
