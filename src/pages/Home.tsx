import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, Book as BookIcon, Star, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Book } from '../types';

interface HomeProps {
  books: Book[];
  onAddBook: (book: Omit<Book, 'id' | 'createdAt' | 'userId'>) => void;
}

export default function Home({ books, onAddBook }: HomeProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80")' }}
        />
        <div className="absolute inset-0 bg-library-blue/60 z-10" />
        
        <div className="relative z-20 text-center px-4">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-7xl font-serif text-white mb-6 drop-shadow-lg"
          >
            Tu Biblioteca Personal
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-library-light max-w-2xl mx-auto font-light italic"
          >
            "Un libro es un regalo que puedes abrir una y otra vez."
          </motion.p>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-3 bg-white text-library-blue rounded-full font-medium shadow-xl hover:bg-library-light transition-all flex items-center gap-2"
            >
              <Plus size={20} />
              Añadir Reseña
            </button>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="bg-library-dark text-white py-6 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 flex justify-around items-center text-center">
          <div>
            <div className="flex justify-center mb-1"><BookIcon size={24} /></div>
            <div className="text-2xl font-serif">{books.length}</div>
            <div className="text-xs uppercase tracking-widest opacity-70">Libros</div>
          </div>
          <div className="w-px h-12 bg-white/20" />
          <div>
            <div className="flex justify-center mb-1"><Star size={24} /></div>
            <div className="text-2xl font-serif">
              {books.length > 0 ? (books.reduce((acc, b) => acc + b.rating, 0) / books.length).toFixed(1) : '0'}
            </div>
            <div className="text-xs uppercase tracking-widest opacity-70">Promedio</div>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <main className="max-w-7xl mx-auto px-4 mt-16">
        <div className="flex items-center justify-between mb-10 border-b border-library-blue/20 pb-4">
          <h2 className="text-3xl font-serif text-library-dark">Colección Reciente</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar en tu biblioteca..."
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-library-blue/50 w-64"
            />
          </div>
        </div>

        {books.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <BookIcon size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-serif text-xl">Aún no has añadido ningún libro.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-4 text-library-blue hover:underline font-medium"
            >
              ¡Empieza ahora!
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {books.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -10 }}
                onClick={() => navigate(`/book/${book.id}`)}
                className="cursor-pointer group"
              >
                <div className="aspect-[2/3] book-parchment rounded-sm overflow-hidden mb-4 transition-shadow group-hover:shadow-2xl relative">
                  <img 
                    src={book.coverUrl} 
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-library-blue/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white text-library-blue px-4 py-2 rounded-full text-sm font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      Ver Reseña
                    </span>
                  </div>
                </div>
                <h3 className="font-serif text-lg leading-tight text-slate-800 group-hover:text-library-blue transition-colors line-clamp-1">
                  {book.title}
                </h3>
                <p className="text-sm text-slate-500 italic">{book.author}</p>
                <div className="flex gap-0.5 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={12} 
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
