export function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!local || !domain || local.length <= 2) return email
  return `${local[0]}${'*'.repeat(local.length - 2)}${local[local.length - 1]}@${domain}`
}

export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 4) return phone
  const last4 = digits.slice(-4)
  return `***-***-${last4}`
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function exportToCSV(rsvps: any[]): string {
  const headers = ['Name', 'Email', 'Phone', 'Attending', 'Plus One 1', 'Plus One 2', 'Created At']
  const rows = rsvps.map(rsvp => [
    rsvp.name,
    rsvp.email,
    rsvp.phone,
    rsvp.attending ? 'Yes' : 'No',
    rsvp.guests[0]?.name || '',
    rsvp.guests[1]?.name || '',
    formatDate(rsvp.created_at),
  ])

  return [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n')
}
