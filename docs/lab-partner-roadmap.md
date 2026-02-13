# Lab Partner | Feature Roadmap

**Version:** 1.0  
**Date:** February 13, 2026  
**Owner:** Keegan (Keegareaux Labs)  
**Status:** Planning Phase

---

## Overview

This roadmap outlines the development phases for Lab Partner, from MVP through scaling. The timeline is flexible and optimized for solo development with quality as the priority over speed.

**Development approach:**
- Build in Loveable initially (rapid prototyping)
- Migrate to Claude Code for production refinement
- Iterative releases with pilot influencer feedback
- Ship features when they're ready, not on arbitrary deadlines

---

## Phase 1: MVP Foundation (Weeks 1-4) - ACCELERATED

**Goal:** Get in hands of pilot influencers for testing within 4 weeks  
**Status:** Planning → Development  
**Estimated Duration:** 4 weeks  
**Strategy:** Build minimum viable features, iterate based on real usage

### Week 1: Foundation (Days 1-7)

**Focus:** Get basic infrastructure working fast

**Deliverables:**
- [ ] Initialize Next.js 14 in Loveable (leverage templates)
- [ ] Set up Supabase (use quickstart, not custom)
- [ ] Implement email auth only (skip OAuth for now)
- [ ] Basic user registration/login
- [ ] Core database schema (communities, members, users only)
- [ ] Simple RLS policies

**Cut from original plan:**
- OAuth (add in Phase 2)
- Complex password rules (use defaults)
- Extensive security hardening (iterate later)

**Technical milestones:**
- Can create account and login
- Database connected
- Deployed to Vercel

**Time allocation:**
- Days 1-2: Loveable setup, Supabase init
- Days 3-5: Auth implementation
- Days 6-7: Database schema, basic deployment

---

### Week 2: Communities + Streaming (Days 8-14)

**Focus:** Core value proposition - communities can go live

**Deliverables:**
- [ ] Community creation (simple form, no validation complexity)
- [ ] Basic branding (color picker, logo upload only)
- [ ] Mux integration (minimal wrapper)
- [ ] Stream creation and "Go Live" button
- [ ] Stream player (use Mux Player React, no customization)
- [ ] Simple member invite (email list, auto-approve for testing)

**Cut from original plan:**
- Subdomain routing (use /c/{slug} paths instead)
- Advanced branding options
- Stream scheduling (manual start only)
- VOD replay (Mux handles automatically, just link to it)
- Stream analytics (Mux provides basics)
- Member approval workflow (auto-approve all for testing)

**Technical milestones:**
- Influencer can create community
- Influencer can go live
- Members can watch stream
- Basic branding works

**Time allocation:**
- Days 8-10: Community setup + branding
- Days 11-14: Mux integration + streaming

**Critical:** Mux setup must happen Day 11 to stay on track

---

### Week 3: Discussions (Days 15-21)

**Focus:** Simple discussion system, iterate based on usage

**Deliverables:**
- [ ] Create posts (title + body, text only)
- [ ] Display posts (simple list, newest first)
- [ ] Add comments (flat, not threaded initially)
- [ ] Basic upvote (no downvote for MVP)
- [ ] Post detail page
- [ ] Real-time updates (Supabase Realtime, basic setup)

**Cut from original plan:**
- Threaded comments (flat list for testing)
- Downvotes (just upvotes)
- Sorting algorithms (newest first only)
- Image uploads (text posts only)
- Complex moderation (just delete button)

**Technical milestones:**
- Can create and view posts
- Can comment on posts
- Upvotes work
- New posts appear in real-time

**Time allocation:**
- Days 15-17: Posts CRUD
- Days 18-19: Comments
- Days 20-21: Voting + real-time

---

### Week 4: Essential Polish + Pilot Launch (Days 22-28)

**Focus:** Make it usable enough for testing, not perfect

**Deliverables:**
- [ ] Basic moderation (delete posts/comments only)
- [ ] Member list view
- [ ] Simple navigation (header, sidebar)
- [ ] Mobile responsive (basic, not perfect)
- [ ] Bug fixes from self-testing
- [ ] Deploy to production
- [ ] Onboard 2-3 pilot influencers (not 5, start smaller)

**Cut from original plan:**
- Advanced moderation tools
- Member banning (just remove from community)
- Moderation queue
- Reporting system
- Spam filtering
- Rate limiting (rely on Supabase defaults)
- Security audit (do after pilot feedback)
- Email notifications (Phase 2)
- Formal onboarding flow (do it manually with pilots)
- Documentation (create as needed)

**Technical milestones:**
- No critical bugs blocking usage
- Works on mobile (doesn't have to be perfect)
- 2-3 communities live
- Ready for real user feedback

**Time allocation:**
- Days 22-24: Moderation + navigation
- Days 25-26: Mobile responsive + bug fixes
- Days 27-28: Pilot onboarding + support

**Success criteria (LOWERED FOR SPEED):**
- 2-3 communities live (not 5)
- 30+ total Lab Partners (not 50)
- 3+ successful live streams (not 5)
- 20+ discussion posts (not 50)
- Can gather meaningful feedback

---

## Phase 1 Feature Summary (4-Week Accelerated MVP)

### ✅ Included in MVP

**Authentication & Accounts:**
- Email login only (no OAuth)
- User profiles (basic)
- Password reset (Supabase default)

**Community Management:**
- Create community (simple form)
- Customize branding (colors, logo only)
- Path-based routing (/c/{slug}, not subdomains)
- Auto-approve members (no workflow)

**Live Streaming:**
- Create streams (no scheduling)
- Go live (RTMP)
- Stream player (Mux default player)
- VOD replay (automatic via Mux)
- Basic analytics (from Mux)

**Discussions:**
- Create posts (text only, no images)
- Flat comments (not threaded)
- Upvote only (no downvote)
- Newest first (no sorting options)

**Moderation:**
- Delete posts and comments
- Remove members

**Notifications:**
- None (Phase 2)

### ❌ Cut from MVP (Move to Phase 2)

**Authentication:**
- OAuth (Google, GitHub)
- Two-factor auth
- Advanced password rules

**Community:**
- Subdomain routing
- Member approval workflow
- Invite system
- Advanced branding options

**Streaming:**
- Stream scheduling
- Custom stream analytics
- Stream announcements

**Discussions:**
- Threaded comments
- Downvotes
- Sorting algorithms (hot, top)
- Image uploads
- Advanced moderation tools
- Reporting system
- Spam filtering

**Features:**
- Email notifications
- In-app notifications
- Fan badges
- Member tiers/paid access
- Analytics dashboard
- Help documentation

### 🎯 Testing Goals (Week 4)

**Minimum viable test:**
- 2 communities active
- 30+ total members
- 3+ live streams completed
- 20+ posts created
- Feedback collected from pilots

**What we're testing:**
- Does streaming work reliably?
- Do people engage in discussions?
- Is the white-label branding sufficient?
- What features do pilots request most?
- What breaks under real usage?

---

## Phase 2: Polish & Essential Features (Weeks 5-8)

**Goal:** Add features cut from MVP, refine based on pilot feedback  
**Status:** Future  
**Estimated Duration:** 4 weeks  
**Trigger:** After collecting feedback from Week 4 pilots

### Week 5: Critical Additions from Pilot Feedback

**Deliverables based on likely feedback:**
- [ ] Threaded comments (pilots will want this)
- [ ] Image uploads in posts
- [ ] Subdomain routing (more professional)
- [ ] Email notifications (basic)
- [ ] Member approval workflow
- [ ] Improved mobile experience

**Priority:** Fix what pilots identify as blockers

**Time allocation:**
- Days 1-2: Feedback synthesis
- Days 3-7: Build top 2-3 requested features

---

### Week 6: Engagement Features

**Deliverables:**
- [ ] Fan badges (tenure, engagement)
- [ ] Downvote functionality
- [ ] Sorting algorithms (hot, top, new)
- [ ] Post pinning
- [ ] Better moderation tools (hide, ban, queue)

**Value:** Increases engagement and gives influencers more control

---

### Week 7: Notifications & Communication

**Deliverables:**
- [ ] Full email notification system
- [ ] In-app notifications
- [ ] Stream announcements
- [ ] Member welcome emails
- [ ] Notification preferences

**Value:** Keeps members engaged and coming back

---

### Week 8: Analytics & Monetization Prep

**Deliverables:**
- [ ] Basic analytics dashboard
- [ ] Member growth tracking
- [ ] Engagement metrics
- [ ] Stripe integration setup
- [ ] Tier structure design

**Value:** Helps influencers understand growth, prepares for revenue

---

## Phase 3: Monetization & Growth (Weeks 9-12)

**Goal:** Enable revenue generation and scale to more communities  
**Status:** Future  
**Estimated Duration:** 4 weeks

### Week 9-10: Paid Tiers & Revenue

**Deliverables:**
- [ ] Stripe payment integration
- [ ] Tier management UI (influencer)
- [ ] Tier-gated content
- [ ] Subscription management (partners)
- [ ] Revenue dashboard
- [ ] Billing/invoicing

**Value:** Core business model validation

**Priority:** High

---

### Week 11-12: Scale Features

**Deliverables:**
- [ ] Custom domains
- [ ] Advanced analytics
- [ ] Performance optimization
- [ ] Caching layer
- [ ] Database optimization

**Value:** Supports larger communities and growth

---

## Phase 4: Integration & Advanced Features (Week 13+)

**Goal:** Dispatch integration, mobile apps, enterprise features  
**Status:** Future  
**Estimated Duration:** Ongoing

### Dispatch Integration (2-3 weeks)

**Features:**
- Dispatch → Lab Partner content sync
- Unified analytics
- Cross-platform scheduling
- Auto-announcements

**Priority:** High (ecosystem play)  
**Dependency:** Dispatch must be stable

---

### Mobile Apps (6-8 weeks)

**Features:**
- React Native apps (iOS + Android)
- Push notifications
- White-label app distribution
- Offline content access

**Priority:** Medium  
**Trigger:** 50+ active communities on web

--- Advanced Moderation

**Features:**
- AI-powered spam detection
- Auto-moderation rules
- Moderator roles and permissions
- Audit logs
- Content filters

**Priority:** Medium  
**Timeline:** 2-3 weeks

---

### Direct Messaging

**Features:**
- 1-on-1 messaging between partners
- Influencer → partner DMs
- Group chats
- Message reactions
- File sharing in DMs

**Priority:** Low-Medium  
**Timeline:** 3-4 weeks

---

### Advanced Analytics

**Features:**
- Cohort analysis
- Retention metrics
- Churn prediction
- A/B testing framework
- Custom reports

**Priority:** Medium  
**Timeline:** 3-4 weeks

---

### API & Integrations

**Features:**
- Public API for third-party apps
- Zapier integration
- Webhooks
- Discord/Slack integration
- Calendar integrations

**Priority:** Low  
**Timeline:** 4-6 weeks

---

### Enterprise Features

**Features:**
- SSO (single sign-on)
- Advanced permissions
- Multi-admin support
- SLA guarantees
- Dedicated infrastructure

**Priority:** Low (only if enterprise demand)  
**Timeline:** 6-8 weeks

---

## Development Methodology

### Sprint Structure

**Sprint length:** 2 weeks

**Sprint activities:**
- Planning (Day 1): Define sprint goals
- Development (Days 2-12): Build features
- Testing (Days 13-14): QA and bug fixes
- Demo (Day 14): Show progress to pilot influencers
- Retrospective (Day 14): Reflect and improve

### Quality Gates

**Before moving to next phase:**
- [ ] All critical features complete
- [ ] No critical bugs
- [ ] Performance benchmarks met
- [ ] Security review passed
- [ ] User testing completed
- [ ] Documentation updated

### Feedback Loops

**Weekly:**
- Check-in with pilot influencers
- Review analytics and usage data
- Triage bug reports

**Monthly:**
- User interviews with influencers
- Lab Partner surveys
- Competitive analysis
- Roadmap adjustment

---

## Feature Prioritization Framework

### High Priority (Must Have)

Features critical to core value proposition:
- Live streaming
- Discussion threads
- Member management
- Basic moderation

**Impact:** High  
**Effort:** High  
**Decision:** Build in Phase 1

---

### Medium Priority (Should Have)

Features that enhance experience significantly:
- Fan badges
- Paid tiers
- Advanced analytics
- Custom domains

**Impact:** Medium-High  
**Effort:** Medium  
**Decision:** Build in Phase 2-3

---

### Low Priority (Nice to Have)

Features that add value but not essential:
- Direct messaging
- Mobile apps
- API access
- Enterprise features

**Impact:** Low-Medium  
**Effort:** High  
**Decision:** Build in Phase 4 or later

---

## Dependencies & Risks

### Technical Dependencies

**Phase 1:**
- Mux API access (streaming)
- Supabase account (database, auth)
- Vercel account (hosting)
- Domain registration (labpartner.com)

**Phase 2:**
- Stripe account (payments)

**Phase 3:**
- Dispatch API (if not self-owned, need stable version)
- SSL certificate provider
- CDN provider

### Resource Dependencies

**Current state:**
- Solo developer (Keegan)
- No designers (use Loveable + AI tools)
- No QA team (self-testing + pilot feedback)

**Future needs:**
- Contract designer (Phase 3, for mobile apps)
- Contract developer (if scaling Phase 4)
- Customer support (when >50 communities)

### Risks & Mitigation

**Risk 1: Streaming costs exceed budget**  
**Mitigation:** Start with Mux pay-as-you-go, monitor closely, consider alternatives if needed

**Risk 2: Solo development slower than planned**  
**Mitigation:** Flexible timeline, no hard deadlines, quality over speed

**Risk 3: Pilot influencers don't promote to followers**  
**Mitigation:** Provide marketing materials, onboarding support, incentives

**Risk 4: Technical complexity in white-label**  
**Mitigation:** Build multi-tenant from day 1, use proven patterns (Supabase RLS)

**Risk 5: Feature creep delays MVP**  
**Mitigation:** Strict MVP scope, move "nice to haves" to Phase 2

**Risk 6: Competitor launches similar product**  
**Mitigation:** Focus on unique positioning (lab partner concept), quality over feature parity

---

## Success Metrics by Phase

### Phase 1 (Week 4) Success Criteria - ACCELERATED

**Product metrics (lower bar for speed):**
- 2 active communities (not 5)
- 30+ total Lab Partners (not 200)
- 3+ successful live streams (not 20)
- 20+ discussion posts (not 500)
- Basic functionality working (not bug-free)

**Feedback metrics (what matters most):**
- Pilots willing to continue using it
- Clear feature requests identified
- No dealbreaker bugs
- Streaming works reliably
- Discussions get organic engagement

**Business validation (too early for revenue):**
- Pilots see value in concept
- At least 1 pilot would pay eventually
- User feedback is positive overall

---

### Phase 2 (Week 8) Success Criteria

**Product metrics:**
- 10 active communities
- 200+ total Lab Partners
- Most-requested features added
- Mobile experience improved

**Business metrics:**
- Pricing model validated
- 3+ influencers committed to paid plans
- Word-of-mouth referrals starting

**Engagement metrics:**
- 35% weekly active rate
- 10+ posts per week per community
- Pilots promoting to their audiences

---

### Phase 3 (Week 12) Success Criteria

**Product metrics:**
- 25 active communities
- 1,000+ total Lab Partners
- 5+ communities with paid tiers
- Revenue dashboard in use

**Business metrics:**
- $2,000+ MRR
- 75% influencer retention
- Growing organically

**Engagement metrics:**
- 40% weekly active rate
- Revenue per community >$80/mo
- Clear product-market fit signals

---

## Migration Plan: Loveable → Claude Code

### When to Migrate

**Recommended timing:** After Week 4 (pilot feedback collected)

**Why wait until after pilots:**
- Loveable is fastest for MVP iteration
- Pilots will identify what needs refinement
- Migrate when you know what to optimize

**Alternative:** Stay in Loveable through Phase 2 if it's working well

### Migration Strategy (If Needed)

**Phase A: Setup (3-4 days)**
- Initialize Next.js project locally
- Set up dev environment
- Connect to existing Supabase

**Phase B: Core Migration (1 week)**
- Port auth + communities
- Rebuild streaming
- Migrate discussions

**Phase C: Testing (2-3 days)**
- Migrate existing data
- Test all features
- Deploy to production

**Total migration time:** 2 weeks

**Decision point:** Evaluate after Week 4 if migration is necessary

---

## Open Questions & Decisions Needed

### Product Decisions

**Q1: Should free tier exist, or paid-only?**  
**Options:**
- A) Free tier with limited features (attract more influencers)
- B) Paid-only from start (better quality influencers)
- C) Free trial, then paid (validate before paying)

**Recommendation:** Option C (30-day free trial, then paid)

---

**Q2: How aggressive should monetization be in Phase 1?**  
**Options:**
- A) No monetization in MVP (grow first)
- B) Charge from day 1 (validate willingness to pay)
- C) Charge after pilot phase (gather feedback first)

**Recommendation:** Option C (free for pilots, paid after Phase 1)

---

**Q3: Should mobile apps be Phase 3 or Phase 4?**  
**Options:**
- A) Phase 3 (sooner, better engagement)
- B) Phase 4 (later, focus on web first)

**Recommendation:** Option B (web-first, validate before mobile investment)

---

### Technical Decisions

**Q4: Should we use Supabase Realtime or build custom WebSocket?**  
**Decision:** Supabase Realtime (faster to market, good enough for MVP)

---

**Q5: Mux vs. building custom streaming infrastructure?**  
**Decision:** Mux (complexity not worth custom build)

---

**Q6: Monorepo or separate repos for web/mobile?**  
**Decision:** TBD based on mobile app approach (likely monorepo with Turborepo)

---

## Timeline Visualization

```
Phase 1: Accelerated MVP (Weeks 1-4) ← YOU ARE HERE
├─ Week 1: Foundation (auth, database)
├─ Week 2: Communities + Streaming ← CRITICAL
├─ Week 3: Discussions (posts, comments, votes)
└─ Week 4: Polish + Pilot Launch (2-3 communities)

Phase 2: Essential Features (Weeks 5-8)
├─ Week 5: Pilot feedback fixes
├─ Week 6: Engagement features
├─ Week 7: Notifications
└─ Week 8: Analytics + monetization prep

Phase 3: Monetization (Weeks 9-12)
├─ Week 9-10: Paid tiers + Stripe
└─ Week 11-12: Scale features

Phase 4: Integration & Advanced (Week 13+)
├─ Dispatch integration (2-3 weeks)
├─ Mobile apps (6-8 weeks)
└─ Enterprise features (ongoing)
```

**Key milestone:** Pilot testing starts Week 4 (Day 28)

---

## Roadmap Flexibility

This roadmap is a guide, not a contract. Adjustments will be made based on:

**User feedback:**
If pilots request specific features, prioritize those

**Technical challenges:**
If streaming takes longer than expected, adjust timeline

**Market changes:**
If competitors launch similar features, re-evaluate priorities

**Business needs:**
If revenue features needed sooner, re-sequence phases

**Personal bandwidth:**
If juggling multiple Keegareaux Labs projects, extend timeline

---

## Next Actions

**This week (Week 1 starts NOW):**
1. ✅ Planning docs complete (PRD, Tech Spec, Brand, Roadmap)
2. Set up Supabase account (free tier)
3. Set up Mux account (get API keys ready for Week 2)
4. Set up Vercel account
5. Recruit 2-3 pilot influencers (start conversations)
6. Initialize Loveable project
7. **Day 1-2:** Auth system working

**Week 1 (Days 1-7):**
- Build foundation fast (auth, database, deployment)
- Daily progress, don't get stuck
- Use Loveable templates when possible
- Goal: Can login by Day 3

**Week 2 (Days 8-14):**
- Communities + streaming
- **Critical:** Mux integration must work
- Focus on "can go live" over polish
- Goal: First test stream by Day 14

**Week 3 (Days 15-21):**
- Discussion system
- Keep it simple (flat comments, text only)
- Real-time updates via Supabase
- Goal: Discussions working by Day 21

**Week 4 (Days 22-28):**
- Essential polish
- Mobile responsive
- Bug fixes
- **Day 27-28:** Onboard first 2 pilots
- Goal: In hands of real users by Day 28

**After Week 4:**
- Collect feedback for 1 week
- Prioritize Phase 2 based on feedback
- Iterate quickly on blockers

---

**Document Owner:** Keegan  
**Last Updated:** February 13, 2026  
**Next Review:** End of Phase 1 (Week 10)
