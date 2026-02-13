import CommunityLayout from "@/components/CommunityLayout";
import { Radio, MessageSquare, ArrowRight, ChevronUp } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCommunityBySlug } from "@/hooks/use-community";
import { usePosts } from "@/hooks/use-posts";
import { useStreams } from "@/hooks/use-streams";
import { timeAgo } from "@/lib/format";

const CommunityHome = () => {
  const { slug } = useParams();
  const { data: community } = useCommunityBySlug(slug);
  const { data: posts } = usePosts(community?.id);
  const { data: streams } = useStreams(community?.id);

  const liveStream = streams?.find((s) => s.status === "live");
  const trendingPosts = (posts ?? []).slice(0, 3);

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

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            to={`/c/${slug}/streams`}
            className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card card-interactive"
          >
            <Radio className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Streams</p>
              <p className="text-xs text-muted-foreground">{streams?.length ?? 0} total</p>
            </div>
          </Link>
          <Link
            to={`/c/${slug}/discussions`}
            className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card card-interactive"
          >
            <MessageSquare className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Discussions</p>
              <p className="text-xs text-muted-foreground">{posts?.length ?? 0} posts</p>
            </div>
          </Link>
        </div>

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
