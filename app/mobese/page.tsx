'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Camera, MapPin, ArrowLeft, Clock, Calendar, Skull, Cloud,
  Maximize2, RefreshCw, AlertTriangle, Eye, Navigation,
  Tv, Radio, Shield, Car
} from 'lucide-react'

interface CameraFeed {
  id: string
  name: string
  location: string
  district: string
  coordinates: [number, number]
  streamUrl: string
  isOnline: boolean
  lastUpdate: string
  type: 'traffic' | 'intersection' | 'highway' | 'bridge'
}

export default function MobesePage() {
  const [selectedCity, setSelectedCity] = useState('istanbul')
  const [selectedDistrict, setSelectedDistrict] = useState('besiktas')
  const [cameras, setCameras] = useState<CameraFeed[]>([])
  const [selectedCamera, setSelectedCamera] = useState<CameraFeed | null>(null)
  const [loading, setLoading] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Mock camera data for demonstration (in real app, these would be actual public feeds)
  const mockCameras: Record<string, CameraFeed[]> = {
    istanbul: [
      {
        id: 'ist-001',
        name: 'Boğaziçi Köprüsü',
        location: 'Bosphorus Bridge Main Span',
        district: 'Beşiktaş',
        coordinates: [41.0392, 29.0352],
        streamUrl: 'https://example.com/stream1', // Would be actual public stream
        isOnline: true,
        lastUpdate: new Date().toLocaleTimeString(),
        type: 'bridge'
      },
      {
        id: 'ist-002',
        name: 'Taksim Meydanı',
        location: 'Taksim Square Center',
        district: 'Beyoğlu',
        coordinates: [41.0369, 28.9851],
        streamUrl: 'https://example.com/stream2',
        isOnline: true,
        lastUpdate: new Date().toLocaleTimeString(),
        type: 'intersection'
      },
      {
        id: 'ist-003',
        name: 'E-5 Karayolu',
        location: 'E-5 Highway - Mecidiyeköy',
        district: 'Şişli',
        coordinates: [41.0608, 28.9875],
        streamUrl: 'https://example.com/stream3',
        isOnline: false,
        lastUpdate: '10 minutes ago',
        type: 'highway'
      },
      {
        id: 'ist-004',
        name: 'Galata Köprüsü',
        location: 'Galata Bridge',
        district: 'Fatih',
        coordinates: [41.0192, 28.9739],
        streamUrl: 'https://example.com/stream4',
        isOnline: true,
        lastUpdate: new Date().toLocaleTimeString(),
        type: 'bridge'
      },
      {
        id: 'ist-005',
        name: 'Kadıköy İskelesi',
        location: 'Kadıköy Ferry Port',
        district: 'Kadıköy',
        coordinates: [40.9065, 29.0127],
        streamUrl: 'https://example.com/stream5',
        isOnline: true,
        lastUpdate: new Date().toLocaleTimeString(),
        type: 'traffic'
      }
    ]
  }

  const getCameraIcon = (type: string) => {
    switch (type) {
      case 'bridge':
        return <Navigation className="w-5 h-5 text-blue-400" />
      case 'highway':
        return <Car className="w-5 h-5 text-green-400" />
      case 'intersection':
        return <Radio className="w-5 h-5 text-yellow-400" />
      default:
        return <Camera className="w-5 h-5 text-gray-400" />
    }
  }

  const loadCameras = () => {
    setLoading(true)
    setTimeout(() => {
      setCameras(mockCameras[selectedCity] || [])
      setLoading(false)
    }, 1000)
  }

  const selectCamera = (camera: CameraFeed) => {
    setSelectedCamera(camera)
  }

  const refreshFeeds = () => {
    loadCameras()
    if (selectedCamera) {
      // Refresh the selected camera's timestamp
      const updatedCamera = { ...selectedCamera, lastUpdate: new Date().toLocaleTimeString() }
      setSelectedCamera(updatedCamera)
    }
  }

  useEffect(() => {
    loadCameras()
  }, [selectedCity])

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/30 to-slate-900/30" />
      <div className="absolute inset-0 bg-[url('/images/gradient-bg.webp')] bg-cover bg-center opacity-10" />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen p-4">
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
              <Shield className="w-16 h-16 text-red-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              MOBESE Viewer
            </h1>
          </div>
          <p className="text-xl text-gray-300">
            Public traffic camera feeds for monitoring city conditions
          </p>
          <div className="mt-4 flex items-center justify-center space-x-2 text-yellow-200">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm">Public feeds only • Educational purposes</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Camera List */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-6 shadow-xl border border-gray-500/20">
              <div className="space-y-4">
                {/* City Selection */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    <MapPin className="inline-block w-4 h-4 mr-2" />
                    Select City
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="time-input w-full px-3 py-2 rounded-lg text-gray-800"
                  >
                    <option value="istanbul">Istanbul</option>
                    <option value="ankara">Ankara</option>
                    <option value="izmir">Izmir</option>
                  </select>
                </div>

                {/* Refresh Button */}
                <button
                  onClick={refreshFeeds}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh Feeds
                </button>

                {/* Camera List */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  <h3 className="text-white font-semibold mb-3">Available Cameras</h3>
                  {loading ? (
                    <div className="text-center py-4">
                      <RefreshCw className="w-6 h-6 text-white animate-spin mx-auto" />
                      <p className="text-gray-300 mt-2">Loading cameras...</p>
                    </div>
                  ) : (
                    cameras.map((camera) => (
                      <div
                        key={camera.id}
                        onClick={() => selectCamera(camera)}
                        className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                          selectedCamera?.id === camera.id
                            ? 'bg-blue-600/30 border border-blue-400'
                            : 'bg-white/10 hover:bg-white/20 border border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getCameraIcon(camera.type)}
                            <div>
                              <div className="text-white font-medium text-sm">
                                {camera.name}
                              </div>
                              <div className="text-gray-300 text-xs">
                                {camera.district}
                              </div>
                            </div>
                          </div>
                          <div className={`w-3 h-3 rounded-full ${
                            camera.isOnline ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                          }`} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Camera Feed Display */}
          <div className="lg:col-span-2">
            <div className="glass rounded-2xl p-6 shadow-xl border border-gray-500/20">
              {selectedCamera ? (
                <div className="space-y-4">
                  {/* Camera Info */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedCamera.name}</h2>
                      <p className="text-gray-300">{selectedCamera.location}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        selectedCamera.isOnline ? 'bg-green-400' : 'bg-red-400'
                      }`} />
                      <span className="text-white text-sm">
                        {selectedCamera.isOnline ? 'LIVE' : 'OFFLINE'}
                      </span>
                    </div>
                  </div>

                  {/* Camera Feed */}
                  <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                    {selectedCamera.isOnline ? (
                      <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-800 to-gray-900">
                        {/* Mock camera feed - in real app this would be actual video stream */}
                        <div className="text-center">
                          <Tv className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-400">Live Camera Feed</p>
                          <p className="text-gray-500 text-sm mt-2">
                            {selectedCamera.streamUrl}
                          </p>
                          <div className="mt-4 text-green-400 text-sm">
                            🔴 REC • {selectedCamera.lastUpdate}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <Eye className="w-16 h-16 text-red-400 mx-auto mb-4" />
                          <p className="text-red-400">Camera Offline</p>
                          <p className="text-gray-500 text-sm">Last seen: {selectedCamera.lastUpdate}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Fullscreen Button */}
                    <button
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-all duration-300"
                    >
                      <Maximize2 className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  {/* Camera Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-center">
                      <div className="text-lg font-bold text-white">{selectedCamera.type.toUpperCase()}</div>
                      <div className="text-gray-300 text-sm">Type</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-center">
                      <div className="text-lg font-bold text-white">{selectedCamera.district}</div>
                      <div className="text-gray-300 text-sm">District</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-center">
                      <div className="text-lg font-bold text-white">
                        {selectedCamera.coordinates[0].toFixed(3)}°
                      </div>
                      <div className="text-gray-300 text-sm">Latitude</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-center">
                      <div className="text-lg font-bold text-white">
                        {selectedCamera.coordinates[1].toFixed(3)}°
                      </div>
                      <div className="text-gray-300 text-sm">Longitude</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 text-xl">Select a camera to view feed</p>
                    <p className="text-gray-500 text-sm mt-2">Choose from the available cameras on the left</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="grid grid-cols-4 gap-4 mt-8 max-w-4xl mx-auto">
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
            className="text-center bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Cloud className="inline-block w-4 h-4 mr-1" />
            Weather
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-400 animate-fade-in">
          <p className="text-sm">
            * This is a demonstration interface for public camera feeds
            <br />
            Real implementation would connect to official city traffic camera APIs
          </p>
        </div>
      </div>
    </div>
  )
} 