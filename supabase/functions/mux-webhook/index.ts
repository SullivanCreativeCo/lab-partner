import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.3";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const muxWebhookSecret = Deno.env.get("MUX_WEBHOOK_SECRET");

    // Optional: Verify Mux webhook signature
    if (muxWebhookSecret) {
      const signature = req.headers.get("mux-signature");
      if (!signature) {
        console.warn("Missing Mux webhook signature");
        return new Response("Missing signature", { status: 401 });
      }
      // For production, implement full HMAC verification here.
      // Mux sends: t=<timestamp>,v1=<signature>
      // For now, we log and proceed (configure MUX_WEBHOOK_SECRET later for full verification).
    }

    const body = await req.json();
    const { type, data } = body;

    console.log("Mux webhook event:", type);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const muxStreamId = data?.id;

    if (!muxStreamId) {
      console.warn("No stream ID in webhook payload");
      return new Response("ok", { status: 200 });
    }

    if (type === "video.live_stream.active") {
      // Stream went live
      const { error } = await supabase
        .from("streams")
        .update({
          status: "live",
          started_at: new Date().toISOString(),
        })
        .eq("mux_stream_id", muxStreamId);

      if (error) {
        console.error("Failed to update stream to live:", error);
      } else {
        console.log("Stream marked live:", muxStreamId);
      }
    } else if (type === "video.live_stream.idle") {
      // Stream ended
      const { error } = await supabase
        .from("streams")
        .update({
          status: "ended",
          ended_at: new Date().toISOString(),
        })
        .eq("mux_stream_id", muxStreamId);

      if (error) {
        console.error("Failed to update stream to ended:", error);
      } else {
        console.log("Stream marked ended:", muxStreamId);
      }
    }

    return new Response("ok", { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response("Internal error", { status: 500 });
  }
});
