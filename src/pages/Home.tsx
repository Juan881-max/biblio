import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, Book as BookIcon, Star, Search, Lock, Sparkles, Quote, LayoutGrid, Calendar, ChevronRight, MessageSquareQuote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { User as FirebaseUser } from 'firebase/auth';
import { cn } from '../lib/utils';
import { Book } from '../types';

interface HomeProps {
  books: Book[];
  onAddBook: (book: Omit<Book, 'id' | 'createdAt' | 'userId'>) => void;
  user: FirebaseUser | null;
}

export default function Home({ books, onAddBook, user }: HomeProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'reviews' | 'grid'>('reviews');
  const navigate = useNavigate();

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        (book.review && book.review.toLowerCase().includes(q)) ||
        (book.summary && book.summary.toLowerCase().includes(q));

      const matchesRating = ratingFilter === null || book.rating === ratingFilter;

      return matchesSearch && matchesRating;
    });
  }, [books, searchTerm, ratingFilter]);

  const formatReadDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative h-[380px] md:h-[420px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-library-dark/80 via-library-blue/70 to-library-dark/90 z-10" />

        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <Sparkles size={14} />
            Tu biblioteca & diario de lecturas
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-serif text-white mb-4 drop-shadow-lg"
          >
            Tu Biblioteca Personal
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-xl text-library-light max-w-2xl mx-auto font-light italic"
          >
            "Un libro es un regalo que puedes abrir una y otra vez."
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
          >
            <button
              onClick={() => user ? setIsModalOpen(true) : alert('Inicia sesión para añadir reseñas')}
              className="px-6 py-2.5 sm:px-8 sm:py-3 bg-white text-library-blue rounded-full font-medium shadow-xl hover:bg-library-light transition-all flex items-center gap-2 text-sm sm:text-base font-semibold"
            >
              <Plus size={18} />
              Añadir Reseña
            </button>
            <button
              onClick={() => navigate('/explore')}
              className="px-6 py-2.5 sm:px-8 sm:py-3 bg-white/15 hover:bg-white/25 border border-white/30 text-white rounded-full font-medium backdrop-blur-sm transition-all flex items-center gap-2 shadow-lg text-sm sm:text-base"
            >
              <Sparkles size={18} className="text-amber-300" />
              Explorar Recomendaciones
            </button>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="bg-library-dark text-white py-5 shadow-inner border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 flex justify-around items-center text-center">
          <div>
            <div className="flex justify-center mb-1 text-amber-300"><BookIcon size={22} /></div>
            <div className="text-2xl font-serif font-bold">{books.length}</div>
            <div className="text-[11px] uppercase tracking-widest text-white/70">Libros Reseñados</div>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div>
            <div className="flex justify-center mb-1 text-amber-300"><MessageSquareQuote size={22} /></div>
            <div className="text-2xl font-serif font-bold">{books.filter(b => !!b.review).length}</div>
            <div className="text-[11px] uppercase tracking-widest text-white/70">Reseñas Personales</div>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div>
            <div className="flex justify-center mb-1 text-amber-300"><Star size={22} className="fill-amber-300" /></div>
            <div className="text-2xl font-serif font-bold">
              {books.length > 0 ? (books.reduce((acc, b) => acc + b.rating, 0) / books.length).toFixed(1) : '0'}
            </div>
            <div className="text-[11px] uppercase tracking-widest text-white/70">Puntuación Media</div>
          </div>
        </div>
      </div>

      {/* Main Books Section */}
      <main className="max-w-7xl mx-auto px-4 mt-12">
        {/* Controls Bar: Title, Search, View Mode, Rating Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-library-blue/20">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif text-library-dark flex items-center gap-3">
              <span>Colección y Reseñas</span>
              <span className="text-xs bg-library-blue/10 text-library-blue px-2.5 py-1 rounded-full font-sans font-bold">
                {filteredBooks.length}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {viewMode === 'reviews' ? 'Mostrando libros con sus reseñas y citas' : 'Vista compacta de portadas'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-grow sm:flex-grow-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por título, autor o reseña..."
                className="pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-library-blue/50 w-full sm:w-64"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
              <button
                onClick={() => setViewMode('reviews')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'reviews'
                    ? 'bg-library-blue text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Vista con reseñas"
              >
                <MessageSquareQuote size={14} />
                <span className="hidden sm:inline">Con Reseñas</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'grid'
                    ? 'bg-library-blue text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Vista solo portadas"
              >
                <LayoutGrid size={14} />
                <span className="hidden sm:inline">Portadas</span>
              </button>
            </div>
          </div>
        </div>

        {/* Rating Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-none">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold mr-1">Filtrar:</span>
          <button
            onClick={() => setRatingFilter(null)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              ratingFilter === null
                ? 'bg-library-blue text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Todos ({books.length})
          </button>
          {[5, 4, 3].map((r) => {
            const count = books.filter(b => b.rating === r).length;
            return (
              <button
                key={r}
                onClick={() => setRatingFilter(ratingFilter === r ? null : r)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  ratingFilter === r
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{r}</span>
                <Star size={11} className={ratingFilter === r ? 'fill-slate-950 text-slate-950' : 'fill-amber-400 text-amber-400'} />
                <span className="text-slate-400 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 mt-6">
            <BookIcon size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-600 font-serif text-xl">
              {books.length === 0 ? 'Aún no hay libros en la biblioteca.' : 'No hay libros que coincidan con la búsqueda.'}
            </p>
            {searchTerm && (
              <button
                onClick={() => { setSearchTerm(''); setRatingFilter(null); }}
                className="mt-3 text-library-blue hover:underline text-sm font-medium"
              >
                Limpiar filtros
              </button>
            )}
            {books.length === 0 && user && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 text-library-blue hover:underline font-medium block mx-auto"
              >
                ¡Añade el primero!
              </button>
            )}
            {books.length === 0 && !user && (
              <p className="mt-4 text-slate-400 flex items-center justify-center gap-2 text-sm">
                <Lock size={16} />
                Inicia sesión para añadir reseñas
              </p>
            )}
          </div>
        ) : viewMode === 'reviews' ? (
          /* ── Rich Review Card View: Reviews are prominently displayed ── */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {filteredBooks.map((book, index) => (
              <motion.article
                key={book.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                onClick={() => navigate(`/book/${book.id}`)}
                className="cursor-pointer group bg-white rounded-2xl border border-slate-200 hover:border-library-blue/40 p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Cover thumbnail + Title, Author, Stars, Date */}
                  <div className="flex gap-4 items-start">
                    <div className="w-20 h-28 flex-shrink-0 rounded-lg overflow-hidden shadow-md border border-slate-200 bg-slate-100 relative">
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          Reseña
                        </span>
                        {book.readDate && (
                          <span className="flex items-center gap-1 text-[11px] text-slate-400">
                            <Calendar size={12} />
                            {formatReadDate(book.readDate)}
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif text-lg font-bold text-slate-800 group-hover:text-library-blue transition-colors line-clamp-1 mt-1">
                        {book.title}
                      </h3>
                      <p className="text-xs text-slate-500 italic font-medium">{book.author}</p>
                      <div className="flex items-center gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={13}
                            className={cn(i < book.rating ? "fill-amber-400 text-amber-400" : "text-slate-200")}
                          />
                        ))}
                        <span className="text-xs font-semibold text-slate-600 ml-1">
                          {book.rating}/5
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Review Text Excerpt */}
                  {book.review ? (
                    <div className="mt-4 p-3.5 bg-parchment/60 rounded-xl border border-amber-200/40 relative">
                      <Quote size={20} className="text-amber-500/30 absolute top-2 right-2" />
                      <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed line-clamp-3">
                        "{book.review}"
                      </p>
                    </div>
                  ) : book.summary ? (
                    <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {book.summary}
                      </p>
                    </div>
                  ) : null}
                </div>

                {/* Footer: Read Full Review Link */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-library-blue group-hover:underline flex items-center gap-1">
                    Leer reseña completa
                    <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Ver análisis detallado
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          /* ── Compact Covers Grid View ── */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6">
            {filteredBooks.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                whileHover={{ y: -6 }}
                onClick={() => navigate(`/book/${book.id}`)}
                className="cursor-pointer group"
              >
                <div className="aspect-[2/3] book-parchment rounded-lg overflow-hidden mb-3 transition-shadow group-hover:shadow-2xl relative border border-slate-200">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-library-blue/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 text-center">
                    <span className="bg-white text-library-blue px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                      Ver Reseña
                    </span>
                  </div>
                </div>
                <h3 className="font-serif text-sm font-bold leading-tight text-slate-800 group-hover:text-library-blue transition-colors line-clamp-1">
                  {book.title}
                </h3>
                <p className="text-xs text-slate-500 italic line-clamp-1">{book.author}</p>
                <div className="flex gap-0.5 mt-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={11}
                      className={cn(i < book.rating ? "fill-amber-400 text-amber-400" : "text-slate-300")}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Add Book Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-parchment w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-white/20"
            >
              <div className="bg-library-blue p-6 text-white flex justify-between items-center">
                <h2 className="text-2xl font-serif">Nueva Reseña</h2>
                <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  onAddBook({
                    title: formData.get('title') as string,
                    author: formData.get('author') as string,
                    coverUrl: formData.get('coverUrl') as string,
                    summary: formData.get('summary') as string,
                    review: formData.get('review') as string,
                    rating: Number(formData.get('rating')),
                    readDate: formData.get('readDate') as string || undefined,
                  });
                  setIsModalOpen(false);
                }}
                className="p-8 space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-semibold text-slate-500">Título</label>
                    <input required name="title" type="text" className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-library-blue/50 outline-none" placeholder="El nombre del libro" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-semibold text-slate-500">Autor</label>
                    <input required name="author" type="text" className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-library-blue/50 outline-none" placeholder="Nombre del autor" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs uppercase tracking-widest font-semibold text-slate-500">Fecha de lectura</label>
                    <input name="readDate" type="date" className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-library-blue/50 outline-none text-slate-700" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-semibold text-slate-500">URL de la Portada</label>
                  <input required name="coverUrl" type="url" className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-library-blue/50 outline-none" placeholder="https://..." />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-semibold text-slate-500">Resumen Breve</label>
                  <textarea required name="summary" rows={2} className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-library-blue/50 outline-none resize-none" placeholder="De qué trata el libro..." />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-semibold text-slate-500">Tu Reseña</label>
                  <textarea required name="review" rows={4} className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-library-blue/50 outline-none resize-none" placeholder="¿Qué te pareció?" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-semibold text-slate-500 block">Calificación</label>
                    <select name="rating" className="p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-library-blue/50 outline-none">
                      {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Estrellas</option>)}
                    </select>
                  </div>
                  <button type="submit" className="px-10 py-3 bg-library-blue text-white rounded-full font-medium shadow-lg hover:bg-library-dark transition-all">
                    Guardar Libro
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}