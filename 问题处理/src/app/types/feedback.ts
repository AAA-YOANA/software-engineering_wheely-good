export type FeedbackPriority = 'high' | 'low';
export type FeedbackStatus = 'pending' | 'in-progress' | 'resolved' | 'closed';

export interface Feedback {
  id: string;
  title: string;
  description: string;
  userName: string;
  userEmail: string;
  priority: FeedbackPriority;
  status: FeedbackStatus;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  adminReply?: string;
}
