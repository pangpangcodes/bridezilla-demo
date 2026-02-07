import nodemailer from 'nodemailer'

if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
  console.warn('Warning: Gmail credentials not set. Email sending will fail.')
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function sendMagicLink(
  toEmail: string,
  guestName: string,
  token: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const magicLink = `${siteUrl}/rsvp/view?token=${token}`

    const emailFrom = process.env.GMAIL_USER || 'noreply@example.com'

    // Create HTML email content directly
    const emailHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f0fdf4; margin: 0; padding: 20px;">
<div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
<div style="padding: 30px 30px 30px 30px;">
<p style="font-size: 16px; color: #374151; margin: 0 0 8px 0;">Hi ${guestName}!</p>
<p style="font-size: 16px; color: #374151; line-height: 1.5; margin: 0 0 20px 0;">You requested to view your RSVP to Monica and Kevin's wedding. Click the button below to access your submission.</p>
<div style="text-align: center; margin: 20px 0;">
<a href="${magicLink}" style="display: inline-block; background-color: #bbf7d0; color: #111827; padding: 8px 24px; text-decoration: none; border-radius: 9999px; font-weight: 600; font-size: 14px;">View My RSVP</a>
</div>
<p style="font-size: 12px; color: #6b7280; line-height: 1.5; margin: 20px 0 0 0; padding-top: 20px; border-top: 1px solid #e5e7eb;">This link will expire in 24 hours. If you didn't request this, you can safely ignore this email.</p>
</div>
<div style="background-color: #1f2937; padding: 12px; text-align: center;">
<p style="font-size: 14px; color: white; margin: 0; font-family: Georgia, 'Times New Roman', serif;">❤️ Sent with love from Monica and Kevin</p>
</div>
</div>
</body>
</html>`

    await transporter.sendMail({
      from: `"Monica & Kevin's Wedding" <${emailFrom}>`,
      to: toEmail,
      subject: 'View Your Wedding RSVP',
      html: emailHtml,
    })

    return { success: true }
  } catch (error) {
    console.error('Unexpected email error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email'
    }
  }
}
