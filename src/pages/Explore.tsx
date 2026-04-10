import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Clock, Calendar, Star, BookOpen, Loader2, ExternalLink } from 'lucide-react';
import { TrendingBook } from '../types';
import { searchSpanishBooks, getCoverUrl, formatAuthorName } from '../services/openLibraryApi';

export default function Explore() {
  const [books, setBooks] = useState<TrendingBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<TrendingBook | null>(null);

  useEffect(() => {
    async function fetchBooks() {
      setIsLoading(true);
      // Use searchSpanishBooks to get titles in Spanish
      const data = await searchSpanishBooks(100);
      setBooks(data);
      setIsLoading(false);
    }
    fetchBooks();
  }, []);

  return (
    <div className="min-h-screen bg-parchment pb-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-library-dark to-library-blue py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl font-serif text-white mb-4"
          >
            Explorar
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-library-light/80 text-lg max-w-2xl"
          >
            Descubre los libros más populares en español. Datos actualizados desde Open Library.
          </motion.p>
        </div>
      </section>

      {/* Books Grid */}
      <main className="max-w-7xl mx-auto px-4 mt-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={40} className="animate-spin text-library-blue" />
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-serif text-xl">
              No se encontraron libros en tendencia.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {books.map((book, index) => (
              <motion.div
                key={book.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.02, 0.5) }}
                onClick={() => setSelectedBook(book)}
                className="cursor-pointer group"
              >
                <div className="aspect-[2/3] rounded-sm overflow-hidden mb-3 bg-slate-200 relative shadow-md group-hover:shadow-xl transition-shadow">
                  {getCoverUrl(book.cover_i, 'M') ? (
                    <img
                      src={getCoverUrl(book.cover_i, 'M')!}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-library-light to-library-blue/20">
                      <BookOpen size={32} className="text-library-blue/50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-library-blue/0 group-hover:bg-library-blue/20 transition-colors" />

                  {/* Ranking Badge */}
                  {index < 10 && (
                    <div className="absolute top-2 left-2 bg-library-dark text-white text-xs font-bold px-2 py-1 rounded-full">
                      #{index + 1}
                    </div>
                  )}
                </div>

                <h3 className="font-serif text-sm text-slate-800 line-clamp-2 group-hover:text-library-blue transition-colors">
                  {book.title}
                </h3>
                <p className="text-xs text-slate-500 truncate">{formatAuthorName(book.author_name)}</p>

                {book.first_publish_year && (
                  <p className="text-xs text-slate-400 mt-1">{book.first_publish_year}</p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Book Detail Modal */}
      {selectedBook && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedBook(null)}
        >
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="relative bg-white rounded-2xl shadow-2xl overflow-hidden max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col md:flex-row">
              {/* Cover */}
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

              {/* Info */}
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
    </div>
  );
}