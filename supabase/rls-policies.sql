-- Lab Partner Row Level Security Policies
-- Run this AFTER schema.sql in the Supabase SQL Editor
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streams ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PROFILES
-- ============================================================================

CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================================================
-- COMMUNITIES
-- ============================================================================

CREATE POLICY "Communities are viewable by everyone"
  ON public.communities FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create communities"
  ON public.communities FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their community"
  ON public.communities FOR UPDATE
  USING (auth.uid() = owner_id);

-- ============================================================================
-- COMMUNITY MEMBERS
-- ============================================================================

CREATE POLICY "Members are viewable by community members"
  ON public.community_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.community_members cm
      WHERE cm.community_id = community_members.community_id
        AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can join communities"
  ON public.community_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave communities"
  ON public.community_members FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- POSTS
-- ============================================================================

CREATE POLICY "Posts viewable by community members"
  ON public.posts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.community_members cm
      WHERE cm.community_id = posts.community_id
        AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can create posts"
  ON public.posts FOR INSERT
  WITH CHECK (
    auth.uid() = author_id
    AND EXISTS (
      SELECT 1 FROM public.community_members cm
      WHERE cm.community_id = posts.community_id
        AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Authors can update own posts"
  ON public.posts FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Authors and owners can delete posts"
  ON public.posts FOR DELETE
  USING (
    auth.uid() = author_id
    OR EXISTS (
      SELECT 1 FROM public.communities c
      WHERE c.id = posts.community_id AND c.owner_id = auth.uid()
    )
  );

-- ============================================================================
-- COMMENTS
-- ============================================================================

CREATE POLICY "Comments viewable by community members"
  ON public.comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.posts p
      JOIN public.community_members cm ON cm.community_id = p.community_id
      WHERE p.id = comments.post_id AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (
    auth.uid() = author_id
    AND EXISTS (
      SELECT 1 FROM public.posts p
      JOIN public.community_members cm ON cm.community_id = p.community_id
      WHERE p.id = comments.post_id AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Authors can delete own comments"
  ON public.comments FOR DELETE
  USING (auth.uid() = author_id);

-- ============================================================================
-- STREAMS
-- ============================================================================

CREATE POLICY "Streams viewable by community members"
  ON public.streams FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.community_members cm
      WHERE cm.community_id = streams.community_id
        AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Owners can manage streams"
  ON public.streams FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.communities c
      WHERE c.id = streams.community_id AND c.owner_id = auth.uid()
    )
  );
