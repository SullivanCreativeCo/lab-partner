# Lab Partner

White-label community platform enabling influencers to own their audience through live streaming and Reddit-style discussions.

## Tech Stack

- **Frontend:** Next.js 14+ (App Router), TypeScript, TailwindCSS, shadcn/ui
- **Backend:** Supabase (PostgreSQL, Auth, Realtime, Storage)
- **Streaming:** Mux API
- **Hosting:** Vercel

## Project Structure

```
/app              - Next.js App Router pages
/components       - Reusable UI components
/lib              - Utilities, Supabase client, helpers
/public           - Static assets
```

## Key Patterns

- Route structure: `/c/[slug]` for community pages
- Supabase Auth for email/password authentication
- Row Level Security (RLS) on all database tables
- Supabase Realtime for live post/comment updates
- Mux Player React component for stream playback

## Commands

- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run lint` - Run linter

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
MUX_TOKEN_ID=
MUX_TOKEN_SECRET=
```
