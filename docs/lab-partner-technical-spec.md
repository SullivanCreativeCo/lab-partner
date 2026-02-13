# Lab Partner | Technical Specification

**Version:** 1.0  
**Date:** February 13, 2026  
**Owner:** Keegan (Keegareaux Labs)  
**Status:** Planning Phase

---

## Executive Summary

This document defines the technical architecture for Lab Partner, a white-label community platform. The system is built as a multi-tenant SaaS application where each influencer gets an isolated, branded instance while sharing underlying infrastructure.

**Key Technical Decisions:**
- Multi-tenant PostgreSQL database with row-level security
- Next.js 14+ with App Router for frontend
- Supabase for auth, real-time, and database
- Mux for live streaming infrastructure
- Vercel for hosting and edge functions

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND LAYER                           │
│  Next.js 14 App Router | TailwindCSS | shadcn/ui            │
│  (Deployed on Vercel Edge)                                   │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ├─── REST API (Next.js API Routes)
                   ├─── Real-time (Supabase Realtime/WebSocket)
                   └─── CDN (Static Assets)
                   │
┌──────────────────┴──────────────────────────────────────────┐
│                     BACKEND SERVICES                         │
├──────────────────────────────────────────────────────────────┤
│  Authentication  │  Supabase Auth (email, OAuth)            │
│  Database        │  PostgreSQL (Supabase)                    │
│  Real-time       │  Supabase Realtime (messages, presence)  │
│  File Storage    │  Supabase Storage (images, logos)        │
│  Streaming       │  Mux (live + VOD)                        │
│  Email           │  Resend (transactional emails)           │
└──────────────────────────────────────────────────────────────┘
                   │
┌──────────────────┴──────────────────────────────────────────┐
│                     INFRASTRUCTURE                           │
├──────────────────────────────────────────────────────────────┤
│  Hosting         │  Vercel (serverless functions)           │
│  CDN             │  Vercel Edge Network                      │
│  Monitoring      │  Vercel Analytics + Sentry               │
│  DNS/Domains     │  Vercel Domains (white-label)            │
└──────────────────────────────────────────────────────────────┘
```

---

## Database Schema

### Core Entities

#### 1. Communities (Influencer Instances)

```sql
CREATE TABLE communities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Identity
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- URL-safe identifier
  custom_domain TEXT UNIQUE, -- e.g., community.influencer.com
  
  -- Branding
  logo_url TEXT,
  primary_color TEXT DEFAULT '#3B82F6',
  secondary_color TEXT DEFAULT '#1E40AF',
  accent_color TEXT DEFAULT '#10B981',
  
  -- Settings
  is_active BOOLEAN DEFAULT true,
  is_invite_only BOOLEAN DEFAULT false,
  welcome_message TEXT,
  
  -- Owner
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Metadata
  settings JSONB DEFAULT '{}',
  
  CONSTRAINT slug_format CHECK (slug ~* '^[a-z0-9-]+$')
);

CREATE INDEX idx_communities_slug ON communities(slug);
CREATE INDEX idx_communities_owner ON communities(owner_id);
CREATE INDEX idx_communities_domain ON communities(custom_domain);
```

---

#### 2. Members (Lab Partners)

```sql
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Identity
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  
  -- Status
  status TEXT DEFAULT 'pending', -- pending, active, banned
  role TEXT DEFAULT 'member', -- member, moderator, admin
  
  -- Tier
  tier TEXT DEFAULT 'free', -- free, paid_basic, paid_premium
  tier_started_at TIMESTAMP WITH TIME ZONE,
  
  -- Engagement
  total_posts INTEGER DEFAULT 0,
  total_comments INTEGER DEFAULT 0,
  total_upvotes INTEGER DEFAULT 0,
  last_active_at TIMESTAMP WITH TIME ZONE,
  
  -- Badges (array of badge IDs)
  badges TEXT[] DEFAULT '{}',
  
  UNIQUE(user_id, community_id)
);

CREATE INDEX idx_members_community ON members(community_id);
CREATE INDEX idx_members_user ON members(user_id);
CREATE INDEX idx_members_status ON members(community_id, status);
CREATE INDEX idx_members_active ON members(last_active_at);
```

---

#### 3. Streams

```sql
CREATE TABLE streams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ownership
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Stream Info
  title TEXT NOT NULL,
  description TEXT,
  
  -- Status
  status TEXT DEFAULT 'scheduled', -- scheduled, live, ended, archived
  scheduled_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  
  -- Mux Integration
  mux_stream_id TEXT,
  mux_stream_key TEXT,
  mux_playback_id TEXT,
  mux_asset_id TEXT, -- for VOD replay
  
  -- Metrics
  peak_viewers INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  duration_seconds INTEGER DEFAULT 0,
  
  -- Settings
  is_members_only BOOLEAN DEFAULT true,
  allow_chat BOOLEAN DEFAULT true,
  
  CONSTRAINT valid_status CHECK (status IN ('scheduled', 'live', 'ended', 'archived'))
);

CREATE INDEX idx_streams_community ON streams(community_id);
CREATE INDEX idx_streams_status ON streams(status);
CREATE INDEX idx_streams_scheduled ON streams(scheduled_at);
```

---

#### 4. Posts (Discussion Threads)

```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ownership
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  author_id UUID REFERENCES members(id) ON DELETE CASCADE,
  
  -- Content
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  
  -- Type
  post_type TEXT DEFAULT 'discussion', -- discussion, announcement, question
  
  -- Status
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  is_hidden BOOLEAN DEFAULT false,
  
  -- Engagement
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  
  -- Sorting scores (calculated)
  hot_score FLOAT DEFAULT 0,
  trending_score FLOAT DEFAULT 0,
  
  -- Media
  image_urls TEXT[] DEFAULT '{}',
  
  CONSTRAINT valid_post_type CHECK (post_type IN ('discussion', 'announcement', 'question'))
);

CREATE INDEX idx_posts_community ON posts(community_id);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_posts_hot ON posts(hot_score DESC);
CREATE INDEX idx_posts_trending ON posts(trending_score DESC);
CREATE INDEX idx_posts_pinned ON posts(is_pinned, created_at DESC);
```

---

#### 5. Comments

```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ownership
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES members(id) ON DELETE CASCADE,
  
  -- Threading
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  thread_path TEXT, -- materialized path for efficient queries
  depth INTEGER DEFAULT 0,
  
  -- Content
  body TEXT NOT NULL,
  
  -- Status
  is_hidden BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  
  -- Engagement
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0
);

CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_author ON comments(author_id);
CREATE INDEX idx_comments_parent ON comments(parent_comment_id);
CREATE INDEX idx_comments_thread ON comments(thread_path);
CREATE INDEX idx_comments_created ON comments(created_at DESC);
```

---

#### 6. Votes

```sql
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ownership
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  
  -- Target
  votable_type TEXT NOT NULL, -- 'post' or 'comment'
  votable_id UUID NOT NULL,
  
  -- Vote
  value INTEGER NOT NULL, -- 1 for upvote, -1 for downvote
  
  UNIQUE(member_id, votable_type, votable_id),
  CONSTRAINT valid_vote CHECK (value IN (-1, 1)),
  CONSTRAINT valid_type CHECK (votable_type IN ('post', 'comment'))
);

CREATE INDEX idx_votes_member ON votes(member_id);
CREATE INDEX idx_votes_target ON votes(votable_type, votable_id);
```

---

#### 7. Notifications

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Target
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  
  -- Content
  type TEXT NOT NULL, -- comment_reply, post_reply, upvote, stream_live, etc.
  title TEXT NOT NULL,
  body TEXT,
  
  -- Link
  action_url TEXT,
  
  -- Status
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  
  -- Context
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_notifications_member ON notifications(member_id);
CREATE INDEX idx_notifications_unread ON notifications(member_id, is_read, created_at DESC);
```

---

#### 8. Moderation Actions

```sql
CREATE TABLE moderation_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ownership
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  moderator_id UUID REFERENCES members(id) ON DELETE SET NULL,
  
  -- Target
  target_type TEXT NOT NULL, -- member, post, comment
  target_id UUID NOT NULL,
  
  -- Action
  action TEXT NOT NULL, -- hide, delete, ban, warn
  reason TEXT,
  
  -- Auto-reverse (for temporary bans)
  expires_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT valid_action CHECK (action IN ('hide', 'delete', 'ban', 'warn', 'approve'))
);

CREATE INDEX idx_moderation_community ON moderation_actions(community_id);
CREATE INDEX idx_moderation_target ON moderation_actions(target_type, target_id);
CREATE INDEX idx_moderation_expires ON moderation_actions(expires_at);
```

---

## Row-Level Security (RLS)

### Multi-Tenant Isolation

Each community's data is isolated using PostgreSQL RLS policies. Users can only access data for communities they're members of.

```sql
-- Enable RLS on all tables
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE streams ENABLE ROW LEVEL SECURITY;

-- Example: Members can only see posts in their communities
CREATE POLICY "Members see posts in their communities"
ON posts FOR SELECT
USING (
  community_id IN (
    SELECT community_id 
    FROM members 
    WHERE user_id = auth.uid() 
    AND status = 'active'
  )
);

-- Example: Only community owners can update settings
CREATE POLICY "Owners manage their communities"
ON communities FOR UPDATE
USING (owner_id = auth.uid());
```

---

## API Architecture

### REST API Endpoints

**Authentication:** All endpoints require authentication except public landing pages.

#### Communities

```
GET    /api/communities/:slug              # Get community info
PUT    /api/communities/:slug              # Update community (owner only)
GET    /api/communities/:slug/members      # List members
POST   /api/communities/:slug/join         # Request to join
```

#### Streams

```
GET    /api/communities/:slug/streams           # List streams
POST   /api/communities/:slug/streams           # Create stream (owner only)
GET    /api/communities/:slug/streams/:id       # Get stream details
PUT    /api/communities/:slug/streams/:id       # Update stream
DELETE /api/communities/:slug/streams/:id       # Delete stream
POST   /api/communities/:slug/streams/:id/start # Start live stream
POST   /api/communities/:slug/streams/:id/end   # End live stream
```

#### Posts

```
GET    /api/communities/:slug/posts        # List posts (with filters)
POST   /api/communities/:slug/posts        # Create post
GET    /api/communities/:slug/posts/:id    # Get post details
PUT    /api/communities/:slug/posts/:id    # Update post
DELETE /api/communities/:slug/posts/:id    # Delete post
POST   /api/communities/:slug/posts/:id/vote  # Vote on post
```

#### Comments

```
GET    /api/posts/:id/comments             # List comments for post
POST   /api/posts/:id/comments             # Create comment
PUT    /api/comments/:id                   # Update comment
DELETE /api/comments/:id                   # Delete comment
POST   /api/comments/:id/vote              # Vote on comment
```

---

### Real-Time Subscriptions (Supabase Realtime)

```javascript
// Subscribe to new posts in community
supabase
  .channel(`community:${communityId}:posts`)
  .on('postgres_changes', 
    { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'posts',
      filter: `community_id=eq.${communityId}`
    },
    (payload) => handleNewPost(payload.new)
  )
  .subscribe()

// Subscribe to comments on a post
supabase
  .channel(`post:${postId}:comments`)
  .on('postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'comments',
      filter: `post_id=eq.${postId}`
    },
    (payload) => handleNewComment(payload.new)
  )
  .subscribe()

// Subscribe to stream status changes
supabase
  .channel(`stream:${streamId}:status`)
  .on('postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'streams',
      filter: `id=eq.${streamId}`
    },
    (payload) => handleStreamUpdate(payload.new)
  )
  .subscribe()
```

---

## Live Streaming Infrastructure

### Mux Integration

**Why Mux:**
- Simple API for live streaming
- Automatic transcoding and ABR (adaptive bitrate)
- Built-in VOD conversion
- Predictable pricing
- Excellent developer experience

**Architecture:**

```
┌─────────────────────────────────────────────────────┐
│ 1. Influencer clicks "Go Live"                      │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│ 2. Backend creates Mux live stream                  │
│    POST https://api.mux.com/video/v1/live-streams   │
│    Returns: stream_key, playback_id                 │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│ 3. Influencer broadcasts to RTMP endpoint           │
│    rtmp://global-live.mux.com:5222/app/{stream_key} │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│ 4. Partners watch via HLS player                    │
│    https://stream.mux.com/{playback_id}.m3u8        │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│ 5. Stream ends, Mux creates VOD asset               │
│    Webhook: video.asset.ready                       │
│    Store asset_id for replay                        │
└─────────────────────────────────────────────────────┘
```

**Code Example:**

```typescript
// Create live stream
const createStream = async (communityId: string, title: string) => {
  // Create Mux live stream
  const muxStream = await mux.video.liveStreams.create({
    playback_policy: ['public'],
    new_asset_settings: {
      playback_policy: ['public']
    }
  });

  // Save to database
  const stream = await db.streams.insert({
    community_id: communityId,
    title: title,
    status: 'live',
    mux_stream_id: muxStream.id,
    mux_stream_key: muxStream.stream_key,
    mux_playback_id: muxStream.playback_ids[0].id,
    started_at: new Date()
  });

  return stream;
};

// Watch stream (frontend)
<MuxPlayer
  playbackId={stream.mux_playback_id}
  metadata={{
    video_title: stream.title,
  }}
  streamType="live"
/>
```

**Mux Webhooks:**

```typescript
// Handle Mux webhooks
POST /api/webhooks/mux

Events to handle:
- video.live_stream.active → Update stream status to 'live'
- video.live_stream.idle → Update stream status to 'ended'
- video.asset.ready → Store asset_id for replay
- video.asset.deleted → Clean up references
```

---

## Frontend Architecture

### Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Components:** shadcn/ui
- **State:** React Context + Zustand (for complex state)
- **Forms:** React Hook Form + Zod validation
- **Real-time:** Supabase client
- **Video:** Mux Player React

### Folder Structure

```
/app
  /(auth)
    /login
    /signup
  /(community)
    /[slug]
      /page.tsx              # Community home
      /streams
        /page.tsx            # Stream list
        /[id]/page.tsx       # Stream player
      /discussions
        /page.tsx            # Posts list
        /[id]/page.tsx       # Post detail
      /members
        /page.tsx            # Members list
  /(admin)
    /[slug]
      /settings
        /page.tsx            # Community settings
      /moderation
        /page.tsx            # Moderation queue
/components
  /ui                        # shadcn/ui components
  /community
    /StreamPlayer.tsx
    /PostCard.tsx
    /CommentThread.tsx
  /admin
    /BrandingForm.tsx
/lib
  /supabase.ts              # Supabase client
  /mux.ts                   # Mux client
  /utils.ts                 # Utilities
/types
  /database.ts              # Database types (auto-generated)
```

---

## White-Label Implementation

### Multi-Tenant Routing

**Option 1: Subdomain-based** (recommended for MVP)
```
{slug}.labpartner.com → Routes to community by slug
Example: sarah.labpartner.com
```

**Option 2: Custom domain** (Phase 2)
```
community.influencer.com → Routes to community by domain
Requires DNS CNAME: community.influencer.com → cname.labpartner.com
```

### Implementation:

```typescript
// middleware.ts
import { NextResponse } from 'next/server';

export function middleware(req: Request) {
  const url = new URL(req.url);
  const hostname = req.headers.get('host');
  
  // Extract community slug from subdomain
  const slug = hostname?.split('.')[0];
  
  if (slug && slug !== 'www' && slug !== 'labpartner') {
    // Rewrite to community page
    url.pathname = `/c/${slug}${url.pathname}`;
    return NextResponse.rewrite(url);
  }
  
  return NextResponse.next();
}
```

### Dynamic Theming

```typescript
// Load community branding
const { data: community } = await supabase
  .from('communities')
  .select('primary_color, secondary_color, accent_color, logo_url')
  .eq('slug', slug)
  .single();

// Apply CSS variables
<style>{`
  :root {
    --primary: ${community.primary_color};
    --secondary: ${community.secondary_color};
    --accent: ${community.accent_color};
  }
`}</style>
```

---

## Security Model

### Authentication Flow

```
1. User signs up → Supabase Auth creates user
2. User joins community → Member record created with status 'pending'
3. Influencer approves → Status updated to 'active'
4. User accesses content → RLS checks membership status
```

### Permission Levels

```typescript
enum Role {
  MEMBER = 'member',      // Can view, post, comment
  MODERATOR = 'moderator', // + can hide/delete content
  ADMIN = 'admin',        // + can manage members
  OWNER = 'owner'         // + can manage settings, branding
}
```

### API Authorization

```typescript
// Check if user can perform action
const canModerate = async (userId: string, communityId: string) => {
  const { data } = await supabase
    .from('members')
    .select('role')
    .eq('user_id', userId)
    .eq('community_id', communityId)
    .single();
  
  return ['moderator', 'admin', 'owner'].includes(data?.role);
};
```

---

## Performance Optimizations

### Database Optimizations

1. **Indexes on foreign keys and frequently queried columns**
2. **Materialized views for complex queries** (hot/trending calculations)
3. **Pagination using cursor-based approach** (better than offset)
4. **Database connection pooling** (Supabase handles this)

### Frontend Optimizations

1. **Code splitting:** Dynamic imports for heavy components
2. **Image optimization:** Next.js Image component
3. **Caching:** React Query for API calls
4. **Lazy loading:** Virtual scrolling for long lists
5. **Edge caching:** Static pages cached at CDN

### Streaming Optimizations

1. **Adaptive bitrate:** Mux handles automatically
2. **CDN distribution:** Mux streams from edge locations
3. **Low latency mode:** Enable for <10s delay
4. **Bandwidth estimation:** Adjust quality based on connection

---

## Deployment Strategy

### Environment Setup

```
Development → localhost + Supabase local
Staging → Vercel preview + Supabase staging
Production → Vercel production + Supabase production
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run build
      - run: npm run test
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### Database Migrations

```bash
# Using Supabase CLI
supabase migration new add_badges_to_members
supabase db push
```

---

## Monitoring & Analytics

### Application Monitoring

- **Vercel Analytics:** Page views, web vitals
- **Sentry:** Error tracking and performance monitoring
- **Supabase Logs:** Database queries and slow queries

### Business Metrics

Track in admin dashboard:
- Daily/Weekly/Monthly active members
- Stream view counts and duration
- Post/comment engagement rates
- Member retention cohorts
- Revenue (if paid tiers enabled)

### Alerts

- Error rate > 1%
- API latency > 2s (p95)
- Database connection pool exhausted
- Stream failure rate > 5%

---

## Scalability Considerations

### Current Limits (MVP)

- 100 communities
- 1,000 members per community
- 100 concurrent stream viewers per community
- 10,000 posts per community

### Scaling Strategy

**Phase 1 (0-100 communities):**
- Single Supabase instance
- Vercel serverless functions
- Mux standard tier

**Phase 2 (100-1,000 communities):**
- Supabase read replicas
- Increase Mux quota
- Implement caching layer (Redis)

**Phase 3 (1,000+ communities):**
- Database sharding by community
- Dedicated infrastructure for high-traffic communities
- Enterprise Mux plan

---

## Cost Estimates (Monthly)

### MVP Phase (5 communities, 500 members total)

```
Supabase (Free tier)           $0
Vercel (Hobby tier)            $20
Mux (Pay-as-you-go)            ~$50 (10 hours streaming/month)
Resend (Free tier)             $0
Domain (labpartner.com)        $12/year

Total: ~$70/month
```

### Growth Phase (50 communities, 5,000 members)

```
Supabase (Pro tier)            $25
Vercel (Pro tier)              $20
Mux (Pay-as-you-go)            ~$500 (100 hours streaming/month)
Resend (Paid tier)             $10
Custom domains                 Included in pricing to influencers

Total: ~$555/month
```

---

## Technology Alternatives Considered

### Streaming

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| **Mux** | Simple API, VOD built-in, reliable | Higher cost at scale | ✅ Chosen |
| Agora | Lower latency, more control | Complex setup, manual VOD | ❌ |
| AWS IVS | AWS ecosystem, scalable | Steeper learning curve | ❌ |
| Twitch API | Free, established | Not white-labelable | ❌ |

### Database

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| **Supabase** | Postgres, real-time, auth included | Vendor lock-in | ✅ Chosen |
| Firebase | Real-time, easy setup | NoSQL limitations | ❌ |
| PlanetScale | Excellent scaling | No real-time built-in | ❌ |
| Raw Postgres | Full control | More infrastructure work | ❌ |

### Hosting

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| **Vercel** | Next.js optimized, edge functions | Limited background jobs | ✅ Chosen |
| Railway | Simple deployment | Less mature edge network | ❌ |
| AWS | Complete control | Complex, expensive | ❌ |

---

## Open Technical Questions

1. **Chat during streams:** Real-time chat via Supabase or dedicated solution (e.g., Stream Chat)?
2. **Search:** Full-text search in Postgres or dedicated (Algolia, Meilisearch)?
3. **Image uploads:** Supabase Storage sufficient or need CDN (Cloudinary)?
4. **Email templates:** Build custom or use service (SendGrid, Mailgun)?
5. **Analytics:** Build custom dashboards or integrate third-party (Mixpanel, Amplitude)?
6. **Mobile streaming:** Web-based streaming (WebRTC) or require OBS/Streamlabs?
7. **Backup strategy:** Automated daily backups via Supabase sufficient?
8. **Rate limiting:** Application-level or rely on Vercel's built-in?

---

## Development Phases

### Phase 1: Foundation (Weeks 1-2)
- Set up Next.js project with TypeScript
- Configure Supabase (database, auth)
- Implement authentication flow
- Create basic database schema
- Set up multi-tenant routing

### Phase 2: Core Features (Weeks 3-6)
- Build streaming infrastructure (Mux integration)
- Implement discussion threads (posts, comments, votes)
- Add real-time updates (Supabase Realtime)
- Create moderation tools
- Build white-label customization UI

### Phase 3: Polish (Weeks 7-8)
- Implement notifications
- Add member profiles and badges
- Create analytics dashboard
- Performance optimization
- Security audit

### Phase 4: Launch Prep (Week 9-10)
- Landing page and marketing site
- Documentation and onboarding flow
- Testing with pilot influencers
- Bug fixes and refinements
- Production deployment

---

## Next Steps

1. **Set up development environment**
   - Initialize Next.js project
   - Configure Supabase project
   - Set up Mux account

2. **Start with authentication**
   - Implement login/signup
   - Set up Supabase Auth
   - Create user profiles

3. **Build first feature: Streaming**
   - Integrate Mux
   - Create stream player
   - Test end-to-end flow

4. **Iterate based on pilot feedback**

---

**Document Owner:** Keegan  
**Last Updated:** February 13, 2026  
**Next Review:** After development begins
