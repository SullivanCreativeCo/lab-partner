import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useSimulcastPlatforms(communityId: string | undefined) {
  return useQuery({
    queryKey: ["simulcast-platforms", communityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("simulcast_platforms")
        .select("*")
        .eq("community_id", communityId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!communityId,
  });
}

export function useAddSimulcastPlatform() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      community_id: string;
      platform: string;
      label: string;
      rtmp_url: string;
      stream_key: string;
    }) => {
      const { data, error } = await supabase
        .from("simulcast_platforms")
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["simulcast-platforms", variables.community_id],
      });
    },
  });
}

export function useUpdateSimulcastPlatform() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      community_id,
      ...updates
    }: {
      id: string;
      community_id: string;
      enabled?: boolean;
      label?: string;
      stream_key?: string;
    }) => {
      const { error } = await supabase
        .from("simulcast_platforms")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["simulcast-platforms", variables.community_id],
      });
    },
  });
}

export function useDeleteSimulcastPlatform() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      community_id,
    }: {
      id: string;
      community_id: string;
    }) => {
      const { error } = await supabase
        .from("simulcast_platforms")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["simulcast-platforms", variables.community_id],
      });
    },
  });
}
