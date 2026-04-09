export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  summary: string;
  review: string;
  rating: number;
  userId: string;
  createdAt: any;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}
