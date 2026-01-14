
export type ProductType = 'beat' | 'sample-pack' | 'midi-pack' | 'song';

export interface Product {
  id: string;
  title: string;
  type: ProductType;
  price: number;
  isFree: boolean;
  audioPreviewUrl: string;
  thumbnailUrl: string;
  description: string;
  tags: string[];
  bpm?: number;
  key?: string;
  fileUrl?: string;
}

export interface ProjectFile {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  type: 'wav' | 'zip' | 'midi';
}

export interface CollabMessage {
  sender: 'admin' | 'user';
  text: string;
  timestamp: string;
}

export interface CollaborationRequest {
  id: string;
  senderName: string;
  senderEmail: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'archived' | 'contacted';
  liveLink?: string;
  createdAt: string;
  projectType: string;
  files: ProjectFile[];
  chat: CollabMessage[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  activeCollaborations: number;
  newMessages: number;
}
