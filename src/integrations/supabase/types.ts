export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      conversations: {
        Row: {
          id: string
          last_message_at: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["conversation_status"] | null
          user_1_id: string
          user_2_id: string
        }
        Insert: {
          id?: string
          last_message_at?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["conversation_status"] | null
          user_1_id: string
          user_2_id: string
        }
        Update: {
          id?: string
          last_message_at?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["conversation_status"] | null
          user_1_id?: string
          user_2_id?: string
        }
        Relationships: []
      }
      coupon_codes: {
        Row: {
          applicable_products: string[] | null
          code: string
          created_at: string | null
          created_by: string | null
          current_uses: number | null
          discount_type: string
          discount_value: number
          id: string
          max_uses: number | null
          min_purchase: number | null
          status: string | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          applicable_products?: string[] | null
          code: string
          created_at?: string | null
          created_by?: string | null
          current_uses?: number | null
          discount_type: string
          discount_value: number
          id?: string
          max_uses?: number | null
          min_purchase?: number | null
          status?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          applicable_products?: string[] | null
          code?: string
          created_at?: string | null
          created_by?: string | null
          current_uses?: number | null
          discount_type?: string
          discount_value?: number
          id?: string
          max_uses?: number | null
          min_purchase?: number | null
          status?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      event_attendance: {
        Row: {
          check_in_latitude: number | null
          check_in_longitude: number | null
          check_in_status: Database["public"]["Enums"]["check_in_status"] | null
          checked_in_at: string | null
          created_at: string | null
          door_code: string | null
          event_id: string
          geo_verified: boolean | null
          id: string
          left_at: string | null
          nametag_pin: string | null
          rsvp_status: Database["public"]["Enums"]["rsvp_status"] | null
          time_spent_minutes: number | null
          user_id: string
        }
        Insert: {
          check_in_latitude?: number | null
          check_in_longitude?: number | null
          check_in_status?:
            | Database["public"]["Enums"]["check_in_status"]
            | null
          checked_in_at?: string | null
          created_at?: string | null
          door_code?: string | null
          event_id: string
          geo_verified?: boolean | null
          id?: string
          left_at?: string | null
          nametag_pin?: string | null
          rsvp_status?: Database["public"]["Enums"]["rsvp_status"] | null
          time_spent_minutes?: number | null
          user_id: string
        }
        Update: {
          check_in_latitude?: number | null
          check_in_longitude?: number | null
          check_in_status?:
            | Database["public"]["Enums"]["check_in_status"]
            | null
          checked_in_at?: string | null
          created_at?: string | null
          door_code?: string | null
          event_id?: string
          geo_verified?: boolean | null
          id?: string
          left_at?: string | null
          nametag_pin?: string | null
          rsvp_status?: Database["public"]["Enums"]["rsvp_status"] | null
          time_spent_minutes?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_attendance_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          age_range_max: number | null
          age_range_min: number | null
          check_in_end: string | null
          check_in_start: string | null
          created_at: string | null
          created_by: string | null
          date: string
          description: string | null
          end_time: string
          geo_fence_enabled: boolean | null
          id: string
          max_attendees: number | null
          start_time: string
          status: string | null
          title: string
          updated_at: string | null
          venue_id: string | null
        }
        Insert: {
          age_range_max?: number | null
          age_range_min?: number | null
          check_in_end?: string | null
          check_in_start?: string | null
          created_at?: string | null
          created_by?: string | null
          date: string
          description?: string | null
          end_time: string
          geo_fence_enabled?: boolean | null
          id?: string
          max_attendees?: number | null
          start_time: string
          status?: string | null
          title: string
          updated_at?: string | null
          venue_id?: string | null
        }
        Update: {
          age_range_max?: number | null
          age_range_min?: number | null
          check_in_end?: string | null
          check_in_start?: string | null
          created_at?: string | null
          created_by?: string | null
          date?: string
          description?: string | null
          end_time?: string
          geo_fence_enabled?: boolean | null
          id?: string
          max_attendees?: number | null
          start_time?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          comment: string | null
          created_at: string | null
          event_id: string
          feedback_tags: string[] | null
          feedback_type: Database["public"]["Enums"]["feedback_type"]
          from_user_id: string
          id: string
          to_user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          event_id: string
          feedback_tags?: string[] | null
          feedback_type: Database["public"]["Enums"]["feedback_type"]
          from_user_id: string
          id?: string
          to_user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          event_id?: string
          feedback_tags?: string[] | null
          feedback_type?: Database["public"]["Enums"]["feedback_type"]
          from_user_id?: string
          id?: string
          to_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          read_at: string | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          read_at?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          coupon_code: string | null
          created_at: string | null
          discount_applied: number | null
          id: string
          items: Json
          status: string | null
          subtotal: number
          total: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          coupon_code?: string | null
          created_at?: string | null
          discount_applied?: number | null
          id?: string
          items: Json
          status?: string | null
          subtotal: number
          total: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          coupon_code?: string | null
          created_at?: string | null
          discount_applied?: number | null
          id?: string
          items?: Json
          status?: string | null
          subtotal?: number
          total?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          area: string | null
          bio: string | null
          community_trusted: boolean | null
          created_at: string | null
          events_attended: number | null
          id: string
          interests: string[] | null
          looking_for: string | null
          name: string
          personality_quote: string | null
          personality_vector: Json | null
          photo_url: string | null
          positive_feedback_count: number | null
          quiz_completed: boolean | null
          religion: string | null
          response_rate: number | null
          show_up_rate: number | null
          total_feedback_count: number | null
          trust_index: number | null
          trust_level: string | null
          updated_at: string | null
          verification_level: string | null
        }
        Insert: {
          age?: number | null
          area?: string | null
          bio?: string | null
          community_trusted?: boolean | null
          created_at?: string | null
          events_attended?: number | null
          id: string
          interests?: string[] | null
          looking_for?: string | null
          name: string
          personality_quote?: string | null
          personality_vector?: Json | null
          photo_url?: string | null
          positive_feedback_count?: number | null
          quiz_completed?: boolean | null
          religion?: string | null
          response_rate?: number | null
          show_up_rate?: number | null
          total_feedback_count?: number | null
          trust_index?: number | null
          trust_level?: string | null
          updated_at?: string | null
          verification_level?: string | null
        }
        Update: {
          age?: number | null
          area?: string | null
          bio?: string | null
          community_trusted?: boolean | null
          created_at?: string | null
          events_attended?: number | null
          id?: string
          interests?: string[] | null
          looking_for?: string | null
          name?: string
          personality_quote?: string | null
          personality_vector?: Json | null
          photo_url?: string | null
          positive_feedback_count?: number | null
          quiz_completed?: boolean | null
          religion?: string | null
          response_rate?: number | null
          show_up_rate?: number | null
          total_feedback_count?: number | null
          trust_index?: number | null
          trust_level?: string | null
          updated_at?: string | null
          verification_level?: string | null
        }
        Relationships: []
      }
      quiz_responses: {
        Row: {
          answer_value: Json
          created_at: string | null
          id: string
          question_key: string
          user_id: string
        }
        Insert: {
          answer_value: Json
          created_at?: string | null
          id?: string
          question_key: string
          user_id: string
        }
        Update: {
          answer_value?: Json
          created_at?: string | null
          id?: string
          question_key?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_products: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          inventory_count: number | null
          name: string
          price: number
          sale_price: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          inventory_count?: number | null
          name: string
          price: number
          sale_price?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          inventory_count?: number | null
          name?: string
          price?: number
          sale_price?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      team_performance: {
        Row: {
          attendee_feedback_score: number | null
          created_at: string | null
          event_id: string
          id: string
          issues_reported: number | null
          notes: string | null
          resolved_count: number | null
          setup_rating: number | null
          team_user_id: string
        }
        Insert: {
          attendee_feedback_score?: number | null
          created_at?: string | null
          event_id: string
          id?: string
          issues_reported?: number | null
          notes?: string | null
          resolved_count?: number | null
          setup_rating?: number | null
          team_user_id: string
        }
        Update: {
          attendee_feedback_score?: number | null
          created_at?: string | null
          event_id?: string
          id?: string
          issues_reported?: number | null
          notes?: string | null
          resolved_count?: number | null
          setup_rating?: number | null
          team_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_performance_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      user_behavior_metrics: {
        Row: {
          avg_response_time_mins: number | null
          conversations_ended_gracefully: number | null
          conversations_started: number | null
          created_at: string | null
          events_attended: number | null
          events_rsvpd: number | null
          id: string
          messages_received: number | null
          messages_sent: number | null
          on_time_percentage: number | null
          positive_feedback_received: number | null
          reports_received: number | null
          trust_index: number | null
          trust_level: string | null
          updated_at: string | null
          user_id: string
          waves_received: number | null
          waves_sent: number | null
        }
        Insert: {
          avg_response_time_mins?: number | null
          conversations_ended_gracefully?: number | null
          conversations_started?: number | null
          created_at?: string | null
          events_attended?: number | null
          events_rsvpd?: number | null
          id?: string
          messages_received?: number | null
          messages_sent?: number | null
          on_time_percentage?: number | null
          positive_feedback_received?: number | null
          reports_received?: number | null
          trust_index?: number | null
          trust_level?: string | null
          updated_at?: string | null
          user_id: string
          waves_received?: number | null
          waves_sent?: number | null
        }
        Update: {
          avg_response_time_mins?: number | null
          conversations_ended_gracefully?: number | null
          conversations_started?: number | null
          created_at?: string | null
          events_attended?: number | null
          events_rsvpd?: number | null
          id?: string
          messages_received?: number | null
          messages_sent?: number | null
          on_time_percentage?: number | null
          positive_feedback_received?: number | null
          reports_received?: number | null
          trust_index?: number | null
          trust_level?: string | null
          updated_at?: string | null
          user_id?: string
          waves_received?: number | null
          waves_sent?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_behavior_metrics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      venues: {
        Row: {
          address: string
          capacity: number | null
          created_at: string | null
          created_by: string | null
          geo_fence_radius: number | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          address: string
          capacity?: number | null
          created_at?: string | null
          created_by?: string | null
          geo_fence_radius?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string
          capacity?: number | null
          created_at?: string | null
          created_by?: string | null
          geo_fence_radius?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      waves: {
        Row: {
          created_at: string | null
          event_id: string | null
          from_user_id: string
          gentle_exit_used: boolean | null
          id: string
          status: Database["public"]["Enums"]["wave_status"] | null
          to_user_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          from_user_id: string
          gentle_exit_used?: boolean | null
          id?: string
          status?: Database["public"]["Enums"]["wave_status"] | null
          to_user_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          from_user_id?: string
          gentle_exit_used?: boolean | null
          id?: string
          status?: Database["public"]["Enums"]["wave_status"] | null
          to_user_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "waves_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_trust_index: { Args: { p_user_id: string }; Returns: number }
      generate_event_pin: { Args: { p_event_id: string }; Returns: string }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "single" | "team" | "admin"
      check_in_status: "on_time" | "late" | "no_show"
      conversation_status: "active" | "ended"
      feedback_type: "positive" | "neutral" | "negative"
      rsvp_status: "going" | "maybe" | "not_going"
      wave_status: "pending" | "accepted" | "declined"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["single", "team", "admin"],
      check_in_status: ["on_time", "late", "no_show"],
      conversation_status: ["active", "ended"],
      feedback_type: ["positive", "neutral", "negative"],
      rsvp_status: ["going", "maybe", "not_going"],
      wave_status: ["pending", "accepted", "declined"],
    },
  },
} as const
