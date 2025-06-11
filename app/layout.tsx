import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ultimate Calculator Suite - 6 Powerful Tools in One App',
  description: 'Complete toolkit featuring Minute Calculator, Age Counter, Death Statistics, Live Weather, Interactive Maps with Street View, and MOBESE Traffic Cameras. All tools in one beautiful modern interface.',
  keywords: 'calculator suite, minute calculator, age calculator, death counter, weather app, maps street view, mobese cameras, time calculator, live statistics, utility tools',
  authors: [{ name: 'Ultimate Calculator Suite' }],
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    title: 'Ultimate Calculator Suite - 6 Powerful Tools',
    description: 'Minute Calculator • Age Counter • Death Statistics • Live Weather • Street View Maps • MOBESE Cameras',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ultimate Calculator Suite - 6 Powerful Tools',
    description: 'Complete toolkit with calculators, live statistics, weather, maps and more!',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
} 