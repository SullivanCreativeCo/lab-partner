import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const muxTokenId = Deno.env.get("MUX_TOKEN_ID")!;
    const muxTokenSecret = Deno.env.get("MUX_TOKEN_SECRET")!;

    // Get user from JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the user's JWT
    const anonClient = createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );
    const {
      data: { user },
      error: authError,
    } = await anonClient.auth.getUser(authHeader.replace("Bearer ", ""));

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { title, description, community_id, simulcast_platform_ids } = await req.json();

    if (!title || !community_id) {
      return new Response(
        JSON.stringify({ error: "title and community_id are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Verify user is the community owner
    const { data: community, error: communityError } = await supabase
      .from("communities")
      .select("id, owner_id")
      .eq("id", community_id)
      .single();

    if (communityError || !community) {
      return new Response(JSON.stringify({ error: "Community not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (community.owner_id !== user.id) {
      return new Response(
        JSON.stringify({ error: "Only the community owner can create streams" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Build Mux request body
    const muxBody: Record<string, unknown> = {
      playback_policy: ["public"],
      new_asset_settings: { playback_policy: ["public"] },
      reduced_latency: true,
    };

    // If simulcast platforms were selected, fetch them and add to Mux request
    if (simulcast_platform_ids && simulcast_platform_ids.length > 0) {
      const { data: platforms, error: platformsError } = await supabase
        .from("simulcast_platforms")
        .select("rtmp_url, stream_key")
        .in("id", simulcast_platform_ids)
        .eq("community_id", community_id);

      if (!platformsError && platforms && platforms.length > 0) {
        muxBody.simulcast_targets = platforms.map((p: { rtmp_url: string; stream_key: string }) => ({
          url: p.rtmp_url,
          stream_key: p.stream_key,
        }));
      }
    }

    // Create Mux live stream
    const muxAuth = btoa(`${muxTokenId}:${muxTokenSecret}`);
    const muxResponse = await fetch(
      "https://api.mux.com/video/v1/live-streams",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${muxAuth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(muxBody),
      }
    );

    if (!muxResponse.ok) {
      const muxError = await muxResponse.text();
      console.error("Mux API error:", muxError);
      return new Response(
        JSON.stringify({ error: "Failed to create Mux stream" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const muxData = await muxResponse.json();
    const liveStream = muxData.data;

    // Insert stream record into database
    const { data: stream, error: insertError } = await supabase
      .from("streams")
      .insert({
        title,
        description: description || "",
        community_id,
        mux_stream_id: liveStream.id,
        mux_playback_id: liveStream.playback_ids[0].id,
        stream_key: liveStream.stream_key,
        status: "scheduled",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to save stream" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        stream_id: stream.id,
        stream_key: liveStream.stream_key,
        mux_playback_id: liveStream.playback_ids[0].id,
        rtmp_url: "rtmp://global-live.mux.com:5222/app",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
