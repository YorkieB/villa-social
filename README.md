# Villa — Social by KM Music Group

<p align="center">
  A social platform built for the KM Music Group community. Built with Next.js, TypeScript, Tailwind CSS, Firebase, and real-time Firestore.
</p>

## Features ✨

- Authentication with Firebase (Google sign-in)
- Post, like, repost, and reply in real-time
- Bookmarks and pinned posts
- Image and video uploads via Firebase Storage
- Follow / unfollow other users
- User profiles with bio, banner, and follower stats
- Trending topics (Firestore-powered)
- Villa Circle — discover other members
- Responsive design for mobile, tablet, and desktop
- Dark mode with customisable colour accent
- PWA-ready

## Tech 🛠

- [Next.js](https://nextjs.org)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Firebase](https://firebase.google.com) (Auth, Firestore, Storage)
- [SWR](https://swr.vercel.app)
- [Headless UI](https://headlessui.com)
- [Framer Motion](https://framer.com)

## Setup 💻

1. Clone the repository

   ```bash
   git clone https://github.com/YorkieB/villa-social.git
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com) and enable:
   - **Authentication** → Google sign-in method
   - **Firestore Database** → production mode, `europe-west2` region
   - **Storage** → default bucket

4. Copy your Firebase config into `.env.development`:

   ```env
   NEXT_PUBLIC_API_KEY=your_api_key
   NEXT_PUBLIC_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_PROJECT_ID=your_project_id
   NEXT_PUBLIC_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_APP_ID=your_app_id
   ```

5. Deploy Firestore rules and indexes

   ```bash
   npm install -g firebase-tools
   firebase login
   firebase use your-project-id
   firebase deploy --except functions
   ```

6. Run locally

   ```bash
   npm run dev
   ```

## Deployment on Droplet

```bash
# On the droplet
git clone https://github.com/YorkieB/villa-social.git /opt/villa-social
cd /opt/villa-social
npm install
npm run build
npm start
```

Run behind nginx on `social.villaradio.live`.

---

© 2026 KM Music Group
