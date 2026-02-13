import CommunityLayout from "@/components/CommunityLayout";
import { Radio, MessageSquare, ArrowRight, ChevronUp } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

const mockPosts = [
  { id: "1", title: "What content do you want to see next?", author: "Sarah K.", upvotes: 24, comments: 8, timeAgo: "2h" },
  { id: "2", title: "My biggest takeaway from today's stream", author: "Mike R.", upvotes: 18, comments: 5, timeAgo: "4h" },
  { id: "3", title: "Resource list from the masterclass", author: "Alex T.", upvotes: 31, comments: 12, timeAgo: "1d" },
];

const CommunityHome = () => {
  const { slug } = useParams();

  return (
    <CommunityLayout communityName="Creator Studio">
      <div className="px-4 py-4 space-y-6">
        {/* Live Banner */}
        <div className="relative overflow-hidden rounded-lg border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
              LIVE
            </div>
            <span className="text-xs text-muted-foreground">142 watching</span>
          </div>
          <h3 className="font-semibold text-base mb-1">Weekly Q&A Session</h3>
          <p className="text-sm text-muted-foreground mb-3">Ask me anything about growing your brand</p>
          <Link to={`/c/${slug}/streams`}>
            <Button size="sm" className="btn-primary-gradient text-sm font-semibold gap-1.5">
              Watch Now
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            to={`/c/${slug}/streams`}
            className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card card-interactive"
          >
            <Radio className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Streams</p>
              <p className="text-xs text-muted-foreground">3 upcoming</p>
            </div>
          </Link>
          <Link
            to={`/c/${slug}/discussions`}
            className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card card-interactive"
          >
            <MessageSquare className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Discussions</p>
              <p className="text-xs text-muted-foreground">12 new posts</p>
            </div>
          </Link>
        </div>

        {/* Trending Posts */}
        <div>
          <h2 className="font-semibold text-base mb-3">Trending</h2>
          <div className="space-y-2">
            {mockPosts.map((post) => (
              <Link
                key={post.id}
                to={`/c/${slug}/discussions/${post.id}`}
                className="flex items-start gap-3 p-4 rounded-lg bg-card post-card card-interactive"
              >
                <div className="flex flex-col items-center gap-0.5 text-muted-foreground min-w-[32px]">
                  <ChevronUp className="w-4 h-4" />
                  <span className="text-xs font-semibold">{post.upvotes}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium leading-snug mb-1 line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{post.author}</span>
                    <span>·</span>
                    <span>{post.comments} comments</span>
                    <span>·</span>
                    <span>{post.timeAgo}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </CommunityLayout>
  );
};

export default CommunityHome;
