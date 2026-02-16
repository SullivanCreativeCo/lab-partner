
-- Create videos table for pre-recorded video uploads
CREATE TABLE public.videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  view_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  upvote_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Videos viewable by everyone" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Owner can upload videos" ON public.videos FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owner can update videos" ON public.videos FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owner can delete videos" ON public.videos FOR DELETE USING (auth.uid() = owner_id);

-- Timestamp trigger
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON public.videos
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Video comments table
CREATE TABLE public.video_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  author_id UUID NOT NULL,
  body TEXT NOT NULL,
  upvote_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.video_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Video comments viewable by everyone" ON public.video_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can comment on videos" ON public.video_comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Author can update video comments" ON public.video_comments FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Author can delete video comments" ON public.video_comments FOR DELETE USING (auth.uid() = author_id);

-- Video votes table
CREATE TABLE public.video_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(video_id, user_id)
);

ALTER TABLE public.video_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Video votes viewable by everyone" ON public.video_votes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can vote on videos" ON public.video_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove own video votes" ON public.video_votes FOR DELETE USING (auth.uid() = user_id);

-- Storage bucket for video uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true);

-- Storage policies
CREATE POLICY "Video files are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'videos');
CREATE POLICY "Authenticated users can upload videos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'videos' AND auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own video files" ON storage.objects FOR UPDATE USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own video files" ON storage.objects FOR DELETE USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);
