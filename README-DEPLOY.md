# Deploying Amplifly Site to Netlify

This document outlines how to deploy the Amplifly marketing site to Netlify.

## Prerequisites

- A Netlify account (free tier is sufficient)
- Your project code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Options

### Option 1: Deploy via Netlify UI (Recommended)

1. **Sign in to Netlify** at [netlify.com](https://www.netlify.com/)

2. **Add new site** by clicking "Add new site" → "Import an existing project"

3. **Connect to Git provider** and select your repository

4. **Configure build settings**:

   - Branch to deploy: `main` (or your default branch)
   - Build command: `npm run build`
   - Publish directory: `dist`

5. **Click "Deploy site"**

6. **Set up a custom domain** (optional):
   - Go to "Domain settings"
   - Click "Add custom domain"
   - Follow the instructions to configure your domain

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI**:

   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:

   ```bash
   netlify login
   ```

3. **Initialize Netlify in your project**:

   ```bash
   cd Site
   netlify init
   ```

4. **Follow the prompts** to create a new site or link to an existing site

5. **Deploy your site**:
   ```bash
   netlify deploy --prod
   ```

## Configuration

The `netlify.toml` file in the project root contains the Netlify configuration:

```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"
```

There is deliberately no `/* -> /index.html` catch-all redirect. The site is static and
multi-page, so unknown URLs should return the real `404.html`; a catch-all would make every
mistyped URL a soft 404 (a 200 copy of the homepage) in search engines.

### Search and AI discoverability

- `src/layouts/Layout.astro` sets the canonical URL, Open Graph / Twitter tags and JSON-LD
  for every page. `astro.config.mjs` must keep `site: "https://amplifly.me"` or canonicals
  fall back to localhost.
- `src/lib/schema.ts` holds the schema.org graph (Organization, WebSite, the app, FAQ,
  breadcrumbs). Update it when prices, store links or features change.
- `src/pages/sitemap.xml.ts` generates `/sitemap.xml`. Add new public pages there.
- `public/robots.txt` allows all crawlers, including AI assistants, and points at the sitemap.
- `public/llms.txt` is a plain-text summary of the product for AI assistants
  (see https://llmstxt.org). Keep its facts in step with the site copy.

## Troubleshooting

- **Build failures**: Check the build logs in Netlify for errors
- **Styling issues**: Ensure all CSS is being properly processed in the build
- **Missing assets**: Verify that all assets are referenced with the correct paths

For more help, refer to the [Netlify documentation](https://docs.netlify.com/) or contact your team's developer.
