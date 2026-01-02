
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Voice Through Image

A non-profit documentary platform bridging the gap between social invisibility and active empathy.

## 🚨 HOW TO FIX "DEMO MODE" / MISSING KEYS

If your website says "Demo Mode" or "Keys Missing", you need to tell the app where your database is.

**Step 1: Get Keys from Firebase**
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Select your project.
3. Click the **Gear Icon** (top left) -> **Project Settings**.
4. Scroll down to the "Your apps" section.
5. You will see a code block like `const firebaseConfig = { apiKey: "...", ... }`.

**Step 2: Create .env File**
1. In your project folder (where `package.json` is), create a file named `.env`.
2. Paste the following into it, replacing the values with what you copied from Firebase:

```env
# Google AI Studio Key (for Chatbot & News)
GEMINI_API_KEY=AIzaSy...

# Firebase Keys (Start with VITE_)
VITE_FIREBASE_API_KEY=Paste_apiKey_Here
VITE_FIREBASE_AUTH_DOMAIN=Paste_authDomain_Here
VITE_FIREBASE_PROJECT_ID=Paste_projectId_Here
VITE_FIREBASE_STORAGE_BUCKET=Paste_storageBucket_Here
VITE_FIREBASE_MESSAGING_SENDER_ID=Paste_messagingSenderId_Here
VITE_FIREBASE_APP_ID=Paste_appId_Here
```

**Step 3: Rebuild**
Changes to `.env` only work after restarting!

```bash
npm run build
npm run deploy
```

---

## Features
- **Documentary Archives**: Watch stories and view photo essays.
- **Resource Directory**: Verified map of 70+ aid agencies.
- **AI Assistant**: Gemini-powered chat for resource finding.
- **Full Localization**: EN / ZH-TW / ZH-CN / ES.

## Local Development

```bash
# Install dependencies
npm install

# Run locally (Open http://localhost:3000)
npm run dev
```
