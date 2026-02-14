import CommunityLayout from "@/components/CommunityLayout";
import { Palette, Type, Upload, Save, Radio, Plus, Trash2, Lock, Youtube } from "lucide-react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useCommunityBySlug } from "@/hooks/use-community";
import {
  useSimulcastPlatforms,
  useAddSimulcastPlatform,
  useUpdateSimulcastPlatform,
  useDeleteSimulcastPlatform,
} from "@/hooks/use-simulcast";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const PLATFORM_CONFIG: Record<string, { label: string; rtmp_url: string; color: string }> = {
  youtube: { label: "YouTube", rtmp_url: "rtmp://a.rtmp.youtube.com/live2", color: "#FF0000" },
  twitch: { label: "Twitch", rtmp_url: "rtmp://live.twitch.tv/app", color: "#9146FF" },
  facebook: { label: "Facebook", rtmp_url: "rtmps://live-api-s.facebook.com:443/rtmp/", color: "#1877F2" },
  linkedin: { label: "LinkedIn", rtmp_url: "rtmp://1.rtmp.linkedin.com/rtmp/", color: "#0A66C2" },
};

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

  // Simulcast
  const { data: platforms } = useSimulcastPlatforms(community?.id);
  const addPlatform = useAddSimulcastPlatform();
  const updatePlatform = useUpdateSimulcastPlatform();
  const deletePlatform = useDeleteSimulcastPlatform();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newPlatform, setNewPlatform] = useState("youtube");
  const [newLabel, setNewLabel] = useState("");
  const [newStreamKey, setNewStreamKey] = useState("");

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

  const handleAddPlatform = () => {
    if (!community || !newStreamKey.trim()) return;

    const config = PLATFORM_CONFIG[newPlatform];
    addPlatform.mutate(
      {
        community_id: community.id,
        platform: newPlatform,
        label: newLabel || config.label,
        rtmp_url: config.rtmp_url,
        stream_key: newStreamKey,
      },
      {
        onSuccess: () => {
          setAddDialogOpen(false);
          setNewPlatform("youtube");
          setNewLabel("");
          setNewStreamKey("");
          toast({ title: "Platform added" });
        },
        onError: (error) => {
          toast({ variant: "destructive", title: "Failed to add platform", description: error.message });
        },
      }
    );
  };

  const handleTogglePlatform = (id: string, enabled: boolean) => {
    if (!community) return;
    updatePlatform.mutate({ id, community_id: community.id, enabled });
  };

  const handleDeletePlatform = (id: string) => {
    if (!community) return;
    deletePlatform.mutate(
      { id, community_id: community.id },
      {
        onSuccess: () => toast({ title: "Platform removed" }),
      }
    );
  };

  const simulcastEnabled = community?.simulcast_enabled ?? false;

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

        {/* Simulcast Add-On */}
        <section className="space-y-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Radio className="w-3.5 h-3.5" />
            Simulcast
            <span className="text-[10px] font-bold tracking-widest text-primary/60 uppercase ml-1">ADD-ON</span>
          </h3>

          {!simulcastEnabled ? (
            // Locked state
            <div className="rounded-lg border border-border bg-card/50 p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1">Multistream to Every Platform</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Go live on Lab Partner, YouTube, Twitch, Facebook, and LinkedIn simultaneously.
                    One stream, everywhere at once.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                {Object.entries(PLATFORM_CONFIG).map(([key, config]) => (
                  <div
                    key={key}
                    className="w-8 h-8 rounded-md flex items-center justify-center opacity-40"
                    style={{ backgroundColor: config.color + "20" }}
                  >
                    <span className="text-[10px] font-bold" style={{ color: config.color }}>
                      {config.label[0]}
                    </span>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full text-sm" disabled>
                Contact Us to Enable
              </Button>
            </div>
          ) : (
            // Enabled state
            <div className="space-y-3">
              {(platforms ?? []).length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-6 text-center">
                  <Radio className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium mb-1">No platforms connected</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Add your YouTube, Twitch, or other platform stream keys to simulcast.
                  </p>
                  <Button
                    size="sm"
                    className="btn-primary-gradient text-sm gap-1.5"
                    onClick={() => setAddDialogOpen(true)}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Platform
                  </Button>
                </div>
              ) : (
                <>
                  {(platforms ?? []).map((p) => {
                    const config = PLATFORM_CONFIG[p.platform];
                    return (
                      <div
                        key={p.id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card"
                      >
                        <div
                          className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                          style={{ backgroundColor: (config?.color ?? "#666") + "20" }}
                        >
                          <span
                            className="text-xs font-bold"
                            style={{ color: config?.color ?? "#666" }}
                          >
                            {(config?.label ?? p.platform)[0].toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{p.label}</p>
                          <p className="text-xs text-muted-foreground">{config?.label ?? p.platform}</p>
                        </div>
                        <Switch
                          checked={p.enabled}
                          onCheckedChange={(checked) => handleTogglePlatform(p.id, checked)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDeletePlatform(p.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    );
                  })}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-sm gap-1.5"
                    onClick={() => setAddDialogOpen(true)}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Platform
                  </Button>
                </>
              )}
            </div>
          )}
        </section>
      </div>

      {/* Add Platform Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Simulcast Platform</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-sm mb-1.5 block">Platform</Label>
              <Select value={newPlatform} onValueChange={setNewPlatform}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PLATFORM_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm mb-1.5 block">Label (optional)</Label>
              <Input
                placeholder={`e.g. "My ${PLATFORM_CONFIG[newPlatform]?.label} Channel"`}
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm mb-1.5 block">Stream Key</Label>
              <Input
                type="password"
                placeholder="Paste your stream key here"
                value={newStreamKey}
                onChange={(e) => setNewStreamKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                Find this in your {PLATFORM_CONFIG[newPlatform]?.label} streaming settings
              </p>
            </div>
            <div className="rounded-md bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">
                <strong>RTMP URL:</strong>{" "}
                <code className="text-xs font-mono">{PLATFORM_CONFIG[newPlatform]?.rtmp_url}</code>
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="btn-primary-gradient"
              onClick={handleAddPlatform}
              disabled={!newStreamKey.trim() || addPlatform.isPending}
            >
              {addPlatform.isPending ? "Adding..." : "Add Platform"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CommunityLayout>
  );
};

export default CommunitySettings;
