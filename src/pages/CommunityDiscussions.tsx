import CommunityLayout from "@/components/CommunityLayout";
import { motion } from "framer-motion";
import { Plus, TrendingUp, MessageSquare, Clock } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const mockPosts = [
  { id: "1", title: "What content do you want to see next?", body: "I'm planning my content calendar for next month. Drop your ideas below!", author: "Sarah K.", upvotes: 24, comments: 8, timeAgo: "2h", isPinned: true },
  { id: "2", title: "My biggest takeaway from today's stream", body: "The part about audience retention was incredible...", author: "Mike R.", upvotes: 18, comments: 5, timeAgo: "4h", isPinned: false },
  { id: "3", title: "Resource list from the masterclass", body: "Here are all the tools and links mentioned during the stream.", author: "Alex T.", upvotes: 31, comments: 12, timeAgo: "1d", isPinned: false },
  { id: "4", title: "Introduce yourself! 👋", body: "Welcome to the community! Tell us about yourself and what brought you here.", author: "Creator", upvotes: 45, comments: 28, timeAgo: "3d", isPinned: true },
  { id: "5", title: "How I grew from 0 to 10k using these strategies", body: "Sharing my journey and the exact steps I took...", author: "Jordan L.", upvotes: 52, comments: 15, timeAgo: "5d", isPinned: false },
];

type SortMode = "hot" | "new";

const CommunityDiscussions = () => {
  const { slug } = useParams();
  const [sort, setSort] = useState<SortMode>("hot");

  const sorted = [...mockPosts].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    if (sort === "hot") return b.upvotes - a.upvotes;
    return 0;
  });

  return (
    <CommunityLayout communityName="Creator Studio">
      <div className="px-4 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Discussions</h2>
          <Button size="sm" className="text-xs font-semibold gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            New Post
          </Button>
        </div>

        {/* Sort Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-muted">
          <button
            onClick={() => setSort("hot")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors ${
              sort === "hot" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Hot
          </button>
          <button
            onClick={() => setSort("new")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors ${
              sort === "new" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            New
          </button>
        </div>

        {/* Posts */}
        <div className="space-y-2">
          {sorted.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to={`/c/${slug}/discussions/${post.id}`}
                className="block p-3.5 rounded-xl border border-border bg-card hover:border-primary/20 transition-colors"
              >
                {post.isPinned && (
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary mb-2">
                    Pinned
                  </span>
                )}
                <h3 className="text-sm font-medium leading-snug mb-1">{post.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{post.body}</p>
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                  <span className="font-medium text-foreground/70">{post.author}</span>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {post.upvotes}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {post.comments}
                  </div>
                  <span>{post.timeAgo}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </CommunityLayout>
  );
};

export default CommunityDiscussions;
