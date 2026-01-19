import { User } from '../users/users';

export interface TimelineActivity {
  activity_type: 'joined_group' | 'applied_to_group' | 'created_invite' | 'redeemed_invite' | 'expression' | 'user_post';
  activity_role: string;
  activity_time: Date;
  group_id: string;
  group_subject: string;
  group_location?: string;
  group_time?: Date;
  app_status?: string;
  app_decided_at?: Date;
  invite_code?: string;
  invite_expires_at?: Date;
  invite_usage_count?: number;
  invite_id?: string;
  redemption_id?: string;
  // Expression-specific fields
  expr_topic?: string;
  expr_ai_question?: string;
  expr_user_answer?: string;
  expr_context?: string;
  expr_created_at?: Date;
  // User post-specific fields
  post_content?: string;
  post_created_at?: Date;
  post_updated_at?: Date;
}

export interface UserTimeline {
  user: User;
  timeline: TimelineActivity[];
}
