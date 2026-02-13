# Lab Partner - Project Context for Claude Code

## Overview

White-label community platform enabling influencers to own their audience through live streaming and Reddit-style discussions. Each influencer gets a branded instance with custom colors, logo, streams, and discussions.

**Core value proposition:** Turn followers into partners. Stop renting attention on platforms you don't control.

---

## What Loveable Built

### Working Features
- [x] Authentication UI (Supabase Auth forms exist)
- [x] Community creation UI
- [x] Branding customization UI (colors, logo)
- [x] Basic routing structure (React Router)
- [x] Mobile-first responsive layout with bottom tab nav
- [x] Landing page with hero, features, CTA
- [x] Dark mode theme
- [ ] Live streaming — NOT integrated (Mux SDK not installed, UI mockup only)
- [ ] Discussion posts — mock data only, no database connection
- [ ] Comments — hardcoded array in PostDetail, no persistence
- [ ] Voting system — read-only display, no click handlers, no persistence
- [ ] Real-time updates — no Supabase Realtime subscriptions
- [ ] Authentication — forms don't submit, no session management

### Known Issues
1. **Streaming**: Mux SDK (`@mux/mux-player-react`) not even installed. Stream pages show hardcoded mock data with empty placeholder thumbnails. No RTMP credential flow.
2. **Real-time updates**: No Supabase Realtime code exists. No WebSocket subscriptions anywhere.
3. **Authentication**: Login/Signup forms call `e.preventDefault()` and do nothing. No Supabase Auth client, no session management, no protected routes.
4. **All data is hardcoded**: `mockPosts` arrays duplicated across CommunityHome, CommunityDiscussions, and PostDetail. No database queries.
5. **Community names hardcoded**: "Creator Studio" is hardcoded in CommunityHome, CommunityStreams, CommunityDiscussions, CommunityMembers, and CommunitySettings instead of reading from route params/database.
6. **Missing dependencies**: `@supabase/supabase-js` and `@mux/mux-player-react` are not in package.json despite env vars being defined.

### Code Quality Observations
- **File structure**: Clean — good separation into `/pages`, `/components`, `/hooks`, `/lib`
- **Component organization**: Fair — modular but repetitive (mock data duplicated across files, no shared data hooks)
- **TypeScript usage**: Loose — `strict: false`, `noImplicitAny: false`, `noUnusedLocals: false` in tsconfig. ESLint has `no-unused-vars: off`
- **Error handling**: Missing — zero try/catch blocks, no error boundaries, no validation messages, no error UI states
- **Loading states**: Missing — no spinners, skeletons, or pending indicators on any forms or data loads

---

## What Needs Improvement

### Priority 1 (Critical)
- Install and integrate Supabase client (`@supabase/supabase-js`)
- Wire up authentication (auth context, session management, protected routes)
- Connect discussions/posts/comments to Supabase database
- Install and integrate Mux SDK for streaming (`@mux/mux-player-react`)
- Replace all hardcoded mock data with real database queries

### Priority 2 (Important)
- Add error boundaries (React ErrorBoundary)
- Add proper error handling (try/catch, error UI states)
- Add loading states (spinners, skeletons)
- Add form validation with error messages
- Wire up voting system with click handlers and persistence
- Add Supabase Realtime subscriptions for live post/comment updates
- Replace hardcoded "Creator Studio" with dynamic community names

### Priority 3 (Nice to Have)
- Enable TypeScript strict mode
- Deduplicate mock data patterns into shared hooks/services
- Add skeleton loaders for better perceived performance
- Improve color picker grid on small phones (currently `grid-cols-2`, cramped on 320px)
- Add hamburger menu for overflow actions on mobile

---

## Technical Debt from Loveable
- **Hardcoded community name** "Creator Studio" in 5+ page components instead of reading from params/database
- **Hardcoded domain** "labpartner.app/c/" in CreateCommunity.tsx
- **Duplicated mock data** — `mockPosts` defined separately in CommunityHome, CommunityDiscussions, PostDetail
- **No error boundaries** — any component throw crashes the entire app
- **TanStack React Query** imported in App.tsx but completely unused
- **`next-themes`** installed (Next.js package) despite this being a Vite project
- **Upvote buttons** have no `onClick` handlers — purely cosmetic
- **Auth forms** submit handlers are empty (`e.preventDefault()` only)
- **TypeScript linting disabled** — no safety net for type errors
- **No service layer** — when backend is added, all queries will need to be created from scratch

---

## Actual Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Vite 5.4.19 + React 18.3.1 | NOT Next.js — uses Vite |
| Routing | React Router DOM 6.30.1 | Client-side routing |
| Language | TypeScript 5.8.3 | ES modules, strict mode OFF |
| Styling | TailwindCSS 3.4.17 | CSS variables, dark mode default |
| UI Components | shadcn/ui (51 components) | Radix UI primitives |
| Forms | React Hook Form + Zod | Schema validation (not fully utilized) |
| Data Fetching | TanStack React Query 5.83 | Imported but unused |
| Animations | Framer Motion 12.34 | |
| Icons | Lucide React 0.462 | |
| Fonts | Space Grotesk (display), DM Sans (body) | |
| Testing | Vitest 3.2.4 | |

### Backend (NOT YET INTEGRATED)

| Service | Purpose | Status |
|---------|---------|--------|
| Supabase | Auth, PostgreSQL, Realtime, Storage | Env vars stubbed, SDK not installed |
| Mux | Live streaming + VOD | Env vars stubbed, SDK not installed |

---

## Project Structure

```
src/
├── pages/
│   ├── Index.tsx              # Landing page (hero, features, CTA)
│   ├── Login.tsx              # Email/password login (non-functional)
│   ├── Signup.tsx             # Account creation (non-functional)
│   ├── CreateCommunity.tsx    # Community creation form (no persistence)
│   ├── CommunityHome.tsx      # Dashboard (mock trending posts, static live banner)
│   ├── CommunityStreams.tsx   # Stream list (mock data, no video playback)
│   ├── CommunityDiscussions.tsx # Reddit-style post list (mock data)
│   ├── PostDetail.tsx         # Post + flat comments (mock data)
│   ├── CommunityMembers.tsx   # Member list with roles (mock data)
│   ├── CommunitySettings.tsx  # Branding config (no persistence)
│   └── NotFound.tsx           # 404
├── components/
│   ├── CommunityLayout.tsx    # Shared layout (header + bottom nav)
│   ├── NavLink.tsx            # Navigation link wrapper
│   └── ui/                    # 51 shadcn/ui components
├── hooks/
│   ├── use-toast.ts           # Toast notifications
│   └── use-mobile.tsx         # Mobile detection (768px breakpoint)
├── lib/
│   └── utils.ts               # Utility functions (cn helper)
├── assets/
│   └── logo.png               # Lab Partner logo
├── App.tsx                    # Root component + route definitions
├── main.tsx                   # React entry point
└── index.css                  # Global styles + CSS variables
```

---

## Routes

```
/                              → Landing page
/login                         → Login (non-functional)
/signup                        → Signup (non-functional)
/create-community              → Community creation form
/c/:slug                       → Community home dashboard
/c/:slug/streams               → Streams list
/c/:slug/discussions           → Discussion posts
/c/:slug/discussions/:postId   → Post detail + comments
/c/:slug/members               → Members list
/c/:slug/settings              → Community settings (owner only)
*                              → 404
```

---

## Database Schema (to be implemented in Supabase)

```sql
communities (id, name, slug, logo_url, primary_color, secondary_color, owner_id, welcome_message, is_active)
members     (id, user_id, community_id, status, role, last_active_at) — UNIQUE(user_id, community_id)
streams     (id, community_id, creator_id, title, description, status, mux_stream_id, mux_playback_id, is_members_only)
posts       (id, community_id, author_id, title, body, is_pinned, upvotes)
comments    (id, post_id, author_id, body, upvotes) — flat, not threaded
votes       (id, member_id, votable_type, votable_id, value) — UNIQUE(member_id, votable_type, votable_id)
```

RLS policies required on all tables.

---

## Design System

### Colors (CSS Variables)
```
--background:    #1a1f2e (dark)
--foreground:    #e8ecf1 (light text)
--primary:       #2F80ED (blue)
--secondary:     #4169B5 (darker blue)
--accent:        #64C8FF (light blue)
--destructive:   #ff4444 (red)
--muted:         #475569 (gray)
```

### Fonts
- **Display:** Space Grotesk (700, 600, 500, 400)
- **Body:** DM Sans (700, 600, 500, 400)

### Components
- Using shadcn/ui (51 Radix-based components)
- Buttons: Blue gradient primary, transparent secondary, red destructive
- Cards: Dark surface, subtle border, rounded corners, hover shadow
- Forms: Clean inputs with focus blue outline

---

## API Integrations

| Service | Purpose | Status |
|---------|---------|--------|
| Supabase Auth | Email/password authentication, session management | Not integrated — SDK not installed |
| Supabase Database | PostgreSQL for all data (communities, posts, comments, votes) | Not integrated |
| Supabase Realtime | Live updates for posts/comments/votes | Not integrated |
| Supabase Storage | Logo and image uploads | Not integrated |
| Mux API | Live stream creation, RTMP credentials, playback IDs | Not integrated — SDK not installed |
| Mux Player | Video playback (live + VOD) | Not integrated |

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
MUX_TOKEN_ID=
MUX_TOKEN_SECRET=
```

---

## Next Features to Build

### Phase 1: Backend Foundation
1. Install `@supabase/supabase-js` and create Supabase client
2. Implement auth context with session management
3. Wire up login/signup forms to Supabase Auth
4. Add protected route wrapper
5. Create database tables and RLS policies in Supabase
6. Replace mock data with real queries (posts, comments, members)

### Phase 2: Core Functionality
1. Install `@mux/mux-player-react` and integrate Mux API
2. Build "Go Live" flow with RTMP credential display
3. Add stream player with live/VOD playback
4. Wire up voting system with persistence
5. Add Supabase Realtime subscriptions
6. Implement file upload for community logos

### Phase 3: Polish
1. Add error boundaries and error UI states
2. Add loading states and skeleton loaders
3. Add form validation with user-facing error messages
4. Enable TypeScript strict mode and fix type issues
5. Mobile responsiveness improvements

---

## NPM Scripts

```
npm run dev        # Start Vite dev server (port 8080)
npm run build      # Production build
npm run build:dev  # Dev mode build
npm run lint       # ESLint
npm run preview    # Preview production build
npm test           # Run tests once
npm run test:watch # Watch mode testing
```

---

## Path Alias

`@/` maps to `./src/` (configured in vite.config.ts and tsconfig)
