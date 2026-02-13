import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Radio, MessageSquare, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const features = [
  {
    icon: Radio,
    title: "Live Streaming",
    description: "Go live exclusively for your community. No algorithms, no distractions.",
    emphasis: true,
  },
  {
    icon: MessageSquare,
    title: "Discussions",
    description: "Reddit-style posts and comments. Your community drives the conversation.",
    emphasis: false,
  },
  {
    icon: Users,
    title: "Lab Partners",
    description: "Turn followers into partners. Build real relationships, not vanity metrics.",
    emphasis: false,
  },
  {
    icon: Shield,
    title: "You Own It",
    description: "Your audience data. Your content. Your rules. No platform risk.",
    emphasis: false,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="container flex items-center justify-between h-14 px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Lab Partner" className="h-7 w-auto" />
          </Link>
          <div className="flex items-center gap-2">
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
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-24 pb-16 px-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[120px]" />
        </div>

        <div className="relative container max-w-lg mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src={logo} alt="Lab Partner" className="h-40 w-auto mx-auto mb-8" />

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] mb-4">
              Your Audience.
              <br />
              Your Platform.
            </h1>

            <p className="text-foreground/80 text-lg leading-relaxed mb-8 max-w-sm mx-auto">
              Turn followers into partners. Stream live, spark discussions, and build a community you actually own.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto btn-primary-gradient text-base font-semibold gap-2 h-12 px-6">
                  Create Your Lab
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base h-12 px-6">
                  Join a Community
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

          <div className="space-y-2">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ scale: 1.015 }}
                  className="group relative flex items-start gap-4 p-4 rounded-lg border border-border/60 bg-card/50 backdrop-blur-sm cursor-default transition-colors hover:border-primary/30 hover:bg-primary/[0.03]"
                >
                  <div className="flex-shrink-0 mt-0.5 w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center transition-colors group-hover:bg-primary/15">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold tracking-tight mb-0.5">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
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
          <div className="p-8 rounded-lg border border-primary/20 bg-primary/5">
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              Ready to own your audience?
            </h2>
            <p className="text-muted-foreground text-base mb-6">
              Create your Lab in under 2 minutes. Free to start.
            </p>
            <Link to="/signup">
              <Button size="lg" className="btn-primary-gradient text-base font-semibold gap-2 h-12 px-8">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 pb-8 pt-4 border-t border-border">
        <div className="container max-w-lg mx-auto flex items-center justify-between">
          <img src={logo} alt="Lab Partner" className="h-6 w-auto" />
          <p className="text-xs text-muted-foreground">
            © 2026 Keegareaux Labs
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
