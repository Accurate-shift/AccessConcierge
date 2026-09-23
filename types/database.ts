export type RequestStatus =
  | "PENDING"
  | "REVIEWING"
  | "QUOTED"
  | "APPROVED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type RequestRow = {
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
};

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

export interface Database {
  public: {
    Tables: {
      requests: {
        Row: RequestRow;
        Insert: RequestInsert;
        Update: RequestUpdate;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      request_status: RequestStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}