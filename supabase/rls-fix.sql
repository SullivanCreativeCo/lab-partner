-- RLS Policy Fix: Allow community owners full access without requiring community_members row
-- Run this in your Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- DROP old policies that are too restrictive
-- ============================================================================

DROP POLICY IF EXISTS "Members are viewable by community members" ON public.community_members;
DROP POLICY IF EXISTS "Posts viewable by community members" ON public.posts;
DROP POLICY IF EXISTS "Members can create posts" ON public.posts;
DROP POLICY IF EXISTS "Comments viewable by community members" ON public.comments;
DROP POLICY IF EXISTS "Members can create comments" ON public.comments;
DROP POLICY IF EXISTS "Streams viewable by community members" ON public.streams;

-- ============================================================================
-- COMMUNITY MEMBERS — owners can always see their community's members
-- ============================================================================

CREATE POLICY "Members and owners can view community members"
  ON public.community_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.community_members cm
      WHERE cm.community_id = community_members.community_id
        AND cm.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.communities c
      WHERE c.id = community_members.community_id
        AND c.owner_id = auth.uid()
    )
  );

-- ============================================================================
-- POSTS — owners can read and create posts without being in community_members
-- ============================================================================

CREATE POLICY "Posts viewable by members and owners"
  ON public.posts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.community_members cm
      WHERE cm.community_id = posts.community_id
        AND cm.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.communities c
      WHERE c.id = posts.community_id
        AND c.owner_id = auth.uid()
    )
  );

CREATE POLICY "Members and owners can create posts"
  ON public.posts FOR INSERT
  WITH CHECK (
    auth.uid() = author_id
    AND (
      EXISTS (
        SELECT 1 FROM public.community_members cm
        WHERE cm.community_id = posts.community_id
          AND cm.user_id = auth.uid()
      )
      OR EXISTS (
        SELECT 1 FROM public.communities c
        WHERE c.id = posts.community_id
          AND c.owner_id = auth.uid()
      )
    )
  );

-- ============================================================================
-- COMMENTS — owners can read and create comments without being in community_members
-- ============================================================================

CREATE POLICY "Comments viewable by members and owners"
  ON public.comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.posts p
      JOIN public.community_members cm ON cm.community_id = p.community_id
      WHERE p.id = comments.post_id AND cm.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.posts p
      JOIN public.communities c ON c.id = p.community_id
      WHERE p.id = comments.post_id AND c.owner_id = auth.uid()
    )
  );

CREATE POLICY "Members and owners can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (
    auth.uid() = author_id
    AND (
      EXISTS (
        SELECT 1 FROM public.posts p
        JOIN public.community_members cm ON cm.community_id = p.community_id
        WHERE p.id = comments.post_id AND cm.user_id = auth.uid()
      )
      OR EXISTS (
        SELECT 1 FROM public.posts p
        JOIN public.communities c ON c.id = p.community_id
        WHERE p.id = comments.post_id AND c.owner_id = auth.uid()
      )
    )
  );

-- ============================================================================
-- STREAMS — owners can view streams (they already have "Owners can manage streams" for ALL)
-- ============================================================================

CREATE POLICY "Streams viewable by members and owners"
  ON public.streams FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.community_members cm
      WHERE cm.community_id = streams.community_id
        AND cm.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.communities c
      WHERE c.id = streams.community_id
        AND c.owner_id = auth.uid()
    )
  );
