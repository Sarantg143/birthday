# Happy Birthday My Love ❤️

A premium romantic interactive birthday website built with React, featuring cinematic animations, a royal scroll-opening love letter, an interactive proposal experience, image slideshow memories, confetti celebration, and automatic email notification.

## Features

- Full-screen romantic landing page with floating hearts, balloons, and typewriter effect
- Medieval royal scroll/parchment love letter with Framer Motion unfolding animation
- Interactive proposal page with evasive "NO" button
- Confetti, fireworks, and image gallery on acceptance
- EmailJS integration for automatic email notification
- Background music toggle, birthday countdown, loading screen
- Dark romantic theme with gold accents
- Fully responsive (desktop, tablet, mobile)

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- npm

### Installation

```bash
cd happy-birthday-my-love
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Customization

### 1. Personalize Names & Birthday

Edit `src/config/appConfig.js`:

```js
export const appConfig = {
  lovedOneName: 'My Love',      // Her name
  senderName: 'Saran',           // Your name
  birthdayDate: '2026-06-25',    // Birthday date (YYYY-MM-DD)
  showCountdown: true,           // Show countdown before landing
  backgroundMusic: '/src/assets/audio/romantic-music.mp3',
};
```

### 2. Add Your Photos

Place images in `src/assets/images/`:

| File | Purpose |
|------|---------|
| `profile.jpg` (or `.png`) | Profile photo on landing page |
| `memory1.jpg`, `memory2.jpg`, etc. | Gallery slideshow images |

Supported formats: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.svg`

Images are loaded automatically — no code changes needed.

### 3. Add Background Music (Optional)

Place an `.mp3` file in `public/audio/` (e.g. `romantic-music.mp3`) and update the path in `appConfig.js`.

Optional paper-opening sound: add `paper-open.mp3` to `public/audio/`.

### 4. Configure EmailJS

1. Create a free account at [EmailJS](https://www.emailjs.com/)
2. Add an email service (Gmail, Outlook, etc.)
3. Create an email template with these variables:
   - `{{name}}` — Loved one's name
   - `{{response}}` — "YES"
   - `{{timestamp}}` — Date and time
   - `{{message}}` — Full message body
4. Set the email subject in your template to: **She Accepted Your Love ❤️**
5. Copy your credentials to `src/config/emailjs.config.js`:

```js
export const emailjsConfig = {
  serviceId: 'your_service_id',
  templateId: 'your_template_id',
  publicKey: 'your_public_key',
};
```

## Project Structure

```
src/
├── assets/
│   ├── images/          # Your photos (auto-loaded)
│   └── audio/           # Background music
├── components/
│   ├── LandingPage.jsx
│   ├── LoveLetter.jsx
│   ├── ProposalPage.jsx
│   ├── SuccessPage.jsx
│   ├── ImageCarousel.jsx
│   ├── FloatingHearts.jsx
│   ├── FloatingPetals.jsx
│   ├── Balloons.jsx
│   ├── Fireworks.jsx
│   ├── MusicToggle.jsx
│   ├── LoadingScreen.jsx
│   └── Countdown.jsx
├── config/
│   ├── appConfig.js
│   └── emailjs.config.js
├── services/
│   └── emailService.js
├── styles/
│   ├── global.css
│   ├── landing.css
│   ├── letter.css
│   ├── proposal.css
│   ├── success.css
│   └── loading.css
├── utils/
│   └── imageLoader.js
├── App.jsx
└── main.jsx
```

## Deploy to Firebase Hosting

### First-Time Setup

1. Install Firebase CLI:

```bash
npm install -g firebase-tools
```

2. Log in to Firebase:

```bash
firebase login
```

3. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)

4. Initialize Firebase in the project directory:

```bash
cd happy-birthday-my-love
firebase init hosting
```

- Select your Firebase project
- Set public directory to: `dist`
- Configure as single-page app: **Yes**
- Don't overwrite `firebase.json` (already included)

### Deploy

```bash
npm run build
firebase deploy
```

Your site will be live at `https://your-project-id.web.app`

### Custom Domain (Optional)

In Firebase Console → Hosting → Add custom domain, follow the DNS setup instructions.

## Tech Stack

- **React 19** — UI framework
- **Vite** — Build tool
- **Framer Motion** — Scroll opening & page transitions
- **React Type Animation** — Typewriter effects
- **React Confetti** — Celebration confetti
- **EmailJS** — Email notifications

## License

Private — made with love ❤️
