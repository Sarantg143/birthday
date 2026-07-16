import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

let _transporter = null;

/**
 * Create and cache a Nodemailer transporter.
 * Priority:
 *   1. GMAIL_USER + GMAIL_APP_PASSWORD (auto-configures Gmail SMTP)
 *   2. SMTP_HOST + SMTP_USER + SMTP_PASS (custom SMTP provider)
 *   3. Ethereal test account (preview-only, no real delivery)
 * The transporter is created once and reused across all requests.
 */
async function getTransporter() {
  if (_transporter) return _transporter;

  // Priority 1: Gmail credentials
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    console.log('📧 Configuring Gmail SMTP...');
    _transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
    console.log(`📧 Gmail SMTP configured for: ${process.env.GMAIL_USER}`);
    return _transporter;
  }

  // Priority 2: Custom SMTP provider
  if (process.env.SMTP_HOST) {
    _transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    return _transporter;
  }

  // Priority 3: Ethereal test account
  console.log('📧 No SMTP configured — creating Ethereal test account...');
  const testAccount = await nodemailer.createTestAccount();
  _transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  console.log('📧 Ethereal test account created:');
  console.log(`   User: ${testAccount.user}`);
  console.log(`   Pass: ${testAccount.pass}`);
  console.log('   Preview URL will appear in logs when sending.');

  return _transporter;
}

/**
 * Send an email via Nodemailer.
 */
async function sendEmailViaNodemailer({ to, subject, html }) {
  const fromName = process.env.SMTP_FROM_NAME || 'Happy Birthday';
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.GMAIL_USER || 'noreply@happybirthday.love';

  const transporter = await getTransporter();

  const info = await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to,
    subject,
    html,
  });

  // Log preview URL for Ethereal emails
  if (info.messageId) {
    console.log('📧 Message ID:', info.messageId);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log('📧 Preview URL:', previewUrl);
    }
  }

  return info;
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
    console.log('📧 Sending email via Nodemailer to:', to);

    const result = await sendEmailViaNodemailer({
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

    console.log('✅ Email sent successfully. Message ID:', result.messageId);
    res.json({ success: true, messageId: result.messageId });
  } catch (error) {
    console.error('❌ Nodemailer error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to send email' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`📧 Email server running on http://localhost:${PORT}`);

  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    console.log(`📧 Sending real emails via Gmail (${process.env.GMAIL_USER})`);
  } else if (process.env.SMTP_HOST) {
    console.log(`📧 Sending real emails via ${process.env.SMTP_HOST}`);
  } else {
    console.log('ℹ️  No SMTP configured — using Ethereal test email (preview only).');
    console.log('   To send real emails, add these to server/.env:');
    console.log('   GMAIL_USER=your.email@gmail.com');
    console.log('   GMAIL_APP_PASSWORD=your-16-char-app-password');
  }
});
