import { appConfig } from '../config/appConfig';

const EMAIL_API_URL = `${appConfig.emailServerUrl}/api/send-email`;

/**
 * Sends an email notification when the loved one accepts the proposal.
 * Calls the local Express API server which delivers the email via Nodemailer.
 *
 * @param {string} name - The loved one's name
 * @param {string} recipientEmail - The email address to send to
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function sendAcceptanceEmail(name, recipientEmail) {
  const timestamp = new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'long',
  });

  const htmlMessage = `
    <p><strong>${name}</strong> said YES! 💜</p>
    <p>Date & Time: ${timestamp}</p>
  `;

  try {
    console.log('📧 Sending email via Express API to:', recipientEmail);

    const response = await fetch(EMAIL_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        to: recipientEmail,
        subject: 'She Said YES! ❤️',
        message: htmlMessage,
      }),
    });

    const data = await response.json();
    console.log('📧 API response:', JSON.stringify(data, null, 2));

    if (data.success) {
      console.log('✅ Email sent successfully!');
      return { success: true, message: 'Email sent successfully!', data };
    }

    return { success: false, message: data.message || 'Unexpected response from server' };
  } catch (error) {
    console.error('❌ Email API error:', error);
    return {
      success: false,
      message: error.message || 'Failed to send email — is the email server running?',
    };
  }
}