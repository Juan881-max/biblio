import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Loader2, ExternalLink, Star, Sparkles, ChevronRight } from 'lucide-react';
import { TrendingBook, Book } from '../types';
import { getTop30Bestsellers, getCoverUrl, formatAuthorName } from '../services/openLibraryApi';

// ─── Static curated recommendations per genre / theme ───────────────────────
interface Recommendation {
  title: string;
  author: string;
  reason: string;
  coverQuery: string; // ISBN or title to build a cover URL
  coverUrl?: string;
}

function getRecommendations(lastBook: Book): Recommendation[] {
  const titleLower = lastBook.title.toLowerCase();
  const authorLower = lastBook.author.toLowerCase();

  // Historical fiction / Ancient world
  if (
    authorLower.includes('vandenberg') ||
    authorLower.includes('graves') ||
    titleLower.includes('escarabajo') ||
    titleLower.includes('egipto') ||
    titleLower.includes('roma') ||
    titleLower.includes('grecia') ||
    titleLower.includes('clásic') ||
    titleLower.includes('calamares') ||
    titleLower.includes('latín')
  ) {
    return [
      {
        title: 'El nombre de la rosa',
        author: 'Umberto Eco',
        reason: `Eco construye en esta novela una investigación medieval tan densa y apasionante como las tramas históricas que disfrutas. Si te cautivó "${lastBook.title}", este laberinto de misterio y erudición te atrapará desde la primera página.`,
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788408163435-L.jpg',
        coverQuery: '',
      },
      {
        title: 'Memorias de Adriano',
        author: 'Marguerite Yourcenar',
        reason: `Un retrato íntimo y magistral del mundo romano escrito en primera persona. La misma mirada hacia la Antigüedad que caracteriza la obra de "${lastBook.author}", pero desde una voz femenina de una lucidez extraordinaria.`,
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788435010719-L.jpg',
        coverQuery: '',
      },
      {
        title: 'Egipto, la gran civilización',
        author: 'Jean Vercoutter',
        reason: `Si el trasfondo histórico de "${lastBook.title}" te despertó la curiosidad por el mundo antiguo, esta obra de divulgación rigurosa y accesible te abrirá las puertas de Egipto como nunca antes lo habías visto.`,
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788446004653-L.jpg',
        coverQuery: '',
      },
    ];
  }

  // Classic literature / mythology
  if (
    titleLower.includes('mitolog') ||
    titleLower.includes('dioses') ||
    titleLower.includes('heroes') ||
    titleLower.includes('héroe') ||
    titleLower.includes('odisea') ||
    titleLower.includes('iliada')
  ) {
    return [
      {
        title: 'El infinito en un junco',
        author: 'Irene Vallejo',
        reason: `Irene Vallejo narra con una prosa luminosa la historia de los libros en la Antigüedad grecorromana. Comparte con "${lastBook.title}" esa pasión por el mundo clásico y la transmisión del conocimiento a través de los siglos.`,
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788491049951-L.jpg',
        coverQuery: '',
      },
      {
        title: 'Circe',
        author: 'Madeline Miller',
        reason: `Una reescritura feminista y emocionalmente poderosa de la mitología griega. Si los dioses y héroes de "${lastBook.title}" te fascinaron, Circe te ofrecerá la misma magia desde una perspectiva completamente fresca y moderna.`,
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788418184123-L.jpg',
        coverQuery: '',
      },
      {
        title: 'Pequeña historia de la mitología clásica',
        author: 'Emilio del Río',
        reason: `Un recorrido ágil y lleno de humor por los grandes mitos griegos y romanos. El estilo divulgativo de Emilio del Río conecta perfectamente con el espíritu de "${lastBook.title}" y hace que la cultura clásica resulte cercana e irresistible.`,
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788467072471-L.jpg',
        coverQuery: '',
      },
    ];
  }

  // Crime / thriller / mystery
  if (
    titleLower.includes('mentira') ||
    titleLower.includes('asistan') ||
    titleLower.includes('crimen') ||
    titleLower.includes('detective') ||
    titleLower.includes('misterio') ||
    titleLower.includes('thriller')
  ) {
    return [
      {
        title: 'La chica del tren',
        author: 'Paula Hawkins',
        reason: `Un thriller psicológico de narrativa adictiva y giros inesperados. Si "${lastBook.title}" te mantuvo en vilo, la voz rota y fascinante de su protagonista te enganchará desde el primer capítulo.`,
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788408141785-L.jpg',
        coverQuery: '',
      },
      {
        title: 'Verity',
        author: 'Colleen Hoover',
        reason: `Oscuro, perturbador y de una tensión sostenida hasta la última línea. Comparte con "${lastBook.title}" esa capacidad de poner en cuestión a todos los personajes y no soltar al lector bajo ningún concepto.`,
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788408259305-L.jpg',
        coverQuery: '',
      },
      {
        title: 'Stieg Larsson: Los hombres que no amaban a las mujeres',
        author: 'Stieg Larsson',
        reason: `Lisbeth Salander es uno de los personajes más brillantes del thriller contemporáneo. Si "${lastBook.title}" te despertó el apetito por la intriga, la trilogía Millennium es el siguiente paso obligado.`,
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788423340279-L.jpg',
        coverQuery: '',
      },
    ];
  }

  // Default: general quality literary fiction
  return [
    {
      title: 'El infinito en un junco',
      author: 'Irene Vallejo',
      reason: `Una joya de la literatura contemporánea en español que mezcla ensayo, memoria y narración histórica con una elegancia poco habitual. Si "${lastBook.title}" te dejó con ganas de más, este libro te recompensará con creces.`,
      coverUrl: 'https://covers.openlibrary.org/b/isbn/9788491049951-L.jpg',
      coverQuery: '',
    },
    {
      title: 'Las correcciones',
      author: 'Jonathan Franzen',
      reason: `Una gran novela familiar que examina la América contemporánea con una mirada tan precisa como compasiva. Perfecta para lectores exigentes que, como tú después de "${lastBook.title}", buscan algo de verdadero peso literario.`,
      coverUrl: 'https://covers.openlibrary.org/b/isbn/9788433975980-L.jpg',
      coverQuery: '',
    },
    {
      title: 'Hamnet',
      author: "Maggie O'Farrell",
      reason: `La ficción histórica llevada a su máxima expresión emocional. O'Farrell reconstruye la vida de Shakespeare desde la mirada de su familia con una prosa que deja sin aliento. Ideal como siguiente lectura tras "${lastBook.title}".`,
      coverUrl: 'https://covers.openlibrary.org/b/isbn/9788416358953-L.jpg',
      coverQuery: '',
    },
  ];
}

// ─── Recommendation Card ─────────────────────────────────────────────────────
function RecommendationCard({ rec, index }: { rec: Recommendation; index: number }) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.1, duration: 0.5 }}
      className="flex gap-5 group"
    >
      {/* Cover */}
      <div className="flex-shrink-0 w-20 h-28 rounded-lg overflow-hidden shadow-md bg-slate-200 relative">
        {!imgError && rec.coverUrl ? (
          <img
            src={rec.coverUrl}
            alt={rec.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#2c3e6b] to-[#1a2540] flex items-center justify-center">
            <BookOpen size={22} className="text-white/50" />
          </div>
        )}
      </div>

      {/* Text */}
      <div className="flex-grow min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-serif text-lg font-bold text-white leading-snug group-hover:text-amber-300 transition-colors">
              {rec.title}
            </h3>
            <p className="text-sm text-white/50 italic mt-0.5">{rec.author}</p>
          </div>
          <ChevronRight
            size={18}
            className="flex-shrink-0 text-white/20 group-hover:text-amber-300 group-hover:translate-x-1 transition-all mt-1"
          />
        </div>
        <p className="text-sm text-white/70 leading-relaxed mt-2 line-clamp-3">
          {rec.reason}
        </p>
      </div>
    </motion.article>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
interface ExploreProps {
  books?: Book[];
}

export default function Explore({ books = [] }: ExploreProps) {
  const [top30Books, setTop30Books] = useState<TrendingBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<TrendingBook | null>(null);

  useEffect(() => {
    async function fetchAllBooks() {
      setIsLoading(true);
      const fetched = await getTop30Bestsellers();
      setTop30Books(fetched);
      setIsLoading(false);
    }
    fetchAllBooks();
  }, []);

  // Last book read = most recently added in Firestore (already ordered desc)
  const lastBook = books.length > 0 ? books[0] : null;
  const recommendations = useMemo(
    () => (lastBook ? getRecommendations(lastBook) : []),
    [lastBook]
  );

  return (
    <div className="min-h-screen bg-parchment pb-20">

      {/* ── Personalized Recommendation Module ────────────────────────── */}
      {lastBook && (
        <section className="relative overflow-hidden">
          {/* Deep layered background */}
          <div className="absolute inset-0 bg-[#0f1724]" />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=60&w=1600")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f1724]/80 via-[#0f1724]/60 to-[#0f1724]" />
          {/* Subtle gold accent line at top */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-amber-400/80 to-transparent" />

          <div className="relative max-w-7xl mx-auto px-4 py-16">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-2"
            >
              <div className="flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 px-4 py-1.5 rounded-full">
                <Sparkles size={14} className="text-amber-400" />
                <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">
                  Tu próxima lectura
                </span>
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="text-4xl md:text-5xl font-serif text-white mb-1 leading-tight"
            >
              Selección personal
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-white/40 text-sm mb-12"
            >
              Basada en tu última lectura:&nbsp;
              <span className="text-white/70 italic font-medium">{lastBook.title}</span>
              &nbsp;de&nbsp;
              <span className="text-white/70 font-medium">{lastBook.author}</span>
            </motion.p>

            {/* Last Book + Recommendations layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

              {/* Last read book — left spotlight */}
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="lg:col-span-3 flex flex-col items-center lg:items-start"
              >
                <div className="relative w-40 lg:w-full max-w-[180px]">
                  {/* Glow behind cover */}
                  <div className="absolute -inset-4 bg-amber-400/10 blur-2xl rounded-full" />
                  <div className="relative rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/10">
                    <img
                      src={lastBook.coverUrl}
                      alt={lastBook.title}
                      className="w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
                <div className="mt-5 text-center lg:text-left">
                  <span className="text-[10px] uppercase tracking-widest text-amber-400/70 font-semibold">
                    Último libro leído
                  </span>
                  <p className="text-white font-serif text-lg leading-snug mt-1">{lastBook.title}</p>
                  <p className="text-white/50 text-sm italic">{lastBook.author}</p>
                  {/* Stars */}
                  <div className="flex gap-0.5 mt-2 justify-center lg:justify-start">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        className={i < lastBook.rating ? 'fill-amber-400 text-amber-400' : 'text-white/20'}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Divider */}
              <div className="hidden lg:flex lg:col-span-1 justify-center">
                <div className="w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
              </div>

              {/* Recommendation cards */}
              <div className="lg:col-span-8 space-y-8">
                <div className="space-y-8 divide-y divide-white/5">
                  {recommendations.map((rec, i) => (
                    <div key={i} className={i > 0 ? 'pt-8' : ''}>
                      <RecommendationCard rec={rec} index={i} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom fade into parchment */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-b from-transparent to-parchment" />
        </section>
      )}

      {/* ── Original Header ────────────────────────────────────────────── */}
      <section className={`bg-gradient-to-br from-library-dark to-library-blue py-16 ${lastBook ? '' : ''}`}>
        <div className="max-w-7xl mx-auto px-4">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl font-serif text-white mb-4"
          >
            Los 30 libros más vendidos en España
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-library-light/80 text-lg max-w-4xl leading-relaxed mt-4"
          >
            Amigos lectores, aquí podéis consultar el ranking de los 30 libros más vendidos en España en la última semana. Podréis ver cuál es el más vendido. Algunos suben, otros se mantienen y otros bajan o salen de la lista. Este ranking se actualiza cada lunes para que podáis estar al tanto de las lecturas más demandadas de cada semana.
          </motion.p>
        </div>
      </section>

      {/* ── Books Grid (unchanged) ─────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 mt-12 bg-slate-50 p-6 md:p-10 rounded-2xl border border-slate-100">
        <h2 className="text-xl md:text-2xl font-serif font-bold text-slate-800 mb-8 border-b border-slate-200 pb-4">
          Semana del 30 de marzo al 5 de abril del 2026
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={40} className="animate-spin text-library-blue" />
          </div>
        ) : top30Books.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-serif text-xl">No se encontraron libros.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10">
            {top30Books.map((book, index) => (
              <motion.div
                key={book.key + index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.02, 0.5) }}
                onClick={() => setSelectedBook(book)}
                className="cursor-pointer group flex flex-col items-center text-center"
              >
                <div className="w-full aspect-[2/3] rounded-sm overflow-hidden mb-3 bg-white border border-slate-200 relative shadow-sm group-hover:shadow-xl transition-all duration-300">
                  {getCoverUrl(book.cover_i, 'M') ? (
                    <img
                      src={getCoverUrl(book.cover_i, 'M')!}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                      <BookOpen size={32} className="text-slate-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/10 transition-colors" />
                  <div className="absolute top-0 left-0 bg-orange-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full -ml-1 -mt-1 shadow-md z-10">
                    {index + 1}
                  </div>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    En stock
                  </div>
                </div>
                <h3 className="font-bold text-xs uppercase text-slate-800 line-clamp-2 mt-1 px-1">
                  {book.title}
                </h3>
                <p className="text-[10px] text-library-blue mt-1 uppercase font-semibold">
                  {formatAuthorName(book.author_name)}
                </p>
                <button className="mt-2 bg-orange-500 hover:bg-orange-600 text-white text-xs px-4 py-1 rounded transition-colors">
                  Comprar
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* ── Book Detail Modal (unchanged) ─────────────────────────────── */}
      <AnimatePresence>
        {selectedBook && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedBook(null)}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl overflow-hidden max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 flex-shrink-0">
                  {getCoverUrl(selectedBook.cover_i, 'L') ? (
                    <img
                      src={getCoverUrl(selectedBook.cover_i, 'L')!}
                      alt={selectedBook.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-64 md:h-full flex items-center justify-center bg-gradient-to-br from-library-light to-library-blue/20">
                      <BookOpen size={48} className="text-library-blue/50" />
                    </div>
                  )}
                </div>
                <div className="p-6 flex-grow">
                  <h2 className="text-2xl font-serif text-library-dark mb-2">{selectedBook.title}</h2>
                  <p className="text-lg text-slate-500 italic mb-4">
                    por {formatAuthorName(selectedBook.author_name)}
                  </p>
                  <div className="space-y-3 text-sm text-slate-600">
                    {selectedBook.first_publish_year && (
                      <p><span className="font-semibold">Publicado:</span> {selectedBook.first_publish_year}</p>
                    )}
                    {selectedBook.edition_count && (
                      <p><span className="font-semibold">Ediciones:</span> {selectedBook.edition_count.toLocaleString()}</p>
                    )}
                    {selectedBook.ratings_average && (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Valoración:</span>
                        <div className="flex items-center gap-1">
                          <Star size={16} className="fill-amber-400 text-amber-400" />
                          <span>{selectedBook.ratings_average.toFixed(1)}</span>
                          {selectedBook.ratings_count && (
                            <span className="text-slate-400">({selectedBook.ratings_count.toLocaleString()} votos)</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-6 flex gap-3">
                    <a
                      href={`https://openlibrary.org${selectedBook.key}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-library-blue text-white rounded-lg hover:bg-library-dark transition-colors"
                    >
                      <ExternalLink size={16} />
                      Ver en Open Library
                    </a>
                    <button
                      onClick={() => setSelectedBook(null)}
                      className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}