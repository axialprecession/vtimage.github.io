<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Voice Through Image

A non-profit documentary platform bridging the gap between social invisibility and active empathy.

## Features
- **Documentary Archives**: Watch stories and view photo essays.
- **Resource Directory**: Verified map of 70+ aid agencies (Shelter, Legal, Food).
- **AI Assistant**: Gemini-powered chat for resource finding.
- **Demo Mode**: Works out-of-the-box without keys.

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run Locally (Demo Mode)**:
   ```bash
   npm run dev
   ```
   The app will launch with simulated data and authentication.

## Connecting to Firebase & Gemini (Production Mode)

To enable real authentication, database storage, and AI features:

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. **Firebase Setup**:
   - Go to [Firebase Console](https://console.firebase.google.com/).
   - Create a project.
   - Enable **Authentication** (Email/Password & Google).
   - Enable **Firestore Database**.
   - Enable **Storage**.
   - Go to Project Settings, create a Web App, and copy the config keys into your `.env` file.

3. **Gemini AI Setup**:
   - Get your key from [Google AI Studio](https://aistudio.google.com/app/apikey).
   - Add it to `GEMINI_API_KEY` in your `.env` file.

4. **Restart the Server**:
   ```bash
   npm run dev
   ```
   The "Preview Mode" banner will disappear, and real data will be used.
