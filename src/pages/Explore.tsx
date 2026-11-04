import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { BookOpen, Star, Sparkles, ChevronRight, BookMarked, ArrowRight } from 'lucide-react';
import { Book } from '../types';

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

  // Ken Follet / La isla de las tormentas / WWII Espionage & Suspense
  if (
    authorLower.includes('follet') ||
    titleLower.includes('isla de las tormentas') ||
    titleLower.includes('ojo de la aguja')
  ) {
    return [
      {
        title: 'El espía que surgió del frío',
        author: 'John le Carré',
        reason: 'La cumbre indiscutible de la novela de espionaje. Comparte con la obra de Follett la tensión implacable, la psicología de agentes dobles y las intrigas de alta inteligencia en plena confrontación bélica.',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788466332507-L.jpg',
        coverQuery: '',
      },
      {
        title: 'Los cañones de Navarone',
        author: 'Alistair MacLean',
        reason: 'Un hito del suspense militar ambientado en la Segunda Guerra Mundial. Un grupo selecto debe infiltrarse en una fortaleza enemiga en una carrera contra el reloj cargada de adrenalina.',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788497597142-L.jpg',
        coverQuery: '',
      },
      {
        title: 'Vuelo final',
        author: 'Ken Follett',
        reason: 'Otra obra maestra de intriga bélica de Ken Follett ambientada en 1941. Relata la desesperada misión clandestina para interceptar un radar secreto de los nazis con un ritmo vertiginoso.',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788497598682-L.jpg',
        coverQuery: '',
      },
    ];
  }

  // Stephen King / La tormenta del siglo / Island Isolation & Moral Dilemma Horror
  if (
    authorLower.includes('king') ||
    titleLower.includes('tormenta del siglo')
  ) {
    return [
      {
        title: 'La niebla (The Mist)',
        author: 'Stephen King',
        reason: 'Una de las cumbres de King sobre una comunidad confinada por una tormenta inexplicable. Explora con maestría cómo el verdadero monstruo surge de la histeria colectiva y el quiebre moral de los vecinos.',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788401032332-L.jpg',
        coverQuery: '',
      },
      {
        title: 'El terror (The Terror)',
        author: 'Dan Simmons',
        reason: 'Una expedición atrapada en el hielo polar ártico enfrentándose a una entidad sobrenatural implacable y al frío glacial. Aislamiento extremo, tensión atmosférica y lucha psicológica por la supervivencia.',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788466637381-L.jpg',
        coverQuery: '',
      },
      {
        title: 'Fantasmas (Ghost Story)',
        author: 'Peter Straub',
        reason: 'En un pequeño pueblo aislado bajo una implacable ventisca de nieve, un grupo de ancianos oculta un secreto oscuro del pasado que regresa para cobrar venganza. Atmósfera gélida y terror psicológico magistral.',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788497598859-L.jpg',
        coverQuery: '',
      },
    ];
  }

  // Horror / Psychological Suspense / Faith & Exorcism (El exorcista)
  if (
    authorLower.includes('blatty') ||
    titleLower.includes('exorcista') ||
    titleLower.includes('demonio') ||
    titleLower.includes('posesión') ||
    titleLower.includes('terror')
  ) {
    return [
      {
        title: 'La semilla del diablo (Rosemary\'s Baby)',
        author: 'Ira Levin',
        reason: 'El gran hito contemporáneo del terror psicológico junto a El exorcista. Retrata con maestría la vulnerabilidad, la duda y el horror que se oculta tras la aparente normalidad cotidiana.',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788497598583-L.jpg',
        coverQuery: '',
      },
      {
        title: 'El resplandor',
        author: 'Stephen King',
        reason: 'Un sobrecogedor estudio sobre el aislamiento, la fragilidad psicológica y las fuerzas oscuras del pasado en el hotel Overlook, combinando drama humano profundo y terror visceral.',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788497593793-L.jpg',
        coverQuery: '',
      },
      {
        title: 'Drácula',
        author: 'Bram Stoker',
        reason: 'El duelo supremo entre el bien y el mal, la fe y la oscuridad. Una atmósfera gótica inolvidable que sentó las bases eternas del horror sobrenatural en la literatura occidental.',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788467035414-L.jpg',
        coverQuery: '',
      },
    ];
  }

  // Dystopian / Totalitarianism / 1984 / Rebelión en la granja
  if (
    authorLower.includes('orwell') ||
    titleLower.includes('1984') ||
    titleLower.includes('rebelión') ||
    titleLower.includes('rebelion') ||
    titleLower.includes('granja')
  ) {
    const isRebelion = titleLower.includes('rebelión') || titleLower.includes('rebelion') || titleLower.includes('granja');
    return [
      {
        title: 'Un mundo feliz',
        author: 'Aldous Huxley',
        reason: `El contrapunto perfecto a la distopía orwelliana. Si Orwell advirtió contra la vigilancia violenta y la opresión estatal, Huxley anticipó la dominación a través del placer superficial, el entretenimiento vacío y el conformismo inducido.`,
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788466332477-L.jpg',
        coverQuery: '',
      },
      {
        title: 'Fahrenheit 451',
        author: 'Ray Bradbury',
        reason: `Una distopía clásica donde los libros están prohibidos y los bomberos se encargan de quemarlos. Comparte la resistencia por preservar el pensamiento libre y la memoria histórica frente al control ideológico.`,
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788497596084-L.jpg',
        coverQuery: '',
      },
      isRebelion ? {
        title: 'Nosotros',
        author: 'Yevgueni Zamiatin',
        reason: `La obra pionera de la literatura distópica del siglo XX que inspiró directamente tanto a Orwell como a Huxley. Retrata con ironía y rigor poético el Gran Estado Unificado y el triunfo del colectivismo sobre el individuo.`,
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788439726883-L.jpg',
        coverQuery: '',
      } : {
        title: 'Rebelión en la granja',
        author: 'George Orwell',
        reason: `La genial fábula política del propio Orwell. Una sátira demoledora sobre cómo las revoluciones nobles terminan traicionadas por la propaganda, el culto al líder y la manipulación sistemática de las masas.`,
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788499890951-L.jpg',
        coverQuery: '',
      },
    ];
  }

  // Enigmas / Mysteries / Archaeology & Legends (Colección Paradigmas)
  if (
    authorLower.includes('frías') ||
    authorLower.includes('frias') ||
    titleLower.includes('paradigmas') ||
    titleLower.includes('tutankamón') ||
    titleLower.includes('tutankamon') ||
    titleLower.includes('bermudas') ||
    titleLower.includes('misterio') ||
    titleLower.includes('enigma')
  ) {
    return [
      {
        title: 'El misterio de Tutankamón',
        author: 'Zahi Hawass',
        reason: `El gran egiptólogo mundial desvela el fascinante hallazgo de Howard Carter, los tesoros de la tumba de Tutankamón y la realidad histórica tras la célebre maldición de los faraones.`,
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788408076643-L.jpg',
        coverQuery: '',
      },
      {
        title: 'El triángulo de las Bermudas',
        author: 'Charles Berlitz',
        reason: `El gran clásico que documentó con mapas y testimonios las desapariciones inexplicables de barcos y aviones en esta mítica zona del océano Atlántico.`,
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788401320392-L.jpg',
        coverQuery: '',
      },
      {
        title: 'Grandes enigmas de la historia',
        author: 'Jesús Callejo',
        reason: `Un exhaustivo y apasionante viaje por los mitos olvidados, civilizaciones perdidas y misterios arqueológicos más asombrosos del planeta.`,
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788497344982-L.jpg',
        coverQuery: '',
      },
    ];
  }

  // Al-Ándalus / Córdoba / Jewish & Islamic Medieval World
  if (
    authorLower.includes('guiladi') ||
    titleLower.includes('cipreses') ||
    titleLower.includes('córdoba') ||
    titleLower.includes('cordoba') ||
    titleLower.includes('ándalus') ||
    titleLower.includes('andalus')
  ) {
    return [
      {
        title: 'El puente de Alcántara',
        author: 'Frank Baer',
        reason: `La gran novela de las tres culturas en la España del siglo XI. Un poeta judío, un caballero cristiano y un médico andalusí cruzan sus destinos en un tapiz histórico de una riqueza y un detalle inolvidables.`,
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788435015387-L.jpg',
        coverQuery: '',
      },
      {
        title: 'El médico',
        author: 'Noah Gordon',
        reason: `La apasionante aventura de Rob Cole en su viaje hacia las grandes escuelas de medicina del mundo islámico medieval junto al maestro Avicena. Una lectura imprescindible sobre la vocación médica en la Edad Media.`,
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788466644266-L.jpg',
        coverQuery: '',
      },
      {
        title: 'La mano de Fátima',
        author: 'Ildefonso Falcones',
        reason: `Un fresco monumental sobre el amor, la fe y la tragedia de los moriscos en el sur de España. Recrea con maestría la lucha de un hombre atrapado entre dos mundos y dos religiones.`,
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788425343469-L.jpg',
        coverQuery: '',
      },
    ];
  }

  // 19th-Century Russian Literature / Pushkin / Classic Tales & Serfdom
  if (
    authorLower.includes('pushkin') ||
    titleLower.includes('dubrovski') ||
    titleLower.includes('belkin')
  ) {
    return [
      {
        title: 'La hija del capitán',
        author: 'Aleksandr Pushkin',
        reason: 'La cumbre de la narrativa histórica de Pushkin. Ambientada en la sangrienta rebelión campesina de Pugachov contra Catalina la Grande, combina una emocionante historia de amor, honor y lealtad con un retrato vívido de las contradicciones de la Rusia zarista.',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788420651262-L.jpg',
        coverQuery: '',
      },
      {
        title: 'Un héroe de nuestro tiempo',
        author: 'Mijaíl Lérmontov',
        reason: 'Publicada poco después de las obras de Pushkin, es la primera gran novela psicológica de las letras rusas. Su protagonista Pechorin encarna el desencanto, el orgullo y el dilema moral de la juventud aristocrática decimonónica en el Cáucaso.',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788437604435-L.jpg',
        coverQuery: '',
      },
      {
        title: 'Relatos de San Petersburgo',
        author: 'Nikolái Gógol',
        reason: 'Contiene obras maestras como "El capote" y "La nariz". Heredero directo de la prosa ágil de Pushkin, Gógol retrata con humor corrosivo, compasión y fantasía la vida de los modestos funcionarios y las desigualdades de la sociedad rusa.',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788420674261-L.jpg',
        coverQuery: '',
      },
    ];
  }

  // Historical fiction / Castles / Ancient & Medieval world
  if (
    authorLower.includes('zueco') ||
    titleLower.includes('escalón') ||
    titleLower.includes('castillo') ||
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
const RecommendationCard: React.FC<{ rec: Recommendation; index: number }> = ({ rec, index }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.1, duration: 0.5 }}
      className="flex flex-col sm:flex-row gap-5 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
    >
      {/* Cover */}
      <div className="flex-shrink-0 w-24 h-36 rounded-lg overflow-hidden shadow-lg bg-slate-800 relative border border-white/10 flex items-center justify-center">
        {!imgError && rec.coverUrl ? (
          <img
            src={rec.coverUrl}
            alt={rec.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#2c3e6b] to-[#1a2540] flex flex-col items-center justify-center p-2 text-center">
            <BookOpen size={24} className="text-amber-300/80 mb-2" />
            <span className="text-[11px] font-serif font-bold text-white leading-tight line-clamp-3">{rec.title}</span>
            <span className="text-[9px] text-amber-300/70 mt-1 italic">{rec.author}</span>
          </div>
        )}
      </div>

      {/* Text */}
      <div className="flex-grow min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400/90 bg-amber-400/10 px-2 py-0.5 rounded-full inline-block mb-1">
                Afinidad temática & estilo
              </span>
              <h3 className="font-serif text-xl font-bold text-white leading-snug group-hover:text-amber-300 transition-colors">
                {rec.title}
              </h3>
              <p className="text-sm text-white/60 italic mt-0.5 font-medium">{rec.author}</p>
            </div>
            <ChevronRight
              size={20}
              className="flex-shrink-0 text-white/20 group-hover:text-amber-300 group-hover:translate-x-1 transition-all mt-1"
            />
          </div>
          <p className="text-sm text-white/80 leading-relaxed mt-3">
            {rec.reason}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
interface ExploreProps {
  books?: Book[];
}

export default function Explore({ books = [] }: ExploreProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const bookIdParam = searchParams.get('bookId');

  // Sort books with the latest read date first (defaulting to the most recent book read)
  const sortedBooks = useMemo(() => {
    return [...books].sort((a, b) => {
      const dateA = a.readDate || (a.createdAt?.toDate ? a.createdAt.toDate().toISOString() : '') || '';
      const dateB = b.readDate || (b.createdAt?.toDate ? b.createdAt.toDate().toISOString() : '') || '';
      return dateB.localeCompare(dateA);
    });
  }, [books]);

  const [selectedBookId, setSelectedBookId] = useState<string>('');

  useEffect(() => {
    if (bookIdParam && sortedBooks.some(b => b.id === bookIdParam)) {
      setSelectedBookId(bookIdParam);
    } else if (sortedBooks.length > 0 && (!selectedBookId || !sortedBooks.some(b => b.id === selectedBookId))) {
      setSelectedBookId(sortedBooks[0].id);
    }
  }, [bookIdParam, sortedBooks, selectedBookId]);

  const activeBook = sortedBooks.find(b => b.id === selectedBookId) || sortedBooks[0] || null;
  const recommendations = useMemo(
    () => (activeBook ? getRecommendations(activeBook) : []),
    [activeBook]
  );

  const handleSelectBook = (id: string) => {
    setSelectedBookId(id);
    setSearchParams({ bookId: id });
  };

  return (
    <div className="min-h-screen bg-parchment pb-20">

      {/* ── Personalized Recommendation Module ────────────────────────── */}
      {activeBook && (
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

          <div className="relative max-w-7xl mx-auto px-4 py-14">
            {/* Header Badge */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-wrap items-center justify-between gap-4 mb-4"
            >
              <div className="flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 px-4 py-1.5 rounded-full">
                <Sparkles size={14} className="text-amber-400" />
                <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">
                  Tu próxima lectura • Recomendaciones afines
                </span>
              </div>

              {/* Selector dropdown */}
              {sortedBooks.length > 1 && (
                <div className="flex items-center gap-2">
                  <label htmlFor="book-select" className="text-white/60 text-xs uppercase tracking-wider font-medium hidden sm:inline">
                    Cambiar libro:
                  </label>
                  <select
                    id="book-select"
                    value={activeBook.id}
                    onChange={(e) => handleSelectBook(e.target.value)}
                    className="bg-slate-800/90 text-amber-300 text-sm font-medium border border-amber-400/40 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer shadow-md"
                  >
                    {sortedBooks.map((b) => (
                      <option key={b.id} value={b.id} className="bg-slate-900 text-white">
                        {b.title} — {b.author}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="text-4xl md:text-5xl font-serif text-white mb-2 leading-tight"
            >
              Recomendaciones para ti
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-white/60 text-sm md:text-base mb-6 max-w-3xl"
            >
              Libros afines por atmósfera, dilema moral y género basados en:&nbsp;
              <span className="text-amber-300 font-semibold">{activeBook.title}</span>
              &nbsp;de&nbsp;
              <span className="text-white/90 font-medium">{activeBook.author}</span>.
            </motion.p>

            {/* Book switcher pill tabs */}
            {sortedBooks.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
                <span className="text-white/40 text-xs uppercase tracking-wider font-semibold whitespace-nowrap mr-1">
                  Tus lecturas:
                </span>
                {sortedBooks.map((b) => {
                  const isSelected = b.id === activeBook.id;
                  return (
                    <button
                      key={b.id}
                      onClick={() => handleSelectBook(b.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 font-bold border-amber-400 shadow-md shadow-amber-400/20'
                          : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border-white/10'
                      }`}
                    >
                      {b.title}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Last Book + Recommendations layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

              {/* Spotlight on selected book */}
              <motion.div
                key={activeBook.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-4 flex flex-col items-center lg:items-start bg-white/5 border border-white/10 p-6 rounded-2xl"
              >
                <div className="relative w-44 max-w-[200px]">
                  {/* Glow behind cover */}
                  <div className="absolute -inset-4 bg-amber-400/10 blur-2xl rounded-full" />
                  <div className="relative rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/20">
                    <img
                      src={activeBook.coverUrl}
                      alt={activeBook.title}
                      className="w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
                <div className="mt-5 text-center lg:text-left w-full">
                  <span className="text-[10px] uppercase tracking-widest text-amber-400/90 font-semibold bg-amber-400/10 px-2.5 py-1 rounded-full inline-block">
                    Lectura de referencia
                  </span>
                  <p className="text-white font-serif text-xl font-bold leading-snug mt-3">{activeBook.title}</p>
                  <p className="text-white/60 text-sm italic">{activeBook.author}</p>
                  {/* Stars */}
                  <div className="flex gap-1 mt-2.5 justify-center lg:justify-start">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={15}
                        className={i < activeBook.rating ? 'fill-amber-400 text-amber-400' : 'text-white/20'}
                      />
                    ))}
                  </div>
                  {activeBook.readDate && (
                    <p className="text-white/40 text-xs mt-2">
                      Leído: {activeBook.readDate}
                    </p>
                  )}
                  {activeBook.summary && (
                    <p className="text-white/70 text-xs leading-relaxed mt-3 border-t border-white/10 pt-3 line-clamp-4">
                      {activeBook.summary}
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Recommendation cards */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                    <Sparkles size={16} className="text-amber-400" />
                    3 Títulos seleccionados especialmente para ti
                  </h3>
                  <span className="text-xs text-white/50">
                    {recommendations.length} sugerencias
                  </span>
                </div>

                <div className="space-y-4">
                  {recommendations.map((rec, i) => (
                    <RecommendationCard key={rec.title + i} rec={rec} index={i} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom fade into parchment */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-b from-transparent to-parchment" />
        </section>
      )}

      {/* ── All Read Books Selection Grid ─────────────────────────────── */}
      {sortedBooks.length > 1 && (
        <main className="max-w-7xl mx-auto px-4 mt-12">
          <div className="border-b border-slate-200 pb-4 mb-8">
            <h2 className="text-2xl font-serif font-bold text-slate-800 flex items-center gap-2">
              <BookMarked size={22} className="text-library-blue" />
              Explorar recomendaciones por cada libro leído
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Selecciona cualquiera de tus libros leídos para descubrir 3 obras afines seleccionadas por temática, atmósfera y estilo:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedBooks.map((b) => {
              const isCurrent = b.id === activeBook?.id;
              return (
                <div
                  key={b.id}
                  onClick={() => {
                    handleSelectBook(b.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/40 shadow-md'
                      : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-library-blue/30 hover:shadow-md'
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="w-14 h-20 flex-shrink-0 rounded overflow-hidden shadow-sm border border-slate-200 bg-slate-100">
                      <img src={b.coverUrl} alt={b.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-serif font-bold text-slate-800 text-sm line-clamp-2 leading-snug">
                        {b.title}
                      </h3>
                      <p className="text-xs text-slate-500 italic mt-0.5">{b.author}</p>
                      <div className="flex gap-0.5 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={10}
                            className={i < b.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className={isCurrent ? 'font-bold text-amber-700' : 'text-library-blue font-medium'}>
                      {isCurrent ? '● Recomendaciones activas' : 'Ver recomendaciones'}
                    </span>
                    <ArrowRight size={13} className={isCurrent ? 'text-amber-700' : 'text-library-blue'} />
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      )}
    </div>
  );
}