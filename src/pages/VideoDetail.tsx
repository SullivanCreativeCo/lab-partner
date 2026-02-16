import { useState } from "react";
import CommunityLayout from "@/components/CommunityLayout";
import { ArrowLeft, ChevronUp, MessageSquare, Send, Trash2, Play } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCommunityBySlug } from "@/hooks/use-community";
import { useVideo, useVideoComments, useCreateVideoComment } from "@/hooks/use-videos";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { timeAgo } from "@/lib/format";

const VideoDetail = () => {
  const { slug, videoId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: community } = useCommunityBySlug(slug);
  const { data: video, isLoading } = useVideo(videoId);
  const { data: comments } = useVideoComments(videoId);
  const createComment = useCreateVideoComment();
  const [comment, setComment] = useState("");

  const handleReply = () => {
    if (!comment.trim() || !user || !videoId) return;
    createComment.mutate(
      { video_id: videoId, body: comment, author_id: user.id },
      {
        onSuccess: () => setComment(""),
        onError: (error) =>
          toast({ variant: "destructive", title: "Failed to post comment", description: error.message }),
      }
    );
  };

  const handleDeleteComment = async (commentId: string) => {
    const { error } = await supabase.from("video_comments").delete().eq("id", commentId);
    if (error) {
      toast({ variant: "destructive", title: "Failed to delete", description: error.message });
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["video-comments", videoId] });
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

  if (!video) {
    return (
      <CommunityLayout communityName={community?.name ?? "Community"}>
        <div className="px-4 py-12 text-center">
          <h2 className="text-lg font-semibold mb-2">Video not found</h2>
          <Link to={`/c/${slug}/streams`} className="text-primary text-sm hover:underline">Back to streams</Link>
        </div>
      </CommunityLayout>
    );
  }

  const authorName = (video as any).profiles?.full_name ?? "Unknown";

  return (
    <CommunityLayout communityName={community?.name ?? "Community"}>
      <div className="px-4 py-4 space-y-4">
        <Link
          to={`/c/${slug}/streams`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Streams
        </Link>

        {/* Video Player */}
        <div className="rounded-lg overflow-hidden border border-border bg-black">
          <video
            src={video.video_url}
            controls
            className="w-full aspect-video"
            poster={video.thumbnail_url ?? undefined}
          />
        </div>

        {/* Video Info */}
        <div>
          <h1 className="text-xl font-bold mb-1">{video.title}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
              {authorName[0]}
            </div>
            <span className="font-medium text-foreground/80">{authorName}</span>
            <span>·</span>
            <span>{timeAgo(video.created_at)}</span>
          </div>
          {video.description && (
            <p className="text-sm text-muted-foreground">{video.description}</p>
          )}
          <div className="flex items-center gap-4 pt-3 mt-3 border-t border-border">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Play className="w-4 h-4" />
              <span>{video.view_count ?? 0} views</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <ChevronUp className="w-4 h-4" />
              <span>{video.upvote_count ?? 0}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MessageSquare className="w-4 h-4" />
              <span>{comments?.length ?? 0} comments</span>
            </div>
          </div>
        </div>

        {/* Comment Input */}
        <div className="rounded-lg border border-border bg-card p-3">
          <Textarea
            placeholder="Share your thoughts..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="bg-transparent border-0 p-0 text-sm resize-none min-h-[60px] focus-visible:ring-0"
          />
          <div className="flex justify-end mt-2">
            <Button
              size="sm"
              className="btn-primary-gradient text-sm font-semibold gap-1.5"
              disabled={!comment.trim() || createComment.isPending}
              onClick={handleReply}
            >
              <Send className="w-3.5 h-3.5" />
              {createComment.isPending ? "Sending..." : "Reply"}
            </Button>
          </div>
        </div>

        {/* Comments */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Comments</p>
          {(comments ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No comments yet. Be the first!</p>
          ) : (
            (comments ?? []).map((c) => {
              const cAuthor = (c as any).profiles?.full_name ?? "Unknown";
              return (
                <div key={c.id} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                      {cAuthor[0]}
                    </div>
                    <span className="text-sm font-medium">{cAuthor}</span>
                    <span className="text-xs text-muted-foreground">{timeAgo(c.created_at)}</span>
                    {c.author_id === user?.id && (
                      <button
                        onClick={() => handleDeleteComment(c.id)}
                        className="ml-auto text-muted-foreground/40 hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">{c.body}</p>
                  <button className="flex items-center gap-1 mt-2 text-xs text-muted-foreground hover:text-primary transition-colors">
                    <ChevronUp className="w-3.5 h-3.5" />
                    <span className="font-semibold">{c.upvote_count}</span>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </CommunityLayout>
  );
};

export default VideoDetail;
