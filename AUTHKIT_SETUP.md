# Mamba FX Academy — WorkOS AuthKit setup

This project currently uses plain HTML on GitHub Pages. Its current email form and local profile are previews, not secure authentication. WorkOS AuthKit requires a server-side authentication flow and secure sessions; do not add WorkOS secret keys to HTML, JavaScript, GitHub Pages, or chat.

## Integration choice
Use the official WorkOS AuthKit Next.js SDK when the Mamba FX site is migrated from static GitHub Pages to a Next.js application hosted on Vercel. The official SDK is designed for the Next.js App Router and manages callback handling, encrypted session cookies, refresh, sign-in and sign-out.

Official documentation:
- https://workos.com/docs/sdks/authkit-nextjs
- https://github.com/workos/authkit-nextjs
- https://workos.com/blog/add-authkit-to-a-nextjs-app

## Required WorkOS setup
1. Create/sign in to a WorkOS account at https://dashboard.workos.com/.
2. Create a User Management / AuthKit application.
3. Configure the allowed application origin and redirect URLs for the final production domain.
4. Configure the sign-in, sign-out and initiate-login URLs in the WorkOS dashboard.
5. Copy the Client ID into the hosting environment as `WORKOS_CLIENT_ID`. Keep the API key private as `WORKOS_API_KEY` if using server-side WorkOS management APIs.
6. Generate a random cookie password of at least 32 characters and store it only as `WORKOS_COOKIE_PASSWORD` in the hosting environment.
7. Configure `NEXT_PUBLIC_WORKOS_REDIRECT_URI` to the exact callback URL registered in WorkOS.

Example environment variable names (values intentionally omitted):
```env
WORKOS_CLIENT_ID=
WORKOS_API_KEY=
WORKOS_COOKIE_PASSWORD=
NEXT_PUBLIC_WORKOS_REDIRECT_URI=
```

## Next implementation steps
- Migrate the existing homepage, social views, creator and trading terminal into the Next.js app without changing their visual design.
- Install `@workos-inc/authkit-nextjs` and its peer dependency `@workos-inc/node`.
- Add the AuthKit provider to the root layout, an AuthKit sign-in route, a callback route using `handleAuth()`, and the AuthKit proxy/middleware.
- Require an authenticated session for member profiles, posting, messaging and member-only pages.
- Store user profiles and uploaded posts in a database/object storage with server-side authorization rules.
- Remove the current preview-only email sign-in and localStorage-only profile flow after verified AuthKit login is working.

## Current status
- PWA manifest and service worker already exist.
- This update adds an in-app PWA install prompt where the browser supports `beforeinstallprompt`.
- The create (+) screen is being upgraded as a camera-first full-screen capture interface.
- WorkOS AuthKit is not active yet. A WorkOS application/client ID and a secure Next.js deployment are required before login can be verified. Do not claim members are authenticated until the callback and session are tested.
