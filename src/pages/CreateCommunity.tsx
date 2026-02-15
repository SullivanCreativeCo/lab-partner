import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";

const COLOR_PRESETS = [
  { label: "Blue", value: "#2F80ED" },
  { label: "Purple", value: "#7C3AED" },
  { label: "Green", value: "#10B981" },
  { label: "Red", value: "#EF4444" },
  { label: "Orange", value: "#F59E0B" },
  { label: "Pink", value: "#EC4899" },
];

const CreateCommunity = () => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [welcome, setWelcome] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#2F80ED");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleNameChange = (value: string) => {
    setName(value);
    setSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setLogoPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name || !slug) return;
    setLoading(true);

    const { data: community, error } = await supabase
      .from("communities")
      .insert({
        name,
        slug,
        welcome_message: welcome,
        primary_color: primaryColor,
        owner_id: user.id,
      })
      .select()
      .single();

    if (error) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Failed to create community",
        description: error.message,
      });
      return;
    }

    // Add creator as owner member
    const { error: memberError } = await supabase.from("members").insert({
      community_id: community.id,
      user_id: user.id,
      role: "owner",
    });

    if (memberError) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Failed to add you as a member",
        description: memberError.message,
      });
      return;
    }

    setLoading(false);
    navigate(`/c/${slug}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Lab Partner" className="h-8 w-auto" />
        </Link>
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
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

          <form className="space-y-5" onSubmit={handleCreate}>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Community Name</Label>
              <Input
                placeholder="Creator Studio"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="h-11 bg-muted/50 border-border"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">URL Slug</Label>
              <div className="flex items-center gap-0 border border-border overflow-hidden bg-muted/50">
                <span className="px-3 text-xs text-muted-foreground bg-muted border-r border-border h-11 flex items-center">
                  labpartner.app/c/
                </span>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="h-11 border-0 bg-transparent rounded-none focus-visible:ring-0 text-sm"
                  placeholder="my-community"
                  disabled={loading}
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
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">Shown to new members when they join</p>
            </div>

            {/* Logo Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Logo</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={handleLogoUpload}
                className="hidden"
              />
              {logoPreview ? (
                <div className="relative inline-block">
                  <img
                    src={logoPreview}
                    alt="Community logo"
                    className="w-16 h-16 object-cover border border-border bg-muted"
                  />
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-3 p-3 border border-dashed border-border bg-muted/30 hover:bg-muted/50 transition-colors w-full text-left"
                >
                  <div className="w-12 h-12 border border-border flex items-center justify-center bg-muted/50">
                    <Upload className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Upload logo</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, SVG · Max 2MB</p>
                  </div>
                </button>
              )}
            </div>

            {/* Primary Color */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Primary Color</Label>
              <div className="flex items-center gap-2">
                {COLOR_PRESETS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setPrimaryColor(c.value)}
                    className={`w-8 h-8 border-2 transition-all ${
                      primaryColor === c.value
                        ? "border-foreground scale-110"
                        : "border-transparent hover:border-muted-foreground/40"
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.label}
                  />
                ))}
                <div className="relative ml-1">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="absolute inset-0 w-8 h-8 opacity-0 cursor-pointer"
                  />
                  <div
                    className="w-8 h-8 border border-border flex items-center justify-center text-xs font-mono text-muted-foreground bg-muted/50"
                    title="Custom color"
                  >
                    #
                  </div>
                </div>
              </div>
            </div>

            {/* Preview */}
            {name && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="border border-border bg-card p-4"
              >
                <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider font-semibold">Preview</p>
                <div className="flex items-center gap-3">
                  {logoPreview ? (
                    <img src={logoPreview} alt="" className="w-10 h-10 object-cover border border-border" />
                  ) : (
                    <div
                      className="w-10 h-10 flex items-center justify-center font-bold text-sm"
                      style={{ backgroundColor: primaryColor + "20", color: primaryColor }}
                    >
                      {name[0]?.toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold">{name}</p>
                    <p className="text-xs text-muted-foreground">labpartner.app/c/{slug || "..."}</p>
                  </div>
                </div>
                <div
                  className="h-8 mt-3 flex items-center justify-center text-sm font-semibold text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  Primary Button
                </div>
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full h-11 btn-primary-gradient text-sm font-semibold gap-2 mt-2"
              disabled={!name || !slug || loading}
            >
              {loading ? "Creating..." : "Create Lab"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateCommunity;
