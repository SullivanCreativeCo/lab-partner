import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function usePosts(communityId: string | undefined) {
  return useQuery({
    queryKey: ["posts", communityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*, profiles:author_id(full_name, avatar_url)")
        .eq("community_id", communityId!)
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!communityId,
  });
}

export function usePost(postId: string | undefined) {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*, profiles:author_id(full_name, avatar_url)")
        .eq("id", postId!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!postId,
  });
}

export function useComments(postId: string | undefined) {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*, profiles:author_id(full_name, avatar_url)")
        .eq("post_id", postId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!postId,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      community_id: string;
      title: string;
      body: string;
      author_id: string;
    }) => {
      const { data, error } = await supabase
        .from("posts")
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["posts", data.community_id] });
    },
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      post_id: string;
      body: string;
      author_id: string;
    }) => {
      const { data, error } = await supabase
        .from("comments")
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["comments", data.post_id] });
    },
  });
}
