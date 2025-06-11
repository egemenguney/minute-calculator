'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Skull, ArrowLeft, Clock, TrendingUp, Globe, AlertTriangle } from 'lucide-react'

interface DeathStats {
  totalDeaths: number
  deathsPerSecond: number
  deathsPerMinute: number
  deathsPerHour: number
  deathsPerDay: number
  daysPassed: number
}

export default function DeathCounter() {
  const [startDate, setStartDate] = useState('2024-01-01')
  const [startTime, setStartTime] = useState('00:00')
  const [deathStats, setDeathStats] = useState<DeathStats | null>(null)
  const [isRunning, setIsRunning] = useState(true)

  // Global death rate: approximately 150,000 deaths per day worldwide
  const GLOBAL_DEATHS_PER_DAY = 150000
  const DEATHS_PER_SECOND = GLOBAL_DEATHS_PER_DAY / (24 * 60 * 60) // ~1.74 deaths per second

  const calculateDeaths = () => {
    if (!startDate || !startTime) return

    const startDateTime = new Date(`${startDate}T${startTime}`)
    const now = new Date()
    
    const timeDiffMs = now.getTime() - startDateTime.getTime()
    
    if (timeDiffMs < 0) {
      setDeathStats(null)
      return
    }

    const daysPassed = timeDiffMs / (1000 * 60 * 60 * 24)
    const hoursPassed = timeDiffMs / (1000 * 60 * 60)
    const minutesPassed = timeDiffMs / (1000 * 60)
    const secondsPassed = timeDiffMs / 1000

    const totalDeaths = Math.floor(secondsPassed * DEATHS_PER_SECOND)
    const deathsPerSecond = DEATHS_PER_SECOND
    const deathsPerMinute = DEATHS_PER_SECOND * 60
    const deathsPerHour = DEATHS_PER_SECOND * 60 * 60
    const deathsPerDay = GLOBAL_DEATHS_PER_DAY

    setDeathStats({
      totalDeaths,
      deathsPerSecond,
      deathsPerMinute,
      deathsPerHour,
      deathsPerDay,
      daysPassed
    })
  }

  useEffect(() => {
    if (!isRunning) return

    calculateDeaths()
    const interval = setInterval(calculateDeaths, 100) // Update every 100ms for smooth counting
    return () => clearInterval(interval)
  }, [startDate, startTime, isRunning])

  const toggleCounter = () => {
    setIsRunning(!isRunning)
  }

  const resetCounter = () => {
    const now = new Date()
    setStartDate(now.toISOString().split('T')[0])
    setStartTime(now.toTimeString().slice(0, 5))
    setIsRunning(true)
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-800 via-red-900 to-black">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 to-gray-900/30" />
      <div className="absolute inset-0 bg-[url('/images/gradient-bg.webp')] bg-cover bg-center opacity-10" />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-5xl">
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
                <Skull className="w-16 h-16 text-red-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Global Death Counter
              </h1>
            </div>
            <p className="text-xl text-red-200">
              Estimated deaths worldwide since your selected time
            </p>
            <div className="mt-4 flex items-center justify-center space-x-2 text-yellow-200">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm">Based on WHO global mortality statistics (~150K deaths/day)</span>
            </div>
          </div>

          {/* Calculator Card */}
          <div className="glass rounded-3xl p-8 shadow-2xl animate-slide-up border border-red-500/20">
            <div className="space-y-8">
              {/* Start Time Input */}
              <div className="text-center space-y-4">
                <label className="block text-2xl font-semibold text-white mb-4">
                  <Clock className="inline-block w-6 h-6 mr-2" />
                  Count Deaths Since
                </label>
                <div className="flex justify-center space-x-4">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="time-input px-4 py-3 rounded-xl text-lg font-medium text-gray-800"
                  />
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="time-input px-4 py-3 rounded-xl text-lg font-medium text-gray-800"
                  />
                </div>
              </div>

              {/* Death Counter Display */}
              {deathStats && (
                <div className="space-y-6">
                  {/* Main Counter */}
                  <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-red-900/30 to-black/30 backdrop-blur-sm border border-red-500/30">
                    <div className="text-6xl md:text-8xl font-bold text-red-400 mb-4 font-mono">
                      {deathStats.totalDeaths.toLocaleString()}
                    </div>
                    <div className="text-2xl text-red-200">
                      Estimated Deaths
                    </div>
                    <div className="text-lg text-gray-300 mt-2">
                      In {deathStats.daysPassed.toFixed(2)} days
                    </div>
                  </div>

                  {/* Rate Statistics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-6 rounded-xl bg-black/30 backdrop-blur-sm border border-red-500/20 text-center">
                      <div className="text-2xl font-bold text-red-400 mb-2">
                        {deathStats.deathsPerSecond.toFixed(2)}
                      </div>
                      <div className="text-red-200 text-sm">Per Second</div>
                    </div>
                    <div className="p-6 rounded-xl bg-black/30 backdrop-blur-sm border border-red-500/20 text-center">
                      <div className="text-2xl font-bold text-red-400 mb-2">
                        {Math.round(deathStats.deathsPerMinute).toLocaleString()}
                      </div>
                      <div className="text-red-200 text-sm">Per Minute</div>
                    </div>
                    <div className="p-6 rounded-xl bg-black/30 backdrop-blur-sm border border-red-500/20 text-center">
                      <div className="text-2xl font-bold text-red-400 mb-2">
                        {Math.round(deathStats.deathsPerHour).toLocaleString()}
                      </div>
                      <div className="text-red-200 text-sm">Per Hour</div>
                    </div>
                    <div className="p-6 rounded-xl bg-black/30 backdrop-blur-sm border border-red-500/20 text-center">
                      <div className="text-2xl font-bold text-red-400 mb-2">
                        {deathStats.deathsPerDay.toLocaleString()}
                      </div>
                      <div className="text-red-200 text-sm">Per Day</div>
                    </div>
                  </div>

                  {/* Live Update Indicator */}
                  <div className="text-center">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-red-900/30 backdrop-blur-sm border border-red-500/30">
                      <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-red-400 animate-pulse' : 'bg-gray-400'}`} />
                      <span className="text-white text-sm">
                        {isRunning ? 'Live Counter Running' : 'Counter Paused'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Control Buttons */}
              <div className="flex flex-col space-y-4">
                <div className="flex space-x-4">
                  <button
                    onClick={toggleCounter}
                    className={`flex-1 font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg ${
                      isRunning 
                        ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
                        : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
                    }`}
                  >
                    {isRunning ? 'Pause Counter' : 'Resume Counter'}
                  </button>
                  <button
                    onClick={resetCounter}
                    className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20"
                  >
                    Reset to Now
                  </button>
                </div>

                {/* Navigation Links */}
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    href="/"
                    className="text-center bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <Clock className="inline-block w-5 h-5 mr-2" />
                    Minute Calculator
                  </Link>
                  <Link
                    href="/age-calculator"
                    className="text-center bg-gradient-to-r from-purple-600 to-pink-700 hover:from-purple-700 hover:to-pink-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <TrendingUp className="inline-block w-5 h-5 mr-2" />
                    Age Calculator
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="text-center mt-8 text-gray-400 animate-fade-in">
            <p className="text-sm">
              * Estimates based on WHO global mortality data. Actual numbers may vary.
              <br />
              This tool is for educational and awareness purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 