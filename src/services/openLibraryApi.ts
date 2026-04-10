import { Author, TrendingBook, AuthorWork } from '../types';

const BASE_URL = 'https://openlibrary.org';

// Helper to handle author name array
function formatAuthorName(name: string | string[] | undefined): string {
  if (!name) return 'Autor desconocido';
  if (Array.isArray(name)) return name.join(', ');
  return name;
}

// Helper to get cover URL
export function getCoverUrl(coverId: number | undefined, size: 'S' | 'M' | 'L' = 'M'): string | null {
  if (!coverId) return null;
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}

// Helper to get author photo URL
export function getAuthorPhotoUrl(photoId: number | undefined): string | null {
  if (!photoId) return null;
  return `https://covers.openlibrary.org/a/id/${photoId}-M.jpg`;
}

// Search for an author by name
export async function searchAuthor(name: string): Promise<Author | null> {
  try {
    const response = await fetch(
      `${BASE_URL}/search/authors.json?q=${encodeURIComponent(name)}&limit=1`
    );
    if (!response.ok) throw new Error('Failed to fetch author');

    const data = await response.json();
    if (data.docs && data.docs.length > 0) {
      const doc = data.docs[0];
      return {
        key: doc.key,
        name: doc.name,
        birth_date: doc.birth_date,
        death_date: doc.death_date,
        bio: doc.bio,
        photos: doc.photos,
        work_count: doc.work_count,
        top_works: doc.top_works,
        top_subjects: doc.top_subjects,
      };
    }
    return null;
  } catch (error) {
    console.error('Error searching author:', error);
    return null;
  }
}

// Get author details by ID
export async function getAuthorDetails(authorKey: string): Promise<Author | null> {
  try {
    const response = await fetch(`${BASE_URL}${authorKey}.json`);
    if (!response.ok) throw new Error('Failed to fetch author details');

    const data = await response.json();
    return {
      key: data.key,
      name: data.name,
      birth_date: data.birth_date,
      death_date: data.death_date,
      bio: typeof data.bio === 'string' ? data.bio : data.bio?.value,
      photos: data.photos,
      work_count: data.work_count,
    };
  } catch (error) {
    console.error('Error fetching author details:', error);
    return null;
  }
}

// Get works by author
export async function getAuthorWorks(authorKey: string, limit: number = 20): Promise<AuthorWork[]> {
  try {
    const response = await fetch(
      `${BASE_URL}${authorKey}/works.json?limit=${limit}`
    );
    if (!response.ok) throw new Error('Failed to fetch author works');

    const data = await response.json();
    return data.entries.map((entry: any) => ({
      key: entry.key,
      title: entry.title,
      first_publish_year: entry.first_publish_date ?
        parseInt(entry.first_publish_date.split(', ').pop() || '0') : undefined,
      cover_i: entry.covers?.[0],
      edition_count: entry.edition_count,
    }));
  } catch (error) {
    console.error('Error fetching author works:', error);
    return [];
  }
}

// Get trending books
export async function getTrendingBooks(
  period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'weekly',
  limit: number = 50
): Promise<TrendingBook[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/trending/${period}.json?limit=${limit}&fields=key,title,author_name,cover_i,edition_count,first_publish_year,ratings_average,ratings_count`
    );
    if (!response.ok) throw new Error('Failed to fetch trending books');

    const data = await response.json();
    return data.works.map((work: any) => ({
      key: work.key,
      title: work.title,
      author_name: work.author_name,
      cover_i: work.cover_i,
      edition_count: work.edition_count,
      first_publish_year: work.first_publish_year,
      ratings_average: work.ratings_average,
      ratings_count: work.ratings_count,
    }));
  } catch (error) {
    console.error('Error fetching trending books:', error);
    return [];
  }
}

// Search books in Spanish
export async function searchSpanishBooks(limit: number = 30): Promise<TrendingBook[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/search.json?q=language:spa&limit=${limit}&fields=key,title,author_name,cover_i,edition_count,first_publish_year,ratings_average,ratings_count`
    );
    if (!response.ok) throw new Error('Failed to search Spanish books');

    const data = await response.json();
    return data.docs.map((doc: any) => ({
      key: doc.key,
      title: doc.title,
      author_name: doc.author_name,
      cover_i: doc.cover_i,
      edition_count: doc.edition_count,
      first_publish_year: doc.first_publish_year,
      ratings_average: doc.ratings_average,
      ratings_count: doc.ratings_count,
    }));
  } catch (error) {
    console.error('Error searching Spanish books:', error);
    return [];
  }
}

export { formatAuthorName };