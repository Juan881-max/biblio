import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Book as BookIcon, Calendar, User, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Book } from '../types';
import { searchAuthor, getAuthorPhotoUrl, formatAuthorName } from '../services/openLibraryApi';

interface AuthorInfo {
  name: string;
  key?: string;
  birth_date?: string;
  death_date?: string;
  bio?: string;
  photoUrl?: string;
  work_count?: number;
  top_works?: string[];
  booksInLibrary: Book[];
  isLoading: boolean;
}

interface AuthorsProps {
  books: Book[];
}

const CUSTOM_AUTHORS: Record<string, Partial<AuthorInfo>> = {
  'Philipp Vandenberg': {
    bio: 'Philipp Vandenberg fue un escritor, periodista e historiador alemán (nacido en 1941), muy conocido por sus novelas históricas y ensayos sobre la Antigüedad y el mundo religioso. En realidad, es el seudónimo de Hans Dietrich Hartel.\n\n📚 Breve descripción de su obra\n\nSu obra se caracteriza por:\n- Novela histórica con intriga: mezcla hechos reales con elementos de misterio y aventura.\n- Interés por la arqueología y el mundo antiguo: Egipto, Roma, Edad Media, cristianismo primitivo…\n- Toque de pseudohistoria: plantea teorías o reinterpretaciones de hechos históricos.\n- Estilo ágil y divulgativo, fácil de leer pero documentado.\n\n👉 En resumen: es un autor muy popular dentro de la novela histórica de entretenimiento, ideal si te gustan las tramas con secretos, conspiraciones y trasfondo histórico.',
    top_works: [
      'El escarabajo verde',
      'El quinto evangelio',
      'La conjura sixtina',
      'El inventor de espejos',
      'Nerón: el emperador artista'
    ],
    birth_date: '1941'
  }
};

export default function Authors({ books }: AuthorsProps) {
  const [authors, setAuthors] = useState<AuthorInfo[]>([]);
  const [expandedAuthor, setExpandedAuthor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAuthors() {
      // Get unique authors from books
      const authorMap = new Map<string, Book[]>();
      books.forEach(book => {
        const existingBooks = authorMap.get(book.author) || [];
        existingBooks.push(book);
        authorMap.set(book.author, existingBooks);
      });

      // Fetch author info from Open Library
      const authorInfos: AuthorInfo[] = [];

      for (const [authorName, authorBooks] of authorMap) {
        const initialInfo: AuthorInfo = {
          name: authorName,
          booksInLibrary: authorBooks,
          isLoading: true,
        };
        authorInfos.push(initialInfo);
      }

      // Set initial state with loading authors
      setAuthors(authorInfos);
      setIsLoading(false);

      authorInfos.forEach(async (info) => {
        const authorName = info.name;
        try {
          const normalizedName = authorName.trim().toLowerCase();
          let customData: Partial<AuthorInfo> = {};
          for (const [key, value] of Object.entries(CUSTOM_AUTHORS)) {
            if (normalizedName.includes(key.toLowerCase())) {
              customData = value;
              break;
            }
          }

          const authorData = await searchAuthor(authorName);
          
          setAuthors(prev => prev.map(a => {
            if (a.name !== authorName) return a;
            
            if (authorData) {
              return {
                ...a,
                key: authorData.key,
                birth_date: customData.birth_date || authorData.birth_date,
                death_date: customData.death_date || authorData.death_date,
                bio: customData.bio || authorData.bio,
                work_count: customData.work_count || authorData.work_count,
                top_works: customData.top_works || authorData.top_works?.slice(0, 5),
                photoUrl: customData.photoUrl || (authorData.photos?.[0] ? getAuthorPhotoUrl(authorData.photos[0]) || undefined : undefined),
                isLoading: false,
              };
            } else if (customData.bio) {
              return {
                ...a,
                ...customData,
                isLoading: false,
              };
            }
            return { ...a, isLoading: false };
          }));
        } catch {
          setAuthors(prev => prev.map(a =>
            a.name === authorName ? { ...a, isLoading: false } : a
          ));
        }
      });
    }

    fetchAuthors();
  }, [books]);

  const toggleAuthor = (authorName: string) => {
    setExpandedAuthor(expandedAuthor === authorName ? null : authorName);
  };

  if (isLoading && books.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-parchment">
        <div className="text-2xl font-serif text-library-blue">Cargando autores...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-parchment pb-20">
      {/* Header */}
      <section className="bg-library-blue py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl font-serif text-white mb-4"
          >
            Autores
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-library-light text-lg max-w-2xl"
          >
            Descubre a los autores de tu biblioteca personal. Información obtenida de Open Library.
          </motion.p>
        </div>
      </section>

      {/* Authors List */}
      <main className="max-w-7xl mx-auto px-4 mt-12">
        {authors.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <User size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-serif text-xl">
              Aún no hay autores en tu biblioteca.
            </p>
            <p className="text-slate-400 mt-2">
              Añade libros para ver información de sus autores.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {authors.map((author, index) => (
              <motion.div
                key={author.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
              >
                <button
                  onClick={() => toggleAuthor(author.name)}
                  className="w-full p-6 flex items-center gap-6 text-left hover:bg-slate-50 transition-colors"
                >
                  {/* Author Photo */}
                  <div className="w-20 h-20 rounded-full bg-library-light flex items-center justify-center overflow-hidden flex-shrink-0">
                    {author.photoUrl ? (
                      <img
                        src={author.photoUrl}
                        alt={author.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <User size={32} className="text-library-blue" />
                    )}
                  </div>

                  {/* Author Info */}
                  <div className="flex-grow">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-serif text-library-dark">{author.name}</h2>
                      {author.isLoading && <Loader2 size={20} className="animate-spin text-library-blue" />}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                      {author.birth_date && (
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {author.birth_date}
                          {author.death_date && ` - ${author.death_date}`}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <BookIcon size={14} />
                        {author.booksInLibrary.length} libro{author.booksInLibrary.length !== 1 ? 's' : ''} en tu biblioteca
                      </span>
                      {author.work_count && (
                        <span className="text-library-blue">
                          {author.work_count.toLocaleString()} obras en Open Library
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expand Icon */}
                  <div className="text-slate-400">
                    {expandedAuthor === author.name ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </div>
                </button>

                {/* Expanded Content */}
                {expandedAuthor === author.name && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="border-t border-slate-100"
                  >
                    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Bio */}
                      <div>
                        <h3 className="text-xs uppercase tracking-widest font-semibold text-library-blue mb-3">
                          Biografía
                        </h3>
                        {author.bio ? (
                          <div className="text-slate-700 leading-relaxed space-y-3">
                            {author.bio.split('\n').map((line, i) => {
                              if (!line.trim()) return null;
                              const isBullet = line.trim().startsWith('-');
                              return (
                                <p key={i} className={isBullet ? "ml-4 pl-2 border-l-2 border-library-light" : ""}>
                                  {line}
                                </p>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-slate-400 italic">
                            {author.isLoading ? 'Cargando...' : 'Información no disponible'}
                          </p>
                        )}

                        {/* Top Works */}
                        {author.top_works && author.top_works.length > 0 && (
                          <div className="mt-6">
                            <h3 className="text-xs uppercase tracking-widest font-semibold text-library-blue mb-3">
                              Obras Destacadas
                            </h3>
                            <ul className="space-y-2">
                              {author.top_works.map((work, i) => (
                                <li key={i} className="text-slate-600 flex items-center gap-2">
                                  <BookIcon size={14} className="text-library-blue" />
                                  {work}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Books in Library */}
                      <div>
                        <h3 className="text-xs uppercase tracking-widest font-semibold text-library-blue mb-3">
                          En tu Biblioteca
                        </h3>
                        <div className="space-y-4">
                          {author.booksInLibrary.map(book => (
                            <div key={book.id} className="flex items-center gap-4">
                              <div className="w-12 h-16 rounded overflow-hidden flex-shrink-0 book-parchment">
                                <img
                                  src={book.coverUrl}
                                  alt={book.title}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div>
                                <p className="font-medium text-slate-800">{book.title}</p>
                                <div className="flex items-center gap-1 mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <span key={i} className={i < book.rating ? 'text-amber-400' : 'text-slate-200'}>
                                      ★
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}