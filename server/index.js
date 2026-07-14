import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

const RESEND_API_URL = 'https://api.resend.com/emails';

/**
 * Send an email via Resend's HTTP API.
 * Uses standard HTTPS (port 443) — never blocked by Render.
 */
async function sendEmailViaResend({ to, subject, html }) {
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  // 30-second timeout to prevent hanging requests
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [to],
        subject,
        html,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || `Resend API error (${response.status})`);
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Resend API request timed out after 30 seconds');
    }
    throw error;
  }
}

/**
 * POST /api/send-email
 * Body: { name, to, subject, message }
 */
app.post('/api/send-email', async (req, res) => {
  const { name, to, subject, message } = req.body;

  if (!to) {
    return res.status(400).json({ success: false, message: 'Recipient email (to) is required' });
  }

  try {
    console.log('📧 Sending email via Resend to:', to);

    const result = await sendEmailViaResend({
      to,
      subject: subject || 'She Said YES! ❤️',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 30px; background: #fef9f0; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <span style="font-size: 48px;">💜</span>
          </div>
          <h1 style="color: #5c3d2e; text-align: center; font-family: 'Georgia', serif;">
            She Said YES! ❤️
          </h1>
          <div style="border-top: 2px solid #d4af37; margin: 20px 0;"></div>
          ${message ? `<p style="color: #3d2a1a; font-size: 16px; line-height: 1.8;">${message}</p>` : ''}
          <p style="color: #3d2a1a; font-size: 16px; line-height: 1.8;">
            <strong>${name}</strong> has accepted your love! 💜
          </p>
          <div style="border-top: 2px solid #d4af37; margin: 20px 0;"></div>
          <p style="color: #888; font-size: 14px; text-align: center;">
            Made with ❤️ — Happy Birthday!
          </p>
        </div>
      `,
    });

    console.log('✅ Email sent successfully. Resend ID:', result.id);
    res.json({ success: true, messageId: result.id });
  } catch (error) {
    console.error('❌ Resend API error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to send email' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`📧 Email server running on http://localhost:${PORT}`);
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️  RESEND_API_KEY must be set in server/.env');
    console.warn('    Get one at https://resend.com/api-keys');
  }
});
