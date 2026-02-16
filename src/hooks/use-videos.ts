import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useVideos(communityId: string | undefined) {
  return useQuery({
    queryKey: ["videos", communityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("videos")
        .select("*, profiles:owner_id(full_name, avatar_url)")
        .eq("community_id", communityId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!communityId,
  });
}

export function useVideo(videoId: string | undefined) {
  return useQuery({
    queryKey: ["video", videoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("videos")
        .select("*, profiles:owner_id(full_name, avatar_url)")
        .eq("id", videoId!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!videoId,
  });
}

export function useVideoComments(videoId: string | undefined) {
  return useQuery({
    queryKey: ["video-comments", videoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("video_comments")
        .select("*, profiles:author_id(full_name, avatar_url)")
        .eq("video_id", videoId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!videoId,
  });
}

export function useCreateVideo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      community_id: string;
      owner_id: string;
      title: string;
      description?: string;
      video_url: string;
      thumbnail_url?: string;
    }) => {
      const { data, error } = await supabase
        .from("videos")
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["videos", data.community_id] });
    },
  });
}

export function useCreateVideoComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      video_id: string;
      body: string;
      author_id: string;
    }) => {
      const { data, error } = await supabase
        .from("video_comments")
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["video-comments", data.video_id] });
    },
  });
}

export function useUploadVideo() {
  return useMutation({
    mutationFn: async ({ file, userId }: { file: File; userId: string }) => {
      const ext = file.name.split(".").pop();
      const path = `${userId}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from("videos")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("videos").getPublicUrl(path);
      return urlData.publicUrl;
    },
  });
}
