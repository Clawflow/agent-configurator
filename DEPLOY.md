# Deployment Guide — AI Kollegorna Agent Configurator

## Prerequisites

- Node.js 18+ installed
- npm 9+ installed

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Option 1: Deploy to Vercel (Recommended)

Vercel provides the easiest deployment experience with automatic SSL, preview deployments, and global CDN.

### Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (follow prompts)
vercel

# Deploy to production
vercel --prod
```

### Via GitHub Integration

1. Push the repository to GitHub
2. Go to [vercel.com](https://vercel.com) and click "New Project"
3. Import your GitHub repository
4. Vercel auto-detects Vite — click "Deploy"
5. Custom domain: Add your domain in Project Settings > Domains

The `vercel.json` in the root handles SPA routing rewrites.

---

## Option 2: Deploy to GitHub Pages

### Setup

1. Update `vite.config.js` — set the base path:

```js
export default defineConfig({
  plugins: [react()],
  base: '/agent-configurator/',
})
```

Or build with the environment variable:

```bash
GITHUB_PAGES=true npm run build
```

2. Build the project:

```bash
npm run build
```

3. Deploy the `dist/` folder to GitHub Pages:

### Using `gh-pages` package

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add deploy script to package.json:
# "deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

### Using GitHub Actions (Automatic)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: GITHUB_PAGES=true npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - uses: actions/deploy-pages@v4
```

Then enable GitHub Pages in your repo:
Settings > Pages > Source: GitHub Actions

---

## Environment Notes

- **Formspree endpoint**: The form submits to `https://formspree.io/f/mldnjqzk`. Update this in `src/App.jsx` if needed.
- **localStorage backup**: All submissions are also saved to `localStorage` under the key `aik-submissions`.
- **Form persistence**: Form data persists across page reloads via `localStorage` (key: `aik-agent-configurator-form`).

## Build

```bash
# Production build
npm run build

# Preview production build locally
npm run preview
```

The build output is in the `dist/` directory.
