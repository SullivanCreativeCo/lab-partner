import { useState, useRef, useEffect, useCallback } from "react";
import { Video, VideoOff, Mic, MicOff, Camera, SwitchCamera, StopCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface BrowserBroadcastProps {
  streamKey: string;
  onLive?: () => void;
  onStop?: () => void;
}

type BroadcastState = "idle" | "previewing" | "connecting" | "live";

const BrowserBroadcast = ({ streamKey, onLive, onStop }: BrowserBroadcastProps) => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const [state, setState] = useState<BroadcastState>("idle");
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopBroadcast();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startPreview = useCallback(async (facing?: "user" | "environment") => {
    try {
      // Stop any existing stream
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing || facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setState("previewing");
    } catch (err: any) {
      console.error("Camera access error:", err);
      if (err.name === "NotAllowedError") {
        toast({
          variant: "destructive",
          title: "Camera access denied",
          description: "Please allow camera and microphone access in your browser settings.",
        });
      } else if (err.name === "NotFoundError") {
        toast({
          variant: "destructive",
          title: "No camera found",
          description: "Please connect a camera or check your device settings.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed to access camera",
          description: err.message,
        });
      }
    }
  }, [facingMode, toast]);

  const switchCamera = useCallback(async () => {
    const newFacing = facingMode === "user" ? "environment" : "user";
    setFacingMode(newFacing);
    if (state === "previewing" || state === "live") {
      await startPreview(newFacing);
      // If live, replace the track on the peer connection
      if (state === "live" && peerConnectionRef.current && mediaStreamRef.current) {
        const videoTrack = mediaStreamRef.current.getVideoTracks()[0];
        const sender = peerConnectionRef.current.getSenders().find((s) => s.track?.kind === "video");
        if (sender && videoTrack) {
          await sender.replaceTrack(videoTrack);
        }
      }
    }
  }, [facingMode, state, startPreview]);

  const goLive = useCallback(async () => {
    if (!mediaStreamRef.current) return;

    setState("connecting");

    try {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      peerConnectionRef.current = pc;

      // Add tracks from camera/mic to peer connection
      mediaStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, mediaStreamRef.current!);
      });

      // Create offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Send offer to Mux WHIP endpoint
      const whipUrl = `https://global-live.mux.com/api/v1/whip/${streamKey}`;
      const response = await fetch(whipUrl, {
        method: "POST",
        headers: { "Content-Type": "application/sdp" },
        body: offer.sdp,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`WHIP error (${response.status}): ${errorText}`);
      }

      const answerSdp = await response.text();
      await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });

      setState("live");
      onLive?.();
      toast({ title: "You're live!", description: "Your stream is now broadcasting." });
    } catch (err: any) {
      console.error("WHIP connection error:", err);
      setState("previewing");
      toast({
        variant: "destructive",
        title: "Failed to go live",
        description: err.message,
      });
    }
  }, [streamKey, onLive, toast]);

  const stopBroadcast = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setState("idle");
    onStop?.();
  }, [onStop]);

  const toggleVideo = useCallback(() => {
    if (mediaStreamRef.current) {
      const videoTrack = mediaStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
      }
    }
  }, []);

  const toggleAudio = useCallback(() => {
    if (mediaStreamRef.current) {
      const audioTrack = mediaStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);
      }
    }
  }, []);

  return (
    <div className="space-y-3">
      {/* Video preview / broadcast */}
      <div className="relative aspect-video rounded-lg overflow-hidden bg-black border border-border">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${state === "idle" ? "hidden" : ""}`}
        />

        {state === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Camera className="w-7 h-7 text-primary" />
            </div>
            <p className="text-sm font-medium text-white">Go live from your browser</p>
            <p className="text-xs text-white/60 text-center px-6">
              Stream directly from your camera — no OBS needed
            </p>
            <Button
              className="btn-primary-gradient mt-2"
              onClick={() => startPreview()}
            >
              <Camera className="w-4 h-4 mr-2" />
              Enable Camera
            </Button>
          </div>
        )}

        {/* Live indicator */}
        {state === "live" && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-destructive/90 text-white text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              LIVE
            </span>
          </div>
        )}

        {state === "connecting" && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="flex items-center gap-2 text-white">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium">Connecting...</span>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      {(state === "previewing" || state === "live") && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleVideo}
            className={!videoEnabled ? "bg-destructive/10 border-destructive/30 text-destructive" : ""}
          >
            {videoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleAudio}
            className={!audioEnabled ? "bg-destructive/10 border-destructive/30 text-destructive" : ""}
          >
            {audioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </Button>

          <Button variant="outline" size="icon" onClick={switchCamera}>
            <SwitchCamera className="w-4 h-4" />
          </Button>

          {state === "previewing" && (
            <Button className="btn-primary-gradient ml-2" onClick={goLive}>
              Go Live
            </Button>
          )}

          {state === "live" && (
            <Button
              variant="destructive"
              className="ml-2"
              onClick={stopBroadcast}
            >
              <StopCircle className="w-4 h-4 mr-1.5" />
              End Stream
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default BrowserBroadcast;
