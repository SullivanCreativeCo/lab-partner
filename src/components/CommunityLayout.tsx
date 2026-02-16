import { ReactNode } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Radio, MessageSquare, Users, Settings, Home } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCommunityBySlug } from "@/hooks/use-community";

interface CommunityLayoutProps {
  children: ReactNode;
  communityName?: string;
}

const ownerNavItems = [
  { icon: Home, label: "Home", path: "" },
  { icon: Radio, label: "Streams", path: "/streams" },
  { icon: MessageSquare, label: "Discuss", path: "/discussions" },
  { icon: Users, label: "Members", path: "/members" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const subscriberNavItems = [
  { icon: Home, label: "Home", path: "" },
  { icon: Radio, label: "Streams", path: "/streams" },
  { icon: MessageSquare, label: "Discuss", path: "/discussions" },
];

const CommunityLayout = ({ children, communityName = "Community" }: CommunityLayoutProps) => {
  const { slug } = useParams();
  const location = useLocation();
  const basePath = `/c/${slug}`;
  const { user } = useAuth();
  const { data: community } = useCommunityBySlug(slug);
  const isOwner = user && community && user.id === community.owner_id;
  const navItems = isOwner ? ownerNavItems : subscriberNavItems;

  const isActive = (path: string) => {
    if (path === "") return location.pathname === basePath;
    return location.pathname.startsWith(basePath + path);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-strong h-14">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold text-sm">
                {communityName[0]?.toUpperCase()}
              </span>
            </div>
            <h1 className="font-semibold text-sm truncate max-w-[200px]">
              {communityName}
            </h1>
          </div>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Exit
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 pt-14 pb-24">
        {children}
        {/* Powered by footer */}
        <div className="mt-8 px-4 pb-2 text-center">
          <p className="text-xs text-muted-foreground/60 hover:text-primary transition-colors cursor-pointer">
            Powered by Keegareaux Labs
          </p>
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border safe-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.label}
                to={basePath + item.path}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                  active
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default CommunityLayout;
