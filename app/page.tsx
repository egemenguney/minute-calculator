'use client'

import React from 'react'
import Link from 'next/link'
import { Clock, Calculator, Calendar, Skull, Cloud, Navigation, Camera, ArrowRight, Sparkles } from 'lucide-react'

export default function LandingPage() {
  const tools = [
    {
      title: 'Minute Calculator',
      description: 'Calculate precise time differences between any two times with 12-hour AM/PM format',
      icon: Clock,
      href: '/minutes',
      gradient: 'from-blue-500 to-purple-600',
      features: ['Real-time calculations', '12-hour format', 'Work hours tracking']
    },
    {
      title: 'Age Calculator',
      description: 'Live age counter showing years, months, days, hours, minutes, and seconds',
      icon: Calendar,
      href: '/age-calculator',
      gradient: 'from-purple-500 to-pink-600',
      features: ['Real-time updates', 'Precise calculations', 'Beautiful animations']
    },
    {
      title: 'Death Counter',
      description: 'Global mortality statistics based on WHO data with real-time updates',
      icon: Skull,
      href: '/death-counter',
      gradient: 'from-red-600 to-gray-800',
      features: ['Global statistics', 'WHO data', 'Educational awareness']
    },
    {
      title: 'Weather App',
      description: 'Real weather data with city selection and live updates',
      icon: Cloud,
      href: '/weather',
      gradient: 'from-sky-500 to-blue-600',
      features: ['Real weather data', 'City selection', 'Live updates']
    },
    {
      title: 'Interactive Maps',
      description: 'Google Maps with live Street View, search, and navigation',
      icon: Navigation,
      href: '/maps',
      gradient: 'from-green-500 to-teal-600',
      features: ['360° Street View', 'Live search', 'Precise coordinates']
    },

  ]

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-gray-800 to-stone-900">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800/30 to-stone-800/30" />
      <div className="absolute inset-0 bg-[url('/images/gradient-bg.webp')] bg-cover bg-center opacity-10" />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen p-4">
        {/* Hero Section */}
        <div className="text-center py-16 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Calculator className="w-20 h-20 text-white mr-4" />
              <Sparkles className="w-8 h-8 text-yellow-300 absolute -top-2 -right-2 animate-pulse" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white">
              Ultimate Calculator Suite
            </h1>
          </div>
                     <p className="text-2xl md:text-3xl text-white/90 mb-4">
             5 Powerful Tools in One Beautiful App
           </p>
           <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
             Complete toolkit featuring time calculations, live statistics, weather data, interactive maps, and more. 
             All designed with modern UI and real-time functionality.
           </p>
           
           {/* Quick Stats */}
           <div className="flex justify-center space-x-8 mb-12">
             <div className="text-center">
               <div className="text-3xl font-bold text-white">5</div>
               <div className="text-white/80">Tools</div>
             </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">100%</div>
              <div className="text-white/80">Real-time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">0</div>
              <div className="text-white/80">API Keys*</div>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up">
            {tools.map((tool, index) => {
              const IconComponent = tool.icon
              return (
                <Link key={tool.title} href={tool.href}>
                  <div className="group glass rounded-3xl p-8 shadow-2xl hover:scale-105 transition-all duration-500 border border-white/20 hover:border-white/40 cursor-pointer">
                    {/* Tool Header */}
                    <div className="flex items-center mb-6">
                      <div className={`p-4 rounded-2xl bg-gradient-to-r ${tool.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-2xl font-bold text-white group-hover:text-white/90 transition-colors">
                          {tool.title}
                        </h3>
                      </div>
                      <ArrowRight className="w-6 h-6 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                    </div>

                    {/* Tool Description */}
                    <p className="text-white/80 text-lg mb-6 leading-relaxed">
                      {tool.description}
                    </p>

                    {/* Tool Features */}
                    <div className="space-y-2">
                      {tool.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-white/70">
                          <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mr-3"></div>
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Hover Effect */}
                    <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className={`h-1 bg-gradient-to-r ${tool.gradient} rounded-full`}></div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-4xl mx-auto mt-20 text-center animate-fade-in">
          <h2 className="text-4xl font-bold text-white mb-8">Why Choose Our Suite?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Modern Design</h3>
              <p className="text-white/80">Beautiful glass morphism UI with smooth animations</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Real-time Updates</h3>
              <p className="text-white/80">Live counters and instant calculations</p>
            </div>
                         <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
               <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                 <Camera className="w-6 h-6 text-white" />
               </div>
               <h3 className="text-xl font-bold text-white mb-2">No Setup Required</h3>
               <p className="text-white/80">Most tools work without API keys or configuration</p>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-20 pb-12 text-white/80 animate-fade-in">
          <p className="text-lg mb-2">Built with ❤️ using Next.js, TypeScript, and Tailwind CSS</p>
          <p className="text-sm">*Some advanced features require API keys</p>
        </div>
      </div>
    </div>
  )
} 