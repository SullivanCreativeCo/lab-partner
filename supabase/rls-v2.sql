-- RLS v2: Fix infinite recursion by using SECURITY DEFINER helper functions
-- These functions bypass RLS so policies don't trigger each other in loops
-- Run this in your Supabase SQL Editor
-- ============================================================================

-- 1. Create helper functions (bypass RLS)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.is_community_member(p_community_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.community_members
    WHERE community_id = p_community_id AND user_id = p_user_id
  );
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_community_owner(p_community_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.communities
    WHERE id = p_community_id AND owner_id = p_user_id
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- 2. Drop ALL existing policies (clean slate)
-- ============================================================================

-- community_members
DROP POLICY IF EXISTS "Members are viewable by community members" ON public.community_members;
DROP POLICY IF EXISTS "Members and owners can view community members" ON public.community_members;
DROP POLICY IF EXISTS "Authenticated users can join communities" ON public.community_members;
DROP POLICY IF EXISTS "Users can leave communities" ON public.community_members;

-- posts
DROP POLICY IF EXISTS "Posts viewable by community members" ON public.posts;
DROP POLICY IF EXISTS "Posts viewable by members and owners" ON public.posts;
DROP POLICY IF EXISTS "Members can create posts" ON public.posts;
DROP POLICY IF EXISTS "Members and owners can create posts" ON public.posts;
DROP POLICY IF EXISTS "Authors can update own posts" ON public.posts;
DROP POLICY IF EXISTS "Authors and owners can delete posts" ON public.posts;

-- comments
DROP POLICY IF EXISTS "Comments viewable by community members" ON public.comments;
DROP POLICY IF EXISTS "Comments viewable by members and owners" ON public.comments;
DROP POLICY IF EXISTS "Members can create comments" ON public.comments;
DROP POLICY IF EXISTS "Members and owners can create comments" ON public.comments;
DROP POLICY IF EXISTS "Authors can delete own comments" ON public.comments;

-- streams
DROP POLICY IF EXISTS "Streams viewable by community members" ON public.streams;
DROP POLICY IF EXISTS "Streams viewable by members and owners" ON public.streams;
DROP POLICY IF EXISTS "Owners can manage streams" ON public.streams;

-- 3. Recreate policies using helper functions (no recursion)
-- ============================================================================

-- COMMUNITY MEMBERS
CREATE POLICY "community_members_select"
  ON public.community_members FOR SELECT
  USING (
    public.is_community_member(community_id, auth.uid())
    OR public.is_community_owner(community_id, auth.uid())
  );

CREATE POLICY "community_members_insert"
  ON public.community_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "community_members_delete"
  ON public.community_members FOR DELETE
  USING (auth.uid() = user_id);

-- POSTS
CREATE POLICY "posts_select"
  ON public.posts FOR SELECT
  USING (
    public.is_community_member(community_id, auth.uid())
    OR public.is_community_owner(community_id, auth.uid())
  );

CREATE POLICY "posts_insert"
  ON public.posts FOR INSERT
  WITH CHECK (
    auth.uid() = author_id
    AND (
      public.is_community_member(community_id, auth.uid())
      OR public.is_community_owner(community_id, auth.uid())
    )
  );

CREATE POLICY "posts_update"
  ON public.posts FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "posts_delete"
  ON public.posts FOR DELETE
  USING (
    auth.uid() = author_id
    OR public.is_community_owner(community_id, auth.uid())
  );

-- COMMENTS
CREATE POLICY "comments_select"
  ON public.comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.posts p
      WHERE p.id = comments.post_id
        AND (
          public.is_community_member(p.community_id, auth.uid())
          OR public.is_community_owner(p.community_id, auth.uid())
        )
    )
  );

CREATE POLICY "comments_insert"
  ON public.comments FOR INSERT
  WITH CHECK (
    auth.uid() = author_id
    AND EXISTS (
      SELECT 1 FROM public.posts p
      WHERE p.id = comments.post_id
        AND (
          public.is_community_member(p.community_id, auth.uid())
          OR public.is_community_owner(p.community_id, auth.uid())
        )
    )
  );

CREATE POLICY "comments_delete"
  ON public.comments FOR DELETE
  USING (auth.uid() = author_id);

-- STREAMS
CREATE POLICY "streams_select"
  ON public.streams FOR SELECT
  USING (
    public.is_community_member(community_id, auth.uid())
    OR public.is_community_owner(community_id, auth.uid())
  );

CREATE POLICY "streams_all_owner"
  ON public.streams FOR ALL
  USING (
    public.is_community_owner(community_id, auth.uid())
  );
