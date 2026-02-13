import CommunityLayout from "@/components/CommunityLayout";
import { Crown, Shield, MoreHorizontal } from "lucide-react";
import { useParams } from "react-router-dom";
import { useCommunityBySlug, useCommunityMembers } from "@/hooks/use-community";
import { timeAgo } from "@/lib/format";

const roleConfig = {
  owner: { icon: Crown, label: "Owner", className: "text-amber-400" },
  moderator: { icon: Shield, label: "Mod", className: "text-primary" },
  member: { icon: null, label: null, className: "" },
};

const CommunityMembers = () => {
  const { slug } = useParams();
  const { data: community } = useCommunityBySlug(slug);
  const { data: members, isLoading } = useCommunityMembers(community?.id);

  return (
    <CommunityLayout communityName={community?.name ?? "Community"}>
      <div className="px-4 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-lg">Lab Partners</h2>
            <p className="text-sm text-muted-foreground">{members?.length ?? 0} members</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (members ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-12">No members yet</p>
        ) : (
          <div className="space-y-1">
            {(members ?? []).map((member) => {
              const config = roleConfig[member.role as keyof typeof roleConfig];
              const profile = (member as any).profiles;
              const name = profile?.full_name || "Unknown";
              const avatar = name[0]?.toUpperCase() ?? "?";

              return (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary flex-shrink-0">
                    {avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{name}</p>
                      {config.icon && (
                        <config.icon className={`w-3.5 h-3.5 ${config.className}`} />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Joined {timeAgo(member.joined_at)}</p>
                  </div>
                  <button className="text-muted-foreground hover:text-foreground transition-colors p-1">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </CommunityLayout>
  );
};

export default CommunityMembers;
