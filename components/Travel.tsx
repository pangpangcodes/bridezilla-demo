'use client'

import { Plane, Train, Car, MapPin, Clock, Globe } from 'lucide-react'

export default function Travel() {
  return (
    <section id="travel" className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Travel Information
            </h2>
            <p className="text-lg text-gray-600">
              How to get to Seville, Spain
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <Plane className="w-10 h-10 text-primary-600 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">By Plane</h3>
              <p className="text-sm text-gray-600 mb-4">
                Seville Airport (SVQ) is just 20 minutes from the city center and our venue.
              </p>
              <div className="text-sm text-gray-700">
                <p className="font-semibold">Airport Code:</p>
                <p>SVQ - Seville Airport</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <Train className="w-10 h-10 text-primary-600 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">By Train</h3>
              <p className="text-sm text-gray-600 mb-4">
                High-speed AVE trains connect Seville to Madrid, Barcelona, and other major Spanish cities.
              </p>
              <div className="text-sm text-gray-700">
                <p className="font-semibold">Main Station:</p>
                <p>Seville Santa Justa</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <Car className="w-10 h-10 text-primary-600 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">By Car</h3>
              <p className="text-sm text-gray-600 mb-4">
                Seville is easily accessible via the A-4 and A-49 motorways. Rental cars are available at the airport.
              </p>
              <div className="text-sm text-gray-700">
                <p className="font-semibold">Parking:</p>
                <p>Available at the venue</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h3 className="font-display text-2xl font-bold text-gray-900 mb-4">Getting from the Airport</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Car className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Airport Transfer</h4>
                  <p className="text-gray-600 mb-2">
                    Taxis and rental cars are available at the airport. The drive to Hacienda de los Naranjos takes approximately 20 minutes.
                  </p>
                  <p className="text-sm text-gray-500">
                    We can help coordinate shared transfers if multiple guests are arriving around the same time.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Recommended Arrival</h4>
                  <p className="text-gray-600">
                    We recommend arriving on September 20th during check-in time to join us for the welcome reception. Check-in at the venue is available from 2 - 5pm.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Globe className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Visa Requirements</h4>
                  <p className="text-gray-600">
                    US citizens do not require a visa for stays up to 90 days in Spain. Other nationalities should check with their local Spanish consulate.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-primary-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Need Help?</strong> If you have questions about travel arrangements or need assistance 
                coordinating your journey, please don't hesitate to reach out to us. We're here to help make 
                your trip as smooth as possible!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

