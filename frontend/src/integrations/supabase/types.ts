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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      accommodations: {
        Row: {
          address: string | null
          amenities: string[] | null
          bathrooms: number | null
          bedrooms: number | null
          created_at: string
          currency: string | null
          description: string | null
          destination_id: string | null
          gallery: string[] | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          is_verified: boolean | null
          latitude: number | null
          listing_type: Database["public"]["Enums"]["listing_type"]
          longitude: number | null
          max_guests: number | null
          name: string
          price_per_night: number
          rating: number | null
          review_count: number | null
          short_description: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          amenities?: string[] | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string
          currency?: string | null
          description?: string | null
          destination_id?: string | null
          gallery?: string[] | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          listing_type?: Database["public"]["Enums"]["listing_type"]
          longitude?: number | null
          max_guests?: number | null
          name: string
          price_per_night: number
          rating?: number | null
          review_count?: number | null
          short_description?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          amenities?: string[] | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string
          currency?: string | null
          description?: string | null
          destination_id?: string | null
          gallery?: string[] | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          listing_type?: Database["public"]["Enums"]["listing_type"]
          longitude?: number | null
          max_guests?: number | null
          name?: string
          price_per_night?: number
          rating?: number | null
          review_count?: number | null
          short_description?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "accommodations_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          accommodation_id: string | null
          booking_date: string | null
          check_in: string | null
          check_out: string | null
          created_at: string
          currency: string | null
          experience_id: string | null
          guests: number | null
          id: string
          special_requests: string | null
          status: Database["public"]["Enums"]["booking_status"] | null
          stripe_payment_id: string | null
          total_price: number
          updated_at: string
          user_id: string
        }
        Insert: {
          accommodation_id?: string | null
          booking_date?: string | null
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          currency?: string | null
          experience_id?: string | null
          guests?: number | null
          id?: string
          special_requests?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          stripe_payment_id?: string | null
          total_price: number
          updated_at?: string
          user_id: string
        }
        Update: {
          accommodation_id?: string | null
          booking_date?: string | null
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          currency?: string | null
          experience_id?: string | null
          guests?: number | null
          id?: string
          special_requests?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          stripe_payment_id?: string | null
          total_price?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_accommodation_id_fkey"
            columns: ["accommodation_id"]
            isOneToOne: false
            referencedRelation: "accommodations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
        ]
      }
      destinations: {
        Row: {
          created_at: string
          description: string | null
          gallery: string[] | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          rating: number | null
          region: string | null
          review_count: number | null
          short_description: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          gallery?: string[] | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          rating?: number | null
          region?: string | null
          review_count?: number | null
          short_description?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          gallery?: string[] | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          rating?: number | null
          region?: string | null
          review_count?: number | null
          short_description?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      experiences: {
        Row: {
          category: Database["public"]["Enums"]["experience_category"]
          created_at: string
          currency: string | null
          description: string | null
          destination_id: string | null
          duration_hours: number | null
          gallery: string[] | null
          id: string
          image_url: string | null
          includes: string[] | null
          is_featured: boolean | null
          latitude: number | null
          longitude: number | null
          max_participants: number | null
          meeting_point: string | null
          name: string
          price: number
          rating: number | null
          review_count: number | null
          short_description: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["experience_category"]
          created_at?: string
          currency?: string | null
          description?: string | null
          destination_id?: string | null
          duration_hours?: number | null
          gallery?: string[] | null
          id?: string
          image_url?: string | null
          includes?: string[] | null
          is_featured?: boolean | null
          latitude?: number | null
          longitude?: number | null
          max_participants?: number | null
          meeting_point?: string | null
          name: string
          price: number
          rating?: number | null
          review_count?: number | null
          short_description?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["experience_category"]
          created_at?: string
          currency?: string | null
          description?: string | null
          destination_id?: string | null
          duration_hours?: number | null
          gallery?: string[] | null
          id?: string
          image_url?: string | null
          includes?: string[] | null
          is_featured?: boolean | null
          latitude?: number | null
          longitude?: number | null
          max_participants?: number | null
          meeting_point?: string | null
          name?: string
          price?: number
          rating?: number | null
          review_count?: number | null
          short_description?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "experiences_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          accommodation_id: string | null
          created_at: string
          destination_id: string | null
          experience_id: string | null
          id: string
          user_id: string
        }
        Insert: {
          accommodation_id?: string | null
          created_at?: string
          destination_id?: string | null
          experience_id?: string | null
          id?: string
          user_id: string
        }
        Update: {
          accommodation_id?: string | null
          created_at?: string
          destination_id?: string | null
          experience_id?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_accommodation_id_fkey"
            columns: ["accommodation_id"]
            isOneToOne: false
            referencedRelation: "accommodations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          preferred_language: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          preferred_language?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          preferred_language?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          accommodation_id: string | null
          comment: string | null
          created_at: string
          experience_id: string | null
          id: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          accommodation_id?: string | null
          comment?: string | null
          created_at?: string
          experience_id?: string | null
          id?: string
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          accommodation_id?: string | null
          comment?: string | null
          created_at?: string
          experience_id?: string | null
          id?: string
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_accommodation_id_fkey"
            columns: ["accommodation_id"]
            isOneToOne: false
            referencedRelation: "accommodations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      booking_status: "pending" | "confirmed" | "cancelled" | "completed"
      experience_category:
        | "city_tour"
        | "cultural"
        | "beach"
        | "nature"
        | "food"
        | "adventure"
      listing_type: "hotel" | "lodge" | "guesthouse" | "hostel" | "apartment"
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
      app_role: ["admin", "moderator", "user"],
      booking_status: ["pending", "confirmed", "cancelled", "completed"],
      experience_category: [
        "city_tour",
        "cultural",
        "beach",
        "nature",
        "food",
        "adventure",
      ],
      listing_type: ["hotel", "lodge", "guesthouse", "hostel", "apartment"],
    },
  },
} as const
