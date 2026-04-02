export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  phoneNumber?: string;
  photoURL?: string;
  createdAt: string;
  role?: 'admin' | 'user';
  isProfessional?: boolean;
  isFeaturedPro?: boolean;
  featuredProPriority?: number;
  featuredProPosition?: string; // e.g., 'sidebar', 'between-ads'
  featuredProActive?: boolean;
  isVerified?: boolean;
  recommendations?: number;
  pushNotificationsEnabled?: boolean;
  rating?: number;
  reviewCount?: number;
  hasActiveBanner?: boolean;
  subscription?: {
    plan: 'bronze' | 'argent' | 'or';
    status: 'active' | 'unpaid' | 'canceled' | 'past_due' | 'incomplete';
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    currentPeriodEnd?: string;
    cancelAtPeriodEnd?: boolean;
  };
  isPartner?: boolean; // Badge 'Partenaire PetiTroc'
  lastSeenAt?: string;
  isPhoneVerified?: boolean;
  responseRate?: string;
}

export interface Review {
  id: string;
  adId: string;
  reviewerId: string;
  reviewerName: string;
  targetUserId: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

export interface Location {
  lat: number;
  lng: number;
  address?: string;
  city: string;
  zipCode: string;
}

export interface Ad {
  id: string;
  authorId: string;
  userName: string;
  title: string;
  description: string;
  category: string;
  type: 'offer' | 'seek';
  price?: number;
  images: string[];
  location: Location;
  details: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  status: 'active' | 'sold' | 'deleted';
  duplicateHash: string;
  isFeatured?: boolean;
  featuredPriority?: number;
  featuredPosition?: number; // 1, 2, 3... or specific slot index
  featuredActive?: boolean;
  authorIsVerified?: boolean;
}

export interface Conversation {
  id: string;
  adId: string;
  adTitle?: string;
  adImage?: string;
  participants: string[];
  lastMessage?: string;
  lastSenderId?: string;
  lastSenderName?: string;
  updatedAt: string;
  unreadCount?: Record<string, number>;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text?: string;
  audioUrl?: string;
  createdAt: string;
}

export interface Report {
  id: string;
  adId: string;
  adTitle: string;
  reporterId: string;
  reporterEmail: string;
  reason: string;
  details?: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
}

export interface SearchAlert {
  id: string;
  userId: string;
  query: string;
  category?: string;
  subCategory?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  maxDistance?: number;
  catFilters?: Record<string, any>;
  createdAt: string;
}

export interface Banner {
  id: string;
  userId: string;
  userName: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
  createdAt: string;
  expiresAt?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  userId?: string | null;
  reply?: string;
  repliedAt?: string;
  repliedBy?: string;
}
