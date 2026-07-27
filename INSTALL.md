# INSTALL.md — Negotiation Sufler (MentraOS)

## What it does

AI negotiation coach for Even G1/G2 smart glasses via MentraOS.
Speak — the glasses show real-time AI tips on the HUD.

**No computer needed** — runs 24/7 on Railway cloud.

---

## Quick setup (for the user)

1. Install **Mentra** app on your phone: https://mentraglass.com/os
2. Connect your Even G1/G2 glasses via Bluetooth
3. Open the install link (sent by the developer)
4. Tap **Install** — the app appears in your Mentra app list
5. Open **Negotiation Sufler** — start speaking, tips appear on glasses

---

## Developer setup (deploying the app)

### Prerequisites
- GitHub account
- Railway account (https://railway.com)
- MentraOS account (https://console.mentraglass.com)

### Step 1: Push to GitHub

```bash
cd negotiation-sufler
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/negotiation-sufler.git
git push -u origin main
```

### Step 2: Deploy to Railway

1. Go to https://railway.com → **Deploy a new project**
2. Select **Deploy from GitHub repo**
3. Select your `negotiation-sufler` repository
4. Railway will auto-detect Node.js and start building

### Step 3: Set environment variables

In Railway project → **Variables** tab, add:

| Variable | Value |
|----------|-------|
| `PACKAGE_NAME` | `com.sufler.negotiation` |
| `MENTRA_API_KEY` | *(from Developer Console, Step 4)* |
| `YANDEX_API_KEY` | `AQVN04hZ0ZObZ9L0ckvuy-kBhujIZMjg3KrJhPJH` |
| `YANDEX_FOLDER_ID` | `b1ghsq8cn89798g1vina` |
| `YANDEX_MODEL_ID` | `yandexgpt-lite` |
| `PORT` | `3000` |

### Step 4: Register in MentraOS Developer Console

1. Go to https://console.mentraglass.com
2. Click **Create App**
3. Fill in:
   - **Package Name**: `com.sufler.negotiation`
   - **Server URL**: `https://your-app.up.railway.app`
4. Add permission: **MICROPHONE**
5. Click **Save** → copy the **API Key**
6. Paste the API Key into Railway as `MENTRA_API_KEY`

### Step 5: Generate Railway domain

1. In Railway → **Settings** → **Networking** → **Public Networking**
2. Click **Generate Domain**
3. Copy the URL (e.g., `https://negotiation-sufler-production.up.railway.app`)
4. Update the **Server URL** in Developer Console with this URL

### Step 6: Deploy

Click **Deploy** in Railway. Wait 1-2 minutes.

### Step 7: Test

1. Open Mentra app on your phone
2. Find **Negotiation Sufler** in the app list
3. Tap to start — speak Russian, tips appear on glasses

---

## Local development

```bash
cp .env.example .env
# Fill in .env with your keys
npm install
npm run dev
```

Use ngrok for local testing:
```bash
ngrok http 3000
```

---

## File structure

```
negotiation-sufler/
├── src/
│   ├── index.ts          ← AppServer (entry point)
│   ├── config.ts         ← System prompt
│   └── llm/
│       └── yandex.ts     ← YandexGPT API client
├── package.json
├── tsconfig.json
├── .env.example
├── app_config.json       ← Developer Console config
└── INSTALL.md            ← This file
```

---

## Troubleshooting

**App not showing on glasses?**
- Check Railway logs for errors
- Verify `MENTRA_API_KEY` is set correctly
- Ensure MICROPHONE permission is added in Developer Console

**No AI tips?**
- Check `YANDEX_API_KEY` and `YANDEX_FOLDER_ID` are set
- Verify Yandex Cloud API is accessible (no VPN needed in Russia)

**Glasses display blank?**
- Ensure glasses are connected via Bluetooth
- Check that Mentra app is running on phone
- Restart the app from Mentra app list
