import { useState } from "react";
import CommunityLayout from "@/components/CommunityLayout";
import { Radio, MessageSquare, ArrowRight, ChevronUp, Film, Play, Users, Upload, Calendar, Share2, Link2, Code, Check } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCommunityBySlug, useCommunityMembers } from "@/hooks/use-community";
import { usePosts } from "@/hooks/use-posts";
import { useStreams } from "@/hooks/use-streams";
import { useVideos } from "@/hooks/use-videos";
import { useAuth } from "@/contexts/AuthContext";
import { timeAgo } from "@/lib/format";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const CommunityHome = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const { data: community } = useCommunityBySlug(slug);
  const { data: posts } = usePosts(community?.id);
  const { data: streams } = useStreams(community?.id);
  const { data: videos } = useVideos(community?.id);
  const { data: members } = useCommunityMembers(community?.id);

  const isOwner = user && community && user.id === community.owner_id;
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  const communityUrl = `${window.location.origin}/c/${slug}`;
  const embedCode = `<iframe src="${communityUrl}" width="100%" height="600" frameborder="0" style="border:0;border-radius:8px;" allowfullscreen></iframe>`;

  const copyToClipboard = (text: string, type: "url" | "embed") => {
    navigator.clipboard.writeText(text);
    if (type === "url") {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } else {
      setCopiedEmbed(true);
      setTimeout(() => setCopiedEmbed(false), 2000);
    }
  };

  const liveStream = streams?.find((s) => s.status === "live");
  const trendingPosts = (posts ?? []).slice(0, 3);
  const recentVideos = (videos ?? []).slice(0, 4);

  const lastLiveStream = streams
    ?.filter((s) => s.status !== "idle")
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

  return (
    <CommunityLayout communityName={community?.name ?? "Community"}>
      <div className="px-4 py-4 space-y-6">
        {/* Live Banner */}
        {liveStream ? (
          <div className="relative overflow-hidden rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                LIVE
              </div>
              <span className="text-xs text-muted-foreground">{liveStream.viewer_count} watching</span>
            </div>
            <h3 className="font-semibold text-base mb-1">{liveStream.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{liveStream.description}</p>
            <Link to={`/c/${slug}/streams/${liveStream.id}`}>
              <Button size="sm" className="btn-primary-gradient text-sm font-semibold gap-1.5">
                Watch Now
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <Radio className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No live streams right now</p>
          </div>
        )}

        {/* Owner: Stats Dashboard */}
        {isOwner && (
          <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-4 flex flex-col items-center text-center">
              <Users className="w-5 h-5 text-primary mb-2" />
              <p className="text-2xl font-bold">{members?.length ?? 0}</p>
              <p className="text-xs text-muted-foreground">Lab Partners</p>
            </div>
            <Link to={`/c/${slug}/streams`} className="rounded-lg border border-border bg-card p-4 flex flex-col items-center text-center card-interactive">
              <Radio className="w-5 h-5 text-primary mb-2" />
              <p className="text-2xl font-bold">{streams?.length ?? 0}</p>
              <p className="text-xs text-muted-foreground">Streams</p>
            </Link>
            <Link to={`/c/${slug}/discussions`} className="rounded-lg border border-border bg-card p-4 flex flex-col items-center text-center card-interactive">
              <MessageSquare className="w-5 h-5 text-primary mb-2" />
              <p className="text-2xl font-bold">{posts?.length ?? 0}</p>
              <p className="text-xs text-muted-foreground">Discussions</p>
            </Link>
            <Link to={`/c/${slug}/streams`} className="rounded-lg border border-border bg-card p-4 flex flex-col items-center text-center card-interactive">
              <Upload className="w-5 h-5 text-primary mb-2" />
              <p className="text-2xl font-bold">{videos?.length ?? 0}</p>
              <p className="text-xs text-muted-foreground">Uploads</p>
            </Link>
            <div className="rounded-lg border border-border bg-card p-4 flex flex-col items-center text-center col-span-2 sm:col-span-2">
              <Calendar className="w-5 h-5 text-primary mb-2" />
              <p className="text-sm font-bold">
                {lastLiveStream ? format(new Date(lastLiveStream.created_at), "MMM d, yyyy") : "Never"}
              </p>
              <p className="text-xs text-muted-foreground">Last Live Stream</p>
            </div>
          </div>

          {/* Get New Followers */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full gap-2 btn-primary-gradient text-sm font-semibold">
                <Users className="w-4 h-4" />
                Get New Followers
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Get New Followers</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-primary" />
                    Community URL
                  </label>
                  <div className="flex gap-2">
                    <Input value={communityUrl} readOnly className="text-sm" />
                    <Button
                      size="sm"
                      variant={copiedUrl ? "default" : "secondary"}
                      className="shrink-0 gap-1.5"
                      onClick={() => copyToClipboard(communityUrl, "url")}
                    >
                      {copiedUrl ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                      {copiedUrl ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Code className="w-4 h-4 text-primary" />
                    Embed Code
                  </label>
                  <Textarea value={embedCode} readOnly rows={3} className="text-xs font-mono" />
                  <Button
                    size="sm"
                    variant={copiedEmbed ? "default" : "secondary"}
                    className="w-full gap-1.5"
                    onClick={() => copyToClipboard(embedCode, "embed")}
                  >
                    {copiedEmbed ? <Check className="w-4 h-4" /> : <Code className="w-4 h-4" />}
                    {copiedEmbed ? "Copied!" : "Copy Embed Code"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          </>
        )}

        {/* Subscriber: Public Profile / About */}
        {!isOwner && (
          <div className="rounded-lg border border-border bg-card p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                {community?.logo_url ? (
                  <img src={community.logo_url} alt={community.name} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <span className="text-primary font-bold text-lg">
                    {community?.name?.[0]?.toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h2 className="font-semibold text-lg">{community?.name}</h2>
                <p className="text-xs text-muted-foreground">{members?.length ?? 0} Lab Partners</p>
              </div>
            </div>
            {community?.description && (
              <p className="text-sm text-muted-foreground">{community.description}</p>
            )}
            {community?.welcome_message && (
              <p className="text-sm text-foreground/80 italic border-l-2 border-primary/30 pl-3">
                {community.welcome_message}
              </p>
            )}
            {!user && (
              <Link to="/signup">
                <Button size="sm" className="btn-primary-gradient text-sm font-semibold gap-1.5 w-full mt-2">
                  Join Community
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            )}
          </div>
        )}

        {/* Recent Videos */}
        {recentVideos.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-base">Recent Videos</h2>
              <Link to={`/c/${slug}/streams`} className="text-xs text-primary hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {recentVideos.map((video) => (
                <Link
                  key={video.id}
                  to={`/c/${slug}/videos/${video.id}`}
                  className="rounded-lg border border-border bg-card overflow-hidden card-interactive"
                >
                  <div className="aspect-video bg-muted relative flex items-center justify-center">
                    {video.thumbnail_url ? (
                      <img src={video.thumbnail_url} alt={video.title} className="absolute inset-0 w-full h-full object-cover" />
                    ) : null}
                    <div className="w-10 h-10 rounded-full bg-card/60 backdrop-blur flex items-center justify-center z-10">
                      <Play className="w-4 h-4 text-foreground ml-0.5" />
                    </div>
                  </div>
                  <div className="p-2.5">
                    <h3 className="text-sm font-medium line-clamp-1">{video.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{timeAgo(video.created_at)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card p-6 text-center">
            <Film className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium mb-1">No videos yet</p>
            <p className="text-xs text-muted-foreground">Uploaded videos will appear here</p>
          </div>
        )}

        {/* Trending Posts */}
        {trendingPosts.length > 0 ? (
          <div>
            <h2 className="font-semibold text-base mb-3">Trending</h2>
            <div className="space-y-2">
              {trendingPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/c/${slug}/discussions/${post.id}`}
                  className="flex items-start gap-3 p-4 rounded-lg bg-card post-card card-interactive"
                >
                  <div className="flex flex-col items-center gap-0.5 text-muted-foreground min-w-[32px]">
                    <ChevronUp className="w-4 h-4" />
                    <span className="text-xs font-semibold">{post.upvote_count}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium leading-snug mb-1 line-clamp-2">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{(post as any).profiles?.full_name ?? "Unknown"}</span>
                      <span>·</span>
                      <span>{post.comment_count} comments</span>
                      <span>·</span>
                      <span>{timeAgo(post.created_at)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card p-6 text-center">
            <MessageSquare className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium mb-1">No posts yet</p>
            <p className="text-xs text-muted-foreground">Start a discussion to get things going!</p>
            <Link to={`/c/${slug}/discussions`}>
              <Button size="sm" className="btn-primary-gradient text-sm font-semibold gap-1.5 mt-3">
                Go to Discussions
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </CommunityLayout>
  );
};

export default CommunityHome;