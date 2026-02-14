import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

export function useStream(streamId: string | undefined) {
  return useQuery({
    queryKey: ["stream", streamId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("streams")
        .select("*")
        .eq("id", streamId!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!streamId,
    refetchInterval: (query) => {
      // Poll every 5s when stream is scheduled (waiting to go live)
      const status = query.state.data?.status;
      return status === "scheduled" ? 5000 : status === "live" ? 15000 : false;
    },
  });
}

export function useCreateStream() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      title: string;
      description: string;
      community_id: string;
      simulcast_platform_ids?: string[];
    }) => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) throw new Error("Not authenticated");

      const response = await supabase.functions.invoke("create-stream", {
        body: payload,
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to create stream");
      }

      return response.data as {
        stream_id: string;
        stream_key: string;
        mux_playback_id: string;
        rtmp_url: string;
      };
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["streams", variables.community_id],
      });
    },
  });
}
