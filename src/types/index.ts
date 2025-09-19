export interface Business {
  name: string;
  owner?: string;
  contact: string;
  description: string;
  isMember: boolean;
  isBoardMember?: boolean;
  category: string;
  address?: string;
  socialMedia?: {
    facebook?: string;
    linkedin?: string;
    instagram?: string;
    other?: string;
  };
  id?: string;
  status?: 'pending' | 'approved' | 'rejected';
  is_featured?: boolean;
  created_at?: string;
  logo_file?: Uint8Array;
  logo_filename?: string;
  logo_content_type?: string;
  website_url?: string;
  contact_email?: string;
  contact_phone?: string;
}

export interface AdvisoryBoardMember {
  name: string;
  title: string;
  business?: string;
}

export interface FoundingMember {
  name: string;
  title: string;
  business?: string;
  bio: string;
  email?: string;
  website?: string;
}
export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
  status: 'active' | 'unsubscribed';
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'super_admin';
  created_at: string;
}

export interface BusinessSubmission extends Business {
  submission_date: string;
  admin_notes?: string;
  rejection_reason?: string;
}