import CommunityLayout from "@/components/CommunityLayout";
import { Radio, Play, Clock, Users } from "lucide-react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCommunityBySlug } from "@/hooks/use-community";
import { useStreams } from "@/hooks/use-streams";
import { timeAgo } from "@/lib/format";

const statusConfig = {
  live: { label: "LIVE", className: "bg-destructive/10 text-destructive", dot: true },
  scheduled: { label: "Upcoming", className: "bg-primary/10 text-primary", dot: false },
  ended: { label: "Replay", className: "bg-muted text-muted-foreground", dot: false },
};

const CommunityStreams = () => {
  const { slug } = useParams();
  const { data: community } = useCommunityBySlug(slug);
  const { data: streams, isLoading } = useStreams(community?.id);

  return (
    <CommunityLayout communityName={community?.name ?? "Community"}>
      <div className="px-4 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Streams</h2>
          <Button size="sm" className="btn-primary-gradient text-sm font-semibold gap-1.5">
            <Radio className="w-3.5 h-3.5" />
            Go Live
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (streams ?? []).length === 0 ? (
          <div className="text-center py-12">
            <Radio className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium mb-1">No streams yet</p>
            <p className="text-xs text-muted-foreground">Click "Go Live" to start your first stream!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {(streams ?? []).map((stream) => {
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
                </div>
              );
            })}
          </div>
        )}
      </div>
    </CommunityLayout>
  );
};

export default CommunityStreams;
