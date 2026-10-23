import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Book as BookIcon, LogIn, LogOut, User } from 'lucide-react';
import { signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { collection, addDoc, updateDoc, doc, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import Home from './pages/Home';
import BookDetail from './pages/BookDetail';
import Authors from './pages/Authors';
import Explore from './pages/Explore';
import { Book } from './types';
import { auth, googleProvider, db } from './firebase';

const SEEDED_BOOKS: Book[] = [
  {
    id: '1984-george-orwell',
    title: '1984',
    author: 'George Orwell',
    coverUrl: '/covers/1984.png',
    readDate: '2026-06-01',
    summary: '1984 (1949) narra la vida de Winston Smith, un funcionario de Londres, en Oceanía, un Estado totalitario dominado por el Gran Hermano, que vigila a todos mediante telepantallas y reescribe el pasado a su conveniencia. Winston empieza a dudar del sistema y trata de recuperar la verdad y la libertad individual frente a un poder que controla hasta el pensamiento. Es una advertencia sobre el totalitarismo, la manipulación de la información y la vigilancia masiva.',
    review: `La he leido en vacaciones y creo que tengo que volver a leerla, con lapiz y subrayando algunas cosas. Me parece un libro fantastico, aunque muy duro.

Realmente es un grito contra los totalitarismos en general, muy interesante ya que hoy dia, parece que la derecha y la ultraderecha cada vez tienen mas poder. Al gunos jovenes incluso claman por la vuelta de un lider fuerte o un dictador.

¿Que habria escrito Orwell hoy vieno el control que ejercen sobre nosotros las redes sociales, con su forma especial de ver la verdad, o por mejor decir de mentir descaradamente?.

Me parece que la inclusion en la novela de esa jerga, con esas extrañas palabras, ese extraño lenguage destinado sin duda a recortar la libertad y hacerlos todavia mas parecidos a maquinas que a personas, es extraordinario.

La idea de que la guerra es un negocio, que juegan con nuestras ideas basicas de patriotismo, el uso de millones de dolares para tirarlos caundo se podrian arreglar tantas cosas en el mundo, parece orweliano.

En fin tengo que volver a leerla, 1984 es una obra maravillosa.

Es de esos libros que cambian según el momento vital en que los lees. La primera lectura es la historia, el impacto emocional. La segunda es cuando empiezas a ver la arquitectura, cómo cada detalle estaba colocado con una precisión casi cruel.

Orwell entendió algo que los lingüistas tardarían décadas en formalizar: el lenguaje no solo describe la realidad, la construye. Si no tienes palabras para expresar un concepto, ese concepto se vuelve prácticamente impensable.

Hoy lo vemos de otra manera: no nos quitan palabras, nos las saturan. "Fake news", "posverdad", "hecho alternativo"... términos que no aclaran sino que enturbian, que hacen que todo parezca relativo y que nada pueda afirmarse con certeza. Es Neolengua invertida, pero con el mismo efecto.

Creo que le habría fascinado y aterrado a partes iguales el hecho de que el Gran Hermano ya no necesita vigilarte: te vigilas tú solo y encima lo publicas. El Ministerio del Amor no necesita arrancarte la verdad, porque tú mismo la entregas voluntariamente a cambio de likes.

Las redes sociales han conseguido algo que Orwell no imaginó del todo: que la vigilancia sea deseable. Que la gente compita por ser más visible, más expuesta.

Es uno de los fenómenos más inquietantes del momento. Orwell lo explicaría así: cuando el sistema democrático lleva décadas prometiendo cosas que no cumple, cuando la complejidad del mundo real no cabe en un tuit, la figura del hombre fuerte y simple se vuelve emocionalmente atractiva. No es estupidez, es agotamiento.

En la novela los tres superestados se necesitan mutuamente para mantener el sistema. La guerra no pretende ganarse, pretende perpetuarse. Hoy el complejo militar-industrial funciona con una lógica parecida, aunque más sofisticada y menos confesable.`,
    rating: 5,
    userId: 'bibliotheca',
    createdAt: Timestamp.fromDate(new Date('2026-06-01T12:00:00Z'))
  }
];

export default function App() {
  const [books, setBooks] = useState<Book[]>(SEEDED_BOOKS);
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

  // Load books from Firestore and merge with seeded books
  useEffect(() => {
    const q = query(collection(db, 'books'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const booksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Book[];

      // Merge seeded books if not already in Firestore
      const firestoreTitles = new Set(booksData.map(b => b.title.toLowerCase().trim()));
      const combined = [...booksData];
      for (const seeded of SEEDED_BOOKS) {
        if (!firestoreTitles.has(seeded.title.toLowerCase().trim())) {
          combined.push(seeded);
        }
      }

      setBooks(combined);
      setLoading(false);
    }, (error) => {
      console.warn('Error al conectar con Firestore, usando colección local:', error);
      setBooks(SEEDED_BOOKS);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Auto-sync seeded books to Firestore when user logs in
  useEffect(() => {
    if (!user) return;
    async function syncToFirestore() {
      try {
        const firestoreTitles = new Set(books.filter(b => b.id !== '1984-george-orwell').map(b => b.title.toLowerCase().trim()));
        for (const seeded of SEEDED_BOOKS) {
          if (!firestoreTitles.has(seeded.title.toLowerCase().trim())) {
            const { id, ...dataToSave } = seeded;
            await addDoc(collection(db, 'books'), {
              ...dataToSave,
              userId: user.email || 'anonymous',
              createdAt: Timestamp.now()
            });
            console.log('Libro sincronizado con éxito a Firestore:', seeded.title);
          }
        }
      } catch (err) {
        console.error('Error al sincronizar libro a Firestore:', err);
      }
    }
    syncToFirestore();
  }, [user]);

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

  const handleUpdateBook = async (id: string, updates: Partial<Omit<Book, 'id' | 'createdAt' | 'userId'>>) => {
    try {
      await updateDoc(doc(db, 'books', id), updates);
    } catch (error) {
      console.error('Error al actualizar el libro:', error);
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
          <Route path="/book/:id" element={<BookDetail books={books} onUpdateBook={handleUpdateBook} />} />
          <Route path="/authors" element={<Authors books={books} />} />
          <Route path="/explore" element={<Explore books={books} />} />
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