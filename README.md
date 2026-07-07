# Vid2Blog

Turn YouTube videos into publication-ready blog posts in one click. Powered by GPT-4.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + React 18 + Tailwind CSS
- **Backend**: Next.js API Routes (serverless)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (Email + Google OAuth)
- **AI**: OpenAI GPT-4 Turbo
- **Payment**: Creem (Alipay withdrawal supported)
- **Deployment**: Vercel

## Quick Start

### 1. Install dependencies

```bash
cd vid2blog-app
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the SQL Editor, run the contents of `supabase-schema.sql`
3. Go to Settings > API to get your project URL and keys
4. Go to Authentication > Providers to enable Email and Google OAuth

### 3. Get OpenAI API key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an API key with GPT-4 access

### 4. Set up Creem payment

1. Register at [creem.io](https://creem.io) (supports Chinese ID, Alipay withdrawal)
2. Create two products:
   - Vid2Blog Pro - $19/month subscription
   - Vid2Blog Business - $49/month subscription
3. Copy the Product IDs from the dashboard
4. Set up webhook URL: `https://your-domain.com/api/creem-webhook`
5. Get your API keys from Developers > API Keys

### 5. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx
OPENAI_API_KEY=sk-xxx
CREEM_SECRET_KEY=your_creem_secret
CREEM_PRO_PRODUCT_ID=your_pro_product_id
CREEM_BUSINESS_PRODUCT_ID=your_business_product_id
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

1. Push this project to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repo
3. Add all environment variables in Vercel project settings
4. Deploy

### Custom Domain (optional)

1. Buy a domain (e.g. vid2blog.com) on Namecheap or GoDaddy (~$12/year)
2. In Vercel project settings > Domains, add your domain
3. Update DNS records as instructed

## Features

- Paste YouTube URL, get a blog post in seconds
- Three tone options: Professional, Casual, Tutorial
- Copy to clipboard or download as Markdown
- Post history with thumbnails
- Usage tracking with monthly limits
- Free / Pro ($19) / Business ($49) tiers
- Dark/light mode toggle
- Responsive design (mobile-first)
- SEO-optimized (meta tags, Open Graph)
- Google OAuth + Email auth

## Project Structure

```
vid2blog-app/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── dashboard/page.tsx    # Main conversion interface
│   │   ├── posts/page.tsx        # Post history list
│   │   ├── posts/[id]/page.tsx   # Single post view
│   │   ├── pricing/page.tsx      # Pricing + FAQ
│   │   ├── settings/page.tsx     # User settings
│   │   ├── auth/callback/        # OAuth callback handler
│   │   └── api/
│   │       ├── convert/          # YouTube -> Blog conversion
│   │       ├── posts/            # Post CRUD
│   │       ├── usage/            # Usage tracking
│   │       ├── creem-checkout/   # Payment checkout
│   │       └── creem-webhook/    # Payment webhook
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── ConvertForm.tsx
│   │   └── PricingCards.tsx
│   ├── lib/
│   │   ├── supabase.ts           # Client-side Supabase
│   │   ├── supabase-server.ts    # Server-side Supabase
│   │   ├── youtube.ts            # YouTube transcript fetcher
│   │   ├── openai.ts             # GPT-4 blog generation
│   │   └── creem.ts              # Creem payment integration
│   └── types/index.ts            # TypeScript types
├── supabase-schema.sql           # Database schema
├── .env.example                  # Environment template
└── package.json
```

## How YouTube Transcript Works

The app fetches transcripts directly from YouTube's timedtext API:
1. Fetches the YouTube watch page
2. Extracts caption track URLs from the page HTML
3. Downloads the caption XML
4. Parses and concatenates the text

No third-party API keys needed for YouTube transcript fetching.

## Pricing

| Plan | Price | Posts/month | Features |
|------|-------|-------------|----------|
| Free | $0 | 3 | Basic formatting, Markdown export |
| Pro | $19/mo | 30 | Tone selection, SEO titles, History |
| Business | $49/mo | Unlimited | Team access, API, Priority support |

## License

Private - All rights reserved.
