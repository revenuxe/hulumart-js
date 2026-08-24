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
    PostgrestVersion: "14.15"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      addons: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          price: number
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          price: number
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          price?: number
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      addresses: {
        Row: {
          city: string
          created_at: string
          id: string
          is_default: boolean
          label: string | null
          line1: string
          line2: string | null
          phone: string
          pincode: string
          state: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          city: string
          created_at?: string
          id?: string
          is_default?: boolean
          label?: string | null
          line1: string
          line2?: string | null
          phone: string
          pincode: string
          state?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          city?: string
          created_at?: string
          id?: string
          is_default?: boolean
          label?: string | null
          line1?: string
          line2?: string | null
          phone?: string
          pincode?: string
          state?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      balloon_pair_groups: {
        Row: {
          balloons: Json
          created_at: string
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          balloons?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          balloons?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      balloon_palette_pair_links: {
        Row: {
          pair_group_id: string
          palette_id: string
          sort_order: number
        }
        Insert: {
          pair_group_id: string
          palette_id: string
          sort_order?: number
        }
        Update: {
          pair_group_id?: string
          palette_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "balloon_palette_pair_links_pair_group_id_fkey"
            columns: ["pair_group_id"]
            isOneToOne: false
            referencedRelation: "balloon_pair_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "balloon_palette_pair_links_palette_id_fkey"
            columns: ["palette_id"]
            isOneToOne: false
            referencedRelation: "decoration_content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_items: {
        Row: {
          addons: Json
          booking_id: string
          category_slug: string
          created_at: string
          customizations: Json
          id: string
          image: string | null
          original_price: number | null
          product_id: string | null
          quantity: number
          service_name: string
          service_slug: string
          unit_price: number
        }
        Insert: {
          addons?: Json
          booking_id: string
          category_slug: string
          created_at?: string
          customizations?: Json
          id?: string
          image?: string | null
          original_price?: number | null
          product_id?: string | null
          quantity?: number
          service_name: string
          service_slug: string
          unit_price: number
        }
        Update: {
          addons?: Json
          booking_id?: string
          category_slug?: string
          created_at?: string
          customizations?: Json
          id?: string
          image?: string | null
          original_price?: number | null
          product_id?: string | null
          quantity?: number
          service_name?: string
          service_slug?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "booking_items_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_status_events: {
        Row: {
          booking_id: string
          created_at: string
          id: string
          status: Database["public"]["Enums"]["booking_status"]
        }
        Insert: {
          booking_id: string
          created_at?: string
          id?: string
          status: Database["public"]["Enums"]["booking_status"]
        }
        Update: {
          booking_id?: string
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["booking_status"]
        }
        Relationships: [
          {
            foreignKeyName: "booking_status_events_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          assigned_vendor_id: string | null
          created_at: string
          decoration_image_url: string | null
          event_date: string
          event_time: string
          id: string
          notes: string | null
          order_code: string
          status: Database["public"]["Enums"]["booking_status"]
          team_image_url: string | null
          total: number
          updated_at: string
          user_id: string
          vendor_accepted_at: string | null
          vendor_bill_amount: number | null
          vendor_paid_amount: number
          vendor_paid_at: string | null
          vendor_payment_status: Database["public"]["Enums"]["vendor_payment_status"]
          vendor_quote_amount: number | null
          vendor_quote_items: Json
          venue_city: string
          venue_line1: string
          venue_line2: string | null
          venue_name: string | null
          venue_phone: string
          venue_pincode: string
        }
        Insert: {
          assigned_vendor_id?: string | null
          created_at?: string
          decoration_image_url?: string | null
          event_date: string
          event_time: string
          id?: string
          notes?: string | null
          order_code?: string
          status?: Database["public"]["Enums"]["booking_status"]
          team_image_url?: string | null
          total: number
          updated_at?: string
          user_id: string
          vendor_accepted_at?: string | null
          vendor_bill_amount?: number | null
          vendor_paid_amount?: number
          vendor_paid_at?: string | null
          vendor_payment_status?: Database["public"]["Enums"]["vendor_payment_status"]
          vendor_quote_amount?: number | null
          vendor_quote_items?: Json
          venue_city: string
          venue_line1: string
          venue_line2?: string | null
          venue_name?: string | null
          venue_phone: string
          venue_pincode: string
        }
        Update: {
          assigned_vendor_id?: string | null
          created_at?: string
          decoration_image_url?: string | null
          event_date?: string
          event_time?: string
          id?: string
          notes?: string | null
          order_code?: string
          status?: Database["public"]["Enums"]["booking_status"]
          team_image_url?: string | null
          total?: number
          updated_at?: string
          user_id?: string
          vendor_accepted_at?: string | null
          vendor_bill_amount?: number | null
          vendor_paid_amount?: number
          vendor_paid_at?: string | null
          vendor_payment_status?: Database["public"]["Enums"]["vendor_payment_status"]
          vendor_quote_amount?: number | null
          vendor_quote_items?: Json
          venue_city?: string
          venue_line1?: string
          venue_line2?: string | null
          venue_name?: string | null
          venue_phone?: string
          venue_pincode?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_assigned_vendor_id_fkey"
            columns: ["assigned_vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          accent: string | null
          created_at: string
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          slug: string
          sort_order: number
          tagline: string | null
          updated_at: string
        }
        Insert: {
          accent?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
          tagline?: string | null
          updated_at?: string
        }
        Update: {
          accent?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
          tagline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      decoration_content_items: {
        Row: {
          content: Json
          created_at: string
          id: string
          is_active: boolean
          kind: Database["public"]["Enums"]["decoration_content_kind"]
          name: string
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          kind: Database["public"]["Enums"]["decoration_content_kind"]
          name: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          kind?: Database["public"]["Enums"]["decoration_content_kind"]
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      fulfilments: {
        Row: {
          courier: string | null
          created_at: string
          delivered_at: string | null
          id: string
          order_id: string
          packed_at: string | null
          shipped_at: string | null
          status: Database["public"]["Enums"]["fulfilment_status"]
          tracking_number: string | null
          tracking_url: string | null
          updated_at: string
        }
        Insert: {
          courier?: string | null
          created_at?: string
          delivered_at?: string | null
          id?: string
          order_id: string
          packed_at?: string | null
          shipped_at?: string | null
          status?: Database["public"]["Enums"]["fulfilment_status"]
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string
        }
        Update: {
          courier?: string | null
          created_at?: string
          delivered_at?: string | null
          id?: string
          order_id?: string
          packed_at?: string | null
          shipped_at?: string | null
          status?: Database["public"]["Enums"]["fulfilment_status"]
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fulfilments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      homepage_hero_slides: {
        Row: {
          action_label: string
          action_url: string
          created_at: string
          desktop_image_url: string
          id: string
          is_active: boolean
          kicker: string
          mobile_image_url: string | null
          sort_order: number
          subtitle: string
          title: string
          updated_at: string
        }
        Insert: {
          action_label?: string
          action_url?: string
          created_at?: string
          desktop_image_url: string
          id?: string
          is_active?: boolean
          kicker?: string
          mobile_image_url?: string | null
          sort_order?: number
          subtitle?: string
          title: string
          updated_at?: string
        }
        Update: {
          action_label?: string
          action_url?: string
          created_at?: string
          desktop_image_url?: string
          id?: string
          is_active?: boolean
          kicker?: string
          mobile_image_url?: string | null
          sort_order?: number
          subtitle?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      inventory_movements: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          kind: Database["public"]["Enums"]["inventory_movement_kind"]
          product_id: string
          quantity_delta: number
          reason: string | null
          reference_id: string | null
          reference_type: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          kind: Database["public"]["Enums"]["inventory_movement_kind"]
          product_id: string
          quantity_delta: number
          reason?: string | null
          reference_id?: string | null
          reference_type?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["inventory_movement_kind"]
          product_id?: string
          quantity_delta?: number
          reason?: string | null
          reference_id?: string | null
          reference_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          condition_snapshot: Json
          created_at: string
          id: string
          image_url: string | null
          line_total: number
          order_id: string
          product_id: string | null
          product_name: string
          product_slug: string
          quantity: number
          sku: string | null
          unit_price: number
          warranty_snapshot: Json
        }
        Insert: {
          condition_snapshot?: Json
          created_at?: string
          id?: string
          image_url?: string | null
          line_total: number
          order_id: string
          product_id?: string | null
          product_name: string
          product_slug: string
          quantity: number
          sku?: string | null
          unit_price: number
          warranty_snapshot?: Json
        }
        Update: {
          condition_snapshot?: Json
          created_at?: string
          id?: string
          image_url?: string | null
          line_total?: number
          order_id?: string
          product_id?: string | null
          product_name?: string
          product_slug?: string
          quantity?: number
          sku?: string | null
          unit_price?: number
          warranty_snapshot?: Json
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          currency: string
          customer_note: string | null
          fulfilment_status: Database["public"]["Enums"]["fulfilment_status"]
          id: string
          idempotency_key: string
          order_number: string
          payment_status: Database["public"]["Enums"]["payment_status"]
          reservation_expires_at: string | null
          shipping_address: Json
          shipping_amount: number
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          tax_amount: number
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          currency?: string
          customer_note?: string | null
          fulfilment_status?: Database["public"]["Enums"]["fulfilment_status"]
          id?: string
          idempotency_key: string
          order_number?: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          reservation_expires_at?: string | null
          shipping_address: Json
          shipping_amount?: number
          status?: Database["public"]["Enums"]["order_status"]
          subtotal: number
          tax_amount?: number
          total: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          currency?: string
          customer_note?: string | null
          fulfilment_status?: Database["public"]["Enums"]["fulfilment_status"]
          id?: string
          idempotency_key?: string
          order_number?: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          reservation_expires_at?: string | null
          shipping_address?: Json
          shipping_amount?: number
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          tax_amount?: number
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          failure_code: string | null
          failure_message: string | null
          id: string
          order_id: string
          paid_at: string | null
          provider: string
          provider_order_id: string | null
          provider_payment_id: string | null
          status: Database["public"]["Enums"]["payment_status"]
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          failure_code?: string | null
          failure_message?: string | null
          id?: string
          order_id: string
          paid_at?: string | null
          provider: string
          provider_order_id?: string | null
          provider_payment_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          failure_code?: string | null
          failure_message?: string | null
          id?: string
          order_id?: string
          paid_at?: string | null
          provider?: string
          provider_order_id?: string | null
          provider_payment_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      product_addon_links: {
        Row: {
          addon_id: string
          created_at: string
          id: string
          product_id: string
        }
        Insert: {
          addon_id: string
          created_at?: string
          id?: string
          product_id: string
        }
        Update: {
          addon_id?: string
          created_at?: string
          id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_addon_links_addon_id_fkey"
            columns: ["addon_id"]
            isOneToOne: false
            referencedRelation: "addons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_addon_links_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_decoration_content_links: {
        Row: {
          content_item_id: string
          created_at: string
          product_id: string
        }
        Insert: {
          content_item_id: string
          created_at?: string
          product_id: string
        }
        Update: {
          content_item_id?: string
          created_at?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_decoration_content_links_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "decoration_content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_decoration_content_links_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_content_library: {
        Row: {
          body: string | null
          created_at: string
          faqs: Json
          id: string
          included: string[]
          is_active: boolean
          kind: string
          name: string
          not_included: string[]
          updated_at: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          faqs?: Json
          id?: string
          included?: string[]
          is_active?: boolean
          kind: string
          name: string
          not_included?: string[]
          updated_at?: string
        }
        Update: {
          body?: string | null
          created_at?: string
          faqs?: Json
          id?: string
          included?: string[]
          is_active?: boolean
          kind?: string
          name?: string
          not_included?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      product_types: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          is_active: boolean
          meta_description: string | null
          meta_title: string | null
          name: string
          slug: string
          sort_order: number
          subcategory_id: string
          tagline: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          meta_description?: string | null
          meta_title?: string | null
          name: string
          slug: string
          sort_order?: number
          subcategory_id: string
          tagline?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          slug?: string
          sort_order?: number
          subcategory_id?: string
          tagline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          approximate_age_months: number | null
          balloon_options: Json
          balloon_palette_id: string | null
          brand: string | null
          care_group_id: string | null
          care_info: string | null
          category_id: string
          condition_details: Json
          condition_grade: Database["public"]["Enums"]["product_condition"]
          condition_summary: string | null
          created_at: string
          delivery_group_id: string | null
          delivery_info: string | null
          description: string | null
          faq_group_id: string | null
          faqs: Json
          fulfilment_methods: string[]
          id: string
          images: string[]
          included: string[]
          included_group_id: string | null
          is_active: boolean
          is_featured: boolean
          is_trending: boolean
          low_stock_threshold: number
          meta_description: string | null
          meta_title: string | null
          model: string | null
          name: string
          not_included: string[]
          og_image_url: string | null
          price: number
          product_type_id: string | null
          rating: number
          reserved_quantity: number
          review_count: number
          sale_price: number | null
          sku: string | null
          slug: string
          sort_order: number
          specifications: Json
          stock_quantity: number
          subcategory_id: string | null
          tagline: string | null
          tags: string[]
          updated_at: string
          usage_summary: string | null
          warranty_coverage: string | null
          warranty_expires_at: string | null
          warranty_provider: string | null
          warranty_status: Database["public"]["Enums"]["warranty_status"]
          warranty_transferable: boolean
        }
        Insert: {
          approximate_age_months?: number | null
          balloon_options?: Json
          balloon_palette_id?: string | null
          brand?: string | null
          care_group_id?: string | null
          care_info?: string | null
          category_id: string
          condition_details?: Json
          condition_grade?: Database["public"]["Enums"]["product_condition"]
          condition_summary?: string | null
          created_at?: string
          delivery_group_id?: string | null
          delivery_info?: string | null
          description?: string | null
          faq_group_id?: string | null
          faqs?: Json
          fulfilment_methods?: string[]
          id?: string
          images?: string[]
          included?: string[]
          included_group_id?: string | null
          is_active?: boolean
          is_featured?: boolean
          is_trending?: boolean
          low_stock_threshold?: number
          meta_description?: string | null
          meta_title?: string | null
          model?: string | null
          name: string
          not_included?: string[]
          og_image_url?: string | null
          price: number
          product_type_id?: string | null
          rating?: number
          reserved_quantity?: number
          review_count?: number
          sale_price?: number | null
          sku?: string | null
          slug: string
          sort_order?: number
          specifications?: Json
          stock_quantity?: number
          subcategory_id?: string | null
          tagline?: string | null
          tags?: string[]
          updated_at?: string
          usage_summary?: string | null
          warranty_coverage?: string | null
          warranty_expires_at?: string | null
          warranty_provider?: string | null
          warranty_status?: Database["public"]["Enums"]["warranty_status"]
          warranty_transferable?: boolean
        }
        Update: {
          approximate_age_months?: number | null
          balloon_options?: Json
          balloon_palette_id?: string | null
          brand?: string | null
          care_group_id?: string | null
          care_info?: string | null
          category_id?: string
          condition_details?: Json
          condition_grade?: Database["public"]["Enums"]["product_condition"]
          condition_summary?: string | null
          created_at?: string
          delivery_group_id?: string | null
          delivery_info?: string | null
          description?: string | null
          faq_group_id?: string | null
          faqs?: Json
          fulfilment_methods?: string[]
          id?: string
          images?: string[]
          included?: string[]
          included_group_id?: string | null
          is_active?: boolean
          is_featured?: boolean
          is_trending?: boolean
          low_stock_threshold?: number
          meta_description?: string | null
          meta_title?: string | null
          model?: string | null
          name?: string
          not_included?: string[]
          og_image_url?: string | null
          price?: number
          product_type_id?: string | null
          rating?: number
          reserved_quantity?: number
          review_count?: number
          sale_price?: number | null
          sku?: string | null
          slug?: string
          sort_order?: number
          specifications?: Json
          stock_quantity?: number
          subcategory_id?: string | null
          tagline?: string | null
          tags?: string[]
          updated_at?: string
          usage_summary?: string | null
          warranty_coverage?: string | null
          warranty_expires_at?: string | null
          warranty_provider?: string | null
          warranty_status?: Database["public"]["Enums"]["warranty_status"]
          warranty_transferable?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "products_balloon_palette_id_fkey"
            columns: ["balloon_palette_id"]
            isOneToOne: false
            referencedRelation: "decoration_content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_care_group_id_fkey"
            columns: ["care_group_id"]
            isOneToOne: false
            referencedRelation: "decoration_content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_delivery_group_id_fkey"
            columns: ["delivery_group_id"]
            isOneToOne: false
            referencedRelation: "decoration_content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_faq_group_id_fkey"
            columns: ["faq_group_id"]
            isOneToOne: false
            referencedRelation: "decoration_content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_included_group_id_fkey"
            columns: ["included_group_id"]
            isOneToOne: false
            referencedRelation: "decoration_content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
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
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      subcategories: {
        Row: {
          category_id: string
          created_at: string
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          slug: string
          sort_order: number
          tagline: string | null
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
          tagline?: string | null
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
          tagline?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
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
          role: Database["public"]["Enums"]["app_role"]
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
      vendor_payments: {
        Row: {
          amount: number
          booking_id: string
          created_at: string
          id: string
          note: string | null
          paid_at: string
          recorded_by: string | null
        }
        Insert: {
          amount: number
          booking_id: string
          created_at?: string
          id?: string
          note?: string | null
          paid_at?: string
          recorded_by?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string
          created_at?: string
          id?: string
          note?: string | null
          paid_at?: string
          recorded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          address_line1: string
          address_line2: string | null
          business_name: string
          city: string
          contact_name: string
          created_at: string
          id: string
          phone: string
          pincode: string
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["vendor_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          business_name: string
          city: string
          contact_name: string
          created_at?: string
          id?: string
          phone: string
          pincode: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["vendor_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          business_name?: string
          city?: string
          contact_name?: string
          created_at?: string
          id?: string
          phone?: string
          pincode?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["vendor_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cancel_booking: { Args: { _booking_id: string }; Returns: undefined }
      create_order_reservation: {
        Args: {
          _address_id: string
          _customer_note?: string
          _idempotency_key: string
          _items: Json
        }
        Returns: string
      }
      place_order_with_offline_payment: {
        Args: {
          _fulfilment_method: string
          _order_id: string
          _payment_method: string
        }
        Returns: undefined
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      record_inventory_adjustment: {
        Args: { _product_id: string; _quantity_delta: number; _reason?: string }
        Returns: {
          created_at: string
          created_by: string | null
          id: string
          kind: Database["public"]["Enums"]["inventory_movement_kind"]
          product_id: string
          quantity_delta: number
          reason: string | null
          reference_id: string | null
          reference_type: string | null
        }
        SetofOptions: {
          from: "*"
          to: "inventory_movements"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      vendor_accept_assignment: {
        Args: { _booking_id: string }
        Returns: undefined
      }
      vendor_decline_assignment: {
        Args: { _booking_id: string }
        Returns: undefined
      }
      vendor_finalize_payment: {
        Args: { _booking_id: string; _final_amount: number }
        Returns: undefined
      }
      vendor_save_quote: {
        Args: { _booking_id: string; _items: Json; _total: number }
        Returns: undefined
      }
      vendor_submit_quote: {
        Args: { _amount: number; _booking_id: string }
        Returns: undefined
      }
      vendor_update_booking_status: {
        Args: {
          _booking_id: string
          _decoration_image_url?: string
          _new_status: Database["public"]["Enums"]["booking_status"]
          _team_image_url?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "customer" | "vendor"
      booking_status:
        | "pending"
        | "confirmed"
        | "preparing"
        | "completed"
        | "cancelled"
      decoration_content_kind:
        | "balloon_palette"
        | "included_set"
        | "faq_set"
        | "delivery_note"
        | "care_note"
      fulfilment_status:
        | "unfulfilled"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
        | "returned"
      inventory_movement_kind:
        | "receipt"
        | "adjustment"
        | "reservation"
        | "release"
        | "sale"
        | "return"
        | "damage"
      order_status:
        | "pending_payment"
        | "paid"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
        | "returned"
      payment_status:
        | "pending"
        | "authorized"
        | "paid"
        | "failed"
        | "refunded"
        | "partially_refunded"
      product_condition: "like_new" | "excellent" | "good" | "fair"
      vendor_payment_status: "unpaid" | "paid"
      vendor_status: "pending" | "approved" | "rejected"
      warranty_status: "none" | "seller" | "manufacturer" | "extended"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      app_role: ["admin", "customer", "vendor"],
      booking_status: [
        "pending",
        "confirmed",
        "preparing",
        "completed",
        "cancelled",
      ],
      decoration_content_kind: [
        "balloon_palette",
        "included_set",
        "faq_set",
        "delivery_note",
        "care_note",
      ],
      fulfilment_status: [
        "unfulfilled",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
      ],
      inventory_movement_kind: [
        "receipt",
        "adjustment",
        "reservation",
        "release",
        "sale",
        "return",
        "damage",
      ],
      order_status: [
        "pending_payment",
        "paid",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
      ],
      payment_status: [
        "pending",
        "authorized",
        "paid",
        "failed",
        "refunded",
        "partially_refunded",
      ],
      product_condition: ["like_new", "excellent", "good", "fair"],
      vendor_payment_status: ["unpaid", "paid"],
      vendor_status: ["pending", "approved", "rejected"],
      warranty_status: ["none", "seller", "manufacturer", "extended"],
    },
  },
} as const
