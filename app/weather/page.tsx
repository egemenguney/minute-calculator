'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Cloud, Sun, CloudRain, CloudSnow, MapPin, ArrowLeft, 
  Clock, Thermometer, Eye, Wind, Droplets, 
  Compass, Sunrise, Sunset, RefreshCw, AlertCircle, Navigation, Search
} from 'lucide-react'
import AppNavigation from '../components/AppNavigation'

interface WeatherData {
  location: string
  country: string
  temperature: number
  description: string
  icon: string
  humidity: number
  windSpeed: number
  windDirection: number
  visibility: number
  feelsLike: number
  pressure: number
  uvIndex: number
  sunrise: string
  sunset: string
  lastUpdated: string
}

interface LocationData {
  latitude: number
  longitude: number
  city: string
  country: string
}

export default function WeatherPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [location, setLocation] = useState<LocationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [manualLocation, setManualLocation] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  
  // Predefined cities for quick selection
  const popularCities = [
    { name: 'Istanbul, Turkey', coords: [41.0082, 28.9784] },
    { name: 'Ankara, Turkey', coords: [39.9334, 32.8597] },
    { name: 'Izmir, Turkey', coords: [38.4192, 27.1287] },
    { name: 'Antalya, Turkey', coords: [36.8969, 30.7133] },
    { name: 'Bursa, Turkey', coords: [40.1826, 29.0669] },
    { name: 'Adana, Turkey', coords: [37.0000, 35.3213] },
    { name: 'London, UK', coords: [51.5074, -0.1278] },
    { name: 'New York, USA', coords: [40.7128, -74.0060] },
    { name: 'Paris, France', coords: [48.8566, 2.3522] },
    { name: 'Tokyo, Japan', coords: [35.6762, 139.6503] },
    { name: 'Dubai, UAE', coords: [25.2048, 55.2708] },
    { name: 'Berlin, Germany', coords: [52.5200, 13.4050] }
  ]

  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase()
    if (lowerCondition.includes('sunny') || lowerCondition.includes('clear')) {
      return <Sun className="w-16 h-16 text-yellow-400" />
    } else if (lowerCondition.includes('cloud')) {
      return <Cloud className="w-16 h-16 text-gray-300" />
    } else if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
      return <CloudRain className="w-16 h-16 text-blue-400" />
    } else if (lowerCondition.includes('snow')) {
      return <CloudSnow className="w-16 h-16 text-white" />
    } else {
      return <Cloud className="w-16 h-16 text-gray-300" />
    }
  }

  const getUserLocation = () => {
    setLoading(true)
    setError('')
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser. Please select a city from the dropdown.')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        await fetchWeatherData(latitude, longitude)
      },
      (error) => {
        setError('Unable to get your location. Please select a city from the dropdown or enter manually.')
        setLoading(false)
      },
      { 
        timeout: 10000,
        enableHighAccuracy: true,
        maximumAge: 300000 // 5 minutes
      }
    )
  }

  const selectPredefinedCity = async (cityName: string) => {
    const city = popularCities.find(c => c.name === cityName)
    if (city) {
      setSelectedCity(cityName)
      setLoading(true)
      setError('')
      await fetchWeatherData(city.coords[0], city.coords[1])
    }
  }

  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      setError('')
      console.log(`Fetching weather for coordinates: ${lat}, ${lon}`)
      
      // Try multiple weather APIs in order
      const weatherUrls = [
        `https://wttr.in/${lat},${lon}?format=j1`,
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m&timezone=auto`,
      ]
      
      let weatherData: WeatherData | null = null
      let lastError: Error | null = null
      
      // Try wttr.in first
      try {
        const response = await fetch(weatherUrls[0], {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (compatible; UltimateCalculatorSuite/1.0)'
          },
          mode: 'cors'
        })
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        
        const text = await response.text()
        console.log('Raw response:', text.substring(0, 200))
        
        // Check if response is JSON
        if (!text.trim().startsWith('{')) {
          throw new Error('Response is not JSON format')
        }
        
        const data = JSON.parse(text)
        console.log('Parsed weather data:', data)
        
        if (data.current_condition && data.current_condition[0] && data.nearest_area && data.nearest_area[0]) {
          const current = data.current_condition[0]
          const nearest = data.nearest_area[0]
          
          weatherData = {
            location: nearest.areaName?.[0]?.value || 'Unknown Location',
            country: nearest.country?.[0]?.value || 'Unknown Country',
            temperature: parseInt(current.temp_C) || 0,
            description: current.weatherDesc?.[0]?.value || 'Unknown',
            icon: '01d',
            humidity: parseInt(current.humidity) || 0,
            windSpeed: parseInt(current.windspeedKmph) || 0,
            windDirection: parseInt(current.winddirDegree) || 0,
            visibility: parseInt(current.visibility) || 0,
            feelsLike: parseInt(current.FeelsLikeC) || 0,
            pressure: parseInt(current.pressure) || 0,
            uvIndex: parseInt(current.uvIndex || '0'),
            sunrise: '06:30',
            sunset: '19:30',
            lastUpdated: new Date().toLocaleTimeString()
          }
        }
      } catch (err) {
        console.warn('wttr.in failed:', err)
        lastError = err instanceof Error ? err : new Error('wttr.in API failed')
      }
      
      // If wttr.in failed, try Open-Meteo API
      if (!weatherData) {
        try {
          console.log('Trying Open-Meteo API...')
          const response = await fetch(weatherUrls[1])
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
          }
          
          const data = await response.json()
          console.log('Open-Meteo response:', data)
          
          if (data.current_weather) {
            const current = data.current_weather
            
            // Get location name from reverse geocoding
            let locationName = 'Unknown Location'
            let countryName = 'Unknown Country'
            
            try {
              const geoResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`)
              const geoData = await geoResponse.json()
              locationName = geoData.address?.city || geoData.address?.town || geoData.address?.village || geoData.display_name?.split(',')[0] || 'Unknown Location'
              countryName = geoData.address?.country || 'Unknown Country'
            } catch (e) {
              console.warn('Reverse geocoding failed:', e)
            }
            
            weatherData = {
              location: locationName,
              country: countryName,
              temperature: Math.round(current.temperature || 0),
              description: getWeatherDescription(current.weathercode || 0),
              icon: '01d',
              humidity: data.hourly?.relative_humidity_2m?.[0] || 0,
              windSpeed: Math.round(current.windspeed || 0),
              windDirection: current.winddirection || 0,
              visibility: 10,
              feelsLike: Math.round(current.temperature || 0),
              pressure: 1013,
              uvIndex: 0,
              sunrise: '06:30',
              sunset: '19:30',
              lastUpdated: new Date().toLocaleTimeString()
            }
          }
        } catch (err) {
          console.warn('Open-Meteo failed:', err)
          lastError = err instanceof Error ? err : new Error('Open-Meteo API failed')
        }
      }
      
      if (weatherData) {
        setWeather(weatherData)
        setLocation({
          latitude: lat,
          longitude: lon,
          city: weatherData.location,
          country: weatherData.country
        })
        setLoading(false)
        console.log('Weather data successfully processed:', weatherData)
      } else {
        throw lastError || new Error('All weather APIs failed')
      }
      
    } catch (err) {
      console.error('Weather fetch error:', err)
      setError(`Failed to fetch weather data: ${err instanceof Error ? err.message : 'All weather services unavailable'}`)
      setLoading(false)
    }
  }
  
  // Helper function to convert weather codes to descriptions
  const getWeatherDescription = (code: number): string => {
    const weatherCodes: { [key: number]: string } = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      95: 'Thunderstorm',
      96: 'Thunderstorm with hail',
      99: 'Thunderstorm with heavy hail'
    }
    return weatherCodes[code] || 'Unknown weather'
  }

  const searchLocation = async () => {
    if (!manualLocation.trim()) return
    
    setLoading(true)
    setError('')
    
    try {
      console.log(`Searching for location: ${manualLocation}`)
      
      // Use OpenStreetMap Nominatim for geocoding (free, no API key required)
      const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(manualLocation)}&limit=1&addressdetails=1`
      
      const response = await fetch(geocodeUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'UltimateCalculatorSuite/1.0'
        }
      })
      
      if (!response.ok) {
        throw new Error(`Geocoding error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Geocoding response:', data)
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat)
        const lon = parseFloat(data[0].lon)
        console.log(`Found coordinates: ${lat}, ${lon}`)
        await fetchWeatherData(lat, lon)
      } else {
        setError('Location not found. Please try a different city name.')
        setLoading(false)
      }
    } catch (err) {
      console.error('Location search error:', err)
      setError(`Failed to find location: ${err instanceof Error ? err.message : 'Please try again.'}`)
      setLoading(false)
    }
  }

  const refreshWeather = () => {
    if (location) {
      fetchWeatherData(location.latitude, location.longitude)
    } else if (selectedCity) {
      selectPredefinedCity(selectedCity)
    }
  }

  useEffect(() => {
    // Start with a default city instead of trying geolocation immediately
    selectPredefinedCity('Istanbul, Turkey')
  }, [])

  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
    return directions[Math.round(degrees / 22.5) % 16]
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-cyan-900 to-teal-900">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-800/20 to-teal-800/20" />
      <div className="absolute inset-0 bg-[url('/images/gradient-bg.webp')] bg-cover bg-center opacity-10" />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex items-center justify-center mb-4 relative">
              <Link 
                href="/"
                className="absolute left-4 top-4 p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 backdrop-blur-sm border border-white/20"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </Link>
              <div className="relative w-16 h-16 mr-4">
                <Cloud className="w-16 h-16 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Weather Forecast
              </h1>
            </div>
            <p className="text-xl text-cyan-200">
              Real-time weather conditions for any location
            </p>
          </div>

          {/* Weather Card */}
          <div className="glass rounded-3xl p-8 shadow-2xl animate-slide-up border border-cyan-400/20">
            {loading ? (
              <div className="text-center py-12">
                <RefreshCw className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
                <p className="text-white text-xl">Getting weather data...</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* City Selection Controls */}
                <div className="space-y-4">
                  {/* Quick City Selection */}
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      <MapPin className="inline-block w-4 h-4 mr-2" />
                      Quick Select City
                    </label>
                    <select
                      value={selectedCity}
                      onChange={(e) => selectPredefinedCity(e.target.value)}
                      className="time-input w-full px-3 py-2 rounded-xl text-gray-800"
                    >
                      <option value="">Choose a city...</option>
                      {popularCities.map((city) => (
                        <option key={city.name} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Manual City Search */}
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Or Search Any City
                    </label>
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        placeholder="e.g., Antalya, Turkey"
                        value={manualLocation}
                        onChange={(e) => setManualLocation(e.target.value)}
                        className="time-input flex-1 px-3 py-2 rounded-xl text-gray-800"
                        onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
                      />
                      <button
                        onClick={searchLocation}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl transition-all duration-300 flex items-center"
                        title="Search Location"
                      >
                        <Search className="w-5 h-5" />
                      </button>
                      <button
                        onClick={getUserLocation}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-xl transition-all duration-300 flex items-center"
                        title="Use My Location"
                      >
                        <Navigation className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="text-center py-4">
                    <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    <p className="text-red-200">{error}</p>
                  </div>
                )}

                {/* Weather Display */}
                {weather && (
                  <div className="space-y-6">
                    {/* Current Weather */}
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-4">
                        <MapPin className="w-5 h-5 text-blue-200 mr-2" />
                        <span className="text-2xl text-white font-semibold">
                          {weather.location}, {weather.country}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-center space-x-8 mb-6">
                        <div className="text-center">
                          {getWeatherIcon(weather.description)}
                        </div>
                        <div className="text-center">
                          <div className="text-6xl font-bold text-white mb-2">
                            {weather.temperature}°C
                          </div>
                          <div className="text-xl text-blue-200">
                            {weather.description}
                          </div>
                          <div className="text-lg text-blue-300">
                            Feels like {weather.feelsLike}°C
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Weather Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-center">
                        <Droplets className="w-8 h-8 text-blue-300 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{weather.humidity}%</div>
                        <div className="text-blue-200 text-sm">Humidity</div>
                      </div>
                      
                      <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-center">
                        <Wind className="w-8 h-8 text-blue-300 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{weather.windSpeed}</div>
                        <div className="text-blue-200 text-sm">km/h {getWindDirection(weather.windDirection)}</div>
                      </div>
                      
                      <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-center">
                        <Eye className="w-8 h-8 text-blue-300 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{weather.visibility}</div>
                        <div className="text-blue-200 text-sm">km Visibility</div>
                      </div>
                      
                      <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-center">
                        <Thermometer className="w-8 h-8 text-blue-300 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{weather.pressure}</div>
                        <div className="text-blue-200 text-sm">hPa Pressure</div>
                      </div>
                    </div>

                    {/* Sun Times */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-6 rounded-xl bg-gradient-to-r from-orange-500/20 to-yellow-500/20 backdrop-blur-sm border border-white/20 text-center">
                        <Sunrise className="w-8 h-8 text-orange-300 mx-auto mb-2" />
                        <div className="text-xl font-bold text-white">{weather.sunrise}</div>
                        <div className="text-orange-200">Sunrise</div>
                      </div>
                      
                      <div className="p-6 rounded-xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 backdrop-blur-sm border border-white/20 text-center">
                        <Sunset className="w-8 h-8 text-purple-300 mx-auto mb-2" />
                        <div className="text-xl font-bold text-white">{weather.sunset}</div>
                        <div className="text-purple-200">Sunset</div>
                      </div>
                    </div>

                    {/* Last Updated */}
                    <div className="text-center">
                      <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                        <Clock className="w-4 h-4 text-white" />
                        <span className="text-white text-sm">Last updated: {weather.lastUpdated}</span>
                      </div>
                    </div>

                    {/* Refresh Button */}
                    <div className="text-center">
                      <button
                        onClick={refreshWeather}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        <RefreshCw className="inline-block w-5 h-5 mr-2" />
                        Refresh Weather
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Links */}
            <AppNavigation currentPage="/weather" layout="grid-5" className="mt-8" />
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-blue-100 animate-fade-in">
            <p>Real weather data from wttr.in • Location-based forecasting</p>
          </div>
        </div>
      </div>
    </div>
  )
} 