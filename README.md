# Lab Partner

**Your Audience. Your Platform.**

Lab Partner is a white-label community platform that enables influencers to own their audience through live streaming, Reddit-style discussions, and member engagement tools. Each influencer gets their own branded instance where they can stream exclusively to their "Lab Partners" (members) and foster real discussions.

Built by [Keegareaux Labs](https://github.com/sullivancreativeco).

---

## Features

- **Branded Communities** — Custom colors, logo, and slug (`/c/your-name`)
- **Live Streaming** — Go live via Mux with RTMP credentials, VOD replay
- **Discussions** — Reddit-style posts with flat comments and upvoting
- **Member Management** — Invite Lab Partners, assign roles (owner/mod/member)
- **Real-time Updates** — Live post and comment feeds via Supabase Realtime
- **Mobile-first** — Bottom tab navigation, responsive layout, safe area support

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TypeScript |
| Routing | React Router DOM 6 |
| Styling | TailwindCSS + shadcn/ui |
| Auth | Supabase Auth |
| Database | Supabase (PostgreSQL) |
| Real-time | Supabase Realtime |
| Storage | Supabase Storage |
| Streaming | Mux API + Mux Player |
| Hosting | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- [Supabase](https://supabase.com) project
- [Mux](https://mux.com) account

### Installation

```sh
# Clone the repository
git clone https://github.com/sullivancreativeco/lab-partner.git
cd lab-partner

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
```

### Environment Variables

Add your credentials to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
MUX_TOKEN_ID=your_mux_token_id
MUX_TOKEN_SECRET=your_mux_token_secret
```

### Development

```sh
# Start dev server
npm run dev

# Run tests
npm test

# Lint
npm run lint

# Production build
npm run build
```

The dev server runs at **http://localhost:8080**.

---

## Project Structure

```
src/
├── pages/              # Route pages
│   ├── Index.tsx       # Landing page
│   ├── Login.tsx       # Authentication
│   ├── Signup.tsx
│   ├── CreateCommunity.tsx
│   ├── CommunityHome.tsx
│   ├── CommunityStreams.tsx
│   ├── CommunityDiscussions.tsx
│   ├── PostDetail.tsx
│   ├── CommunityMembers.tsx
│   └── CommunitySettings.tsx
├── components/
│   ├── CommunityLayout.tsx   # Shared community layout
│   ├── NavLink.tsx
│   └── ui/                   # shadcn/ui components
├── hooks/              # Custom React hooks
├── lib/                # Utilities
└── assets/             # Static assets
```

---

## Routes

| Path | Description |
|------|-------------|
| `/` | Landing page |
| `/login` | Login |
| `/signup` | Sign up |
| `/create-community` | Create a new community |
| `/c/:slug` | Community home |
| `/c/:slug/streams` | Streams (live, upcoming, replays) |
| `/c/:slug/discussions` | Discussion posts |
| `/c/:slug/discussions/:postId` | Post detail + comments |
| `/c/:slug/members` | Member list |
| `/c/:slug/settings` | Community settings (owner only) |

---

## Documentation

Planning docs are in the [`docs/`](docs/) directory:

- [Product Requirements (PRD)](docs/lab-partner-prd.md)
- [Technical Spec](docs/lab-partner-technical-spec.md)
- [Brand Guidelines](docs/lab-partner-brand-guidelines.md)
- [Feature Roadmap](docs/lab-partner-roadmap.md)
- [Go-to-Market Plan](docs/lab-partner-gtm-plan.md)
- [Loveable Prompt](docs/lab-partner-loveable-prompt.md)

---

## Development Status

**Current phase:** MVP Foundation — migrating from Loveable prototype to production codebase via Claude Code.

See [claude_context.md](claude_context.md) for detailed audit of current state, known issues, and technical debt.

---

## License

Private — All rights reserved. Keegareaux Labs.
