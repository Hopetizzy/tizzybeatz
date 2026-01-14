<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# TizzyBeatz

TizzyBeatz is a digital music production brand that creates and distributes original instrumentals, sound kits, and audio content for artists, content creators, and media projects. We sell and license beats, sample packs, and digital music products through our website and online platforms.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deployment

When deploying to a hosting provider (like Vercel, Netlify, or Render), you must set the following environment variables:

- `GEMINI_API_KEY`: Your Google Gemini API Key
- `VITE_PAYSTACK_PUBLIC_KEY`: Your Paystack Public Key (Live or Test)
