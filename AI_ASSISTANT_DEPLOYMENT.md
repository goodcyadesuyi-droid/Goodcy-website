# Mamba FX Academy AI Assistant Deployment

## Current implementation
- `api/assistant.js` is a Vercel serverless API route.
- It sends user messages to the OpenAI Responses API from the server.
- The browser never receives the OpenAI API key.
- The assistant may change only the chart symbol, timeframe, and activity tab.
- It cannot place, modify, or close broker orders.
- The local chart/tab commands in `trade.html` work without the AI backend.
- The current GitHub Pages site does not run Vercel API functions. The full AI chat will not answer until the site and API are deployed on a serverless host such as Vercel.

## Deploy on Vercel
1. Sign in to Vercel and choose **Add New → Project**.
2. Import `goodcyadesuyi-droid/Goodcy-website` from GitHub.
3. Deploy the repository as a static site with the included `api/assistant.js` function. No build command is required for the existing plain HTML site.
4. In the Vercel project, open **Settings → Environment Variables**.
5. Add `OPENAI_API_KEY` with a newly created OpenAI project API key. Add it only in Vercel's secret environment-variable field; never put it in GitHub, HTML, screenshots, or chat.
6. Optionally set `OPENAI_MODEL` to a model enabled for the API project. The default is `gpt-6-astra`; confirm that model is enabled for the project before relying on it.
7. Set `ALLOWED_ORIGIN` to the exact deployed website origin, for example `https://your-project.vercel.app` (no trailing slash). If this is not set, the API relies on hosting-level protection and rate limiting.
8. Redeploy after adding environment variables.
9. Open the Vercel-hosted website and test a normal question, then test “Show XAUUSD”, “Change timeframe to 4h”, and “Open trade history”.

## Important hosting note
The existing GitHub Pages URL is a static host and does not execute `api/assistant.js`. The easiest first test is to use the Vercel deployment URL for both the website and its `/api/assistant` route. To keep a custom domain, attach that domain to Vercel after DNS verification. Do not expect the GitHub Pages URL to run this API route.

## Security and product limits
- Never ask members for broker passwords, OTPs, or API secrets in chat.
- Never put `OPENAI_API_KEY` in client-side JavaScript or a public repository.
- Before public launch, add real member authentication, persistent rate limiting, abuse monitoring, budget limits, and privacy disclosures. The included in-memory rate limit is only a basic starter safeguard and is not sufficient by itself for a public production launch.
- Broker connection and live execution remain disabled. The assistant has no broker credentials and no order-execution tools.
- AI output is not financial advice and must not be treated as a promise of trading profit.
