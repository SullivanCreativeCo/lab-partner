import { useState } from "react";
import CommunityLayout from "@/components/CommunityLayout";
import { Radio, Play, Clock, Users, Copy, Check } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useCommunityBySlug } from "@/hooks/use-community";
import { useStreams, useCreateStream } from "@/hooks/use-streams";
import { useSimulcastPlatforms } from "@/hooks/use-simulcast";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { timeAgo } from "@/lib/format";

const PLATFORM_COLORS: Record<string, string> = {
  youtube: "#FF0000",
  twitch: "#9146FF",
  facebook: "#1877F2",
  linkedin: "#0A66C2",
};

const statusConfig = {
  live: { label: "LIVE", className: "bg-destructive/10 text-destructive", dot: true },
  scheduled: { label: "Upcoming", className: "bg-primary/10 text-primary", dot: false },
  ended: { label: "Replay", className: "bg-muted text-muted-foreground", dot: false },
};

const CommunityStreams = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: community } = useCommunityBySlug(slug);
  const { data: streams, isLoading } = useStreams(community?.id);
  const createStream = useCreateStream();
  const { data: simulcastPlatforms } = useSimulcastPlatforms(community?.id);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPlatformIds, setSelectedPlatformIds] = useState<string[]>([]);

  // After creating a stream, show RTMP credentials
  const [createdStream, setCreatedStream] = useState<{
    stream_key: string;
    rtmp_url: string;
    stream_id: string;
  } | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const isOwner = community && user && community.owner_id === user.id;

  const handleCreateStream = () => {
    if (!title.trim() || !community) return;

    createStream.mutate(
      {
        title,
        description,
        community_id: community.id,
        ...(selectedPlatformIds.length > 0 && { simulcast_platform_ids: selectedPlatformIds }),
      },
      {
        onSuccess: (data) => {
          setTitle("");
          setDescription("");
          setSelectedPlatformIds([]);
          setDialogOpen(false);
          setCreatedStream({
            stream_key: data.stream_key,
            rtmp_url: data.rtmp_url,
            stream_id: data.stream_id,
          });
          toast({ title: "Stream created!", description: "Use the RTMP credentials to go live in OBS." });
        },
        onError: (error) => {
          toast({ variant: "destructive", title: "Failed to create stream", description: error.message });
        },
      }
    );
  };

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

  return (
    <CommunityLayout communityName={community?.name ?? "Community"}>
      <div className="px-4 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Streams</h2>
          {isOwner && (
            <Button
              size="sm"
              className="btn-primary-gradient text-sm font-semibold gap-1.5"
              onClick={() => setDialogOpen(true)}
            >
              <Radio className="w-3.5 h-3.5" />
              Go Live
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (streams ?? []).length === 0 ? (
          <div className="text-center py-12">
            <Radio className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium mb-1">No streams yet</p>
            {isOwner && (
              <p className="text-xs text-muted-foreground">Click "Go Live" to start your first stream!</p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {(streams ?? []).map((stream) => {
              const config = statusConfig[stream.status];
              return (
                <Link
                  key={stream.id}
                  to={`/c/${slug}/streams/${stream.id}`}
                  className="block rounded-lg border border-border bg-card overflow-hidden card-interactive"
                >
                  <div className="aspect-video bg-muted relative flex items-center justify-center">
                    {stream.status === "live" ? (
                      <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <Radio className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                    ) : stream.status === "ended" ? (
                      <div className="w-12 h-12 rounded-full bg-card/60 backdrop-blur flex items-center justify-center">
                        <Play className="w-5 h-5 text-foreground ml-0.5" />
                      </div>
                    ) : (
                      <Clock className="w-6 h-6 text-muted-foreground/40" />
                    )}

                    <div className="absolute top-3 left-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${config.className}`}>
                        {config.dot && <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />}
                        {config.label}
                      </span>
                    </div>

                    {stream.viewer_count > 0 && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 text-xs text-muted-foreground bg-card/60 backdrop-blur px-2 py-1 rounded-full">
                        <Users className="w-3 h-3" />
                        {stream.viewer_count}
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-base mb-0.5">{stream.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{stream.description}</p>
                    <p className="text-xs text-muted-foreground">{timeAgo(stream.created_at)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Go Live Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Go Live</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Title</label>
              <Input
                placeholder="What are you streaming?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Description</label>
              <Textarea
                placeholder="Tell your audience what to expect..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* Simulcast platforms */}
            {community?.simulcast_enabled && (simulcastPlatforms ?? []).filter((p) => p.enabled).length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium mb-1 block">
                  Simulcast
                  <span className="text-[10px] font-bold tracking-widest text-primary/60 uppercase ml-2">ADD-ON</span>
                </label>
                <div className="space-y-2">
                  {(simulcastPlatforms ?? []).filter((p) => p.enabled).map((platform) => {
                    const color = PLATFORM_COLORS[platform.platform] ?? "#666";
                    const checked = selectedPlatformIds.includes(platform.id);
                    return (
                      <label
                        key={platform.id}
                        className="flex items-center gap-3 p-2.5 rounded-md border border-border bg-card/50 cursor-pointer hover:bg-card transition-colors"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(c) => {
                            setSelectedPlatformIds((prev) =>
                              c ? [...prev, platform.id] : prev.filter((id) => id !== platform.id)
                            );
                          }}
                        />
                        <div
                          className="w-6 h-6 rounded flex items-center justify-center shrink-0"
                          style={{ backgroundColor: color + "20" }}
                        >
                          <span className="text-[10px] font-bold" style={{ color }}>
                            {platform.platform[0].toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm">{platform.label}</span>
                      </label>
                    );
                  })}
                </div>
                {selectedPlatformIds.length > 0 && (
                  <p className="text-[11px] text-muted-foreground">
                    Streaming to {selectedPlatformIds.length} additional platform{selectedPlatformIds.length > 1 ? "s" : ""} may incur extra costs.
                  </p>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="btn-primary-gradient"
              onClick={handleCreateStream}
              disabled={!title.trim() || createStream.isPending}
            >
              {createStream.isPending ? "Creating..." : "Create Stream"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* RTMP Credentials Dialog */}
      <Dialog open={!!createdStream} onOpenChange={() => setCreatedStream(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Stream Credentials</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              Paste these into OBS (Settings &gt; Stream) to go live.
            </p>
            <div>
              <label className="text-sm font-medium mb-1.5 block">RTMP URL</label>
              <div className="flex gap-2">
                <Input value={createdStream?.rtmp_url ?? ""} readOnly className="font-mono text-xs" />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(createdStream?.rtmp_url ?? "", "url")}
                >
                  {copiedUrl ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Stream Key</label>
              <div className="flex gap-2">
                <Input value={createdStream?.stream_key ?? ""} readOnly className="font-mono text-xs" type="password" />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(createdStream?.stream_key ?? "", "key")}
                >
                  {copiedKey ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Link to={`/c/${slug}/streams/${createdStream?.stream_id}`}>
              <Button className="btn-primary-gradient">Go to Stream</Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CommunityLayout>
  );
};

export default CommunityStreams;
