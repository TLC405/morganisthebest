# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## PWA (Progressive Web App) Features

This application is a fully-featured Progressive Web App with the following capabilities:

### Installation
- **Desktop & Mobile**: Users can install the app directly from their browser
- **Custom Install Prompt**: A beautiful custom UI prompts users to install the app
- **iOS Support**: Full support for iOS home screen installation

### Offline Support
- **Service Worker**: Caches static assets and API responses for offline access
- **Offline Fallback**: Custom offline page when no connection is available
- **Background Sync**: Queues actions when offline and syncs when connection returns

### Performance Optimizations
- **Lazy Loading**: Routes are loaded on-demand to reduce initial bundle size
- **Code Splitting**: Vendor libraries split into separate chunks for optimal caching
- **Cache Strategies**:
  - Cache-first for static assets (HTML, CSS, JS, images)
  - Network-first for API calls with offline fallback

### How to Install the PWA

**On Desktop (Chrome, Edge):**
1. Visit the app in your browser
2. Look for the install button in the address bar or custom prompt
3. Click "Install" to add it to your desktop

**On Mobile (Android):**
1. Visit the app in Chrome or Firefox
2. Tap the custom install prompt or browser menu
3. Select "Add to Home Screen" or "Install App"

**On iOS:**
1. Visit the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"

### Development Notes

The PWA implementation includes:
- `public/manifest.json` - App metadata and configuration
- `public/sw.js` - Service worker for caching and offline support
- `src/hooks/useInstallPrompt.ts` - Install prompt management
- `src/hooks/useOnlineStatus.ts` - Network status tracking
- `src/components/InstallPrompt.tsx` - Custom install UI
- `src/pages/Offline.tsx` - Offline fallback page

Service worker updates are checked every 30 minutes to ensure users get the latest version without excessive battery drain.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
