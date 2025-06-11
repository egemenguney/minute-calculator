'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, ArrowLeft, User, Timer } from 'lucide-react'
import AppNavigation from '../components/AppNavigation'

interface AgeResult {
  years: number
  months: number
  days: number
  hours: number
  minutes: number
  seconds: number
  totalDays: number
  totalHours: number
  totalMinutes: number
  totalSeconds: number
}

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('1989-07-17')
  const [ageResult, setAgeResult] = useState<AgeResult | null>(null)

  const calculateAge = () => {
    if (!birthDate) return

    const birth = new Date(birthDate)
    const now = new Date()

    // Calculate total differences
    const totalMs = now.getTime() - birth.getTime()
    const totalSeconds = Math.floor(totalMs / 1000)
    const totalMinutes = Math.floor(totalSeconds / 60)
    const totalHours = Math.floor(totalMinutes / 60)
    const totalDays = Math.floor(totalHours / 24)

    // Calculate detailed age
    let years = now.getFullYear() - birth.getFullYear()
    let months = now.getMonth() - birth.getMonth()
    let days = now.getDate() - birth.getDate()
    let hours = now.getHours() - birth.getHours()
    let minutes = now.getMinutes() - birth.getMinutes()
    let seconds = now.getSeconds() - birth.getSeconds()

    // Adjust for negative values
    if (seconds < 0) {
      seconds += 60
      minutes--
    }
    if (minutes < 0) {
      minutes += 60
      hours--
    }
    if (hours < 0) {
      hours += 24
      days--
    }
    if (days < 0) {
      const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
      days += lastMonth.getDate()
      months--
    }
    if (months < 0) {
      months += 12
      years--
    }

    setAgeResult({
      years,
      months,
      days,
      hours,
      minutes,
      seconds,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds
    })
  }

  useEffect(() => {
    calculateAge()
    const interval = setInterval(calculateAge, 1000)
    return () => clearInterval(interval)
  }, [birthDate])

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20" />
      <div className="absolute inset-0 bg-[url('/images/gradient-bg.webp')] bg-cover bg-center opacity-20" />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex items-center justify-center mb-4">
              <Link 
                href="/"
                className="absolute left-4 top-4 p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 backdrop-blur-sm border border-white/20"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </Link>
              <div className="relative w-16 h-16 mr-4">
                <Calendar className="w-16 h-16 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Age Calculator
              </h1>
            </div>
            <p className="text-xl text-pink-100">
              Calculate your exact age with live updates
            </p>
          </div>

          {/* Calculator Card */}
          <div className="glass rounded-3xl p-8 shadow-2xl animate-slide-up">
            <div className="space-y-8">
              {/* Birth Date Input */}
              <div className="text-center space-y-4">
                <label className="block text-2xl font-semibold text-white mb-4">
                  <User className="inline-block w-6 h-6 mr-2" />
                  Enter Your Birth Date
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="time-input px-6 py-4 rounded-xl text-xl font-medium text-gray-800 text-center mx-auto"
                />
              </div>

              {/* Age Display */}
              {ageResult && (
                <div className="space-y-6">
                  {/* Main Age Display */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-center">
                      <div className="text-3xl font-bold text-white animate-pulse-slow">
                        {ageResult.years}
                      </div>
                      <div className="text-pink-100 text-sm">Years</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-center">
                      <div className="text-3xl font-bold text-white animate-pulse-slow">
                        {ageResult.months}
                      </div>
                      <div className="text-pink-100 text-sm">Months</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-center">
                      <div className="text-3xl font-bold text-white animate-pulse-slow">
                        {ageResult.days}
                      </div>
                      <div className="text-pink-100 text-sm">Days</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-center">
                      <div className="text-3xl font-bold text-white animate-pulse-slow">
                        {ageResult.hours}
                      </div>
                      <div className="text-pink-100 text-sm">Hours</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-center">
                      <div className="text-3xl font-bold text-white animate-pulse-slow">
                        {ageResult.minutes}
                      </div>
                      <div className="text-pink-100 text-sm">Minutes</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-center">
                      <div className="text-3xl font-bold text-white animate-pulse-slow">
                        {ageResult.seconds}
                      </div>
                      <div className="text-pink-100 text-sm">Seconds</div>
                    </div>
                  </div>

                  {/* Total Statistics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-white/20 text-center">
                      <div className="text-2xl font-bold text-white mb-2">
                        {ageResult.totalDays.toLocaleString()}
                      </div>
                      <div className="text-pink-100">Total Days</div>
                    </div>
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-pink-500/20 to-red-500/20 backdrop-blur-sm border border-white/20 text-center">
                      <div className="text-2xl font-bold text-white mb-2">
                        {ageResult.totalHours.toLocaleString()}
                      </div>
                      <div className="text-pink-100">Total Hours</div>
                    </div>
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-red-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 text-center">
                      <div className="text-2xl font-bold text-white mb-2">
                        {ageResult.totalMinutes.toLocaleString()}
                      </div>
                      <div className="text-pink-100">Total Minutes</div>
                    </div>
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-white/20 text-center">
                      <div className="text-2xl font-bold text-white mb-2">
                        {ageResult.totalSeconds.toLocaleString()}
                      </div>
                      <div className="text-pink-100">Total Seconds</div>
                    </div>
                  </div>

                  {/* Live Update Indicator */}
                  <div className="text-center">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                      <Timer className="w-4 h-4 text-white animate-spin" />
                      <span className="text-white text-sm">Live Updates Every Second</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <AppNavigation currentPage="/age-calculator" layout="grid-5" />
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-pink-100 animate-fade-in">
            <p>Watch your age increase in real-time - every second counts!</p>
          </div>
        </div>
      </div>
    </div>
  )
} 