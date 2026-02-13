import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Radio, MessageSquare, Users, Zap, Shield, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const features = [
  {
    icon: Radio,
    title: "Live Streaming",
    description: "Go live exclusively for your community. No algorithms, no distractions.",
  },
  {
    icon: MessageSquare,
    title: "Discussions",
    description: "Reddit-style posts and comments. Your community drives the conversation.",
  },
  {
    icon: Users,
    title: "Lab Partners",
    description: "Turn followers into partners. Build real relationships, not vanity metrics.",
  },
  {
    icon: Palette,
    title: "Your Brand",
    description: "Custom colors, logo, domain. It looks like yours because it is yours.",
  },
  {
    icon: Shield,
    title: "You Own It",
    description: "Your audience data. Your content. Your rules. No platform risk.",
  },
  {
    icon: Zap,
    title: "Real-time",
    description: "Live updates on everything. Posts, comments, and votes appear instantly.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong safe-bottom">
        <div className="container flex items-center justify-between h-14 px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Lab Partner" className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-muted-foreground text-sm">
                Log in
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="text-sm font-medium">
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
          <div className="absolute top-40 left-1/4 w-[300px] h-[300px] bg-accent/6 rounded-full blur-[100px]" />
        </div>

        <div className="relative container max-w-lg mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Now in beta
            </div>

            <img src={logo} alt="Lab Partner" className="h-48 w-auto mx-auto mb-6 drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]" />

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] mb-4">
              Stop renting
              <br />
              <span className="text-gradient">your audience</span>
            </h1>

            <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-sm mx-auto">
              Turn followers into partners. Stream live, spark discussions, and build a community you actually own.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto text-base font-semibold gap-2 h-12 px-6">
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

      {/* Mock Phone Preview */}
      <section className="px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="container max-w-sm mx-auto"
        >
          <div className="rounded-2xl border border-border bg-card p-4 shadow-2xl shadow-primary/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Radio className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Creator Studio</p>
                <p className="text-xs text-muted-foreground">Live now · 142 watching</p>
              </div>
              <div className="ml-auto flex items-center gap-1 px-2 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                LIVE
              </div>
            </div>
            <div className="aspect-video rounded-xl bg-muted mb-4 flex items-center justify-center">
              <div className="text-center">
                <Radio className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground/60">Stream preview</p>
              </div>
            </div>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl bg-muted/50">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium">Lab Partner</p>
                      <span className="text-[10px] text-muted-foreground">2m ago</span>
                    </div>
                    <div className="h-3 w-3/4 bg-muted rounded mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-4 pb-20">
        <div className="container max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              Everything you need
            </h2>
            <p className="text-muted-foreground text-sm">
              Built for creators who want more than likes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors"
              >
                <feature.icon className="w-5 h-5 text-primary mb-3" />
                <h3 className="text-sm font-semibold mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20">
        <div className="container max-w-lg mx-auto text-center">
          <div className="p-8 rounded-2xl border border-primary/20 bg-primary/5">
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              Ready to own your audience?
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Create your Lab in under 2 minutes. Free to start.
            </p>
            <Link to="/signup">
              <Button size="lg" className="text-base font-semibold gap-2 h-12 px-8">
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
            © 2026 Lab Partner
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
