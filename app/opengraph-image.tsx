import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Bridezilla - AI-Powered Wedding Planning'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #faf5f0 0%, #f5ede4 50%, #ece3d8 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
          position: 'relative',
        }}
      >
        {/* Decorative border */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            right: '20px',
            bottom: '20px',
            border: '2px solid rgba(120, 100, 80, 0.15)',
            borderRadius: '24px',
            display: 'flex',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
          }}
        >
          {/* Logo text */}
          <div
            style={{
              fontSize: '72px',
              fontWeight: 400,
              letterSpacing: '0.3em',
              color: '#1c1917',
              textTransform: 'uppercase',
            }}
          >
            BRIDEZILLA
          </div>

          {/* Divider */}
          <div
            style={{
              width: '80px',
              height: '2px',
              background: '#1c1917',
              display: 'flex',
            }}
          />

          {/* Tagline */}
          <div
            style={{
              fontSize: '24px',
              fontWeight: 300,
              color: '#57534e',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            AI-Powered Wedding Planning
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: '18px',
              color: '#78716c',
              textAlign: 'center',
              maxWidth: '600px',
              lineHeight: 1.6,
              marginTop: '12px',
            }}
          >
            The modern wedding planner's command centre. Manage couples, curate vendors, and share beautiful portals.
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: '#a8a29e',
            letterSpacing: '0.1em',
          }}
        >
          bridezilla-demo.vercel.app
        </div>
      </div>
    ),
    { ...size }
  )
}
