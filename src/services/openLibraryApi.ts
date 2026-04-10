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
      
      // Attempt to get a better biography from Wikipedia in Spanish
      let wikiBio = undefined;
      try {
        // First search Wikipedia for the author
        const wikiSearchRes = await fetch(`https://es.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(name)}&utf8=&format=json&origin=*`);
        if (wikiSearchRes.ok) {
          const wikiSearchData = await wikiSearchRes.json();
          if (wikiSearchData.query?.search?.length > 0) {
            const firstResultTitle = wikiSearchData.query.search[0].title;
            // Fetch the full extract for the matched title to include awards and publications
            const wikiExtractRes = await fetch(`https://es.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&titles=${encodeURIComponent(firstResultTitle)}&format=json&origin=*`);
            if (wikiExtractRes.ok) {
              const wikiExtractData = await wikiExtractRes.json();
              const pages = wikiExtractData.query?.pages;
              if (pages) {
                const pageId = Object.keys(pages)[0];
                if (pageId && pages[pageId].extract) {
                  const rawExtract = pages[pageId].extract as string;
                  // Only take the first paragraph of the Wikipedia article (intro)
                  const firstParagraph = rawExtract.split('\n\n')[0]?.trim() || '';
                  // Limit to first 3 sentences for brevity
                  const sentences = firstParagraph.match(/[^.!?]+[.!?]+/g) || [firstParagraph];
                  wikiBio = sentences.slice(0, 3).join(' ').trim();
                }
              }
            }
          }
        }
      } catch (wikiError) {
        console.error('Error fetching Wikipedia bio:', wikiError);
      }

      return {
        key: doc.key,
        name: doc.name,
        birth_date: doc.birth_date,
        death_date: doc.death_date,
        bio: wikiBio || doc.bio,
        photos: doc.photos,
        work_count: doc.work_count,
        top_works: doc.top_works,
        top_subjects: doc.top_subjects,
      };
    }
    
    // If not found in OpenLibrary, let's at least try Wikipedia
    try {
      const wikiSearchRes = await fetch(`https://es.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(name)}&utf8=&format=json&origin=*`);
      if (wikiSearchRes.ok) {
        const wikiSearchData = await wikiSearchRes.json();
        if (wikiSearchData.query?.search?.length > 0) {
          const firstResultTitle = wikiSearchData.query.search[0].title;
          const wikiExtractRes = await fetch(`https://es.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&titles=${encodeURIComponent(firstResultTitle)}&format=json&origin=*`);
          if (wikiExtractRes.ok) {
            const wikiExtractData = await wikiExtractRes.json();
            const pages = wikiExtractData.query?.pages;
            if (pages) {
              const pageId = Object.keys(pages)[0];
              if (pageId && pages[pageId].extract) {
                const rawExtract = pages[pageId].extract as string;
                const firstParagraph = rawExtract.split('\n\n')[0]?.trim() || '';
                const sentences = firstParagraph.match(/[^.!?]+[.!?]+/g) || [firstParagraph];
                return {
                  key: 'wiki_' + firstResultTitle,
                  name: firstResultTitle,
                  bio: sentences.slice(0, 3).join(' ').trim(),
                };
              }
            }
          }
        }
      }
    } catch (e) {
      console.error('Wikipedia fallback error', e);
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

// Fetch specific top 30 Spanish bestsellers requested by the user
export async function getTop30Bestsellers(): Promise<TrendingBook[]> {
  const top30 = [
    { title: "Comerás flores", author: "Lúcia Boadella" },
    { title: "Bolsillo Newton Surtido", author: "" },
    { title: "Maite", author: "" },
    { title: "Surtido 1+1 2025", author: "" },
    { title: "Han cantado bingo", author: "Lara Conejo" },
    { title: "Las gratitudes", author: "Delphine de Vigan" },
    { title: "La ciudad de las luces muertas", author: "David Uclés" },
    { title: "Mentira", author: "Juan Gómez-Jurado" },
    { title: "Llevará tu nombre", author: "Sonsoles Ónega" },
    { title: "La península de las casas vacías", author: "David Uclés" },
    { title: "Méliès", author: "Emmanuel Carrère" },
    { title: "Jotadé 2. El Amo", author: "Santiago Díaz" },
    { title: "Batman. Patrones Oscuros 02", author: "" },
    { title: "Hamnet", author: "Maggie O'Farrell" },
    { title: "Coloquio de invierno", author: "Luis Landero" },
    { title: "Islandia", author: "Manuel Vilas" },
    { title: "La chica más lista que conozco", author: "" },
    { title: "La fuerza de pocos", author: "" },
    { title: "Gente a cenar", author: "" },
    { title: "Con nadie", author: "Lorenzo Silva" },
    { title: "Si fuéramos eternos", author: "Emma Gil" },
    { title: "Dragon Ball Super N° 24", author: "Akira Toriyama" },
    { title: "España partida en dos", author: "Julián Casanova" },
    { title: "La asistenta", author: "Freida McFadden" },
    { title: "El profeta", author: "" },
    { title: "Oxígeno", author: "Marta Jiménez Serrano" },
    { title: "Punto de araña", author: "Nora Delarbol" },
    { title: "Mamá está dormida", author: "Máximo Huerta" },
    { title: "Amiga mía", author: "" },
    { title: "Atelier of Witch Hat", author: "Kamome Shirahama" }
  ];

  const results = await Promise.all(top30.map(async (book) => {
    try {
      const q = book.author ? `title:"${book.title}" author:${book.author}` : `title:"${book.title}"`;
      const response = await fetch(
        `${BASE_URL}/search.json?q=${encodeURIComponent(q)}&limit=1&fields=key,title,author_name,cover_i,edition_count,first_publish_year,ratings_average,ratings_count`
      );
      if (!response.ok) throw new Error('API failed');

      const data = await response.json();
      if (data.docs && data.docs.length > 0) {
        const doc = data.docs[0];
        return {
          key: doc.key,
          title: doc.title,
          author_name: doc.author_name || [book.author],
          cover_i: doc.cover_i,
          edition_count: doc.edition_count,
          first_publish_year: doc.first_publish_year,
          ratings_average: doc.ratings_average,
          ratings_count: doc.ratings_count,
        };
      }
      
      // Fallback if not found
      return {
        key: `/works/${book.title.replace(/\s+/g, '')}`,
        title: book.title,
        author_name: [book.author],
        cover_i: undefined
      };
    } catch (error) {
      // Fallback on error
      return {
        key: `/works/${book.title.replace(/\s+/g, '')}`,
        title: book.title,
        author_name: [book.author],
        cover_i: undefined
      };
    }
  }));

  return results as TrendingBook[];
}

export { formatAuthorName };