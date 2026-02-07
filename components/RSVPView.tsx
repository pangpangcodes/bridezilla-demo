'use client'

import { Check, X, Users, Mail, Phone, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/format'
import type { RSVPViewData, Question } from '@/types/rsvp'

interface RSVPViewProps {
  rsvp: RSVPViewData
  questions?: Question[]
  token: string
}

export default function RSVPView({ rsvp, questions, token }: RSVPViewProps) {
  return (
    <section className="pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Your RSVP
            </h2>
            <p className="text-lg text-gray-600">
              View your submitted information
            </p>
          </div>

          {/* RSVP Summary Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">{rsvp.name}</h3>
              <span className={`font-semibold ${
                rsvp.attending
                  ? 'text-primary-600'
                  : 'text-gray-600'
              }`}>
                {rsvp.attending ? '✓ Attending' : '✗ Not Attending'}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span>{rsvp.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>{rsvp.phone}</span>
              </div>
            </div>

            {rsvp.attending && rsvp.guests && rsvp.guests.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-gray-600" />
                  <h4 className="font-semibold text-gray-900">Plus Ones</h4>
                </div>
                <ul className="space-y-2">
                  {rsvp.guests.map((guest, index) => (
                    <li key={index} className="text-gray-600 pl-7">
                      {guest.guest_name || guest.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Questions Section - Placeholder for Phase 4 */}
          {questions && questions.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Additional Questions
              </h3>
              <p className="text-gray-600">
                Additional questions feature coming soon!
              </p>
            </div>
          )}

          {/* Back to Itinerary Link */}
          <div className="mt-8 text-center">
            <a
              href="/itinerary"
              className="inline-block px-6 py-2 bg-green-200 text-gray-900 rounded-full font-semibold hover:bg-green-300 transition-colors"
            >
              View Itinerary
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
