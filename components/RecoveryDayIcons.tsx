'use client'

export default function RecoveryDayIcons() {
  const icons = [
    // Basketballs
    { id: 1, type: 'basketball', left: '65%', top: '20%', delay: '0s', duration: '4s' },
    { id: 2, type: 'basketball', left: '85%', top: '65%', delay: '1s', duration: '5s' },
    // Sunglasses
    { id: 3, type: 'sunglasses', left: '60%', top: '50%', delay: '0.5s', duration: '5.5s' },
    { id: 4, type: 'sunglasses', left: '88%', top: '30%', delay: '1.2s', duration: '5s' },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
      {icons.map((icon) => (
        <div
          key={icon.id}
          className="absolute"
          style={{
            left: icon.left,
            top: icon.top,
            animation: `floatSolid ${icon.duration} ease-in-out infinite`,
            animationDelay: icon.delay,
          }}
        >
          {icon.type === 'basketball' && (
            <svg width="50" height="50" viewBox="0 0 50 50" style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))' }}>
              <defs>
                <radialGradient id={`basketballGradient-${icon.id}`} cx="35%" cy="35%">
                  <stop offset="0%" stopColor="#ff9966" />
                  <stop offset="70%" stopColor="#ff7733" />
                  <stop offset="100%" stopColor="#e56020" />
                </radialGradient>
              </defs>
              {/* Basketball body */}
              <circle cx="25" cy="25" r="18" fill={`url(#basketballGradient-${icon.id})`} />
              {/* Highlight */}
              <circle cx="18" cy="18" r="6" fill="#fff" opacity="0.3" />
              {/* Basketball lines */}
              <path d="M 25 7 L 25 43" stroke="#2c3e50" strokeWidth="1.5" opacity="0.4" />
              <path d="M 7 25 L 43 25" stroke="#2c3e50" strokeWidth="1.5" opacity="0.4" />
              <path d="M 25 7 Q 15 25 25 43" stroke="#2c3e50" strokeWidth="1.5" fill="none" opacity="0.4" />
              <path d="M 25 7 Q 35 25 25 43" stroke="#2c3e50" strokeWidth="1.5" fill="none" opacity="0.4" />
            </svg>
          )}
          {icon.type === 'sunglasses' && (
            <svg width="50" height="32" viewBox="0 0 70 35" style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))' }}>
              <defs>
                <linearGradient id={`lensGradient-${icon.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                <radialGradient id={`reflectionGradient-${icon.id}`} cx="30%" cy="30%">
                  <stop offset="0%" stopColor="#ffffff" opacity="0.6" />
                  <stop offset="100%" stopColor="#ffffff" opacity="0" />
                </radialGradient>
              </defs>

              {/* Frame outline */}
              <rect x="4" y="9" width="22" height="14" rx="7" fill="#1a202c" />
              <rect x="44" y="9" width="22" height="14" rx="7" fill="#1a202c" />

              {/* Left lens - dark with gradient */}
              <rect x="5.5" y="10.5" width="19" height="11" rx="5.5" fill={`url(#lensGradient-${icon.id})`} />
              {/* Left lens reflection */}
              <ellipse cx="12" cy="14" rx="4" ry="3" fill={`url(#reflectionGradient-${icon.id})`} />

              {/* Right lens - dark with gradient */}
              <rect x="45.5" y="10.5" width="19" height="11" rx="5.5" fill={`url(#lensGradient-${icon.id})`} />
              {/* Right lens reflection */}
              <ellipse cx="52" cy="14" rx="4" ry="3" fill={`url(#reflectionGradient-${icon.id})`} />

              {/* Bridge - shorter */}
              <rect x="28" y="15" width="14" height="2.5" rx="1.5" fill="#1a202c" />

              {/* Left temple arm */}
              <path d="M 4 16 L 0 15" stroke="#1a202c" strokeWidth="2.5" strokeLinecap="round" />

              {/* Right temple arm */}
              <path d="M 66 16 L 70 15" stroke="#1a202c" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          )}
        </div>
      ))}
    </div>
  )
}
