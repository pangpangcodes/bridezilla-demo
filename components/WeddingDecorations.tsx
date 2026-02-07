'use client'

export default function WeddingDecorations() {
  const decorations = [
    // Bride figures
    { id: 1, type: 'bride', left: '55%', top: '20%', delay: '0s', duration: '4s' },
    { id: 2, type: 'bride', left: '80%', top: '60%', delay: '1s', duration: '5s' },
    // Groom figures
    { id: 3, type: 'groom', left: '70%', top: '10%', delay: '0.5s', duration: '4.5s' },
    { id: 4, type: 'groom', left: '85%', top: '70%', delay: '1.5s', duration: '5.5s' },
    // Wedding cakes
    { id: 5, type: 'cake', left: '65%', top: '45%', delay: '0.3s', duration: '5s' },
    { id: 6, type: 'cake', left: '90%', top: '30%', delay: '2s', duration: '4.8s' },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
      {decorations.map((decoration) => (
        <div
          key={decoration.id}
          className="absolute"
          style={{
            left: decoration.left,
            top: decoration.top,
            animation: `floatSolid ${decoration.duration} ease-in-out infinite`,
            animationDelay: decoration.delay,
          }}
        >
          {decoration.type === 'bride' && (
            <svg width="45" height="60" viewBox="0 0 45 60" style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))' }}>
              <defs>
                <radialGradient id={`brideGradient-${decoration.id}`} cx="40%" cy="40%">
                  <stop offset="0%" stopColor="#ffe4e6" />
                  <stop offset="100%" stopColor="#fecdd3" />
                </radialGradient>
              </defs>
              {/* Dress - white/pink gradient */}
              <path d="M 22.5 25 L 10 55 L 35 55 Z" fill="url(#brideGradient-${decoration.id})" />
              {/* Dress details */}
              <path d="M 22.5 25 L 10 55 L 35 55 Z" fill="none" stroke="#f9a8d4" strokeWidth="1" opacity="0.6" />
              {/* Body/torso */}
              <rect x="18" y="18" width="9" height="10" rx="2" fill="#ffe4e6" />
              {/* Head */}
              <circle cx="22.5" cy="12" r="6" fill="#fef3c7" />
              {/* Hair */}
              <ellipse cx="22.5" cy="10" rx="6.5" ry="5" fill="#1a1a1a" opacity="0.9" />
              {/* Veil */}
              <ellipse cx="22.5" cy="8" rx="8" ry="4" fill="#fff" opacity="0.7" />
              {/* Bouquet */}
              <ellipse cx="22.5" cy="30" rx="4" ry="3" fill="#fb7185" opacity="0.8" />
              <circle cx="21" cy="30" r="1.5" fill="#fff" opacity="0.8" />
              <circle cx="24" cy="30" r="1.5" fill="#fff" opacity="0.8" />
            </svg>
          )}
          {decoration.type === 'groom' && (
            <svg width="45" height="60" viewBox="0 0 45 60" style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))' }}>
              <defs>
                <linearGradient id={`groomGradient-${decoration.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
              </defs>
              {/* Suit jacket */}
              <rect x="15" y="20" width="15" height="18" rx="2" fill="url(#groomGradient-${decoration.id})" />
              {/* Pants */}
              <rect x="17" y="38" width="5" height="17" rx="1" fill="#334155" />
              <rect x="23" y="38" width="5" height="17" rx="1" fill="#334155" />
              {/* Shirt */}
              <rect x="19" y="20" width="7" height="8" fill="#fff" />
              {/* Tie */}
              <rect x="21.5" y="20" width="2" height="12" fill="#dc2626" />
              {/* Head */}
              <circle cx="22.5" cy="12" r="6" fill="#fed7aa" />
              {/* Hair */}
              <ellipse cx="22.5" cy="10" rx="6" ry="4" fill="#1a1a1a" />
              {/* Bow tie accent */}
              <rect x="19" y="19" width="7" height="2" fill="#dc2626" rx="1" />
            </svg>
          )}
          {decoration.type === 'cake' && (
            <svg width="50" height="55" viewBox="0 0 50 55" style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))' }}>
              <defs>
                <linearGradient id={`cakeGradient-${decoration.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fff" />
                  <stop offset="100%" stopColor="#f3f4f6" />
                </linearGradient>
              </defs>
              {/* Bottom tier */}
              <rect x="8" y="38" width="34" height="12" rx="2" fill="url(#cakeGradient-${decoration.id})" stroke="#e5e7eb" strokeWidth="1" />
              {/* Middle tier */}
              <rect x="13" y="26" width="24" height="12" rx="2" fill="url(#cakeGradient-${decoration.id})" stroke="#e5e7eb" strokeWidth="1" />
              {/* Top tier */}
              <rect x="18" y="14" width="14" height="12" rx="2" fill="url(#cakeGradient-${decoration.id})" stroke="#e5e7eb" strokeWidth="1" />
              {/* Decorative frosting - bottom */}
              <ellipse cx="25" cy="44" rx="16" ry="2" fill="#fbbf24" opacity="0.6" />
              {/* Decorative frosting - middle */}
              <ellipse cx="25" cy="32" rx="11" ry="2" fill="#fbbf24" opacity="0.6" />
              {/* Decorative frosting - top */}
              <ellipse cx="25" cy="20" rx="6" ry="2" fill="#fbbf24" opacity="0.6" />
              {/* Hearts decoration */}
              <path d="M 23 10 C 23 8, 21 8, 21 10 C 21 8, 19 8, 19 10 C 19 12, 21 13, 21 15 C 21 13, 23 12, 23 10 Z" fill="#f43f5e" />
              <path d="M 31 10 C 31 8, 29 8, 29 10 C 29 8, 27 8, 27 10 C 27 12, 29 13, 29 15 C 29 13, 31 12, 31 10 Z" fill="#f43f5e" />
              {/* Candles */}
              <rect x="20" y="8" width="2" height="6" fill="#fbbf24" />
              <rect x="28" y="8" width="2" height="6" fill="#fbbf24" />
              {/* Flames */}
              <ellipse cx="21" cy="7" rx="1.5" ry="2" fill="#fb923c" />
              <ellipse cx="29" cy="7" rx="1.5" ry="2" fill="#fb923c" />
            </svg>
          )}
        </div>
      ))}
    </div>
  )
}
