export type RequestStatus =
  | "PENDING"
  | "IN_REVIEW"
  | "QUOTED"
  | "FULFILLED"
  | "UNAVAILABLE";

export interface RequestRow {
  id: string;
  created_at: string;
  ticket_number: string;
  description: string;
  reference_image_url: string | null;
  budget: string | null;
  size: string | null;
  category: string | null;
  condition: string | null;
  need_by_date: string | null;
  flexibility: string | null;
  extra_notes: string | null;
  client_email: string;
  client_phone: string;
  status: RequestStatus;
  admin_response_notes: string | null;
  quoted_price: string | null;
}

export type RequestInsert = {
  id?: string;
  created_at?: string;
  ticket_number?: string;
  description: string;
  reference_image_url?: string | null;
  budget?: string | null;
  size?: string | null;
  category?: string | null;
  condition?: string | null;
  need_by_date?: string | null;
  flexibility?: string | null;
  extra_notes?: string | null;
  client_email: string;
  client_phone: string;
  status?: RequestStatus;
  admin_response_notes?: string | null;
  quoted_price?: string | null;
};

export type RequestUpdate = Partial<RequestRow>;

/**
 * Minimal hand-written stand-in for the `supabase gen types typescript`
 * output. Once the project is linked to a live Supabase project, regenerate
 * this with:
 *
 *   npx supabase gen types typescript --project-id <ref> > types/database.ts
 *
 * and re-add the RequestStatus/RequestRow helper aliases above the generated
 * block if you want to keep using them elsewhere in the app.
 */
export interface Database {
  public: {
    Tables: {
      requests: {
        Row: RequestRow;
        Insert: RequestInsert;
        Update: RequestUpdate;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      request_status: RequestStatus;
    };
  };
}
