# AI Affiliate Tools - Next.js 14 Website

A modern affiliate tools website built with Next.js 14 (App Router), Supabase, and TailwindCSS. Discover and compare the best AI tools for productivity, creativity, and business.

## Features

- 🚀 **Next.js 14** with App Router
- 🎨 **TailwindCSS** for modern, responsive design
- 🗄️ **Supabase** (PostgreSQL) backend
- 🔍 **Search & Filter** functionality
- 📱 **Mobile responsive** design
- 🔗 **Affiliate links** with proper SEO attributes
- ⚡ **Server-side rendering** for better performance
- 🎯 **TypeScript** for type safety

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: TailwindCSS
- **Backend**: Supabase (PostgreSQL)
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd affiliate-tools-nextjs
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to your project's SQL editor
3. Run the SQL schema from `supabase-schema.sql`
4. Get your project URL and anon key from Settings > API

### 4. Configure environment variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
affiliate-tools-nextjs/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── page.tsx           # Homepage
│   │   ├── tools/[id]/        # Tool detail pages
│   │   ├── layout.tsx         # Root layout
│   │   ├── globals.css        # Global styles
│   │   └── not-found.tsx      # 404 page
│   ├── components/            # React components
│   │   ├── ToolCard.tsx       # Tool card component
│   │   └── SearchAndFilter.tsx # Search and filter component
│   └── lib/                   # Utility functions
│       ├── supabaseClient.ts  # Supabase client
│       └── data.ts           # Data fetching functions
├── supabase-schema.sql        # Database schema
├── .env.local                 # Environment variables
└── README.md                  # This file
```

## Database Schema

The application uses a single `tools` table with the following structure:

```sql
CREATE TABLE tools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  affiliate_link TEXT NOT NULL,
  categories TEXT[] NOT NULL DEFAULT '{}',
  highlights TEXT NOT NULL,
  features TEXT NOT NULL,
  pricing TEXT NOT NULL CHECK (pricing IN ('Free', 'Freemium', 'Paid', 'Lifetime')),
  note TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Features

### Homepage
- Grid layout of all tools
- Search by tool name
- Filter by category and pricing
- URL-based filtering (shareable links)
- Responsive design

### Tool Detail Pages
- Full tool information display
- Hero image with overlay
- Features and notes sections
- Affiliate link with proper attributes
- Back navigation

### Search & Filter
- Real-time search by title
- Category filtering
- Pricing filtering
- Clear filters functionality
- URL query parameters

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you have any questions or need help, please open an issue on GitHub.
