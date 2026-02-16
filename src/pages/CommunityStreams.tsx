import { useState, useRef } from "react";
import CommunityLayout from "@/components/CommunityLayout";
import { Radio, Play, Clock, Users, Copy, Check, Upload, Film } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useCommunityBySlug } from "@/hooks/use-community";
import { useStreams, useCreateStream } from "@/hooks/use-streams";
import { useVideos, useCreateVideo, useUploadVideo } from "@/hooks/use-videos";
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

const statusConfig: Record<string, { label: string; className: string; dot: boolean }> = {
  live: { label: "LIVE", className: "bg-destructive/10 text-destructive", dot: true },
  scheduled: { label: "Upcoming", className: "bg-primary/10 text-primary", dot: false },
  ended: { label: "Replay", className: "bg-muted text-muted-foreground", dot: false },
};

const CommunityStreams = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: community } = useCommunityBySlug(slug);
  const { data: streams, isLoading: streamsLoading } = useStreams(community?.id);
  const { data: videos, isLoading: videosLoading } = useVideos(community?.id);
  const createStream = useCreateStream();
  const createVideo = useCreateVideo();
  const uploadVideo = useUploadVideo();
  const { data: simulcastPlatforms } = useSimulcastPlatforms(community?.id);

  // Go Live dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPlatformIds, setSelectedPlatformIds] = useState<string[]>([]);

  // Upload video dialog state
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // RTMP credentials dialog
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

  const handleUploadVideo = async () => {
    if (!videoTitle.trim() || !videoFile || !community || !user) return;
    setIsUploading(true);
    try {
      const videoUrl = await uploadVideo.mutateAsync({ file: videoFile, userId: user.id });
      await createVideo.mutateAsync({
        community_id: community.id,
        owner_id: user.id,
        title: videoTitle,
        description: videoDescription || undefined,
        video_url: videoUrl,
      });
      setVideoTitle("");
      setVideoDescription("");
      setVideoFile(null);
      setUploadDialogOpen(false);
      toast({ title: "Video uploaded!", description: "Your video is now available." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Upload failed", description: error.message });
    } finally {
      setIsUploading(false);
    }
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

  const isLoading = streamsLoading || videosLoading;

  return (
    <CommunityLayout communityName={community?.name ?? "Community"}>
      <div className="px-4 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Streams & Videos</h2>
          {isOwner && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="text-sm font-semibold gap-1.5"
                onClick={() => setUploadDialogOpen(true)}
              >
                <Upload className="w-3.5 h-3.5" />
                Upload
              </Button>
              <Button
                size="sm"
                className="btn-primary-gradient text-sm font-semibold gap-1.5"
                onClick={() => setDialogOpen(true)}
              >
                <Radio className="w-3.5 h-3.5" />
                Go Live
              </Button>
            </div>
          )}
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
            <TabsTrigger value="streams" className="flex-1">Live & Replays</TabsTrigger>
            <TabsTrigger value="videos" className="flex-1">Videos</TabsTrigger>
          </TabsList>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <TabsContent value="all" className="space-y-3 mt-3">
                {(streams ?? []).length === 0 && (videos ?? []).length === 0 ? (
                  <EmptyState isOwner={!!isOwner} />
                ) : (
                  <>
                    {(streams ?? []).map((stream) => (
                      <StreamCard key={stream.id} stream={stream} slug={slug!} />
                    ))}
                    {(videos ?? []).map((video) => (
                      <VideoCard key={video.id} video={video} slug={slug!} />
                    ))}
                  </>
                )}
              </TabsContent>

              <TabsContent value="streams" className="space-y-3 mt-3">
                {(streams ?? []).length === 0 ? (
                  <EmptyState isOwner={!!isOwner} type="streams" />
                ) : (
                  (streams ?? []).map((stream) => (
                    <StreamCard key={stream.id} stream={stream} slug={slug!} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="videos" className="space-y-3 mt-3">
                {(videos ?? []).length === 0 ? (
                  <EmptyState isOwner={!!isOwner} type="videos" />
                ) : (
                  (videos ?? []).map((video) => (
                    <VideoCard key={video.id} video={video} slug={slug!} />
                  ))
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
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
              <Input placeholder="What are you streaming?" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Description</label>
              <Textarea placeholder="Tell your audience what to expect..." value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
            </div>
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
                      <label key={platform.id} className="flex items-center gap-3 p-2.5 rounded-md border border-border bg-card/50 cursor-pointer hover:bg-card transition-colors">
                        <Checkbox checked={checked} onCheckedChange={(c) => setSelectedPlatformIds((prev) => c ? [...prev, platform.id] : prev.filter((id) => id !== platform.id))} />
                        <div className="w-6 h-6 rounded flex items-center justify-center shrink-0" style={{ backgroundColor: color + "20" }}>
                          <span className="text-[10px] font-bold" style={{ color }}>{platform.platform[0].toUpperCase()}</span>
                        </div>
                        <span className="text-sm">{platform.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button className="btn-primary-gradient" onClick={handleCreateStream} disabled={!title.trim() || createStream.isPending}>
              {createStream.isPending ? "Creating..." : "Create Stream"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Video Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Video</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Title</label>
              <Input placeholder="Video title" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Description</label>
              <Textarea placeholder="What's this video about?" value={videoDescription} onChange={(e) => setVideoDescription(e.target.value)} rows={3} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Video File</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
              />
              {videoFile ? (
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
                  <Film className="w-5 h-5 text-primary shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{videoFile.name}</p>
                    <p className="text-xs text-muted-foreground">{(videoFile.size / (1024 * 1024)).toFixed(1)} MB</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setVideoFile(null)}>Change</Button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-8 rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center gap-2"
                >
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Click to select a video</span>
                  <span className="text-xs text-muted-foreground/60">MP4, MOV, WebM supported</span>
                </button>
              )}
            </div>
            {isUploading && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Uploading...</p>
                <Progress className="h-2" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setUploadDialogOpen(false)} disabled={isUploading}>Cancel</Button>
            <Button
              className="btn-primary-gradient"
              onClick={handleUploadVideo}
              disabled={!videoTitle.trim() || !videoFile || isUploading}
            >
              {isUploading ? "Uploading..." : "Upload Video"}
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
            <p className="text-sm text-muted-foreground">Paste these into OBS (Settings &gt; Stream) to go live.</p>
            <div>
              <label className="text-sm font-medium mb-1.5 block">RTMP URL</label>
              <div className="flex gap-2">
                <Input value={createdStream?.rtmp_url ?? ""} readOnly className="font-mono text-xs" />
                <Button variant="outline" size="icon" onClick={() => copyToClipboard(createdStream?.rtmp_url ?? "", "url")}>
                  {copiedUrl ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Stream Key</label>
              <div className="flex gap-2">
                <Input value={createdStream?.stream_key ?? ""} readOnly className="font-mono text-xs" type="password" />
                <Button variant="outline" size="icon" onClick={() => copyToClipboard(createdStream?.stream_key ?? "", "key")}>
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

// Sub-components
function StreamCard({ stream, slug }: { stream: any; slug: string }) {
  const config = statusConfig[stream.status] ?? statusConfig.ended;
  return (
    <Link
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
}

function VideoCard({ video, slug }: { video: any; slug: string }) {
  return (
    <Link
      to={`/c/${slug}/videos/${video.id}`}
      className="block rounded-lg border border-border bg-card overflow-hidden card-interactive"
    >
      <div className="aspect-video bg-muted relative flex items-center justify-center">
        {video.thumbnail_url ? (
          <img src={video.thumbnail_url} alt={video.title} className="absolute inset-0 w-full h-full object-cover" />
        ) : null}
        <div className="w-12 h-12 rounded-full bg-card/60 backdrop-blur flex items-center justify-center z-10">
          <Play className="w-5 h-5 text-foreground ml-0.5" />
        </div>
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold bg-accent text-accent-foreground">
            <Film className="w-3 h-3" />
            Video
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-base mb-0.5">{video.title}</h3>
        {video.description && <p className="text-sm text-muted-foreground mb-2">{video.description}</p>}
        <p className="text-xs text-muted-foreground">{timeAgo(video.created_at)}</p>
      </div>
    </Link>
  );
}

function EmptyState({ isOwner, type }: { isOwner: boolean; type?: string }) {
  return (
    <div className="text-center py-12">
      {type === "videos" ? (
        <Film className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
      ) : (
        <Radio className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
      )}
      <p className="text-sm font-medium mb-1">
        {type === "videos" ? "No videos yet" : type === "streams" ? "No streams yet" : "No content yet"}
      </p>
      {isOwner && (
        <p className="text-xs text-muted-foreground">
          {type === "videos" ? 'Click "Upload" to add your first video!' : 'Click "Go Live" or "Upload" to get started!'}
        </p>
      )}
    </div>
  );
}

export default CommunityStreams;
