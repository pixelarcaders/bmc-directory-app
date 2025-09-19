# Netlify Deployment Guide

## Quick Deploy Options

### Option 1: Direct from GitHub
1. Push this code to a GitHub repository
2. Go to [Netlify](https://netlify.com) and sign in
3. Click "New site from Git"
4. Connect your GitHub repository
5. Build settings will be automatically detected from `netlify.toml`

### Option 2: Drag & Drop Deploy
1. Run `npm run build` locally
2. Go to [Netlify](https://netlify.com)
3. Drag the `dist` folder to the deploy area

### Option 3: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

## Environment Variables Setup

After deployment, add these environment variables in Netlify:

1. Go to Site settings > Environment variables
2. Add the following variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Build Settings

The `netlify.toml` file configures:
- Build command: `npm run build`
- Publish directory: `dist`
- SPA redirects for React Router
- Node.js version: 18

## Custom Domain (Optional)

1. In Netlify dashboard, go to Domain settings
2. Add your custom domain
3. Configure DNS records as instructed

## Supabase Integration

Don't forget to:
1. Set up your Supabase project
2. Run the database migration
3. Configure RLS policies
4. Set up the storage bucket for logos
5. Deploy the edge function for email notifications

Your site will be live at: `https://your-site-name.netlify.app`