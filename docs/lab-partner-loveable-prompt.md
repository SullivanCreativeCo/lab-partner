# Lab Partner - Loveable Initial Prompt

## Project Overview

Build "Lab Partner" - a white-label community platform that enables influencers to own their audience through live streaming and Reddit-style discussions. Each influencer gets their own branded instance (custom colors, logo) where they can stream exclusively to their "Lab Partners" (members) and foster discussions.

**Core value proposition:** Turn followers into partners. Stop renting attention on platforms you don't control.

---

## Tech Stack Requirements

**Frontend:**
- Next.js 14+ with App Router
- TypeScript
- TailwindCSS
- shadcn/ui components

**Backend:**
- Supabase (PostgreSQL database, Auth, Realtime, Storage)
- Mux for live streaming
- Vercel for hosting

**Key integrations:**
- Mux for live video streaming
- Supabase Realtime for live updates
- Supabase Auth for authentication

---

## Database Schema

### Core Tables

```sql
-- Communities (each influencer's branded instance)
CREATE TABLE communities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  
  -- Branding
  logo_url TEXT,
  primary_color TEXT DEFAULT '#2F80ED',
  secondary_color TEXT DEFAULT '#4169B5',
  
  -- Settings
  is_active BOOLEAN DEFAULT true,
  welcome_message TEXT,
  
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Members (Lab Partners in communities)
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  
  status TEXT DEFAULT 'active',
  role TEXT DEFAULT 'member',
  
  last_active_at TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(user_id, community_id)
);

-- Streams
CREATE TABLE streams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  description TEXT,
  
  status TEXT DEFAULT 'scheduled',
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  
  -- Mux integration
  mux_stream_id TEXT,
  mux_playback_id TEXT,
  
  is_members_only BOOLEAN DEFAULT true
);

-- Posts (discussions)
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  author_id UUID REFERENCES members(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  
  is_pinned BOOLEAN DEFAULT false,
  
  upvotes INTEGER DEFAULT 0
);

-- Comments (flat for MVP, not threaded)
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES members(id) ON DELETE CASCADE,
  
  body TEXT NOT NULL,
  
  upvotes INTEGER DEFAULT 0
);

-- Votes
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  votable_type TEXT NOT NULL,
  votable_id UUID NOT NULL,
  
  value INTEGER NOT NULL,
  
  UNIQUE(member_id, votable_type, votable_id)
);
```

Enable Row Level Security (RLS) on all tables with appropriate policies.

---

## MVP Feature Requirements (Week 1-4)

### Week 1: Foundation

**Authentication:**
- Email/password signup and login (use Supabase Auth)
- User profile creation
- Password reset functionality

**Basic UI:**
- Landing page with hero section
- Login/signup pages
- Simple navigation header
- Responsive layout (mobile-friendly)

**Database setup:**
- Create all core tables
- Set up RLS policies
- Basic indexes

---

### Week 2: Communities + Streaming

**Community Management:**
- Create community form (name, slug, welcome message)
- Community settings page
- Branding customization:
  - Color picker for primary and secondary colors
  - Logo upload (Supabase Storage)
  - Preview of branding changes
- Route structure: `/c/[slug]` for each community

**Streaming Integration:**
- Integration with Mux API for live streaming
- "Go Live" button for community owners
- Stream creation modal (title, description)
- Stream player using Mux Player React component
- Automatic VOD replay after stream ends
- Simple stream list showing upcoming/past streams

**Member Management:**
- Simple member invitation (email list input)
- Auto-approve members for testing (no workflow)
- Member list view showing all Lab Partners

---

### Week 3: Discussions

**Posts:**
- Create post form (title + body, text only)
- Post list view (newest first)
- Post detail page
- Upvote button (no downvote for MVP)
- Delete post button (for post author and community owner)

**Comments:**
- Add comment form on post detail page
- Flat comment list (not threaded)
- Upvote button on comments
- Delete comment button

**Real-time updates:**
- Use Supabase Realtime for live post/comment updates
- New posts appear automatically
- New comments appear automatically
- Vote counts update in real-time

---

### Week 4: Polish

**Navigation:**
- Community sidebar with:
  - Streams link
  - Discussions link
  - Members link
  - Settings link (owner only)
- Top navigation bar with:
  - Community logo and name
  - User menu (profile, logout)

**Moderation:**
- Delete posts (owner and moderators)
- Delete comments (owner and moderators)
- Remove members from community

**Mobile Responsive:**
- Works on mobile (doesn't need to be perfect)
- Hamburger menu for mobile navigation
- Touch-friendly buttons

**Basic polish:**
- Loading states
- Error messages
- Empty states (no posts yet, no streams)
- Success confirmations

---

## Design System

### Colors (from Lab Partner brand)

```css
--color-primary: #2F80ED;
--color-secondary: #4169B5;
--color-accent: #56CCF2;

--color-bg-light: #F8FAFB;
--color-surface: #FFFFFF;
--color-border: #E2E8F0;

--color-text-primary: #1A202C;
--color-text-secondary: #718096;

--color-success: #48BB78;
--color-error: #F56565;
```

### Typography

- Font: Inter (import from Google Fonts)
- Headings: 700 weight (bold)
- Body: 400 weight (regular)
- Use TailwindCSS default type scale

### Component Patterns

**Buttons:**
- Primary: Blue gradient background, white text, rounded corners
- Secondary: Transparent with blue border
- Destructive: Red background for delete actions

**Cards:**
- White background
- Subtle border (gray)
- Rounded corners (12px)
- Slight shadow on hover

**Forms:**
- Clean input fields with border
- Focus state with blue outline
- Clear labels above inputs
- Error messages in red below fields

---

## Routing Structure

```
/ → Landing page
/login → Login page
/signup → Signup page

/c/[slug] → Community home (shows recent streams and posts)
/c/[slug]/streams → Stream list
/c/[slug]/streams/[id] → Stream player/detail
/c/[slug]/discussions → Post list
/c/[slug]/discussions/[id] → Post detail with comments
/c/[slug]/members → Member list
/c/[slug]/settings → Community settings (owner only)

/create-community → Community creation flow
```

---

## User Flows

### Flow 1: Influencer Creates Community

1. Sign up / Log in
2. Click "Create Community"
3. Fill in form (name, slug, welcome message)
4. Customize branding (colors, logo)
5. Preview community
6. Click "Create"
7. Redirected to `/c/[slug]`
8. See onboarding tips (invite members, create first stream)

### Flow 2: Influencer Goes Live

1. Navigate to `/c/[slug]/streams`
2. Click "Go Live"
3. Fill in stream details (title, description)
4. Click "Start Stream"
5. Get RTMP credentials (copy to OBS/Streamlabs)
6. Start broadcasting
7. Stream appears live for members
8. Click "End Stream" when done
9. VOD automatically available for replay

### Flow 3: Lab Partner Joins Discussion

1. Receive invite link from influencer
2. Sign up / Log in
3. Auto-added to community
4. Navigate to `/c/[slug]/discussions`
5. Click on a post
6. Read post and comments
7. Add comment
8. Upvote post/comments
9. See updates in real-time

### Flow 4: Lab Partner Watches Stream

1. Navigate to `/c/[slug]/streams`
2. See list of upcoming/live/past streams
3. Click on live stream
4. Watch stream in Mux Player
5. Stream ends, automatically switches to VOD replay

---

## Key Implementation Notes

### Supabase Setup

1. Create Supabase project
2. Run schema SQL to create tables
3. Enable RLS on all tables
4. Create policies:
   - Users can read communities they're members of
   - Community owners can update their communities
   - Members can create posts in their communities
   - Post authors can delete their own posts
   - Community owners can delete any post in their community

### Mux Integration

1. Sign up for Mux account
2. Get API credentials
3. Store in environment variables:
   - `MUX_TOKEN_ID`
   - `MUX_TOKEN_SECRET`
4. Create live stream via API when user clicks "Go Live"
5. Return stream key and playback ID
6. Use Mux Player React component for playback

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
MUX_TOKEN_ID=
MUX_TOKEN_SECRET=
```

---

## Success Criteria for Loveable Build

**Must have working:**
- User can sign up and log in
- User can create a community
- User can customize community branding (colors, logo)
- Community owner can go live and get RTMP credentials
- Members can watch live streams
- Members can view VOD replays
- Members can create posts and comments
- Members can upvote posts and comments
- Real-time updates work for posts/comments
- Mobile responsive layout

**Can be basic/minimal:**
- UI design (functional over beautiful)
- Error handling (just show errors, don't need fancy)
- Loading states (simple spinners are fine)
- Empty states (simple text messages)

**Not needed in Loveable build:**
- Email notifications
- Advanced moderation tools
- Analytics dashboard
- Search functionality
- Image uploads
- Threaded comments (flat is fine)
- Member approval workflow (auto-approve)
- Subdomain routing (path-based is fine)

---

## Initial Prompt for Loveable

Use this prompt to start the Loveable project:

```
Build a white-label community platform called "Lab Partner" where influencers can create branded communities, live stream to members, and host Reddit-style discussions.

Tech stack: Next.js 14 with App Router, TypeScript, TailwindCSS, shadcn/ui, Supabase (auth + database + realtime), Mux (streaming).

Core features needed:
1. Auth system (Supabase Auth - email/password)
2. Community creation with branding (colors, logo upload)
3. Live streaming integration (Mux API)
4. Discussion posts with flat comments
5. Upvoting system
6. Real-time updates (Supabase Realtime)

Database schema:
- communities (id, name, slug, logo_url, primary_color, secondary_color, owner_id)
- members (id, user_id, community_id, status, role)
- streams (id, community_id, title, status, mux_stream_id, mux_playback_id)
- posts (id, community_id, author_id, title, body, upvotes)
- comments (id, post_id, author_id, body, upvotes)
- votes (id, member_id, votable_type, votable_id, value)

Routing:
- / = landing page
- /c/[slug] = community home
- /c/[slug]/streams = stream list
- /c/[slug]/discussions = post list
- /c/[slug]/settings = community settings

Design: Use Inter font, blue color scheme (#2F80ED primary, #4169B5 secondary), clean modern UI with cards and rounded corners.

Start by building the authentication and community creation flow.
```

---

## Next Steps After Loveable Build

1. Test everything manually
2. Fix critical bugs
3. Deploy to Vercel
4. Set up Mux account and add credentials
5. Set up Supabase project and run migrations
6. Onboard first pilot influencer
7. Gather feedback and iterate

---

**Created:** February 13, 2026  
**Owner:** Keegan  
**Use:** Copy the "Initial Prompt for Loveable" section to start your Loveable project
