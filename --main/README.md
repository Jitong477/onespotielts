<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# AI IELTS Remix Hackathon Demo

This repository is a fast-launch hackathon demo for an AI-powered IELTS speaking assistant.

It supports:
- Local development with a Node backend (`server.ts`)
- Cloudflare Pages deployment with built-in Functions in `functions/api/`

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the OpenAI credentials in `.env.local` or your deployment platform's environment variables/secrets:
   - `OPENAI_API_KEY` = your OpenAI API key / school token
   - `OPENAI_BASE_URL` = `https://api.openai-next.com/v1` or your Cloudflare proxy URL
   - `OPENAI_MODEL` = `gpt-4`
3. Run the app:
   `npm run dev`

## Deploy to Cloudflare Pages

This repository now includes Cloudflare Pages Functions under `functions/api/` for `/api/remix` and `/api/chat`.

1. Push this repo to GitHub.
2. Create a new Cloudflare Pages site and connect your repo.
3. Set the build command to:
   `npm run build:cloudflare`
4. Set the output directory to:
   `dist`
5. In Cloudflare Pages, add the following environment secrets:
   - `OPENAI_API_KEY` = your OpenAI API key or school token
   - `OPENAI_BASE_URL` = `https://api.openai-next.com/v1` or your Cloudflare proxy URL
   - `OPENAI_MODEL` = `gpt-4`

After deployment, the front-end will call `/api/remix` and `/api/chat` through Cloudflare Pages Functions.

If you are using a separate Node backend instead of Cloudflare Functions, keep your `server.ts` version and deploy it to a Node hosting service, then update the front-end fetch endpoints accordingly.
