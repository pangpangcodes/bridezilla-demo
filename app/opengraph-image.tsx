import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Bridezilla - AI-Powered Wedding Planning'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  // Design system colours (heirloom theme)
  const primary = '#1b3b2b'       // primaryColor - dark forest green
  const pageBg = '#FAF9F6'        // pageBackground
  const textPrimary = '#1c1917'   // stone-900
  const textSecondary = '#57534e' // stone-600
  const textMuted = '#a8a29e'     // stone-400
  const border = '#e7e5e4'        // stone-200

  // Read logo from local public directory
  const logoData = await fetch(
    new URL('../public/images/bridezilla-logo-green.png', import.meta.url)
  ).then((res) => res.arrayBuffer())

  return new ImageResponse(
    (
      <div
        style={{
          background: pageBg,
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
        {/* Decorative border matching design system */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            right: '20px',
            bottom: '20px',
            border: `1px solid ${border}`,
            borderRadius: '16px',
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
            gap: '20px',
          }}
        >
          {/* Logo image */}
          <img
            src={logoData as unknown as string}
            width={80}
            height={80}
            style={{ objectFit: 'contain' }}
          />

          {/* Logo text + divider row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '1px',
                background: textMuted,
                display: 'flex',
              }}
            />
            <div
              style={{
                fontSize: '64px',
                fontWeight: 400,
                letterSpacing: '0.3em',
                color: textPrimary,
                textTransform: 'uppercase',
              }}
            >
              BRIDEZILLA
            </div>
            <div
              style={{
                width: '40px',
                height: '1px',
                background: textMuted,
                display: 'flex',
              }}
            />
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: '22px',
              fontWeight: 300,
              color: textSecondary,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            AI-Powered Wedding Planning
          </div>

          {/* Feature pills - matching primaryButton style */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginTop: '16px',
            }}
          >
            {['Manage Couples', 'Curate Vendors', 'Share Portals'].map((label) => (
              <div
                key={label}
                style={{
                  background: primary,
                  color: 'white',
                  padding: '10px 24px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: 500,
                }}
              >
                {label}
              </div>
            ))}
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
            color: textMuted,
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
