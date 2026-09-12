export interface Database {
  public: {
    Tables: {
      private_bookings: {
        Row: {
          id: string;
          booking_type: "blockbuster" | "movie-package";
          film_id: string | null;
          film_title: string | null;
          content_platform: string | null;
          content_title: string | null;
          package_id: string;
          package_name: string;
          package_price_ngn: number;
          additional_guests: number;
          include_rose_decoration: boolean;
          booking_date: string;
          time_slot: string;
          full_name: string;
          email: string;
          phone_number: string;
          notes: string | null;
          status: "pending_payment" | "paid" | "failed" | "cancelled";
          payment_source: "online_paystack" | "admin_direct";
          created_by_admin: string | null;
          paystack_reference: string;
          paid_at: string | null;
          confirmation_email_sent_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          booking_type?: "blockbuster" | "movie-package";
          film_id?: string | null;
          film_title?: string | null;
          content_platform?: string | null;
          content_title?: string | null;
          package_id: string;
          package_name: string;
          package_price_ngn: number;
          additional_guests?: number;
          include_rose_decoration?: boolean;
          booking_date: string;
          time_slot: string;
          full_name: string;
          email: string;
          phone_number: string;
          notes?: string | null;
          status?: "pending_payment" | "paid" | "failed" | "cancelled";
          payment_source?: "online_paystack" | "admin_direct";
          created_by_admin?: string | null;
          paystack_reference: string;
          paid_at?: string | null;
          confirmation_email_sent_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          booking_type?: "blockbuster" | "movie-package";
          film_id?: string | null;
          film_title?: string | null;
          content_platform?: string | null;
          content_title?: string | null;
          package_id?: string;
          package_name?: string;
          package_price_ngn?: number;
          additional_guests?: number;
          include_rose_decoration?: boolean;
          booking_date?: string;
          time_slot?: string;
          full_name?: string;
          email?: string;
          phone_number?: string;
          notes?: string | null;
          status?: "pending_payment" | "paid" | "failed" | "cancelled";
          payment_source?: "online_paystack" | "admin_direct";
          created_by_admin?: string | null;
          paystack_reference?: string;
          paid_at?: string | null;
          confirmation_email_sent_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      manual_slot_blocks: {
        Row: {
          id: string;
          booking_date: string;
          time_slot: string;
          reason: string | null;
          created_by_admin: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_date: string;
          time_slot: string;
          reason?: string | null;
          created_by_admin?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          booking_date?: string;
          time_slot?: string;
          reason?: string | null;
          created_by_admin?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
