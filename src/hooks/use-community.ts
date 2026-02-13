import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useCommunityBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["community", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("communities")
        .select("*")
        .eq("slug", slug!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
}

export function useCommunityMembers(communityId: string | undefined) {
  return useQuery({
    queryKey: ["community-members", communityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_members")
        .select("*, profiles(*)")
        .eq("community_id", communityId!)
        .order("joined_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!communityId,
  });
}
