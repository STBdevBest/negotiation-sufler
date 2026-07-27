# PLAN.md — Negotiation Sufler for MentraOS

## Summary

AI negotiation coach for Even G1/G2 smart glasses via MentraOS.
Speak — glasses show real-time AI tips on HUD (640×200, green mono).

## Architecture

```
Phone mic → MentraOS Cloud (STT) → WebSocket → Railway Server
  → YandexGPT API → Response → Glasses Display
```

## Components

| Component | Solution |
|-----------|----------|
| Platform | MentraOS (cloud) |
| STT | Built-in MentraOS (auto language detection) |
| LLM | YandexGPT Lite (yandexgpt-lite) |
| SDK | @mentra/sdk |
| Deploy | Railway (24/7, no computer needed) |

## Key files

- `src/index.ts` — AppServer (entry point)
- `src/config.ts` — System prompt
- `src/llm/yandex.ts` — YandexGPT API client
- `app_config.json` — Developer Console config

## Setup

1. Push to GitHub
2. Deploy to Railway
3. Register in console.mentraglass.com
4. Set env vars in Railway
5. Install from Mentra Store

## API Keys

- Yandex Cloud: already configured in .env.example
- MentraOS: generated in Developer Console
