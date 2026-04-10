import { Timestamp } from 'firebase/firestore';

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  summary: string;
  review: string;
  rating: number;
  readDate?: string;    // fecha en que se leyó (YYYY-MM-DD)
  userId: string;
  createdAt: Timestamp;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

// Open Library types
export interface Author {
  key: string;
  name: string;
  birth_date?: string;
  death_date?: string;
  bio?: string;
  photos?: number[];
  work_count?: number;
  top_works?: string[];
  top_subjects?: string[];
}

export interface TrendingBook {
  key: string;
  title: string;
  author_name?: string | string[];
  cover_i?: number;
  edition_count?: number;
  first_publish_year?: number;
  ratings_average?: number;
  ratings_count?: number;
}

export interface AuthorWork {
  key: string;
  title: string;
  first_publish_year?: number;
  cover_i?: number;
  edition_count?: number;
}