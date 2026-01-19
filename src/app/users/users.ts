export interface User {
  user_id: string;  // Changed from number to string
  username?: string | null;  // Made optional/nullable
  email?: string | null;  // Made optional/nullable
  first_name?: string | null;  // Made optional/nullable
  gender?: string;
  birthday?: string;
  height?: string | null;
  relationship_status?: string | null;
  college?: string | null;
  avatar?: string | null;
  last_user_location?: any;
  created_at?: Date;
  updated_at?: Date;
  metadata?: string;
  is_delete?: string;
  user_focus?: string | null;
  look_for_gender?: string | null;
  user_summary?: string | null;
  top_user?: boolean | null;
  interests?: string | null;
  summary?: string | null;
  connection_type?: string | null;
  age_preference?: string | null;
}
