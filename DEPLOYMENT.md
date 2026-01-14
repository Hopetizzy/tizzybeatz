# Deployment Guide

Your application is built and ready for deployment! Here are the steps to deploy your **Vite + React** app to popular hosting providers.

## Pre-Requisites

- **Environment Variables**: You MUST have your API keys ready.
    - `GEMINI_API_KEY`: Found in your Google AI Studio dashboard.
    - `VITE_PAYSTACK_PUBLIC_KEY`: Your Paystack Live (or Test) Public Key.
- **Build Artifacts**: The `npm run build` command has created a `dist` folder in your project root. This is the folder that gets published.

---

## Option 1: Vercel (Recommended)

1.  **Create/Login**: Go to [vercel.com](https://vercel.com) and sign up/login.
2.  **Import Project**:
    - Click **"Add New..."** -> **"Project"**.
    - Import your Git repository (if you pushed this code to GitHub/GitLab).
    - *Alternatively, drag and drop the `dist` folder if installing the Vercel CLI.*
3.  **Configure Project**:
    - **Framework Preset**: Vite
    - **Root Directory**: `./` (default)
    - **Build Command**: `npm run build` (or `vite build`)
    - **Output Directory**: `dist`
4.  **Environment Variables** (Crucial Step):
    - Expand the **"Environment Variables"** section.
    - Add:
        - `GEMINI_API_KEY`: `your_actual_key_here`
        - `VITE_PAYSTACK_PUBLIC_KEY`: `your_paystack_public_key`
5.  **Deploy**: Click **"Deploy"**.

## Option 2: Netlify

1.  **Create/Login**: Go to [netlify.com](https://netlify.com).
2.  **Add New Site**:
    - **"Add new site"** -> **"Import from Git"**.
3.  **Build Settings**:
    - **Build command**: `npm run build`
    - **Publish directory**: `dist`
4.  **Environment Variables**:
    - Go to **"Site configuration"** -> **"Environment variables"**.
    - Add `GEMINI_API_KEY` and `VITE_PAYSTACK_PUBLIC_KEY`.
5.  **Deploy**: Click **"Deploy site"**.

## Manual Upload (Netlify Drop)

If you don't use Git:
1.  Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2.  Drag and drop the `dist` folder from your project into the browser window.
3.  **Note**: You still need to go to Site Settings to set your Environment Variables for the API features to work!

---

## Troubleshooting

- **Blank Page?**: Check the browser console. If you see "process is not defined", ensure you are using the latest code where we fixed the `vite.config.ts`.
- **API Errors?**: Double-check that your Environment Variables are set correctly in the hosting provider's dashboard.
