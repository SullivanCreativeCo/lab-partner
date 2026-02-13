# Lab Partner | Phase 2 Roadmap - FINALIZED

**Updated:** February 13, 2026
**Based on:** Decision session with Keegan

---

## Phase 2 Overview (Weeks 5-8)

**Primary Goal:** Enable revenue generation and improve retention based on pilot feedback

**Key Decisions Made:**
- Two-tier monetization (Free + Paid)
- 5% revenue share (most competitive)
- Both Stripe options (Connect + Standard)
- OBS-only streaming for MVP (browser in Phase 3)
- Email + PWA push notifications
- Monetization before notifications (Weeks 5-6 vs Weeks 7-8)
- Personal network pilot sourcing (space, business, education)

---

## Week 5-6: Monetization (Revenue Generation)

**Goal:** Enable influencers to charge for membership and start generating revenue

### Week 5: Stripe Integration & Tier System

**Day 1-2: Stripe Setup**
- [ ] Set up Stripe account
- [ ] Integrate Stripe Connect (for direct payouts)
- [ ] Integrate Standard Stripe (for managed payouts)
- [ ] Create onboarding flow for both options
- [ ] Test webhook handling

**Day 3-4: Two-Tier System**
- [ ] Database schema update:
  - Add `tier` field to members table (free, paid)
  - Add `pricing` table (community_id, tier_name, price_monthly)
  - Add `subscriptions` table (member_id, tier, stripe_subscription_id, status)
- [ ] Create tier management UI (influencer sets paid tier price)
- [ ] Build tier selection for members (upgrade flow)

**Day 5-7: Payment Flow**
- [ ] Member checkout flow (Stripe Checkout)
- [ ] Subscription management page (cancel, update payment)
- [ ] Handle webhook events (subscription.created, subscription.canceled, etc.)
- [ ] Revenue share calculation (5% to Lab Partner, 95% to influencer)
- [ ] Test both Stripe Connect and Standard Stripe flows

**Deliverables:**
- Influencer can set paid tier price ($X/month)
- Members can subscribe via Stripe
- Automatic tier assignment on successful payment
- Revenue split working (95% influencer, 5% Lab Partner)

---

### Week 6: Revenue Dashboard & Gating

**Day 1-3: Revenue Dashboard**
- [ ] Build influencer dashboard showing:
  - Total revenue (monthly, all-time)
  - Active paid members
  - Conversion rate (free > paid)
  - Recent transactions
  - Payout schedule (for Standard Stripe users)
- [ ] Export revenue data (CSV)
- [ ] Link to Stripe dashboard for details

**Day 4-5: Content Gating**
- [ ] Gate exclusive streams (paid tier only)
- [ ] Gate discussion posting (paid tier can post, free tier read-only)
- [ ] Gate early access content (add "early access" flag to posts/streams)
- [ ] Add tier badges to member profiles (Free vs Paid indicator)

**Day 6-7: Testing & Polish**
- [ ] End-to-end payment testing
- [ ] Edge case handling (failed payments, downgrades, cancellations)
- [ ] Error messages and user guidance
- [ ] Mobile responsive payment flow

**Deliverables:**
- Revenue dashboard live
- Content gating working
- Tier badges visible
- Stripe integration tested and stable

---

## Week 7-8: Notifications & Pilot Feedback

**Goal:** Keep Lab Partners engaged and fix critical issues from pilot feedback

### Week 7: Email + PWA Push Notifications

**Day 1-2: Email Notifications (Resend)**
- [ ] Set up Resend account
- [ ] Create email templates:
  - Stream going live
  - New post in community
  - Reply to your comment
  - Welcome to community
- [ ] Implement notification triggers (stream start, new post, etc.)
- [ ] Add notification preferences (member can opt out)
- [ ] Test email delivery

**Day 3-5: PWA Push Notifications**
- [ ] Set up PWA infrastructure:
  - Create manifest.json
  - Set up service worker
  - Configure Firebase Cloud Messaging (FCM)
- [ ] Add push permission prompt (after user engages, not immediately)
- [ ] Implement push notification triggers (stream live, new posts)
- [ ] Add notification center in app (bell icon with badge)
- [ ] Test on multiple browsers (Chrome, Safari, Firefox)

**Day 6-7: Notification Testing**
- [ ] Test email delivery across providers (Gmail, Outlook, etc.)
- [ ] Test push on desktop and mobile browsers
- [ ] Add unsubscribe links to emails
- [ ] Test notification preferences (on/off toggles)

**Deliverables:**
- Email notifications working
- PWA push notifications working
- Notification preferences UI
- No spam (proper opt-in/opt-out)

---

### Week 8: Pilot Feedback & Critical Fixes

**Day 1-2: Feedback Synthesis**
- [ ] Review all pilot feedback from Weeks 4-7
- [ ] Identify top 3 most-requested features
- [ ] Identify top 3 most critical bugs
- [ ] Prioritize fixes based on impact

**Day 3-7: Implementation**
Based on typical pilot feedback, likely fixes include:

**Probable requests:**
- [ ] Threaded comments (if pilots hate flat comments)
- [ ] Image uploads in posts (if text-only is limiting)
- [ ] Better mobile experience (specific pain points)
- [ ] Stream scheduling (announce future streams)
- [ ] Member profiles (show activity, badges)

**Critical bugs:**
- [ ] Fix any streaming issues
- [ ] Fix any payment/subscription bugs
- [ ] Fix any real-time update issues
- [ ] Performance improvements

**Deliverables:**
- Top 3 pilot requests implemented
- Critical bugs fixed
- Platform stable for expansion

---

## Pilot Recruitment Plan

### Target Niches & Candidates

Based on your selections:

**Space Industry/Community Creator**
- **Profile:** Someone building following in space sector (engineers, enthusiasts, professionals)
- **Why good fit:** Underserved niche, highly engaged audience, technical (can handle OBS)
- **Possible candidates from your network:**
  - Space industry professional you know from Ursa Consulting work
  - Space content creator you follow
  - Someone from space community Discord/Slack
- **Pitch angle:** "Own your space community without relying on X/LinkedIn algorithms"

**Business/Productivity Creator**
- **Profile:** Teaching productivity systems, business growth, or professional development
- **Why good fit:** High willingness to pay for content, engaged audience, clear monetization path
- **Possible candidates:**
  - Someone from ThreatCaptain network
  - Business coach you follow
  - Productivity creator in your network
- **Pitch angle:** "Build a paid community without Patreon's 12% fees"

**Educational Creator**
- **Profile:** Teaching specific skills (coding, design, marketing, etc.)
- **Why good fit:** Natural fit for tiered access (free intro, paid deep-dive), recurring revenue model
- **Possible candidates:**
  - Skills instructor you know
  - Online course creator
  - Tutorial/how-to content creator
- **Pitch angle:** "Turn your free content into a paid community with 95% revenue share"

---

### Recruitment Timeline

**Week 3 (Days 15-21):**
- Streaming is working (can demo it)
- Discussions are live (can show engagement)
- Product is functional enough to show

**Outreach strategy:**

**Day 15-16: Identify specific people**
- [ ] Write down 5-7 specific names from your network
- [ ] Check their current follower counts (5K-30K ideal)
- [ ] Verify they're actively posting content
- [ ] Confirm they fit the "frustrated with platforms" profile

**Day 17-18: Personalized outreach**
- [ ] Send personalized DMs (not generic pitch)
- [ ] Reference specific content they've created
- [ ] Mention you're building Lab Partner
- [ ] Offer "founding partner" status (free forever)
- [ ] Ask for 15-minute call

**Sample DM template:**

```
Hey [Name],

I've been following your [specific content] and really appreciate
how you [specific thing they do well].

I'm building Lab Partner - a platform that lets creators like you
own your community instead of being dependent on [platform] algorithms.

Think: Your own branded space to stream exclusively, have deeper
discussions, and monetize directly (no 12% Patreon fees).

I'm looking for 2-3 creators to be founding partners and help shape
the product. You'd get:
- Free access forever (normally paid)
- Direct input on features
- First-mover advantage in [their niche]
- Your own community live in 1 week

Would you be open to a quick 15-min call to discuss?

- Keegan

[Loom video showing quick product demo]
```

**Day 19-21: Follow-up & scheduling**
- [ ] Follow up with non-responders (1 time only)
- [ ] Schedule calls with interested creators
- [ ] Prepare demo environment for calls
- [ ] Get 2-3 committed pilots

---

### Week 4: Pilot Onboarding

**Day 27-28: First pilot onboarding**
- 1-hour onboarding call per pilot
- Walk through platform
- Set up their community (branding, colors, logo)
- Configure OBS for streaming
- Test first stream together
- Invite their first Lab Partners

**Ongoing (Week 5+):**
- Daily Slack check-ins
- Weekly feedback calls
- Monitor usage closely
- Fix issues immediately

---

## Streaming Implementation (OBS-Only for MVP)

### Setup Flow

**Influencer side:**

1. Click "Go Live" button in `/c/[slug]/streams`
2. Fill in basic settings:
   - Stream title (required)
   - Description (optional)
   - Privacy: "Members Only" or "Paid Members Only"
3. Click "Create Stream"
4. Get RTMP credentials displayed:
   ```
   RTMP URL: rtmp://global-live.mux.com:5222/app
   Stream Key: [unique key from Mux]
   ```
5. Copy to OBS:
   - Open OBS Settings > Stream
   - Service: Custom
   - Server: [RTMP URL]
   - Stream Key: [paste key]
6. Click "Start Streaming" in OBS
7. Stream appears live in Lab Partner
8. Click "End Stream" when done

**Member side:**

1. See "LIVE NOW" indicator on stream list
2. Click to watch
3. Mux Player loads stream
4. Watch live (3-5 second latency)
5. Stream ends > automatically switches to VOD replay

### Technical Details

**Mux API calls:**

```javascript
// When influencer clicks "Go Live"
POST https://api.mux.com/video/v1/live-streams
{
  "playback_policy": ["public"],
  "new_asset_settings": {
    "playback_policy": ["public"]
  },
  "reconnect_window": 60,
  "max_continuous_duration": 43200 // 12 hours
}

// Returns:
{
  "id": "stream_id",
  "stream_key": "unique_key",
  "playback_ids": [{ "id": "playback_id" }]
}

// Store in database:
- mux_stream_id
- mux_stream_key (show to influencer once)
- mux_playback_id (use for player)
```

**Stream player component:**

```tsx
import MuxPlayer from '@mux/mux-player-react';

<MuxPlayer
  playbackId={stream.mux_playback_id}
  streamType="live"
  metadata={{
    video_title: stream.title,
  }}
  primaryColor="#2F80ED"
  secondaryColor="#4169B5"
/>
```

**Automatic VOD replay:**

Mux automatically creates a VOD asset when stream ends. Webhook:

```javascript
// Listen for webhook
POST /api/webhooks/mux

{
  "type": "video.asset.ready",
  "data": {
    "id": "asset_id",
    "playback_ids": [{ "id": "playback_id" }]
  }
}

// Update database:
UPDATE streams
SET
  status = 'ended',
  mux_asset_id = 'asset_id',
  ended_at = NOW()
WHERE mux_stream_id = ...
```

**Browser streaming in Phase 3:**

Add WebRTC option where influencer clicks "Go Live" and camera turns on in browser (no OBS needed). Use Mux WHIP protocol or similar.

---

## Success Metrics for Phase 2

### Week 6 (Monetization Launch)

**Product:**
- [ ] 2+ influencers enable paid tiers
- [ ] 10+ paid memberships created
- [ ] $100+ total revenue generated
- [ ] Zero payment processing errors

**Business:**
- [ ] 5% revenue share working correctly
- [ ] Both Stripe options (Connect + Standard) tested
- [ ] Revenue dashboard accurate

---

### Week 8 (End of Phase 2)

**Product:**
- [ ] 10-15 total communities
- [ ] 300+ total Lab Partners
- [ ] 30+ paid memberships
- [ ] Email notifications working reliably
- [ ] PWA push notifications working
- [ ] Top 3 pilot requests implemented

**Business:**
- [ ] $500+ MRR (monthly recurring revenue)
- [ ] 80%+ pilot retention
- [ ] Clear product-market fit signals

**Engagement:**
- [ ] 35%+ weekly active rate
- [ ] 10+ streams per week across all communities
- [ ] 5+ paid tier conversions per week
- [ ] Positive feedback from pilots

---

## Updated Phase 3 Preview (Weeks 9-12)

Based on decisions made, Phase 3 will focus on:

**Week 9-10:**
- Browser-based streaming (WebRTC or WHIP)
- Threaded comments (if pilots request)
- Image uploads in posts

**Week 11-12:**
- Custom domains
- Advanced analytics
- Performance optimization
- Scale features (caching, read replicas)

---

## Risk Mitigation

### Risk: Stripe integration more complex than expected

**Mitigation:**
- Start with Stripe Connect only (simpler)
- Add Standard Stripe if pilots request it
- Use Stripe's hosted checkout (less to build)
- Test extensively with test mode first

---

### Risk: 5% revenue share doesn't cover costs

**Reality check:**

**Revenue per community:**
- Average: 50 Lab Partners x 20% paid x $15/month = $150/month
- Lab Partner take (5%): $7.50/month per community
- Stripe fees (~3%): $4.50/month
- Net to Lab Partner: $3/month per community

**To break even at $500/month costs:**
- Need: 167 communities generating revenue
- OR: Higher paid conversion rates
- OR: Higher average tier prices

**Mitigation:**
- Focus on high-value influencers (higher tier prices)
- Optimize for paid conversion (better value prop)
- Plan to increase to 8% in Phase 4 (grandfather early adopters at 5%)
- Consider flat fee + revenue share hybrid later

---

### Risk: PWA push notifications don't work on all browsers

**Known issues:**
- iOS Safari: Limited PWA support (requires "Add to Home Screen")
- Firefox: Full PWA support but lower adoption
- Chrome/Edge: Full support

**Mitigation:**
- Email notifications as primary (works everywhere)
- Push as enhancement (nice to have)
- Clear messaging: "Enable push for instant alerts"
- Don't require push for core functionality

---

### Risk: OBS setup too technical for non-technical influencers

**Reality:**
- OBS is industry standard for streaming
- Most creators with 5K+ followers have used it
- YouTube, Twitch require same setup

**Mitigation:**
- Create step-by-step OBS setup guide (video)
- Offer 1-on-1 setup help for pilots
- Add browser streaming in Phase 3 for less technical users
- Partner with StreamYard/Restream (future) for easier setup

---

## Action Items for This Week

**Today (Day 1):**
- [ ] Review all 6 planning docs (PRD, Tech Spec, Brand, Roadmap, GTM, Loveable)
- [ ] Set up Supabase account
- [ ] Set up Mux account (get API keys)
- [ ] Set up Vercel account
- [ ] Initialize Loveable project with prompt

**Days 2-7 (Week 1):**
- [ ] Build authentication system
- [ ] Set up database schema
- [ ] Deploy to Vercel
- [ ] Test auth flow end-to-end

**Week 2:**
- [ ] Build community creation
- [ ] Integrate Mux streaming
- [ ] Test first stream

**Week 3:**
- [ ] Build discussion system
- [ ] **Day 15-21: Recruit pilots from personal network**
- [ ] Test with internal users

**Week 4:**
- [ ] Polish and bug fixes
- [ ] **Day 27-28: Onboard first 2-3 pilots**
- [ ] Get first communities live
- [ ] Collect initial feedback

---

## Next Steps

1. **Start Loveable build** (use prompt from lab-partner-loveable-prompt.md)
2. **Set up accounts** (Supabase, Mux, Vercel)
3. **Begin Week 1 development** (auth system)
4. **Prepare pilot outreach** (identify specific people by Week 3)

---

**Document Owner:** Keegan
**Last Updated:** February 13, 2026
**Next Review:** End of Week 4 (after pilot launch)
