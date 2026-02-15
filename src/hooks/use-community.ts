import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useCommunityBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["community", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("communities")
        .select("*")
        .eq("slug", slug!)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw new Error(`Community "${slug}" not found`);
      return data;
    },
    enabled: !!slug,
    retry: false,
  });
}

export function useUserCommunities(userId: string | undefined) {
  return useQuery({
    queryKey: ["user-communities", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("communities")
        .select("id, name, slug, logo_url, primary_color")
        .eq("owner_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

export function useCommunityMembers(communityId: string | undefined) {
  return useQuery({
    queryKey: ["community-members", communityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("members")
        .select("*, profiles(*)")
        .eq("community_id", communityId!)
        .order("joined_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!communityId,
  });
}
