import CommunityLayout from "@/components/CommunityLayout";
import { ArrowLeft, ChevronUp, MessageSquare, Send, Trash2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const post = {
  id: "1",
  title: "What content do you want to see next?",
  body: "I'm planning my content calendar for next month and I want to make sure I'm creating content that's actually useful to you all.\n\nSome ideas I have:\n• Deep dive tutorials on audience growth\n• Behind-the-scenes of my creative process\n• Live Q&A sessions every week\n• Collaborative projects with Lab Partners\n\nWhat would be most valuable to you? Drop your thoughts below!",
  author: "Sarah K.",
  upvotes: 24,
  timeAgo: "2h",
  isPinned: true,
};

const comments = [
  { id: "1", author: "Mike R.", body: "The deep dive tutorials would be amazing! Especially on audience growth strategies.", upvotes: 8, timeAgo: "1h" },
  { id: "2", author: "Alex T.", body: "Collaborative projects! I'd love to work on something together with this community.", upvotes: 12, timeAgo: "45m" },
  { id: "3", author: "Jordan L.", body: "+1 for the Q&A sessions. Those are always the most insightful.", upvotes: 5, timeAgo: "30m" },
  { id: "4", author: "Casey P.", body: "All of the above honestly. But if I had to pick one - the behind the scenes content. It's so rare to get an honest look at someone's process.", upvotes: 15, timeAgo: "20m" },
];

const PostDetail = () => {
  const { slug } = useParams();
  const [comment, setComment] = useState("");

  return (
    <CommunityLayout communityName="Creator Studio">
      <div className="px-4 py-4 space-y-4">
        {/* Back */}
        <Link
          to={`/c/${slug}/discussions`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to discussions
        </Link>

        {/* Post */}
        <article className="rounded-lg bg-card post-card p-4">
          {post.isPinned && (
            <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-primary/10 text-primary mb-2">
              Pinned
            </span>
          )}
          <h1 className="text-lg font-bold leading-snug mb-2">{post.title}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
              {post.author[0]}
            </div>
            <span className="font-medium text-foreground/80">{post.author}</span>
            <span>·</span>
            <span>{post.timeAgo}</span>
          </div>
          <div className="text-base text-foreground/80 leading-relaxed whitespace-pre-line mb-4">
            {post.body}
          </div>
          <div className="flex items-center gap-4 pt-3 border-t border-border">
            <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
              <ChevronUp className="w-4 h-4" />
              <span className="font-semibold">{post.upvotes}</span>
            </button>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MessageSquare className="w-4 h-4" />
              <span>{comments.length} comments</span>
            </div>
          </div>
        </article>

        {/* Comment Input */}
        <div className="rounded-lg border border-border bg-card p-3">
          <Textarea
            placeholder="Share your thoughts..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="bg-transparent border-0 p-0 text-sm resize-none min-h-[60px] focus-visible:ring-0"
          />
          <div className="flex justify-end mt-2">
            <Button size="sm" className="btn-primary-gradient text-sm font-semibold gap-1.5" disabled={!comment.trim()}>
              <Send className="w-3.5 h-3.5" />
              Reply
            </Button>
          </div>
        </div>

        {/* Comments */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Comments
          </p>
          {comments.map((c) => (
            <div
              key={c.id}
              className="rounded-lg border border-border bg-card p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                  {c.author[0]}
                </div>
                <span className="text-sm font-medium">{c.author}</span>
                <span className="text-xs text-muted-foreground">{c.timeAgo}</span>
                <button className="ml-auto text-muted-foreground/40 hover:text-destructive transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">{c.body}</p>
              <button className="flex items-center gap-1 mt-2 text-xs text-muted-foreground hover:text-primary transition-colors">
                <ChevronUp className="w-3.5 h-3.5" />
                <span className="font-semibold">{c.upvotes}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </CommunityLayout>
  );
};

export default PostDetail;
