# GOODCY CONTENT — WorkOS AuthKit setup

## Current state
- The website is a static GitHub Pages app.
- The splash screen and login/sign-up gateway are present.
- The PWA manifest, install prompt, app icon and service worker are present.
- The login gateway does not store or transmit passwords.
- Real AuthKit login is not active until a WorkOS application and secure callback backend are configured.

## Required WorkOS setup
1. Create a WorkOS account and an AuthKit application in the WorkOS dashboard.
2. Copy the application's **Client ID** (the value starts with `client_`). Never put a WorkOS API key or other secret in this static website.
3. Choose a secure backend host for the AuthKit routes. GitHub Pages cannot run server-side callback/session code.
4. Configure the WorkOS Redirect URI, Initiate Login URI and Logout redirect to match the deployed backend routes. Use HTTPS production URLs.
5. Add the GOODCY CONTENT website origin to the WorkOS allowed origins/CORS configuration if the chosen SDK flow requires it.
6. Store any WorkOS API key and session/cookie secrets only as encrypted backend environment variables.
7. Deploy the backend routes for sign-in, sign-up, OAuth callback, session refresh/current-user and sign-out. Verify secure HttpOnly session cookies and CSRF/PKCE protections.
8. Set `GOODCY_AUTH_BASE_URL` in `index.html` to the backend's HTTPS origin. The page then sends users to `/auth/sign-in` or `/auth/sign-up`; passwords must be entered only on the trusted AuthKit-hosted sign-in experience.

## PWA install and testing
- Serve the site over HTTPS (GitHub Pages does this).
- Open the site in Chrome on Android, then use **Install App** or the browser menu's **Install app / Add to Home screen**.
- Test launch in standalone mode, offline shell loading, icon display and service-worker updates.
- The app currently stores preview posts/profile locally on the device. This is not cloud sync and does not create user accounts.

## Production note
Do not claim authentication, cloud storage, messaging, or cross-device sync is live until the backend is deployed and tested end-to-end. The PWA shell can be installed independently of the authentication setup.
