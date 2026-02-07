'use client'

import { Heart } from 'lucide-react'
import { useEffect, useState } from 'react'

interface HeartParticle {
  id: number
  left: number
  top: number
  size: number
  delay: number
  duration: number
  opacity: number
  color: string
}

export default function AnimatedHearts() {
  const [hearts, setHearts] = useState<HeartParticle[]>([])

  useEffect(() => {
    // Create many small hearts with varying properties - Partiful style
    const colors = ['#f87171', '#fb7185', '#f43f5e', '#ef4444'] // Various red/pink shades
    const newHearts: HeartParticle[] = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 6 + Math.random() * 10, // 6-16px - smaller, more subtle
      delay: Math.random() * 6,
      duration: 4 + Math.random() * 3, // 4-7s - slower, more gentle
      opacity: 0.1 + Math.random() * 0.2, // 0.1-0.3 - more subtle
      color: colors[Math.floor(Math.random() * colors.length)],
    }))
    setHearts(newHearts)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <Heart
          key={heart.id}
          className="absolute heart-float"
          style={{
            left: `${heart.left}%`,
            top: `${heart.top}%`,
            width: `${heart.size}px`,
            height: `${heart.size}px`,
            color: heart.color,
            opacity: heart.opacity,
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`,
          }}
          fill="currentColor"
        />
      ))}
    </div>
  )
}

