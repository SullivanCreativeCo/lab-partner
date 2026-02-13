import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const CreateCommunity = () => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [welcome, setWelcome] = useState("");

  const handleNameChange = (value: string) => {
    setName(value);
    setSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <Link to="/" className="font-display text-lg font-bold tracking-tight">
          lab<span className="text-primary">partner</span>
        </Link>
        <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" />
          Back
        </Link>
      </div>

      <div className="flex-1 flex items-start justify-center px-4 pt-8 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <h1 className="text-2xl font-bold tracking-tight mb-1">Create your Lab</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Set up your branded community space
          </p>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Community Name</Label>
              <Input
                placeholder="Creator Studio"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="h-11 bg-muted/50 border-border"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">URL Slug</Label>
              <div className="flex items-center gap-0 rounded-lg border border-border overflow-hidden bg-muted/50">
                <span className="px-3 text-xs text-muted-foreground bg-muted border-r border-border h-11 flex items-center">
                  labpartner.app/c/
                </span>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="h-11 border-0 bg-transparent rounded-none focus-visible:ring-0 text-sm"
                  placeholder="my-community"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Welcome Message</Label>
              <Textarea
                placeholder="Welcome to the community! We're glad you're here."
                value={welcome}
                onChange={(e) => setWelcome(e.target.value)}
                className="bg-muted/50 border-border min-h-[80px] resize-none"
              />
              <p className="text-[10px] text-muted-foreground">Shown to new members when they join</p>
            </div>

            {/* Preview */}
            {name && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="rounded-xl border border-border bg-card p-4"
              >
                <p className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wider font-semibold">Preview</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-display font-bold text-sm">
                    {name[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{name}</p>
                    <p className="text-[10px] text-muted-foreground">labpartner.app/c/{slug || "..."}</p>
                  </div>
                </div>
              </motion.div>
            )}

            <Link to={slug ? `/c/${slug}` : "#"}>
              <Button
                type="submit"
                className="w-full h-11 text-sm font-semibold gap-2 mt-2"
                disabled={!name || !slug}
              >
                Create Lab
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateCommunity;
