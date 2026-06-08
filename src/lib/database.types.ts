export interface Database {
  public: {
    Tables: {
      private_bookings: {
        Row: {
          id: string;
          film_id: string | null;
          film_title: string | null;
          package_id: string;
          package_name: string;
          package_price_ngn: number;
          booking_date: string;
          time_slot: string;
          full_name: string;
          email: string;
          phone_number: string;
          notes: string | null;
          status: "pending_payment" | "paid" | "failed" | "cancelled";
          paystack_reference: string;
          paid_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          film_id?: string | null;
          film_title?: string | null;
          package_id: string;
          package_name: string;
          package_price_ngn: number;
          booking_date: string;
          time_slot: string;
          full_name: string;
          email: string;
          phone_number: string;
          notes?: string | null;
          status?: "pending_payment" | "paid" | "failed" | "cancelled";
          paystack_reference: string;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          film_id?: string | null;
          film_title?: string | null;
          package_id?: string;
          package_name?: string;
          package_price_ngn?: number;
          booking_date?: string;
          time_slot?: string;
          full_name?: string;
          email?: string;
          phone_number?: string;
          notes?: string | null;
          status?: "pending_payment" | "paid" | "failed" | "cancelled";
          paystack_reference?: string;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
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
