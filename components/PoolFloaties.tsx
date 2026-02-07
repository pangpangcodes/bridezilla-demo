'use client'

export default function PoolFloaties() {
  const floaties = [
    // Pool rings
    { id: 1, type: 'ring', left: '55%', top: '20%', delay: '0s', duration: '4s' },
    { id: 2, type: 'ring', left: '80%', top: '60%', delay: '1s', duration: '5s' },
    { id: 3, type: 'ring', left: '90%', top: '30%', delay: '0.5s', duration: '4.5s' },
    // Flamingo floaties
    { id: 4, type: 'flamingo', left: '75%', top: '45%', delay: '1.5s', duration: '6s' },
    { id: 5, type: 'flamingo', left: '60%', top: '10%', delay: '0.3s', duration: '5.5s' },
    { id: 6, type: 'flamingo', left: '65%', top: '75%', delay: '2s', duration: '5s' },
    // Water waves
    { id: 7, type: 'wave', left: '70%', top: '25%', delay: '1.2s', duration: '5s' },
    { id: 8, type: 'wave', left: '85%', top: '70%', delay: '0.8s', duration: '4.5s' },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
      {floaties.map((floatie) => (
        <div
          key={floatie.id}
          className="absolute"
          style={{
            left: floatie.left,
            top: floatie.top,
            animation: `floatSolid ${floatie.duration} ease-in-out infinite`,
            animationDelay: floatie.delay,
          }}
        >
          {floatie.type === 'ring' && (
            <svg width="50" height="50" viewBox="0 0 50 50" style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))' }}>
              <defs>
                <radialGradient id={`ringGradient-${floatie.id}`} cx="40%" cy="40%">
                  <stop offset="0%" stopColor="#ff8c5a" />
                  <stop offset="50%" stopColor="#ff6b35" />
                  <stop offset="100%" stopColor="#e55a2b" />
                </radialGradient>
              </defs>
              <circle cx="25" cy="25" r="16" fill="none" stroke="#fff" strokeWidth="2" opacity="0.5" />
              <circle cx="25" cy="25" r="15" fill="none" stroke={`url(#ringGradient-${floatie.id})`} strokeWidth="10" />
              <circle cx="25" cy="25" r="10" fill="none" stroke="#d44920" strokeWidth="1" opacity="0.3" />
              <circle cx="25" cy="25" r="15" fill="none" stroke="#ffb380" strokeWidth="2" opacity="0.6" />
            </svg>
          )}
          {floatie.type === 'ball' && (
            <svg width="45" height="45" viewBox="0 0 40 40" style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))' }}>
              <defs>
                <radialGradient id={`ballGradient-${floatie.id}`} cx="35%" cy="35%">
                  <stop offset="0%" stopColor="#ff6b7a" />
                  <stop offset="70%" stopColor="#ff4757" />
                  <stop offset="100%" stopColor="#e03e4a" />
                </radialGradient>
              </defs>
              <circle cx="20" cy="20" r="16" fill={`url(#ballGradient-${floatie.id})`} />
              <circle cx="15" cy="15" r="5" fill="#fff" opacity="0.4" />
              <path d="M 20 4 Q 20 20 4 20" fill="none" stroke="#fff" strokeWidth="2.5" opacity="0.8" />
              <path d="M 20 4 Q 20 20 36 20" fill="none" stroke="#3498db" strokeWidth="2.5" opacity="0.8" />
            </svg>
          )}
          {floatie.type === 'flamingo' && (
            <svg width="55" height="55" viewBox="0 0 50 50" style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))' }}>
              <defs>
                <radialGradient id={`flamingoGradient-${floatie.id}`} cx="40%" cy="40%">
                  <stop offset="0%" stopColor="#ff91b4" />
                  <stop offset="70%" stopColor="#ff6b9d" />
                  <stop offset="100%" stopColor="#e5528a" />
                </radialGradient>
              </defs>
              <ellipse cx="25" cy="28" rx="13" ry="11" fill={`url(#flamingoGradient-${floatie.id})`} />
              <ellipse cx="25" cy="28" rx="8" ry="6" fill="#fff" opacity="0.3" />
              <path d="M 25 20 Q 23 14 21 9" stroke="#ff6b9d" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              <path d="M 24 20 Q 22.5 14 20.5 9" stroke="#ff91b4" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6" />
              <circle cx="20" cy="7" r="4.5" fill={`url(#flamingoGradient-${floatie.id})`} />
              <circle cx="19" cy="6" r="1.5" fill="#ffb3d1" opacity="0.7" />
              <path d="M 18 7 L 14 7" stroke="#2c3e50" strokeWidth="2" strokeLinecap="round" />
              <circle cx="21" cy="6.5" r="0.8" fill="#2c3e50" />
            </svg>
          )}
          {floatie.type === 'wave' && (
            <svg width="60" height="35" viewBox="0 0 60 35" style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.15))' }}>
              <defs>
                <linearGradient id={`waveGradient-${floatie.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#7dd3fc" opacity="0.6" />
                  <stop offset="100%" stopColor="#3b82f6" opacity="0.4" />
                </linearGradient>
              </defs>
              {/* Wave layers */}
              <path d="M 0 20 Q 10 10, 20 20 T 40 20 T 60 20" fill="none" stroke="url(#waveGradient-${floatie.id})" strokeWidth="4" strokeLinecap="round" />
              <path d="M 5 25 Q 15 15, 25 25 T 45 25 T 65 25" fill="none" stroke="#93c5fd" strokeWidth="3" opacity="0.5" strokeLinecap="round" />
              <path d="M 0 15 Q 8 8, 16 15 T 32 15 T 48 15" fill="none" stroke="#bfdbfe" strokeWidth="2.5" opacity="0.6" strokeLinecap="round" />
            </svg>
          )}
        </div>
      ))}
    </div>
  )
}
