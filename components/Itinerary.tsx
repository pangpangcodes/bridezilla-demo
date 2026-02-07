'use client'

import { Calendar, Clock, Utensils, Music, Camera, Sparkles, Wine, Waves, Luggage, PartyPopper, Fish, Compass, Map } from 'lucide-react'
import PoolFloaties from './PoolFloaties'
import WeddingDecorations from './WeddingDecorations'
import RecoveryDayIcons from './RecoveryDayIcons'
import CheckOutXOXOs from './CheckOutXOXOs'

const itinerary = [
  {
    day: 1,
    date: 'September 14, 2025',
    title: 'Pool Party & Welcome Dinner',
    events: [
      {
        time: '2:00 PM - 5:00 PM',
        title: 'Check-In',
        description: 'Arrive and settle into your room',
        icon: Luggage,
      },
      {
        time: 'All afternoon',
        title: 'Pool Party',
        description: 'Relax by the pool and make new friends',
        icon: Waves,
      },
      {
        time: 'TBD',
        title: 'Welcome Dinner',
        description: 'Casual dinner, no dress code',
        icon: Fish,
      },
    ],
  },
  {
    day: 2,
    date: 'September 15, 2025',
    title: 'Wedding Day',
    events: [
      {
        time: '2:30 PM',
        title: 'Cocktail Hour',
        description: 'The warm-up',
        icon: Wine,
      },
      {
        time: 'TBD',
        title: 'Ceremony',
        description: 'The ugly crying',
        icon: Music,
      },
      {
        time: 'TBD',
        title: 'Reception',
        description: 'The main event where we eat, drink and dance till late',
        icon: Utensils,
      },
    ],
  },
  {
    day: 3,
    date: 'September 16, 2025',
    title: 'Recovery Day',
    events: [
      {
        time: 'All day',
        title: 'Free time! Group activity TBD',
        description: 'How hungover will you be?',
        icon: Map,
      },
    ],
  },
  {
    day: 4,
    date: 'September 17, 2025',
    title: 'Check Out',
    events: [
      {
        time: '11:00 AM',
        title: 'Check Out',
        description: 'All parties must come to an end... we miss you already!',
        icon: Calendar,
      },
    ],
  },
]

export default function Itinerary() {
  return (
    <section id="itinerary" className="py-3 md:py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-4 md:mb-8">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Itinerary
            </h2>
            <p className="text-lg text-gray-600">
              <i>Why celebrate for one night when you can celebrate for three?</i>
            </p>
          </div>

          <div className="space-y-4 md:space-y-6">
            {itinerary.map((day, dayIndex) => (
              <div
                key={day.day}
                className="bg-gradient-to-br from-primary-50 to-white rounded-2xl shadow-md p-4 md:p-6 border border-primary-100 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden"
              >
                {day.day === 1 && <PoolFloaties />}
                {day.day === 2 && <WeddingDecorations />}
                {day.day === 3 && <RecoveryDayIcons />}
                {day.day === 4 && <CheckOutXOXOs />}
                <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4 relative z-10">
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-base md:text-lg">
                    {day.day}
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-gray-900">
                      {day.title}
                    </h3>
                    <p className="text-gray-600">
                      {day.date}
                    </p>
                  </div>
                </div>

                <div className="md:ml-16 relative z-10">
                  <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm max-w-full md:max-w-md">
                    <div className="space-y-4">
                      {day.events.map((event, eventIndex) => {
                        const Icon = event.icon
                        return (
                          <div key={eventIndex} className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                              <Icon className="w-5 h-5 text-primary-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-semibold text-gray-700">
                                  {event.time}
                                </span>
                              </div>
                              <h4 className="font-semibold text-gray-900 mb-1">
                                {event.title}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {event.description}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

