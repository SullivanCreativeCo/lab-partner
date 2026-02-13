import CommunityLayout from "@/components/CommunityLayout";
import { Plus, ChevronUp, MessageSquare, Clock, TrendingUp } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useCommunityBySlug } from "@/hooks/use-community";
import { usePosts, useCreatePost } from "@/hooks/use-posts";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { timeAgo } from "@/lib/format";

type SortMode = "hot" | "new";

const CommunityDiscussions = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: community } = useCommunityBySlug(slug);
  const { data: posts, isLoading } = usePosts(community?.id);
  const createPost = useCreatePost();
  const [sort, setSort] = useState<SortMode>("hot");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");

  const sorted = [...(posts ?? [])].sort((a, b) => {
    if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
    if (sort === "hot") return b.upvote_count - a.upvote_count;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const handleCreatePost = async () => {
    if (!newTitle.trim() || !community || !user) return;
    createPost.mutate(
      {
        community_id: community.id,
        title: newTitle,
        body: newBody,
        author_id: user.id,
      },
      {
        onSuccess: () => {
          setNewTitle("");
          setNewBody("");
          setDialogOpen(false);
          toast({ title: "Post created" });
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Failed to create post",
            description: error.message,
          });
        },
      }
    );
  };

  return (
    <CommunityLayout communityName={community?.name ?? "Community"}>
      <div className="px-4 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Discussions</h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="btn-primary-gradient text-sm font-semibold gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>New Post</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Title</Label>
                  <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="What's on your mind?"
                    className="h-11 bg-muted/50 border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Body</Label>
                  <Textarea
                    value={newBody}
                    onChange={(e) => setNewBody(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="bg-muted/50 border-border min-h-[120px] resize-none"
                  />
                </div>
                <Button
                  onClick={handleCreatePost}
                  className="w-full h-11 btn-primary-gradient text-sm font-semibold"
                  disabled={!newTitle.trim() || createPost.isPending}
                >
                  {createPost.isPending ? "Posting..." : "Post"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Sort Tabs */}
        <div className="flex gap-1 p-1 rounded-lg bg-muted">
          <button
            onClick={() => setSort("hot")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-medium transition-colors ${
              sort === "hot" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Hot
          </button>
          <button
            onClick={() => setSort("new")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-medium transition-colors ${
              sort === "new" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            New
          </button>
        </div>

        {/* Posts */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium mb-1">No discussions yet</p>
            <p className="text-xs text-muted-foreground">Be the first to start a conversation!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sorted.map((post) => (
              <Link
                key={post.id}
                to={`/c/${slug}/discussions/${post.id}`}
                className="block p-4 rounded-lg bg-card post-card card-interactive"
              >
                {post.is_pinned && (
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-primary/10 text-primary mb-2">
                    Pinned
                  </span>
                )}
                <h3 className="text-sm font-medium leading-snug mb-1">{post.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.body}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground/70">
                    {(post as any).profiles?.full_name ?? "Unknown"}
                  </span>
                  <div className="flex items-center gap-1">
                    <ChevronUp className="w-3.5 h-3.5" />
                    {post.upvote_count}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {post.comment_count}
                  </div>
                  <span>{timeAgo(post.created_at)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </CommunityLayout>
  );
};

export default CommunityDiscussions;
