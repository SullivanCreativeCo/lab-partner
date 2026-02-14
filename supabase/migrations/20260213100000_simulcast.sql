-- Simulcast Add-On: Multistream to YouTube, Twitch, Facebook, LinkedIn
-- ============================================================================

-- Flag on communities for simulcast access (premium add-on)
ALTER TABLE public.communities
  ADD COLUMN IF NOT EXISTS simulcast_enabled BOOLEAN NOT NULL DEFAULT false;

-- Saved platform credentials per community
CREATE TABLE public.simulcast_platforms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  label TEXT NOT NULL DEFAULT '',
  rtmp_url TEXT NOT NULL,
  stream_key TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_simulcast_platforms_community ON public.simulcast_platforms(community_id);

-- RLS: only community owners can manage their simulcast platforms
ALTER TABLE public.simulcast_platforms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can manage simulcast platforms"
  ON public.simulcast_platforms FOR ALL
  USING (public.is_community_owner(community_id, auth.uid()));
