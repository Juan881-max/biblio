import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Calendar, User, Quote, Pencil, X, Save } from 'lucide-react';
import { Book } from '../types';
import { cn } from '../lib/utils';

interface BookDetailProps {
  books: Book[];
  onUpdateBook?: (id: string, updates: Partial<Omit<Book, 'id' | 'createdAt' | 'userId'>>) => void;
}

export default function BookDetail({ books, onUpdateBook }: BookDetailProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const book = books.find(b => b.id === id);
  const [isEditing, setIsEditing] = useState(false);

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-3xl font-serif text-library-dark mb-4">Libro no encontrado</h2>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-library-blue hover:underline"
        >
          <ArrowLeft size={20} /> Volver al inicio
        </button>
      </div>
    );
  }

  const formatReadDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const displayDate = book.readDate
    ? formatReadDate(book.readDate)
    : book.createdAt?.toDate?.()?.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) || 'Fecha desconocida';

  return (
    <div className="min-h-screen pb-20">
      {/* Header Navigation */}
      <nav className="p-6 max-w-7xl mx-auto flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-600 hover:text-library-blue transition-colors group"
        >
          <div className="p-2 rounded-full group-hover:bg-library-light transition-colors">
            <ArrowLeft size={20} />
          </div>
          <span className="font-medium">Volver a la Biblioteca</span>
        </button>

        {onUpdateBook && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-5 py-2 bg-library-blue text-white rounded-full text-sm font-medium shadow hover:bg-library-dark transition-all"
          >
            <Pencil size={15} />
            Editar reseña
          </button>
        )}
      </nav>

      <main className="max-w-6xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Book Cover & Quick Stats */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="book-parchment rounded-sm overflow-hidden shadow-2xl sticky top-8"
            >
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
              <div className="flex items-center gap-3 text-slate-600">
                <Star size={18} className="text-amber-400 fill-amber-400" />
                <span className="font-medium">{book.rating} de 5 estrellas</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Calendar size={18} />
                <span>Leído el {displayDate}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <User size={18} />
                <span>Autor: <span className="font-medium">{book.author}</span></span>
              </div>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="lg:col-span-8 space-y-12">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <h1 className="text-5xl md:text-6xl font-serif text-library-dark mb-4 leading-tight">
                {book.title}
              </h1>
              <p className="text-2xl text-slate-500 font-serif italic mb-8">
                por {book.author}
              </p>

              <div className="flex gap-1 mb-10">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={24}
                    className={cn(i < book.rating ? "fill-amber-400 text-amber-400" : "text-slate-200")}
                  />
                ))}
              </div>
            </motion.div>

            <motion.section
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-library-blue border-b border-library-blue/20 pb-2">
                Resumen del Libro
              </h2>
              <p className="text-lg text-slate-700 leading-relaxed font-light">
                {book.summary}
              </p>
            </motion.section>

            <motion.section
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -left-6 -top-4 text-library-light z-0">
                <Quote size={80} />
              </div>
              <div className="relative z-10 space-y-4">
                <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-library-blue border-b border-library-blue/20 pb-2">
                  Mi Reseña Personal
                </h2>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 italic text-xl text-slate-800 leading-relaxed">
                  "{book.review}"
                </div>
              </div>
            </motion.section>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-parchment w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-white/20"
            >
              <div className="bg-library-blue p-6 text-white flex justify-between items-center">
                <h2 className="text-2xl font-serif">Editar Reseña</h2>
                <button onClick={() => setIsEditing(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  onUpdateBook?.(book.id, {
                    summary: fd.get('summary') as string,
                    review: fd.get('review') as string,
                    rating: Number(fd.get('rating')),
                    readDate: fd.get('readDate') as string || undefined,
                  });
                  setIsEditing(false);
                }}
                className="p-8 space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-semibold text-slate-500">Calificación</label>
                    <select name="rating" defaultValue={book.rating} className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-library-blue/50 outline-none">
                      {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Estrellas</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-semibold text-slate-500">Fecha de lectura</label>
                    <input
                      name="readDate"
                      type="date"
                      defaultValue={book.readDate || ''}
                      className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-library-blue/50 outline-none text-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-semibold text-slate-500">Resumen Breve</label>
                  <textarea
                    name="summary"
                    rows={2}
                    defaultValue={book.summary}
                    className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-library-blue/50 outline-none resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-semibold text-slate-500">Tu Reseña</label>
                  <textarea
                    name="review"
                    rows={5}
                    defaultValue={book.review}
                    className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-library-blue/50 outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-10 py-3 bg-library-blue text-white rounded-full font-medium shadow-lg hover:bg-library-dark transition-all"
                  >
                    <Save size={16} />
                    Guardar cambios
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
