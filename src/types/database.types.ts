export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          achievement_date: string | null
          category: string | null
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string | null
          id: string
          issuing_organization: string | null
          media_url: string | null
          profile_id: string
          sort_order: number
          status: Database["public"]["Enums"]["record_status"]
          title: string
          updated_at: string
        }
        Insert: {
          achievement_date?: string | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          issuing_organization?: string | null
          media_url?: string | null
          profile_id: string
          sort_order?: number
          status?: Database["public"]["Enums"]["record_status"]
          title: string
          updated_at?: string
        }
        Update: {
          achievement_date?: string | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          issuing_organization?: string | null
          media_url?: string | null
          profile_id?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["record_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "achievements_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          actor_role: string | null
          created_at: string
          created_by: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: string | null
          metadata: Json
          new_value: Json | null
          previous_value: Json | null
          status: Database["public"]["Enums"]["record_status"]
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_role?: string | null
          created_at?: string
          created_by?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json
          new_value?: Json | null
          previous_value?: Json | null
          status?: Database["public"]["Enums"]["record_status"]
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_role?: string | null
          created_at?: string
          created_by?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json
          new_value?: Json | null
          previous_value?: Json | null
          status?: Database["public"]["Enums"]["record_status"]
        }
        Relationships: []
      }
      biographies: {
        Row: {
          content: string | null
          created_at: string
          created_by: string | null
          id: string
          profile_id: string
          status: Database["public"]["Enums"]["record_status"]
          summary: string | null
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          profile_id: string
          status?: Database["public"]["Enums"]["record_status"]
          summary?: string | null
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          profile_id?: string
          status?: Database["public"]["Enums"]["record_status"]
          summary?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "biographies_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      career_timeline: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string | null
          id: string
          is_current: boolean
          location: string | null
          organization: string | null
          profile_id: string
          sort_order: number
          start_date: string | null
          status: Database["public"]["Enums"]["record_status"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean
          location?: string | null
          organization?: string | null
          profile_id: string
          sort_order?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean
          location?: string | null
          organization?: string | null
          profile_id?: string
          sort_order?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "career_timeline_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Relationships: []
      }
      edit_permission_requests: {
        Row: {
          created_at: string
          description: string | null
          editor_id: string
          fields_requested: string[]
          id: string
          profile_id: string
          reason: string
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["edit_request_status"]
          supporting_document_path: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          editor_id: string
          fields_requested?: string[]
          id?: string
          profile_id: string
          reason: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["edit_request_status"]
          supporting_document_path?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          editor_id?: string
          fields_requested?: string[]
          id?: string
          profile_id?: string
          reason?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["edit_request_status"]
          supporting_document_path?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "edit_permission_requests_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      edit_permission_grants: {
        Row: {
          allowed_fields: string[] | null
          created_at: string
          editor_id: string
          expires_at: string | null
          grant_type: Database["public"]["Enums"]["edit_grant_type"]
          granted_by: string
          id: string
          profile_id: string
          request_id: string | null
          revoked_at: string | null
          snapshot_before: Json | null
          used_at: string | null
        }
        Insert: {
          allowed_fields?: string[] | null
          created_at?: string
          editor_id: string
          expires_at?: string | null
          grant_type?: Database["public"]["Enums"]["edit_grant_type"]
          granted_by: string
          id?: string
          profile_id: string
          request_id?: string | null
          revoked_at?: string | null
          snapshot_before?: Json | null
          used_at?: string | null
        }
        Update: {
          allowed_fields?: string[] | null
          created_at?: string
          editor_id?: string
          expires_at?: string | null
          grant_type?: Database["public"]["Enums"]["edit_grant_type"]
          granted_by?: string
          id?: string
          profile_id?: string
          request_id?: string | null
          revoked_at?: string | null
          snapshot_before?: Json | null
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "edit_permission_grants_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "edit_permission_grants_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "edit_permission_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          category: string | null
          created_at: string
          created_by: string | null
          document_date: string | null
          file_name: string | null
          file_size: number | null
          id: string
          is_private: boolean
          issuing_organization: string | null
          mime_type: string | null
          profile_id: string
          sort_order: number
          status: Database["public"]["Enums"]["record_status"]
          storage_path: string | null
          title: string
          updated_at: string
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          document_date?: string | null
          file_name?: string | null
          file_size?: number | null
          id?: string
          is_private?: boolean
          issuing_organization?: string | null
          mime_type?: string | null
          profile_id: string
          sort_order?: number
          status?: Database["public"]["Enums"]["record_status"]
          storage_path?: string | null
          title: string
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          document_date?: string | null
          file_name?: string | null
          file_size?: number | null
          id?: string
          is_private?: boolean
          issuing_organization?: string | null
          mime_type?: string | null
          profile_id?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["record_status"]
          storage_path?: string | null
          title?: string
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: [
          {
            foreignKeyName: "documents_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      education: {
        Row: {
          created_at: string
          created_by: string | null
          degree: string | null
          description: string | null
          end_date: string | null
          field_of_study: string | null
          id: string
          institution: string
          is_current: boolean
          profile_id: string
          sort_order: number
          start_date: string | null
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          degree?: string | null
          description?: string | null
          end_date?: string | null
          field_of_study?: string | null
          id?: string
          institution: string
          is_current?: boolean
          profile_id: string
          sort_order?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          degree?: string | null
          description?: string | null
          end_date?: string | null
          field_of_study?: string | null
          id?: string
          institution?: string
          is_current?: boolean
          profile_id?: string
          sort_order?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "education_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      government_positions: {
        Row: {
          country: string | null
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string | null
          government_level: string | null
          id: string
          institution: string | null
          is_current: boolean
          position_title: string
          profile_id: string
          sort_order: number
          start_date: string | null
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
        }
        Insert: {
          country?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          government_level?: string | null
          id?: string
          institution?: string | null
          is_current?: boolean
          position_title: string
          profile_id: string
          sort_order?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Update: {
          country?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          government_level?: string | null
          id?: string
          institution?: string | null
          is_current?: boolean
          position_title?: string
          profile_id?: string
          sort_order?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "government_positions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      media: {
        Row: {
          caption: string | null
          category: string | null
          created_at: string
          created_by: string | null
          event_date: string | null
          external_url: string | null
          file_name: string | null
          file_size: number | null
          id: string
          is_featured: boolean
          location: string | null
          media_type: string
          mime_type: string | null
          profile_id: string
          sort_order: number
          status: Database["public"]["Enums"]["record_status"]
          storage_path: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          caption?: string | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          event_date?: string | null
          external_url?: string | null
          file_name?: string | null
          file_size?: number | null
          id?: string
          is_featured?: boolean
          location?: string | null
          media_type?: string
          mime_type?: string | null
          profile_id: string
          sort_order?: number
          status?: Database["public"]["Enums"]["record_status"]
          storage_path?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          caption?: string | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          event_date?: string | null
          external_url?: string | null
          file_name?: string | null
          file_size?: number | null
          id?: string
          is_featured?: boolean
          location?: string | null
          media_type?: string
          mime_type?: string | null
          profile_id?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["record_status"]
          storage_path?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          is_read: boolean
          message: string | null
          related_profile_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string | null
          related_profile_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string | null
          related_profile_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_profile_id_fkey"
            columns: ["related_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      official_activities: {
        Row: {
          activity_date: string | null
          activity_type: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          location: string | null
          organization: string | null
          profile_id: string
          sort_order: number
          status: Database["public"]["Enums"]["record_status"]
          title: string
          updated_at: string
        }
        Insert: {
          activity_date?: string | null
          activity_type?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          location?: string | null
          organization?: string | null
          profile_id: string
          sort_order?: number
          status?: Database["public"]["Enums"]["record_status"]
          title: string
          updated_at?: string
        }
        Update: {
          activity_date?: string | null
          activity_type?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          location?: string | null
          organization?: string | null
          profile_id?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["record_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "official_activities_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      official_travel: {
        Row: {
          created_at: string
          created_by: string | null
          delegation: string | null
          description: string | null
          destination_city: string | null
          destination_country: string
          end_date: string | null
          id: string
          profile_id: string
          purpose: string | null
          sort_order: number
          start_date: string | null
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          delegation?: string | null
          description?: string | null
          destination_city?: string | null
          destination_country: string
          end_date?: string | null
          id?: string
          profile_id: string
          purpose?: string | null
          sort_order?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          delegation?: string | null
          description?: string | null
          destination_city?: string | null
          destination_country?: string
          end_date?: string | null
          id?: string
          profile_id?: string
          purpose?: string | null
          sort_order?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "official_travel_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          country: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          logo_url: string | null
          name: string
          status: Database["public"]["Enums"]["record_status"]
          type: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          status?: Database["public"]["Enums"]["record_status"]
          type?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          status?: Database["public"]["Enums"]["record_status"]
          type?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      permissions: {
        Row: {
          category: string
          created_at: string
          description: string | null
          key: string
          label: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          key: string
          label: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          key?: string
          label?: string
        }
        Relationships: []
      }
      profile_updates: {
        Row: {
          change_summary: string | null
          created_at: string
          created_by: string | null
          id: string
          new_data: Json | null
          old_data: Json | null
          profile_id: string
          section: string
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
        }
        Insert: {
          change_summary?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          profile_id: string
          section: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Update: {
          change_summary?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          profile_id?: string
          section?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_updates_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          assigned_editor_id: string | null
          assigned_staff_id: string | null
          assignment_deadline: string | null
          category_id: string | null
          country: string | null
          cover_url: string | null
          created_at: string
          created_by: string | null
          current_position: string | null
          deleted_at: string | null
          deleted_by: string | null
          editorial_notes: string | null
          email: string | null
          full_name: string
          hidden_at: string | null
          hidden_by: string | null
          id: string
          is_public: boolean
          location: string | null
          nationality: string | null
          organization_id: string | null
          phone: string | null
          photo_url: string | null
          preferred_title: string | null
          profession: string | null
          short_bio: string | null
          slug: string
          social_links: Json
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          user_id: string | null
          verification_status: Database["public"]["Enums"]["verification_status"]
          verified_at: string | null
          view_count: number
          website: string | null
          workflow_status: Database["public"]["Enums"]["profile_workflow_status"]
        }
        Insert: {
          assigned_editor_id?: string | null
          assigned_staff_id?: string | null
          assignment_deadline?: string | null
          category_id?: string | null
          country?: string | null
          cover_url?: string | null
          created_at?: string
          created_by?: string | null
          current_position?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          editorial_notes?: string | null
          email?: string | null
          full_name: string
          hidden_at?: string | null
          hidden_by?: string | null
          id?: string
          is_public?: boolean
          location?: string | null
          nationality?: string | null
          organization_id?: string | null
          phone?: string | null
          photo_url?: string | null
          preferred_title?: string | null
          profession?: string | null
          short_bio?: string | null
          slug: string
          social_links?: Json
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          user_id?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verified_at?: string | null
          view_count?: number
          website?: string | null
          workflow_status?: Database["public"]["Enums"]["profile_workflow_status"]
        }
        Update: {
          assigned_editor_id?: string | null
          assigned_staff_id?: string | null
          assignment_deadline?: string | null
          category_id?: string | null
          country?: string | null
          cover_url?: string | null
          created_at?: string
          created_by?: string | null
          current_position?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          editorial_notes?: string | null
          email?: string | null
          full_name?: string
          hidden_at?: string | null
          hidden_by?: string | null
          id?: string
          is_public?: boolean
          location?: string | null
          nationality?: string | null
          organization_id?: string | null
          phone?: string | null
          photo_url?: string | null
          preferred_title?: string | null
          profession?: string | null
          short_bio?: string | null
          slug?: string
          social_links?: Json
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          user_id?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verified_at?: string | null
          view_count?: number
          website?: string | null
          workflow_status?: Database["public"]["Enums"]["profile_workflow_status"]
        }
        Relationships: [
          {
            foreignKeyName: "profiles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      qr_profiles: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          profile_id: string
          qr_storage_path: string | null
          scan_count: number
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          profile_id: string
          qr_storage_path?: string | null
          scan_count?: number
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          profile_id?: string
          qr_storage_path?: string | null
          scan_count?: number
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "qr_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          permission_key: string
          role_key: string
          scope: Database["public"]["Enums"]["permission_scope"]
        }
        Insert: {
          permission_key: string
          role_key: string
          scope?: Database["public"]["Enums"]["permission_scope"]
        }
        Update: {
          permission_key?: string
          role_key?: string
          scope?: Database["public"]["Enums"]["permission_scope"]
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_key_fkey"
            columns: ["permission_key"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["key"]
          },
          {
            foreignKeyName: "role_permissions_role_key_fkey"
            columns: ["role_key"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["key"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          is_system: boolean
          key: string
          label: string
          level: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          is_system?: boolean
          key: string
          label: string
          level: number
        }
        Update: {
          created_at?: string
          description?: string | null
          is_system?: boolean
          key?: string
          label?: string
          level?: number
        }
        Relationships: []
      }
      speeches: {
        Row: {
          audio_url: string | null
          created_at: string
          created_by: string | null
          event: string | null
          full_text: string | null
          id: string
          location: string | null
          profile_id: string
          sort_order: number
          speech_date: string | null
          status: Database["public"]["Enums"]["record_status"]
          summary: string | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          created_by?: string | null
          event?: string | null
          full_text?: string | null
          id?: string
          location?: string | null
          profile_id: string
          sort_order?: number
          speech_date?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          summary?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          created_by?: string | null
          event?: string | null
          full_text?: string | null
          id?: string
          location?: string | null
          profile_id?: string
          sort_order?: number
          speech_date?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          summary?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "speeches_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      speech_attachments: {
        Row: {
          created_at: string
          created_by: string | null
          file_name: string | null
          file_size: number | null
          file_type: string
          id: string
          mime_type: string | null
          sort_order: number
          speech_id: string
          storage_path: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type: string
          id?: string
          mime_type?: string | null
          sort_order?: number
          speech_id: string
          storage_path: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string
          id?: string
          mime_type?: string | null
          sort_order?: number
          speech_id?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "speech_attachments_speech_id_fkey"
            columns: ["speech_id"]
            isOneToOne: false
            referencedRelation: "speeches"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          account_status: Database["public"]["Enums"]["account_status"]
          created_at: string
          created_by: string | null
          email: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          account_status?: Database["public"]["Enums"]["account_status"]
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          account_status?: Database["public"]["Enums"]["account_status"]
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      verifications: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          identity_verified: boolean
          information_reviewed: boolean
          notes: string | null
          profile_id: string
          status: Database["public"]["Enums"]["verification_status"]
          updated_at: string
          verified_at: string | null
          verifier_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          identity_verified?: boolean
          information_reviewed?: boolean
          notes?: string | null
          profile_id: string
          status?: Database["public"]["Enums"]["verification_status"]
          updated_at?: string
          verified_at?: string | null
          verifier_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          identity_verified?: boolean
          information_reviewed?: boolean
          notes?: string | null
          profile_id?: string
          status?: Database["public"]["Enums"]["verification_status"]
          updated_at?: string
          verified_at?: string | null
          verifier_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_edit_content: { Args: never; Returns: boolean }
      can_edit_profile: { Args: { p_profile_id: string }; Returns: boolean }
      current_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_permission: {
        Args: { p_permission_key: string; p_user_id?: string }
        Returns: boolean
      }
      is_account_approved: { Args: never; Returns: boolean }
      is_admin: { Args: never; Returns: boolean }
      is_staff: { Args: never; Returns: boolean }
      owns_profile: { Args: { p_profile_id: string }; Returns: boolean }
      permission_scope: {
        Args: { p_permission_key: string; p_user_id?: string }
        Returns: Database["public"]["Enums"]["permission_scope"]
      }
      role_level: { Args: { p_user_id?: string }; Returns: number }
      set_account_status: {
        Args: {
          p_status: Database["public"]["Enums"]["account_status"]
          p_user_id: string
        }
        Returns: undefined
      }
      set_user_role: {
        Args: {
          p_role: Database["public"]["Enums"]["app_role"]
          p_user_id: string
        }
        Returns: undefined
      }
      set_role_permission: {
        Args: {
          p_permission_key: string
          p_role_key: string
          p_scope: Database["public"]["Enums"]["permission_scope"]
        }
        Returns: undefined
      }
      super_admin_set_profile_hidden: {
        Args: { p_hidden: boolean; p_profile_id: string }
        Returns: undefined
      }
      super_admin_set_profile_verified: {
        Args: { p_profile_id: string; p_verified: boolean }
        Returns: undefined
      }
      super_admin_set_profile_archived: {
        Args: { p_archived: boolean; p_profile_id: string }
        Returns: undefined
      }
      super_admin_set_profile_deleted: {
        Args: { p_deleted: boolean; p_profile_id: string }
        Returns: undefined
      }
      super_admin_permanently_delete_profile: {
        Args: { p_profile_id: string }
        Returns: undefined
      }
    }
    Enums: {
      account_status: "pending" | "approved" | "rejected"
      app_role:
        | "super_admin"
        | "admin"
        | "editor"
        | "verifier"
        | "profile_owner"
        | "staff"
      edit_grant_type: "one_time" | "time_limited" | "full"
      edit_request_status: "pending" | "more_info_requested" | "approved" | "rejected"
      permission_scope: "none" | "assigned" | "limited" | "all"
      profile_workflow_status:
        | "draft"
        | "in_progress"
        | "submitted"
        | "under_review"
        | "changes_required"
        | "editor_approved"
        | "admin_review"
        | "approved"
        | "verified"
        | "published"
        | "suspended"
        | "archived"
        | "rejected"
      record_status: "draft" | "active" | "archived" | "pending" | "rejected"
      verification_status: "unverified" | "pending" | "verified" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database["public"]

export type Tables<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Row"]

export type TablesInsert<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Insert"]

export type TablesUpdate<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Update"]

export type Enums<T extends keyof DefaultSchema["Enums"]> =
  DefaultSchema["Enums"][T]
