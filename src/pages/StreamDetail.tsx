import { useState } from "react";
import CommunityLayout from "@/components/CommunityLayout";
import BrowserBroadcast from "@/components/BrowserBroadcast";
import { Radio, Copy, Check, ArrowLeft, Monitor, Camera } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCommunityBySlug } from "@/hooks/use-community";
import { useStream } from "@/hooks/use-streams";
import { useAuth } from "@/contexts/AuthContext";
import MuxPlayer from "@mux/mux-player-react";

type BroadcastMode = "choose" | "browser" | "obs";

const StreamDetail = () => {
  const { slug, streamId } = useParams();
  const { user } = useAuth();
  const { data: community } = useCommunityBySlug(slug);
  const { data: stream, isLoading } = useStream(streamId);

  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [broadcastMode, setBroadcastMode] = useState<BroadcastMode>("choose");

  const isOwner = community && user && community.owner_id === user.id;

  const copyToClipboard = (text: string, type: "key" | "url") => {
    navigator.clipboard.writeText(text);
    if (type === "key") {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <CommunityLayout communityName={community?.name ?? "Community"}>
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </CommunityLayout>
    );
  }

  if (!stream) {
    return (
      <CommunityLayout communityName={community?.name ?? "Community"}>
        <div className="px-4 py-12 text-center">
          <h2 className="text-lg font-semibold mb-2">Stream not found</h2>
          <Link to={`/c/${slug}/streams`} className="text-primary text-sm hover:underline">
            Back to streams
          </Link>
        </div>
      </CommunityLayout>
    );
  }

  const showOwnerSetup = isOwner && stream.mux_stream_key && stream.status === "scheduled";

  return (
    <CommunityLayout communityName={community?.name ?? "Community"}>
      <div className="px-4 py-4 space-y-4">
        {/* Back link */}
        <Link
          to={`/c/${slug}/streams`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          All Streams
        </Link>

        {/* Player / Broadcast Area */}
        {stream.status === "live" && isOwner && broadcastMode === "browser" ? (
          <BrowserBroadcast streamKey={stream.mux_stream_key!} />
        ) : stream.status === "live" && stream.mux_playback_id ? (
          <div className="rounded-lg overflow-hidden border border-primary/20">
            <MuxPlayer
              playbackId={stream.mux_playback_id}
              streamType="live"
              autoPlay="muted"
              style={{ aspectRatio: "16/9", width: "100%" }}
            />
          </div>
        ) : stream.status === "ended" && stream.mux_playback_id ? (
          <div className="rounded-lg overflow-hidden border border-border">
            <MuxPlayer
              playbackId={stream.mux_playback_id}
              streamType="on-demand"
              style={{ aspectRatio: "16/9", width: "100%" }}
            />
          </div>
        ) : showOwnerSetup && broadcastMode === "browser" ? (
          <BrowserBroadcast streamKey={stream.mux_stream_key!} />
        ) : showOwnerSetup && broadcastMode === "choose" ? (
          <div className="aspect-video rounded-lg border border-border bg-card flex flex-col items-center justify-center gap-4 p-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Radio className="w-7 h-7 text-primary" />
            </div>
            <p className="text-sm font-medium">How do you want to go live?</p>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
              <Button
                className="flex-1 btn-primary-gradient gap-2"
                onClick={() => setBroadcastMode("browser")}
              >
                <Camera className="w-4 h-4" />
                Phone / Camera
              </Button>
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => setBroadcastMode("obs")}
              >
                <Monitor className="w-4 h-4" />
                OBS / RTMP
              </Button>
            </div>
          </div>
        ) : (
          <div className="aspect-video rounded-lg border border-border bg-card flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Radio className="w-7 h-7 text-primary" />
            </div>
            <p className="text-sm font-medium">Waiting for stream to start...</p>
            <p className="text-xs text-muted-foreground">The stream will appear here once the host goes live</p>
          </div>
        )}

        {/* Stream Info */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            {stream.status === "live" && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                LIVE
              </span>
            )}
            {stream.status === "scheduled" && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                Upcoming
              </span>
            )}
            {stream.status === "ended" && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-semibold">
                Ended
              </span>
            )}
          </div>
          <h1 className="text-xl font-bold mb-1">{stream.title}</h1>
          {stream.description && (
            <p className="text-sm text-muted-foreground">{stream.description}</p>
          )}
        </div>

        {/* Owner: OBS/RTMP Credentials */}
        {isOwner && stream.mux_stream_key && broadcastMode === "obs" && (stream.status === "scheduled" || stream.status === "live") && (
          <div className="rounded-lg border border-border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">OBS Setup</h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground gap-1.5"
                onClick={() => setBroadcastMode("choose")}
              >
                <Camera className="w-3.5 h-3.5" />
                Use Camera Instead
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Paste these into OBS (Settings &gt; Stream &gt; Custom) to go live.
            </p>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">RTMP URL</label>
              <div className="flex gap-2">
                <Input
                  value="rtmp://global-live.mux.com:5222/app"
                  readOnly
                  className="font-mono text-xs"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  onClick={() => copyToClipboard("rtmp://global-live.mux.com:5222/app", "url")}
                >
                  {copiedUrl ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Stream Key</label>
              <div className="flex gap-2">
                <Input
                  value={stream.mux_stream_key}
                  readOnly
                  className="font-mono text-xs"
                  type="password"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  onClick={() => copyToClipboard(stream.mux_stream_key!, "key")}
                >
                  {copiedKey ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </CommunityLayout>
  );
};

export default StreamDetail;
