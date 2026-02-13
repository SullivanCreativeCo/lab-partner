import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useStreams(communityId: string | undefined) {
  return useQuery({
    queryKey: ["streams", communityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("streams")
        .select("*")
        .eq("community_id", communityId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!communityId,
  });
}
