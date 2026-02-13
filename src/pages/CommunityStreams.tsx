import CommunityLayout from "@/components/CommunityLayout";
import { Radio, Play, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const streams = [
  {
    id: "1",
    title: "Weekly Q&A Session",
    description: "Ask me anything about growing your brand",
    status: "live" as const,
    viewers: 142,
    time: "Started 34 min ago",
  },
  {
    id: "2",
    title: "Content Strategy Masterclass",
    description: "Deep dive into creating content that converts",
    status: "scheduled" as const,
    viewers: 0,
    time: "Tomorrow, 3:00 PM",
  },
  {
    id: "3",
    title: "Behind the Scenes",
    description: "A look at my creative process",
    status: "ended" as const,
    viewers: 89,
    time: "2 days ago · 1h 23m",
  },
  {
    id: "4",
    title: "Community Kickoff",
    description: "Welcome to the Lab!",
    status: "ended" as const,
    viewers: 203,
    time: "1 week ago · 45m",
  },
];

const statusConfig = {
  live: { label: "LIVE", className: "bg-destructive/10 text-destructive", dot: true },
  scheduled: { label: "Upcoming", className: "bg-primary/10 text-primary", dot: false },
  ended: { label: "Replay", className: "bg-muted text-muted-foreground", dot: false },
};

const CommunityStreams = () => {
  return (
    <CommunityLayout communityName="Creator Studio">
      <div className="px-4 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Streams</h2>
          <Button size="sm" className="btn-primary-gradient text-sm font-semibold gap-1.5">
            <Radio className="w-3.5 h-3.5" />
            Go Live
          </Button>
        </div>

        <div className="space-y-3">
          {streams.map((stream) => {
            const config = statusConfig[stream.status];
            return (
              <div
                key={stream.id}
                className="rounded-lg border border-border bg-card overflow-hidden card-interactive"
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

                  {stream.viewers > 0 && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 text-xs text-muted-foreground bg-card/60 backdrop-blur px-2 py-1 rounded-full">
                      <Users className="w-3 h-3" />
                      {stream.viewers}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-base mb-0.5">{stream.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{stream.description}</p>
                  <p className="text-xs text-muted-foreground">{stream.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </CommunityLayout>
  );
};

export default CommunityStreams;
