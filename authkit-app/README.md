# Mamba FX Academy — AuthKit foundation

This is a separate Next.js deployment foundation. The existing GitHub Pages website on `main` is intentionally unchanged while this migration is prepared.

## Local setup

1. Use Node.js 22.11 or later.
2. Copy `.env.example` to `.env.local`.
3. Add your WorkOS Client ID and a random cookie password (at least 32 characters). AuthKit sign-in can use PKCE public-client mode without a WorkOS API key. Never commit real secrets.
4. Install and run:

```bash
npm install
npm run dev
```

## WorkOS development redirects

Configure the WorkOS application's Redirects tab:

- Redirect URI: `http://localhost:3000/callback`
- Initiate login URI: `http://localhost:3000/sign-in`
- Sign-out URI: `http://localhost:3000/`

## Vercel deployment

Import this GitHub repository into Vercel and set **Root Directory** to `authkit-app`. Add `WORKOS_CLIENT_ID`, `WORKOS_COOKIE_PASSWORD`, and `NEXT_PUBLIC_WORKOS_REDIRECT_URI` in Vercel Project Settings → Environment Variables. Add `WORKOS_API_KEY` only if server-side WorkOS management APIs are needed. Set `NEXT_PUBLIC_APP_URL` to the deployed URL. Deploy, then replace the localhost URLs above with the production Vercel domain:

- Redirect URI: `https://YOUR-VERCEL-DOMAIN/callback`
- Initiate login URI: `https://YOUR-VERCEL-DOMAIN/sign-in`
- Sign-out URI: `https://YOUR-VERCEL-DOMAIN/`

Redeploy after adding or changing environment variables.

## Important

- No real WorkOS secret or cookie password is stored in this repository.
- Do not publish the API key in frontend code.
- This branch is an AuthKit starting point, not a completed migration of the current academy/social features.
- The existing GitHub Pages site remains available until the Vercel version is tested and ready to replace it.
