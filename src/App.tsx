import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreateCommunity from "./pages/CreateCommunity";
import CommunityHome from "./pages/CommunityHome";
import CommunityStreams from "./pages/CommunityStreams";
import CommunityDiscussions from "./pages/CommunityDiscussions";
import CommunityMembers from "./pages/CommunityMembers";
import CommunitySettings from "./pages/CommunitySettings";
import PostDetail from "./pages/PostDetail";
import StreamDetail from "./pages/StreamDetail";
import VideoDetail from "./pages/VideoDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="dark">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/create-community"
                element={
                  <ProtectedRoute>
                    <CreateCommunity />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/c/:slug"
                element={
                  <ProtectedRoute>
                    <CommunityHome />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/c/:slug/streams"
                element={
                  <ProtectedRoute>
                    <CommunityStreams />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/c/:slug/discussions"
                element={
                  <ProtectedRoute>
                    <CommunityDiscussions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/c/:slug/discussions/:postId"
                element={
                  <ProtectedRoute>
                    <PostDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/c/:slug/streams/:streamId"
                element={
                  <ProtectedRoute>
                    <StreamDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/c/:slug/videos/:videoId"
                element={
                  <ProtectedRoute>
                    <VideoDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/c/:slug/members"
                element={
                  <ProtectedRoute>
                    <CommunityMembers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/c/:slug/settings"
                element={
                  <ProtectedRoute>
                    <CommunitySettings />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
