import CommunityLayout from "@/components/CommunityLayout";
import { Palette, Type, Upload, Save } from "lucide-react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useCommunityBySlug } from "@/hooks/use-community";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const CommunitySettings = () => {
  const { slug } = useParams();
  const { data: community } = useCommunityBySlug(slug);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [welcome, setWelcome] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#2F80ED");
  const [secondaryColor, setSecondaryColor] = useState("#4169B5");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (community) {
      setName(community.name);
      setWelcome(community.welcome_message ?? "");
      setPrimaryColor(community.primary_color ?? "#2F80ED");
      setSecondaryColor(community.secondary_color ?? "#4169B5");
    }
  }, [community]);

  const handleSave = async () => {
    if (!community) return;
    setSaving(true);

    const { error } = await supabase
      .from("communities")
      .update({
        name,
        welcome_message: welcome,
        primary_color: primaryColor,
        secondary_color: secondaryColor,
      })
      .eq("id", community.id);

    setSaving(false);

    if (error) {
      toast({ variant: "destructive", title: "Failed to save", description: error.message });
      return;
    }

    toast({ title: "Settings saved" });
    queryClient.invalidateQueries({ queryKey: ["community", slug] });
  };

  return (
    <CommunityLayout communityName={community?.name ?? "Community"}>
      <div className="px-4 py-4 space-y-6">
        <h2 className="font-semibold text-lg">Settings</h2>

        {/* General */}
        <section className="space-y-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">General</h3>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-sm">Community Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="h-11 bg-muted/50" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Welcome Message</Label>
              <Textarea
                value={welcome}
                onChange={(e) => setWelcome(e.target.value)}
                className="bg-muted/50 min-h-[80px] resize-none"
              />
            </div>
          </div>
        </section>

        {/* Branding */}
        <section className="space-y-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Palette className="w-3.5 h-3.5" />
            Branding
          </h3>

          {/* Logo Upload */}
          <div className="space-y-2">
            <Label className="text-sm">Logo</Label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
                <Upload className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">PNG, JPG up to 2MB</p>
                <Button variant="outline" size="sm" className="mt-1.5 text-sm">
                  Upload
                </Button>
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-sm">Primary Color</Label>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg border border-border flex-shrink-0"
                  style={{ backgroundColor: primaryColor }}
                />
                <Input
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-9 bg-muted/50 text-sm font-mono"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Secondary Color</Label>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg border border-border flex-shrink-0"
                  style={{ backgroundColor: secondaryColor }}
                />
                <Input
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="h-9 bg-muted/50 text-sm font-mono"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-lg border border-border p-4 bg-card">
            <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1.5">
              <Type className="w-3 h-3" />
              Preview
            </p>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{ backgroundColor: primaryColor + "20", color: primaryColor }}
              >
                {name[0]}
              </div>
              <div>
                <p className="text-sm font-semibold">{name}</p>
                <p className="text-xs text-muted-foreground">Your branded community</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <div
                className="h-8 flex-1 rounded-md flex items-center justify-center text-sm font-semibold"
                style={{ backgroundColor: primaryColor, color: "white" }}
              >
                Primary
              </div>
              <div
                className="h-8 flex-1 rounded-md flex items-center justify-center text-sm font-semibold"
                style={{ backgroundColor: secondaryColor, color: "white" }}
              >
                Secondary
              </div>
            </div>
          </div>
        </section>

        <Button
          className="w-full h-11 btn-primary-gradient text-sm font-semibold gap-2"
          onClick={handleSave}
          disabled={saving}
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </CommunityLayout>
  );
};

export default CommunitySettings;
