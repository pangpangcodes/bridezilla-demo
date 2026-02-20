import Image from 'next/image'

interface VendorCategory {
  type: string
  count: number
}

interface VendorInviteEmailTemplateProps {
  coupleName: string
  plannerName?: string
  vendorCategories?: VendorCategory[]
  customMessage?: string
  shareLinkId?: string
}

export default function VendorInviteEmailTemplate({
  coupleName,
  plannerName = 'La Bella Novia Wedding Planning',
  vendorCategories = [],
  customMessage,
  shareLinkId
}: VendorInviteEmailTemplateProps) {
  const hasVendors = vendorCategories.length > 0

  return (
    <div className="bg-white rounded-lg overflow-hidden" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Header with Heirloom theme color - elegant dark green */}
      <div className="p-6" style={{ backgroundColor: '#1b3b2b' }}>
        <div className="flex items-center gap-3">
          <Image
            src="/images/ksmt-logo-simple.svg"
            alt="ksmt"
            width={40}
            height={40}
            className="object-contain"
          />
          <span style={{ fontSize: '1.5rem', fontFamily: '"Playfair Display", Georgia, serif', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'white' }}>
            KSMT
          </span>
        </div>
      </div>

      {/* Email Body */}
      <div className="p-8 space-y-6">
        {/* Greeting */}
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '600', color: '#111827', marginBottom: '0.75rem', fontFamily: '"Playfair Display", Georgia, serif' }}>
            Hi {coupleName}!
          </h1>
        </div>

        {/* Main Message */}
        <p style={{ fontSize: '1rem', color: '#374151', lineHeight: '1.625', fontFamily: 'Nunito, -apple-system, BlinkMacSystemFont, sans-serif' }}>
          {plannerName ? (
            <>Your planner at {plannerName} has curated some wonderful vendor recommendations for your special day. Check them out in your private workspace!</>
          ) : (
            <>I've curated some wonderful vendor recommendations for your special day. Check them out in your private workspace!</>
          )}
        </p>

        {/* Custom Note from Planner (if provided) */}
        {customMessage && (
          <div style={{ backgroundColor: '#fafaf9', border: '1px solid #e7e5e4', borderRadius: '0.75rem', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '0.75rem', fontWeight: '600', color: '#57534e', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem', fontFamily: 'Nunito, -apple-system, BlinkMacSystemFont, sans-serif' }}>
              Note from your planner:
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#44403c', lineHeight: '1.625', fontStyle: 'italic', fontFamily: 'Nunito, -apple-system, BlinkMacSystemFont, sans-serif' }}>
              "{customMessage}"
            </p>
          </div>
        )}

        {/* What's Included Box */}
        <div style={{ backgroundColor: '#fafaf9', border: '1px solid #e7e5e4', borderRadius: '0.75rem', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '0.75rem', fontWeight: '600', color: '#57534e', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', fontFamily: 'Nunito, -apple-system, BlinkMacSystemFont, sans-serif' }}>
            What's Included:
          </h2>
          {hasVendors ? (
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {vendorCategories.map((category, index) => (
                <li key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: index < vendorCategories.length - 1 ? '0.75rem' : '0' }}>
                  <span style={{ fontWeight: '600', fontSize: '1rem', color: '#1b3b2b' }}>✓</span>
                  <span style={{ lineHeight: '1.625', fontSize: '0.875rem', color: '#44403c', fontFamily: 'Nunito, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                    {category.count} vendor{category.count !== 1 ? 's' : ''} for {category.type}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: '600', fontSize: '1rem', color: '#1b3b2b' }}>✓</span>
                <span style={{ lineHeight: '1.625', fontSize: '0.875rem', color: '#44403c', fontFamily: 'Nunito, -apple-system, BlinkMacSystemFont, sans-serif' }}>Vendor contact information</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: '600', fontSize: '1rem', color: '#1b3b2b' }}>✓</span>
                <span style={{ lineHeight: '1.625', fontSize: '0.875rem', color: '#44403c', fontFamily: 'Nunito, -apple-system, BlinkMacSystemFont, sans-serif' }}>Pricing estimates</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: '600', fontSize: '1rem', color: '#1b3b2b' }}>✓</span>
                <span style={{ lineHeight: '1.625', fontSize: '0.875rem', color: '#44403c', fontFamily: 'Nunito, -apple-system, BlinkMacSystemFont, sans-serif' }}>My personal recommendations</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <span style={{ fontWeight: '600', fontSize: '1rem', color: '#1b3b2b' }}>✓</span>
                <span style={{ lineHeight: '1.625', fontSize: '0.875rem', color: '#44403c', fontFamily: 'Nunito, -apple-system, BlinkMacSystemFont, sans-serif' }}>Easy status tracking</span>
              </li>
            </ul>
          )}
        </div>

        {/* CTA Button - Heirloom theme */}
        <div style={{ paddingTop: '1rem' }}>
          <a
            href={shareLinkId ? `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/s/${shareLinkId}` : '#'}
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: '600',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              backgroundColor: '#1b3b2b',
              fontFamily: 'Nunito, -apple-system, BlinkMacSystemFont, sans-serif'
            }}
          >
            View My Vendors
          </a>
        </div>

        {/* Privacy Note */}
        <p style={{ fontSize: '0.875rem', color: '#57534e', paddingTop: '0.5rem', lineHeight: '1.625', fontFamily: 'Nunito, -apple-system, BlinkMacSystemFont, sans-serif' }}>
          This is your private workspace — only you can see and manage these vendors.
        </p>

        {/* Footer */}
        <div style={{ paddingTop: '1.5rem', borderTop: '1px solid #e7e5e4' }}>
          <p style={{ fontSize: '0.875rem', color: '#57534e', lineHeight: '1.625', fontFamily: 'Nunito, -apple-system, BlinkMacSystemFont, sans-serif' }}>
            💕 Happy Planning!<br />
            {plannerName}
          </p>
        </div>
      </div>
    </div>
  )
}
