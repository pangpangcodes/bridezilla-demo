'use client'

import { Calendar, MapPin } from 'lucide-react'
import Image from 'next/image'
import AnimatedHearts from './AnimatedHearts'

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-green-50 via-green-100/50 to-green-50 pt-8 md:pt-0 md:flex md:items-center md:justify-center">
      {/* Animated hearts background - Partiful style */}
      <AnimatedHearts />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Main Card Layout - Partiful inspired */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Left Side - Photo & Invitation Details */}
              <div className="p-8 md:p-10 lg:p-12 flex flex-col bg-white">
                {/* Photo */}
                <div className="mb-6">
                  <div className="relative w-full">
                    <Image
                      src="/couple-photo.png"
                      alt="Bella and Edward"
                      width={600}
                      height={600}
                      className="object-contain w-full h-auto rounded-xl shadow-lg"
                      priority
                    />
                  </div>
                </div>

                {/* Header - Elegant Font (Playfair) */}
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  B&E's Wedding
                </h1>

                {/* Date, Location, Host Info */}
                <div className="space-y-2 text-sm md:text-base text-gray-700">
                  <p>📅 Sat, Sept 20 – Mon, Sept 22, 2026</p>
                  <p>📍 <a href="https://maps.app.goo.gl/WiS5wuaKHpYuXRky6" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary-600 transition-colors">Hacienda de los Naranjos</a>, Seville, Spain</p>
                  <p>❤️ Hosted by Bella & Edward</p>
                </div>
              </div>

              {/* Right Side - Message */}
              <div className="bg-gradient-to-br from-green-50 to-green-100/30 p-8 md:p-10 lg:p-12 flex flex-col justify-center relative overflow-visible">
                {/* Floral Decoration - Top Right Corner */}
                <div className="absolute -top-8 -right-8 w-72 h-72 opacity-80 pointer-events-none">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    {/* Watercolor style flowers and foliage */}
                    {/* Leaf sprigs */}
                    <ellipse cx="150" cy="50" rx="25" ry="8" fill="#86a865" opacity="0.4" transform="rotate(-30 150 50)" />
                    <ellipse cx="160" cy="40" rx="20" ry="7" fill="#9ab880" opacity="0.3" transform="rotate(-45 160 40)" />
                    <ellipse cx="140" cy="60" rx="22" ry="7" fill="#7a9855" opacity="0.35" transform="rotate(-15 140 60)" />

                    {/* Orange flower - watercolor style */}
                    <circle cx="170" cy="60" r="18" fill="#ff9a5a" opacity="0.4" />
                    <circle cx="172" cy="58" r="15" fill="#ff7f3f" opacity="0.5" />
                    <circle cx="170" cy="60" r="12" fill="#ffb380" opacity="0.3" />
                    <circle cx="170" cy="60" r="5" fill="#ffd4a3" opacity="0.6" />

                    {/* Yellow flower */}
                    <circle cx="145" cy="45" r="15" fill="#ffd966" opacity="0.4" />
                    <circle cx="147" cy="43" r="12" fill="#ffe599" opacity="0.5" />
                    <circle cx="145" cy="45" r="8" fill="#fff4cc" opacity="0.4" />
                    <circle cx="145" cy="45" r="4" fill="#ffffff" opacity="0.5" />

                    {/* Pink/Coral flower */}
                    <circle cx="180" cy="80" r="14" fill="#ff9999" opacity="0.4" />
                    <circle cx="182" cy="78" r="11" fill="#ffb3b3" opacity="0.5" />
                    <circle cx="180" cy="80" r="7" fill="#ffcccc" opacity="0.4" />
                    <circle cx="180" cy="80" r="3" fill="#fff0f0" opacity="0.6" />

                    {/* Small accent flowers */}
                    <circle cx="155" cy="70" r="8" fill="#ffcc80" opacity="0.4" />
                    <circle cx="155" cy="70" r="5" fill="#ffe0b3" opacity="0.5" />

                    <circle cx="165" cy="90" r="7" fill="#ffa366" opacity="0.4" />
                    <circle cx="165" cy="90" r="4" fill="#ffccb3" opacity="0.5" />

                    {/* Additional foliage */}
                    <ellipse cx="170" cy="95" rx="18" ry="6" fill="#a8c885" opacity="0.3" transform="rotate(20 170 95)" />
                    <ellipse cx="185" cy="70" rx="15" ry="5" fill="#86a865" opacity="0.35" transform="rotate(-60 185 70)" />
                  </svg>
                </div>

                {/* Header Message */}
                <div className="mb-8">
                  <p className="font-display text-xl md:text-2xl text-gray-800">
                    Join us for an unforgettable weekend in Seville 🇪🇸
                  </p>
                </div>

                {/* Description */}
                <div className="mb-8 text-gray-700 leading-relaxed text-base md:text-lg">
                  <p className="mb-4">
                    When Edward and I started planning our wedding, what mattered most to us was gathering everyone we love in one beautiful place.
                  </p>
                  <p className="mb-4">
                    As much as this wedding is a celebration of us, it's also a celebration of our love and gratitude for all of our closest friends and family that shaped our lives and filled our hearts.
                  </p>
                  <p className="mb-4">
                    We found Hacienda de los Naranjos in Seville, Spain that felt like us, and we invite you to spend a magical weekend with us there - to unwind, connect, celebrate, and make new memories to last a lifetime.
                  </p>
                  <p className="font-bold">
                    We cannot wait to celebrate with you!
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="pt-6 border-t border-gray-300">
                  <div className="flex gap-3 md:gap-4">
                    <a
                      href="/rsvp"
                      className="flex-1 inline-flex items-center justify-center px-4 py-3 md:px-8 md:py-4 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm hover:shadow-md text-sm md:text-base"
                    >
                      RSVP
                    </a>
                    <a
                      href="/itinerary"
                      className="flex-1 inline-flex items-center justify-center px-4 py-3 md:px-8 md:py-4 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors shadow-sm hover:shadow-md text-sm md:text-base"
                    >
                      View Itinerary
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
