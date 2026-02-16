import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Radio, MessageSquare, Users, Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useUserCommunities } from "@/hooks/use-community";
import logo from "@/assets/logo.png";

const features = [
  {
    icon: Radio,
    title: "Live Streaming",
    description: "Go live exclusively for your community. No algorithms, no distractions.",
    label: "CORE",
    accent: "from-primary/20 to-accent/10",
    borderAccent: "border-primary/25",
  },
  {
    icon: MessageSquare,
    title: "Discussions",
    description: "Reddit-style posts and comments. Your community drives the conversation.",
    label: "ENGAGE",
    accent: "from-accent/15 to-primary/10",
    borderAccent: "border-accent/20",
  },
  {
    icon: Users,
    title: "Lab Partners",
    description: "Turn followers into partners. Build real relationships, not vanity metrics.",
    label: "GROW",
    accent: "from-success/15 to-primary/10",
    borderAccent: "border-success/20",
  },
  {
    icon: Shield,
    title: "You Own It",
    description: "Your audience data. Your content. Your rules. No platform risk.",
    label: "CONTROL",
    accent: "from-secondary/15 to-accent/10",
    borderAccent: "border-secondary/25",
  },
];

const Index = () => {
  const { user, signOut } = useAuth();
  const { data: communities } = useUserCommunities(user?.id);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Where to send logged-in users — their first community or create one
  const dashboardPath = communities && communities.length > 0
    ? `/c/${communities[0].slug}`
    : "/create-community";

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Nav */}
       <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="container flex items-center justify-between h-14 px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Lab Partner" className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link to={dashboardPath}>
                  <Button size="sm" className="btn-primary-gradient text-sm font-medium">
                    My Lab
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground text-sm gap-1.5"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-muted-foreground text-sm">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="btn-primary-gradient text-sm font-medium">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-24 pb-16 px-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/8 blur-[120px]" />
        </div>

        <div className="relative container max-w-lg mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src={logo} alt="Lab Partner" className="h-56 w-auto mx-auto mb-8" />

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] mb-4">
              Your Audience.
              <br />
              Your Platform.
            </h1>

            <p className="text-foreground/80 text-lg leading-relaxed mb-8 max-w-sm mx-auto">
              Turn followers into partners. Stream live, spark discussions, and build a community you actually own.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to={user ? dashboardPath : "/signup"}>
                <Button size="lg" className="w-full sm:w-auto btn-primary-gradient text-base font-semibold gap-2 h-12 px-6">
                  {user ? "Go to My Lab" : "Create Your Lab"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 pb-20">
        <div className="container max-w-lg mx-auto">
          <h2 className="text-2xl font-bold tracking-tight mb-2 text-center">
            Built for creators who want more
          </h2>
          <p className="text-muted-foreground text-base mb-8 text-center">
            Everything you need to own your audience.
          </p>

          <div className="space-y-3">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              const isEven = i % 2 === 0;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: isEven ? -16 : 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className={`group relative overflow-hidden border ${feature.borderAccent} bg-card/60 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5`}
                >
                  {/* Gradient accent strip */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  <div className="relative flex items-start gap-4 p-5">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary/15 to-accent/10 border border-primary/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <Icon className="w-4.5 h-4.5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-[15px] font-semibold tracking-tight">{feature.title}</h3>
                        <span className="text-[10px] font-bold tracking-widest text-muted-foreground/60 uppercase">{feature.label}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20">
        <div className="container max-w-lg mx-auto text-center">
          <div className="p-8 border border-primary/20 bg-primary/5">
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              Ready to own your audience?
            </h2>
            <p className="text-muted-foreground text-base mb-6">
              Create your Lab in under 2 minutes. Free to start.
            </p>
            <Link to={user ? dashboardPath : "/signup"}>
              <Button size="lg" className="btn-primary-gradient text-base font-semibold gap-2 h-12 px-8">
                {user ? "Go to My Lab" : "Get Started Free"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 pb-8 pt-4 border-t border-border">
        <div className="container max-w-lg mx-auto flex items-center justify-between">
          <img src={logo} alt="Lab Partner" className="h-8 w-auto" />
          <p className="text-xs text-muted-foreground">
            © 2026 Keegareaux Labs
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
