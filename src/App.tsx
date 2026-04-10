import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Book as BookIcon, LogIn, LogOut, User } from 'lucide-react';
import { signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { collection, addDoc, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import Home from './pages/Home';
import BookDetail from './pages/BookDetail';
import Authors from './pages/Authors';
import Explore from './pages/Explore';
import { Book } from './types';
import { auth, googleProvider, db } from './firebase';

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Load books from Firestore
  useEffect(() => {
    const q = query(collection(db, 'books'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const booksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Book[];
      setBooks(booksData);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleAddBook = async (newBook: Omit<Book, 'id' | 'createdAt' | 'userId'>) => {
    if (!user) {
      alert('Debes iniciar sesión para añadir un libro');
      return;
    }
    try {
      await addDoc(collection(db, 'books'), {
        ...newBook,
        userId: user.email || 'anonymous',
        createdAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error al guardar el libro:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-parchment">
        <div className="text-2xl font-serif text-library-blue">Cargando...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-parchment">
        {/* Barra de Navegación */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-library-blue p-1.5 rounded-lg text-white group-hover:bg-library-dark transition-colors">
                <BookIcon size={24} />
              </div>
              <span className="text-2xl font-serif text-library-blue tracking-tight">Bibliotheca</span>
            </Link>

            <div className="flex items-center gap-6">
              <nav className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest font-semibold text-slate-500">
                <Link to="/" className="hover:text-library-blue transition-colors">Libros</Link>
                <Link to="/authors" className="hover:text-library-blue transition-colors">Autores</Link>
                <Link to="/explore" className="hover:text-library-blue transition-colors">Explorar</Link>
              </nav>

              <div className="h-6 w-px bg-slate-200 hidden md:block" />

              {user ? (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-library-light flex items-center justify-center text-library-blue overflow-hidden">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" />
                    ) : (
                      <User size={18} />
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-slate-500 hover:text-red-500 transition-colors"
                    title="Cerrar Sesión"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className="flex items-center gap-2 text-library-blue font-medium hover:bg-library-light px-4 py-2 rounded-full transition-all"
                >
                  <LogIn size={18} />
                  <span>Entrar</span>
                </button>
              )}
            </div>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Home books={books} onAddBook={handleAddBook} user={user} />} />
          <Route path="/book/:id" element={<BookDetail books={books} />} />
          <Route path="/authors" element={<Authors books={books} />} />
          <Route path="/explore" element={<Explore />} />
        </Routes>

        {/* Pie de Página */}
        <footer className="bg-library-dark text-white py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <BookIcon size={24} />
                <span className="text-2xl font-serif tracking-tight">Bibliotheca</span>
              </div>
              <p className="text-library-light/70 font-light leading-relaxed">
                Tu rincón personal para la reflexión literaria. Guarda tus pensamientos, puntúa tus lecturas y construye tu propio legado de conocimiento.
              </p>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-6 text-white/50">Enlaces</h4>
              <ul className="space-y-4 text-library-light/80">
                <li><Link to="/" className="hover:text-white transition-colors">Inicio</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Mi Perfil</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Ajustes</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-6 text-white/50">Contacto</h4>
              <p className="text-library-light/80 mb-4">¿Tienes alguna sugerencia?</p>
              <a href="mailto:hola@bibliotheca.com" className="text-white hover:underline">hola@bibliotheca.com</a>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-white/10 text-center text-white/30 text-xs uppercase tracking-widest">
            © 2026 Bibliotheca - Inspirado en Elejandria
          </div>
        </footer>
      </div>
    </Router>
  );
}