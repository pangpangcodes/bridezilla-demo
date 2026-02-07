'use client'

export default function CoupleIllustration() {
  return (
    <div className="relative w-full flex items-center justify-center" style={{ minHeight: '500px' }}>
      <svg
        viewBox="0 0 400 500"
        width="100%"
        height="auto"
        style={{ maxWidth: '400px', maxHeight: '600px' }}
        className="w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background foliage - top */}
        <g opacity="0.8">
          <path
            d="M0 0 L400 0 L400 150 Q350 100 300 120 T200 110 T100 130 T0 150 Z"
            fill="#86a865"
          />
          <path
            d="M0 20 L400 20 L400 140 Q350 90 300 110 T200 100 T100 120 T0 140 Z"
            fill="#a8c885"
          />
        </g>

        {/* Building/Architecture background */}
        <g>
          {/* Building base */}
          <rect x="100" y="200" width="200" height="180" fill="#f5e6d3" />
          
          {/* Archway */}
          <path
            d="M150 200 Q200 160 250 200 L250 280 Q200 240 150 280 Z"
            fill="#ffffff"
          />
          <ellipse cx="200" cy="240" rx="45" ry="40" fill="#e8d4b8" />
          
          {/* Building details */}
          <rect x="110" y="210" width="30" height="40" fill="#d4c4b0" rx="2" />
          <rect x="260" y="210" width="30" height="40" fill="#d4c4b0" rx="2" />
          
          {/* Vines on building */}
          <path
            d="M110 280 Q120 250 130 270 T150 260 T170 275 T190 255 T210 270 T230 250 T250 265 T270 245 T280 260"
            stroke="#86a865"
            strokeWidth="3"
            fill="none"
          />
          <circle cx="130" cy="260" r="4" fill="#86a865" />
          <circle cx="170" cy="270" r="4" fill="#86a865" />
          <circle cx="210" cy="265" r="4" fill="#86a865" />
          <circle cx="250" cy="260" r="4" fill="#86a865" />
        </g>

        {/* Ground/Pathway */}
        <g>
          <rect x="0" y="380" width="400" height="120" fill="#d4a574" />
          {/* Bricks pattern */}
          <g opacity="0.3">
            {Array.from({ length: 20 }).map((_, i) => (
              <rect
                key={i}
                x={(i % 10) * 40}
                y={380 + Math.floor(i / 10) * 30}
                width="38"
                height="28"
                fill="#c89563"
                stroke="#b88552"
                strokeWidth="1"
              />
            ))}
          </g>
        </g>

        {/* Plants on ground */}
        <g>
          <ellipse cx="50" cy="390" rx="25" ry="15" fill="#86a865" />
          <ellipse cx="350" cy="390" rx="25" ry="15" fill="#86a865" />
          <path
            d="M45 390 Q50 370 55 390 M50 390 Q55 375 60 390"
            stroke="#5a7a45"
            strokeWidth="2"
            fill="none"
          />
        </g>

        {/* Woman (left) */}
        <g>
          {/* Dress */}
          <path
            d="M120 320 L140 320 L145 380 L115 380 Z"
            fill="#ffffff"
          />
          {/* Dress pattern - flowers */}
          <circle cx="130" cy="340" r="3" fill="#fbbf24" />
          <circle cx="135" cy="350" r="2" fill="#a78bfa" />
          <circle cx="125" cy="360" r="3" fill="#fbbf24" />
          <path
            d="M130 340 Q132 338 134 340 Q132 342 130 340"
            stroke="#86a865"
            strokeWidth="1"
            fill="#86a865"
          />
          
          {/* Head */}
          <circle cx="130" cy="300" r="25" fill="#d4a574" />
          
          {/* Hair */}
          <path
            d="M105 300 Q110 280 120 285 Q125 275 130 280 Q135 275 140 285 Q150 280 155 300"
            fill="#8b6914"
          />
          
          {/* Facial features */}
          <circle cx="125" cy="295" r="2" fill="#000" />
          <circle cx="135" cy="295" r="2" fill="#000" />
          <path
            d="M125 305 Q130 308 135 305"
            stroke="#000"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Necklace */}
          <circle cx="130" cy="315" r="2" fill="#fbbf24" />
          
          {/* Bag */}
          <ellipse cx="145" cy="340" rx="8" ry="12" fill="#d4a574" />
          <path
            d="M145 328 Q148 325 151 328"
            stroke="#8b6914"
            strokeWidth="2"
            fill="none"
          />
          
          {/* Arms */}
          <path
            d="M115 320 Q105 315 105 330"
            stroke="#d4a574"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M140 320 Q150 315 150 330"
            stroke="#d4a574"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Sandals */}
          <ellipse cx="120" cy="385" rx="8" ry="3" fill="#ffffff" />
          <ellipse cx="140" cy="385" rx="8" ry="3" fill="#ffffff" />
        </g>

        {/* Man (right) */}
        <g>
          {/* T-shirt */}
          <path
            d="M250 320 L270 320 L275 360 L245 360 Z"
            fill="#ffffff"
          />
          
          {/* Shorts */}
          <path
            d="M245 360 L275 360 L270 380 L250 380 Z"
            fill="#86a865"
          />
          {/* Shorts stripes */}
          <line x1="250" y1="365" x2="250" y2="375" stroke="#a8c885" strokeWidth="2" />
          <line x1="255" y1="365" x2="255" y2="375" stroke="#ffffff" strokeWidth="2" />
          <line x1="260" y1="365" x2="260" y2="375" stroke="#a8c885" strokeWidth="2" />
          <line x1="265" y1="365" x2="265" y2="375" stroke="#ffffff" strokeWidth="2" />
          <line x1="270" y1="365" x2="270" y2="375" stroke="#a8c885" strokeWidth="2" />
          
          {/* Head */}
          <circle cx="260" cy="300" r="25" fill="#d4a574" />
          
          {/* Hair */}
          <path
            d="M235 300 Q240 285 250 290 Q260 285 270 290 Q280 285 285 300"
            fill="#1a1a1a"
          />
          
          {/* Sunglasses */}
          <rect x="250" y="295" width="20" height="8" rx="4" fill="#1a1a1a" />
          <line x1="260" y1="295" x2="260" y2="303" stroke="#ffffff" strokeWidth="1" />
          
          {/* Facial features */}
          <path
            d="M255 310 Q260 313 265 310"
            stroke="#000"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Arms */}
          <path
            d="M245 320 Q235 315 235 330"
            stroke="#d4a574"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M270 320 Q275 315 275 325 L275 335"
            stroke="#d4a574"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          {/* Hand in pocket */}
          <path
            d="M270 330 Q275 335 275 340"
            stroke="#d4a574"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Shoes */}
          <ellipse cx="250" cy="385" rx="8" ry="3" fill="#ffffff" />
          <ellipse cx="270" cy="385" rx="8" ry="3" fill="#ffffff" />
        </g>

        {/* Hands holding */}
        <g>
          <path
            d="M150 330 Q165 325 180 330"
            stroke="#d4a574"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M180 330 Q165 335 150 330"
            stroke="#d4a574"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* Foliage sides */}
        <g opacity="0.7">
          <path
            d="M0 150 L0 400 Q20 300 40 320 T80 310 T120 330 T160 315 T200 325 T240 315 T280 330 T320 310 T360 320 T400 300 L400 150"
            fill="#5a7a45"
          />
          {/* Leaves */}
          {[20, 60, 100, 140, 260, 300, 340, 380].map((x) => (
            <ellipse key={x} cx={x} cy={280 + (x % 40)} rx="15" ry="20" fill="#86a865" />
          ))}
        </g>
      </svg>
    </div>
  )
}

