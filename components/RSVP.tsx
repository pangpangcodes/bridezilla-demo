'use client'

import { useState } from 'react'
import { Check, X, Users, Mail, MessageSquare, Phone, UserPlus } from 'lucide-react'

interface PlusOne {
  id: string
  name: string
}

export default function RSVP() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    attending: '',
  })
  const [plusOnes, setPlusOnes] = useState<PlusOne[]>([])
  const maxPlusOnes = 2
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addPlusOne = () => {
    if (plusOnes.length < maxPlusOnes) {
      setPlusOnes([...plusOnes, { id: Date.now().toString(), name: '' }])
    }
  }

  const removePlusOne = (id: string) => {
    setPlusOnes(plusOnes.filter(po => po.id !== id))
  }

  const updatePlusOneName = (id: string, name: string) => {
    setPlusOnes(plusOnes.map(po => po.id === id ? { ...po, name } : po))
  }

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '')

    // Format as (XXX) XXX-XXXX
    if (digits.length <= 3) {
      return digits
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    } else {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setFormData({ ...formData, phone: formatted })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/rsvp/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          attending: formData.attending === 'yes',
          plusOnes: plusOnes.filter(po => po.name.trim()).map(po => ({ name: po.name }))
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit RSVP')
      }

      // If we got a token, redirect to view RSVP
      if (data.data?.token) {
        window.location.href = `/rsvp/view?token=${data.data.token}`
        return
      }

      // Fallback to success message
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <section id="rsvp" className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-lg p-12">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
                Thank You!
              </h2>
              <p className="text-gray-600 mb-6">
                We've received your RSVP. Check your email for a link to view your submission!
              </p>
              <p className="text-sm text-gray-500">
                Already have the link? <a href="#rsvp-lookup" className="text-primary-600 hover:text-primary-700 font-semibold">View Your RSVP</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="rsvp" className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              RSVP
            </h2>
            <p className="text-lg text-gray-600">
              Please let us know if you can join us for our celebration
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Full Name"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="name@email.com"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              {/* Attending */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Will you be attending? *
                </label>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, attending: 'yes' })}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 rounded-lg font-semibold transition-colors ${
                      formData.attending === 'yes'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Check className="w-5 h-5 flex-shrink-0" />
                    <span>Yes, I'll be there!</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, attending: 'no' })}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 rounded-lg font-semibold transition-colors ${
                      formData.attending === 'no'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <X className="w-5 h-5 flex-shrink-0" />
                    <span>Sorry, can't make it</span>
                  </button>
                </div>
              </div>

              {/* Plus Ones */}
              {formData.attending === 'yes' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Your plus ones (max {maxPlusOnes})
                    </label>
                    <div className="space-y-3">
                      {plusOnes.map((plusOne) => (
                        <div key={plusOne.id} className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-gray-600" />
                          </div>
                          <input
                            type="text"
                            value={plusOne.name}
                            onChange={(e) => updatePlusOneName(plusOne.id, e.target.value)}
                            placeholder="Guest name"
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={() => removePlusOne(plusOne.id)}
                            className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
                            aria-label="Remove guest"
                          >
                            <X className="w-6 h-6" />
                          </button>
                        </div>
                      ))}

                      {plusOnes.length < maxPlusOnes && (
                        <button
                          type="button"
                          onClick={addPlusOne}
                          className="w-full flex items-center justify-center gap-2 px-4 py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
                        >
                          <UserPlus className="w-5 h-5" />
                          <span className="font-medium">Add a plus one</span>
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!formData.attending || isSubmitting}
                className="w-full bg-gray-900 text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

