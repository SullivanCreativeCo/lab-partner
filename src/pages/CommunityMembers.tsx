import CommunityLayout from "@/components/CommunityLayout";
import { motion } from "framer-motion";
import { Crown, Shield, MoreHorizontal } from "lucide-react";

const members = [
  { id: "1", name: "Creator Name", role: "owner", joinedAgo: "Founder", avatar: "C" },
  { id: "2", name: "Sarah K.", role: "moderator", joinedAgo: "2 months ago", avatar: "S" },
  { id: "3", name: "Mike R.", role: "member", joinedAgo: "1 month ago", avatar: "M" },
  { id: "4", name: "Alex T.", role: "member", joinedAgo: "3 weeks ago", avatar: "A" },
  { id: "5", name: "Jordan L.", role: "member", joinedAgo: "2 weeks ago", avatar: "J" },
  { id: "6", name: "Casey P.", role: "member", joinedAgo: "1 week ago", avatar: "C" },
  { id: "7", name: "Riley M.", role: "member", joinedAgo: "5 days ago", avatar: "R" },
  { id: "8", name: "Taylor S.", role: "member", joinedAgo: "2 days ago", avatar: "T" },
];

const roleConfig = {
  owner: { icon: Crown, label: "Owner", className: "text-amber-400" },
  moderator: { icon: Shield, label: "Mod", className: "text-primary" },
  member: { icon: null, label: null, className: "" },
};

const CommunityMembers = () => {
  return (
    <CommunityLayout communityName="Creator Studio">
      <div className="px-4 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-lg">Lab Partners</h2>
            <p className="text-xs text-muted-foreground">{members.length} members</p>
          </div>
        </div>

        <div className="space-y-1">
          {members.map((member, i) => {
            const config = roleConfig[member.role as keyof typeof roleConfig];
            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary flex-shrink-0">
                  {member.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{member.name}</p>
                    {config.icon && (
                      <config.icon className={`w-3.5 h-3.5 ${config.className}`} />
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground">Joined {member.joinedAgo}</p>
                </div>
                <button className="text-muted-foreground hover:text-foreground transition-colors p-1">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </CommunityLayout>
  );
};

export default CommunityMembers;
