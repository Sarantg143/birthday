/**
 * Application configuration — customize these values for your loved one.
 */
export const appConfig = {
  // Full name displayed on the success page
  lovedOneName: 'GV',

  // Nickname used in the landing page greeting and other playful places
  nickname: 'Jeevitha',

  // Your name (appears at the end of the love letter)
  senderName: 'SaranKutty',

  // Birthday date for countdown (YYYY-MM-DD) — set to today or upcoming birthday
  birthdayDate: '2026-07-18',

  // Whether to show countdown before the landing page
  showCountdown: true,

  // Music that plays during the 3-2-1 countdown (placed in public/assets/audio/)
  countdownMusic: '/assets/audio/123Birthday.mp3',

  // Music that plays on the Love Letter page (place your .mp3 in public/assets/audio/)
  letterMusic: '/assets/audio/melliname.mp3',

  // Music that plays on the Success page (place your .mp3 in public/assets/audio/)
  successMusic: '/assets/audio/Rosapoo.mp3',

  // Recipient email address for the love acceptance notification
  // This email will receive a notification when your loved one says YES
  notificationEmail: 'sarantg1905@gmail.com',

  // Email server URL (the Express server running Nodemailer)
  emailServerUrl: 'http://localhost:3001',
};
