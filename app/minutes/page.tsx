'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, Calculator, ArrowRight, RefreshCw, ArrowLeft } from 'lucide-react'
import AppNavigation from '../components/AppNavigation'

interface TimeResult {
  totalMinutes: number
  hours: number
  minutes: number
}

export default function MinuteCalculator() {
  const [startTime, setStartTime] = useState('09:45')
  const [startPeriod, setStartPeriod] = useState('AM')
  const [endTime, setEndTime] = useState('05:00')
  const [endPeriod, setEndPeriod] = useState('PM')
  const [result, setResult] = useState<TimeResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const convertTo24Hour = (time: string, period: string): string => {
    const [hours, minutes] = time.split(':').map(Number)
    let hour24 = hours

    if (period === 'PM' && hours !== 12) {
      hour24 = hours + 12
    } else if (period === 'AM' && hours === 12) {
      hour24 = 0
    }

    return `${hour24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }

  const calculateDifference = () => {
    setIsCalculating(true)
    
    setTimeout(() => {
      const start24 = convertTo24Hour(startTime, startPeriod)
      const end24 = convertTo24Hour(endTime, endPeriod)

      const [startHour, startMin] = start24.split(':').map(Number)
      const [endHour, endMin] = end24.split(':').map(Number)

      let startTotalMinutes = startHour * 60 + startMin
      let endTotalMinutes = endHour * 60 + endMin

      // Handle next day scenario
      if (endTotalMinutes < startTotalMinutes) {
        endTotalMinutes += 24 * 60
      }

      const diffMinutes = endTotalMinutes - startTotalMinutes
      const hours = Math.floor(diffMinutes / 60)
      const minutes = diffMinutes % 60

      setResult({
        totalMinutes: diffMinutes,
        hours,
        minutes
      })
      setIsCalculating(false)
    }, 500)
  }

  const resetCalculator = () => {
    setStartTime('09:45')
    setStartPeriod('AM')
    setEndTime('05:00')
    setEndPeriod('PM')
    setResult(null)
  }

  const validateAndSetTime = (time: string, setter: (time: string) => void) => {
    const [hours, minutes] = time.split(':').map(Number)
    
    // Limit hours to 1-12 for AM/PM format
    if (hours >= 1 && hours <= 12) {
      setter(time)
    } else if (hours === 0) {
      setter('12:' + minutes.toString().padStart(2, '0'))
    } else if (hours > 12) {
      setter('12:' + minutes.toString().padStart(2, '0'))
    }
  }

  useEffect(() => {
    calculateDifference()
  }, [startTime, startPeriod, endTime, endPeriod])

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-800 via-indigo-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-800/20 to-slate-800/20" />
      <div className="absolute inset-0 bg-[url('/images/gradient-bg.webp')] bg-cover bg-center opacity-10" />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
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
                <Clock className="w-16 h-16 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Minute Calculator
              </h1>
            </div>
            <p className="text-xl text-blue-100">
              Calculate precise time differences between any two times
            </p>
          </div>

          {/* Calculator Card */}
          <div className="glass rounded-3xl p-8 shadow-2xl animate-slide-up">
            <div className="space-y-8">
              {/* Time Inputs */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Start Time */}
                <div className="space-y-4">
                  <label className="block text-lg font-semibold text-white mb-2">
                    <Clock className="inline-block w-5 h-5 mr-2" />
                    Start Time
                  </label>
                  <div className="flex space-x-3">
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => validateAndSetTime(e.target.value, setStartTime)}
                      min="01:00"
                      max="12:59"
                      className="time-input flex-1 px-4 py-3 rounded-xl text-lg font-medium text-gray-800"
                    />
                    <select
                      value={startPeriod}
                      onChange={(e) => setStartPeriod(e.target.value)}
                      className="time-input px-4 py-3 rounded-xl text-lg font-medium text-gray-800"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>

                {/* End Time */}
                <div className="space-y-4">
                  <label className="block text-lg font-semibold text-white mb-2">
                    <Clock className="inline-block w-5 h-5 mr-2" />
                    End Time
                  </label>
                  <div className="flex space-x-3">
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => validateAndSetTime(e.target.value, setEndTime)}
                      min="01:00"
                      max="12:59"
                      className="time-input flex-1 px-4 py-3 rounded-xl text-lg font-medium text-gray-800"
                    />
                    <select
                      value={endPeriod}
                      onChange={(e) => setEndPeriod(e.target.value)}
                      className="time-input px-4 py-3 rounded-xl text-lg font-medium text-gray-800"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Arrow Divider */}
              <div className="flex justify-center">
                <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
                  <ArrowRight className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Result Display */}
              <div className="text-center space-y-4">
                {isCalculating ? (
                  <div className="flex items-center justify-center space-x-3">
                    <RefreshCw className="w-6 h-6 text-white animate-spin" />
                    <span className="text-xl text-white">Calculating...</span>
                  </div>
                ) : result ? (
                  <div className="space-y-4">
                    <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-white mb-2">
                          {result.totalMinutes}
                        </div>
                        <div className="text-xl text-blue-100">
                          Total Minutes
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                        <div className="text-3xl font-bold text-white">
                          {result.hours}
                        </div>
                        <div className="text-blue-100">Hours</div>
                      </div>
                      <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                        <div className="text-3xl font-bold text-white">
                          {result.minutes}
                        </div>
                        <div className="text-blue-100">Minutes</div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-4">
                <div className="flex space-x-4">
                  <button
                    onClick={calculateDifference}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <Calculator className="inline-block w-5 h-5 mr-2" />
                    Calculate
                  </button>
                  <button
                    onClick={resetCalculator}
                    className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20"
                  >
                    <RefreshCw className="inline-block w-5 h-5 mr-2" />
                    Reset
                  </button>
                </div>
                
                {/* Navigation Links */}
                <AppNavigation currentPage="/minutes" layout="grid-5" />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-blue-100 animate-fade-in">
            <p>Perfect for calculating work hours, meeting durations, and time planning</p>
            <p className="text-sm mt-2 opacity-80">Part of the Ultimate Calculator Suite</p>
          </div>
        </div>
      </div>
    </div>
  )
} 