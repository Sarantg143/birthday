import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Create Nodemailer transporter using Gmail SMTP
function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
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

  const transporter = createTransporter();

  try {
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject: subject || 'She Accepted Your Love ❤️',
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

    console.log('✅ Email sent successfully. Message ID:', info.messageId);
    res.json({ success: true, messageId: info.messageId });
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
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn('⚠️  GMAIL_USER and GMAIL_APP_PASSWORD must be set in server/.env');
  }
});
