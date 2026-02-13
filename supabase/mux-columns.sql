-- Add Mux streaming columns to the streams table
-- Run this in Supabase SQL Editor
-- ============================================================================

ALTER TABLE public.streams
  ADD COLUMN IF NOT EXISTS mux_stream_id TEXT,
  ADD COLUMN IF NOT EXISTS mux_playback_id TEXT,
  ADD COLUMN IF NOT EXISTS stream_key TEXT;
