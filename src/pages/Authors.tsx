import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Book as BookIcon, Calendar, User, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Book } from '../types';
import { searchAuthor, getAuthorWorks, getAuthorPhotoUrl, formatAuthorName } from '../services/openLibraryApi';

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
  },
  'Emilio del Río': {
    bio: 'Emilio del Río Sanz (Logroño, 1963) es un destacado filólogo, escritor, comunicador y profesor español, ampliamente reconocido por su labor de divulgación de las humanidades clásicas.\n\n📚 Biografía y obra\n\n- Es doctor en Filología Clásica por la Universidad Complutense de Madrid.\n- Destaca por su labor de divulgación de la cultura clásica en España a través de programas de radio (como "Verba Volant" en RNE) y su podcast "Locos por los clásicos".\n- Sus escritos se centran en hacer la cultura del Imperio Romano y las lenguas clásicas accesibles al público en general de una manera divertida y muy ágil.\n- Ha recibido múltiples premios por su trabajo divulgativo, como el Premio Nacional de la Sociedad Española de Estudios Clásicos.\n\n👉 En resumen: Si te gusta conocer los orígenes de las palabras, curiosidades del latín o la historia de Roma explicada con mucho sentido del humor, es el autor perfecto.',
    top_works: [
      'Carpe diem',
      'Pequeña historia de la mitología clásica',
      'Locos por los clásicos',
      'Calamares a la romana',
      'Latín lovers'
    ],
    birth_date: '1963',
    work_count: 5
  },
  'Robert Graves': {
    bio: 'Robert von Ranke Graves (Wimbledon, 1895 - Deià, Mallorca, 1985) fue un poeta, novelista e historiador británico afincado en España desde 1929. Conocido tanto por su poesía como por sus novelas históricas, alcanzó la fama internacional con su magistral recreación del mundo romano.\n\n📚 Descripción de su obra\n\n- Su obra más celebrada son las novelas históricas centradas en la Roma imperial, escritas con erudición y sentido del humor.\n- También destacó como poeta y ensayista, y como estudioso de la mitología con obras como La diosa blanca.\n- Vivió durante décadas en Deià, Mallorca, donde recibió a artistas e intelectuales de todo el mundo.\n\n👉 En resumen: un clásico imprescindible si te apasionan las novelas históricas ambientadas en la Antigüedad, narradas con ironía y una enorme profundidad histórica.',
    top_works: [
      'Yo, Claudio',
      'Claudio el dios y su esposa Mesalina',
      'La diosa blanca',
      'El vellocino de oro',
      'Hércules, mi compañero de viaje'
    ],
    birth_date: '1895',
    death_date: '1985',
  },
  'Javier Reverte': {
    bio: 'Javier Martínez Reverte, conocido como Javier Reverte (Madrid, 1944 - 2020), fue un periodista y escritor español especializado en literatura de viajes. A lo largo de su carrera recorrió África, Asia y América Latina, convirtiendo sus experiencias en libros que mezclan historia, cultura y aventura personal.\n\n📚 Descripción de su obra\n\n- Sus libros de viajes destacan por su prosa ágil, el rigor histórico y la capacidad de hacer al lector sentirse partícipe del viaje.\n- El continente africano fue su gran pasión literaria, al que dedicó varios de sus títulos más conocidos.\n- También escribió novelas y ensayos sobre la Guerra Civil española y conflictos bélicos del siglo XX.\n\n👉 En resumen: lectura ideal para quienes disfrutan de la literatura de viajes con fondo histórico y una mirada periodística honesta y apasionada.',
    top_works: [
      'El sueño de África',
      'Vagabundo en África',
      'Dios, el diablo y la aventura',
      'El médico de Ifni',
      'La magia de Birmania'
    ],
    birth_date: '1944',
    death_date: '2020',
  }
};

// Sub-component to render bio with expand/collapse (hooks must live in a component)
function BioRenderer({ bio }: { bio: string }) {
  const MAX_LINES = 18;
  const lines = bio.split('\n').filter(l => l.trim());
  const isLong = lines.length > MAX_LINES;
  const [expanded, setExpanded] = useState(false);
  const visibleLines = !isLong || expanded ? lines : lines.slice(0, MAX_LINES);

  return (
    <div className="text-slate-700 leading-relaxed space-y-2">
      {visibleLines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return null;
        if (trimmed.startsWith('📚')) {
          return (
            <p key={i} className="font-semibold text-library-blue mt-4 mb-1 text-sm uppercase tracking-wide">
              {trimmed}
            </p>
          );
        }
        if (trimmed.startsWith('-')) {
          return (
            <p key={i} className="ml-3 pl-3 border-l-2 border-library-light text-sm">
              {trimmed}
            </p>
          );
        }
        return <p key={i} className="text-sm">{trimmed}</p>;
      })}
      {isLong && (
        <button
          onClick={e => { e.stopPropagation(); setExpanded(!expanded); }}
          className="text-library-blue text-sm font-medium mt-2 hover:underline"
        >
          {expanded ? '▲ Leer menos' : '▼ Leer más'}
        </button>
      )}
    </div>
  );
}

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
          const normalizedName = authorName.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
          let customData: Partial<AuthorInfo> = {};
          for (const [key, value] of Object.entries(CUSTOM_AUTHORS)) {
            const normalizedKey = key.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            if (normalizedName.includes(normalizedKey)) {
              customData = value;
              break;
            }
          }

          const authorData = await searchAuthor(authorName);

          // If top_works is missing, fetch works directly from the author's endpoint
          let resolvedWorks: string[] | undefined = customData.top_works;
          if (!resolvedWorks) {
            const apiWorks = authorData?.top_works?.slice(0, 5);
            if (apiWorks && apiWorks.length > 0) {
              resolvedWorks = apiWorks;
            } else if (authorData?.key && authorData.key.startsWith('/authors/')) {
              try {
                const worksData = await getAuthorWorks(authorData.key, 10);
                resolvedWorks = worksData.slice(0, 5).map(w => w.title);
              } catch {
                // ignore
              }
            }
          }

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
                top_works: resolvedWorks,
                photoUrl: customData.photoUrl || (authorData.photos?.[0] ? getAuthorPhotoUrl(authorData.photos[0]) || undefined : undefined),
                isLoading: false,
              };
            } else if (customData.bio) {
              return {
                ...a,
                ...customData,
                top_works: resolvedWorks || customData.top_works,
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
                          <BioRenderer bio={author.bio} />
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