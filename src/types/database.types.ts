export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      communities: {
        Row: {
          id: string;
          name: string;
          slug: string;
          welcome_message: string;
          logo_url: string | null;
          primary_color: string;
          secondary_color: string;
          owner_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          welcome_message?: string;
          logo_url?: string | null;
          primary_color?: string;
          secondary_color?: string;
          owner_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          welcome_message?: string;
          logo_url?: string | null;
          primary_color?: string;
          secondary_color?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "communities_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      community_members: {
        Row: {
          id: string;
          community_id: string;
          user_id: string;
          role: "owner" | "moderator" | "member";
          joined_at: string;
        };
        Insert: {
          id?: string;
          community_id: string;
          user_id: string;
          role?: "owner" | "moderator" | "member";
          joined_at?: string;
        };
        Update: {
          role?: "owner" | "moderator" | "member";
        };
        Relationships: [
          {
            foreignKeyName: "community_members_community_id_fkey";
            columns: ["community_id"];
            isOneToOne: false;
            referencedRelation: "communities";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "community_members_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      posts: {
        Row: {
          id: string;
          community_id: string;
          author_id: string;
          title: string;
          body: string;
          is_pinned: boolean;
          upvote_count: number;
          comment_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          community_id: string;
          author_id: string;
          title: string;
          body?: string;
          is_pinned?: boolean;
          upvote_count?: number;
          comment_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          body?: string;
          is_pinned?: boolean;
          upvote_count?: number;
          comment_count?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "posts_community_id_fkey";
            columns: ["community_id"];
            isOneToOne: false;
            referencedRelation: "communities";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "posts_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          author_id: string;
          body: string;
          upvote_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          author_id: string;
          body: string;
          upvote_count?: number;
          created_at?: string;
        };
        Update: {
          body?: string;
          upvote_count?: number;
        };
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      streams: {
        Row: {
          id: string;
          community_id: string;
          title: string;
          description: string;
          status: "scheduled" | "live" | "ended";
          scheduled_at: string | null;
          started_at: string | null;
          ended_at: string | null;
          viewer_count: number;
          mux_stream_id: string | null;
          mux_playback_id: string | null;
          stream_key: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          community_id: string;
          title: string;
          description?: string;
          status?: "scheduled" | "live" | "ended";
          scheduled_at?: string | null;
          started_at?: string | null;
          ended_at?: string | null;
          viewer_count?: number;
          mux_stream_id?: string | null;
          mux_playback_id?: string | null;
          stream_key?: string | null;
          created_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          status?: "scheduled" | "live" | "ended";
          scheduled_at?: string | null;
          started_at?: string | null;
          ended_at?: string | null;
          viewer_count?: number;
          mux_stream_id?: string | null;
          mux_playback_id?: string | null;
          stream_key?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "streams_community_id_fkey";
            columns: ["community_id"];
            isOneToOne: false;
            referencedRelation: "communities";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      community_role: "owner" | "moderator" | "member";
      stream_status: "scheduled" | "live" | "ended";
    };
  };
};
