'use client'

export default function CheckOutXOXOs() {
  const xoxos = [
    // X's (kisses)
    { id: 1, type: 'x', left: '70%', top: '15%', delay: '0s', duration: '4.5s' },
    { id: 2, type: 'x', left: '82%', top: '60%', delay: '1.2s', duration: '5.2s' },
    // O's (hugs)
    { id: 3, type: 'o', left: '58%', top: '45%', delay: '0.7s', duration: '5s' },
    { id: 4, type: 'o', left: '90%', top: '28%', delay: '1.5s', duration: '4.8s' },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
      {xoxos.map((xoxo) => (
        <div
          key={xoxo.id}
          className="absolute"
          style={{
            left: xoxo.left,
            top: xoxo.top,
            animation: `floatSolid ${xoxo.duration} ease-in-out infinite`,
            animationDelay: xoxo.delay,
          }}
        >
          {xoxo.type === 'x' && (
            <svg width="45" height="45" viewBox="0 0 50 50" style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.15))' }}>
              <defs>
                <linearGradient id={`xGradient-${xoxo.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff6b9d" />
                  <stop offset="100%" stopColor="#ff91b4" />
                </linearGradient>
              </defs>
              {/* X shape - two crossing lines */}
              <path
                d="M 12 12 L 38 38"
                stroke={`url(#xGradient-${xoxo.id})`}
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 38 12 L 12 38"
                stroke={`url(#xGradient-${xoxo.id})`}
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />
              {/* Highlight on X */}
              <path
                d="M 12 12 L 25 25"
                stroke="#ffb3d1"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                opacity="0.6"
              />
            </svg>
          )}
          {xoxo.type === 'o' && (
            <svg width="45" height="45" viewBox="0 0 50 50" style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.15))' }}>
              <defs>
                <linearGradient id={`oGradient-${xoxo.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff91b4" />
                  <stop offset="100%" stopColor="#ffb3d1" />
                </linearGradient>
              </defs>
              {/* O shape - circle ring */}
              <circle
                cx="25"
                cy="25"
                r="13"
                fill="none"
                stroke={`url(#oGradient-${xoxo.id})`}
                strokeWidth="6"
              />
              {/* Inner highlight for depth */}
              <circle
                cx="25"
                cy="25"
                r="13"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                opacity="0.4"
              />
              {/* Outer subtle glow */}
              <circle
                cx="25"
                cy="25"
                r="16"
                fill="none"
                stroke="#ff6b9d"
                strokeWidth="1"
                opacity="0.3"
              />
            </svg>
          )}
        </div>
      ))}
    </div>
  )
}
