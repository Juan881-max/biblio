import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Book as BookIcon, Calendar, User, ChevronDown, ChevronUp, Loader2, Sparkles } from 'lucide-react';
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
  'Leon Uris': {
    bio: 'Leon Marcus Uris (Baltimore, Maryland, 1924 - Shelter Island, Nueva York, 2003) fue un célebre novelista y guionista estadounidense, reconocido internacionalmente por sus monumentales novelas épicas históricas basadas en rigurosas investigaciones y en los acontecimientos más trascendentales del siglo XX.\n\n📚 Biografía y obra\n\n- Hijo de un inmigrante judío polaco que huyó de los pogromos zaristas, se alistó en el Cuerpo de Marines a los diecisiete años tras el ataque a Pearl Harbor, combatiendo como operador de radio en el Pacífico (Guadalcanal y Tarawa).\n- Su experiencia militar inspiró su primera novela, Más allá de las lágrimas (Battle Cry, 1953), que se convirtió en un éxito rotundo. En 1958 alcanzó consagración mundial absoluta con Éxodo (Exodus), fenómeno editorial que retrató el nacimiento del Estado de Israel y la epopeya de los refugiados del Holocausto.\n- En 1961 publicó Mila 18, fruto de minuciosas entrevistas e investigaciones sobre el heroico levantamiento del gueto de Varsovia en 1943, donde el búnker de la calle Miła 18 sirvió de cuartel general a la Organización Judía de Combate (ŻOB).\n- Autor de otros grandes títulos como Topaz (adaptada al cine por Alfred Hitchcock), QB VII y Trinidad.\n\n👉 En resumen: Maestro indiscutible de la novela histórica monumental y apasionada, capaz de plasmar el dolor, la dignidad y el coraje frente a la opresión con un ritmo conmovedor e inolvidable.',
    top_works: [
      'Mila 18',
      'Éxodo (Exodus)',
      'Más allá de las lágrimas (Battle Cry)',
      'Topaz',
      'Trinidad'
    ],
    birth_date: '1924',
    death_date: '2003'
  },
  'John le Carré': {
    bio: 'John le Carré (seudónimo literario de David John Moore Cornwell, Poole, Dorset, 1931 - Truro, Cornualles, 2020) es unánimemente aclamado como el gran maestro indiscutible de la novela de espionaje del siglo XX y uno de los escritores británicos más influyentes de la literatura contemporánea.\n\n📚 Biografía y obra\n\n- Tras estudiar filología alemana en la Universidad de Berna y graduarse en la Universidad de Oxford, impartió clases en el prestigioso colegio Eton.\n- Durante las décadas de 1950 y 1960 formó parte activa de los servicios secretos británicos: primero en el servicio de seguridad interna (MI5) y posteriormente en el servicio de inteligencia exterior (MI6), destinado en Alemania bajo cobertura diplomática en pleno apogeo de la Guerra Fría y el levantamiento del Muro de Berlín.\n- Su tercera novela, El espía que surgió del frío (The Spy Who Came in from the Cold, 1963), supuso una auténtica revolución literaria mundial. Desmitificó radicalmente la visión glamurosa y fantástica de espías tipo James Bond para mostrar un universo desgarrador, claustrofóbico, burocrático y amoral, donde los peones individuales son sacrificados con frialdad por las maquinarias del poder de ambos bandos (inmortalizada en el cine en 1965 con Richard Burton).\n- Consagró su maestría con la trilogía de George Smiley (El topo, El honorable colegial, La gente de Smiley), El sastre de Panamá, El jardinero fiel y Un espía perfecto.\n\n👉 En resumen: El autor definitivo de espionaje psicológico y político, caracterizado por su realismo implacable, dilemas éticos y una honda mirada a la condición humana bajo la tensión de los secretos de Estado.',
    top_works: [
      'El espía que surgió del frío',
      'El topo (Tinker Tailor Soldier Spy)',
      'Un espía perfecto',
      'El jardinero fiel',
      'La gente de Smiley'
    ],
    birth_date: '1931',
    death_date: '2020'
  },
  'John Lecarré': {
    bio: 'John le Carré (seudónimo literario de David John Moore Cornwell, Poole, Dorset, 1931 - Truro, Cornualles, 2020) es unánimemente aclamado como el gran maestro indiscutible de la novela de espionaje del siglo XX y uno de los escritores británicos más influyentes de la literatura contemporánea.\n\n📚 Biografía y obra\n\n- Tras estudiar filología alemana en la Universidad de Berna y graduarse en la Universidad de Oxford, impartió clases en el prestigioso colegio Eton.\n- Durante las décadas de 1950 y 1960 formó parte activa de los servicios secretos británicos: primero en el servicio de seguridad interna (MI5) y posteriormente en el servicio de inteligencia exterior (MI6), destinado en Alemania bajo cobertura diplomática en pleno apogeo de la Guerra Fría y el levantamiento del Muro de Berlín.\n- Su tercera novela, El espía que surgió del frío (The Spy Who Came in from the Cold, 1963), supuso una auténtica revolución literaria mundial. Desmitificó radicalmente la visión glamurosa y fantástica de espías tipo James Bond para mostrar un universo desgarrador, claustrofóbico, burocrático y amoral, donde los peones individuales son sacrificados con frialdad por las maquinarias del poder de ambos bandos (inmortalizada en el cine en 1965 con Richard Burton).\n- Consagró su maestría con la trilogía de George Smiley (El topo, El honorable colegial, La gente de Smiley), El sastre de Panamá, El jardinero fiel y Un espía perfecto.\n\n👉 En resumen: El autor definitivo de espionaje psicológico y político, caracterizado por su realismo implacable, dilemas éticos y una honda mirada a la condición humana bajo la tensión de los secretos de Estado.',
    top_works: [
      'El espía que surgió del frío',
      'El topo (Tinker Tailor Soldier Spy)',
      'Un espía perfecto',
      'El jardinero fiel',
      'La gente de Smiley'
    ],
    birth_date: '1931',
    death_date: '2020'
  },
  'Jack Higgins': {
    bio: 'Jack Higgins (seudónimo de Harry Patterson, Newcastle upon Tyne, 1929 - Jersey, 2022) fue uno de los autores británicos de thrillers militares, espionaje y suspense de mayor éxito y reconocimiento mundial, con más de 80 novelas traducidas a decenas de idiomas y más de 250 millones de ejemplares vendidos.\n\n📚 Biografía y obra\n\n- Tras prestar servicio militar en el regimiento de élite Horse Guards en la frontera alemana y graduarse en Sociología por la London School of Economics, ejerció como docente universitario antes de volcarse por completo en la escritura.\n- En 1975 alcanzó consagración mundial indiscutible con Ha llegado el águila (The Eagle Has Landed), hito de la novela bélica que revitalizó el género al presentar un comando de paracaidistas alemanes con un profundo sentido del honor enfrentados a una misión casi suicida en suelo inglés (magistralmente adaptada al cine en 1976 con Michael Caine, Donald Sutherland y Robert Duvall).\n- Creador de personajes legendarios como el exagente Liam Devlin y el implacable Sean Dillon, destacó por su prodigioso manejo del suspense, atmósferas desoladas y dilemas morales bajo el fuego de la guerra y la inteligencia.\n\n👉 En resumen: Maestro indiscutible del thriller militar y de infiltración bélica, con narrativas directas, personajes con alma y tramas electrizantes.',
    top_works: [
      'Ha llegado el águila (The Eagle Has Landed)',
      'El águila ha volado',
      'El toque del diablo',
      'Confesional',
      'El día del juicio'
    ],
    birth_date: '1929'
  },
  'Robert Harris': {
    bio: 'Robert Dennis Harris (Nottingham, 1957) es un prestigioso novelista, historiador y periodista británico, célebre mundialmente por sus thrillers históricos de rigurosa base documental sobre el poder político, la Segunda Guerra Mundial y el espionaje de inteligencia.\n\n📚 Biografía y obra\n\n- Graduado en Literatura Inglesa por la Universidad de Cambridge, trabajó como reportero para la BBC y columnista en The Sunday Times y The Daily Telegraph antes de consagrarse a la narrativa.\n- Su novela Enigma (1995) recrea con maestría técnica y humana la atmósfera claustrofóbica de Bletchley Park, los desafíos matemáticos de la máquina de cifrado nazi y la trascendencia de la información en el desenlace del conflicto bélico (adaptada al cine en 2001 con guion de Tom Stoppard).\n- Es autor de grandes éxitos internacionales como Patria (Fatherland), El escritor fantasma (The Ghost Writer), Múnich y su aclamada trilogía sobre Cicerón en la Roma republicana (Imperium, Lustrum, Dictator).\n\n👉 En resumen: Un referente indiscutible del thriller histórico inteligente, caracterizado por su precisión histórica, tramas envolventes y lúcida reflexión sobre los secretos de Estado.',
    top_works: [
      'Enigma',
      'Patria (Fatherland)',
      'El escritor fantasma',
      'Múnich',
      'Imperium'
    ],
    birth_date: '1957'
  },
  'Frank Baer': {
    bio: 'Frank Baer (Dresde, 1938) es un novelista, ensayista y periodista alemán, reconocido internacionalmente por su monumental reconstrucción de la España medieval en "El puente de Alcántara", una de las cumbres absolutas de la novela histórica sobre la Península Ibérica en el siglo XI.\n\n📚 Biografía y obra\n\n- Trabajó durante años como redactor y corresponsal antes de dedicarse a la investigación histórica exhaustiva sobre la convivencia y el choque de las tres culturas en la Edad Media peninsular.\n- Su obra maestra, El puente de Alcántara (Die Brücke von Alcántara, 1988), fruto de años de rigurosa investigación documental, ofrece un tapiz coral inigualable a través de tres destinos cruzados en el año 1064: un poeta y cortesano andalusí, un joven escudero cristiano y un médico sabio judío.\n- La novela destaca por su lucidez histórica al desmitificar las visiones maniqueas, mostrando con crudeza el asedio de Barbastro, la sofisticación del sur andalusí, la rudeza de los reinos del norte y el advenimiento del fanatismo religioso.\n\n👉 En resumen: Una de las lecturas más ricas, documentadas e imprescindibles sobre la España medieval, las tres religiones y la búsqueda del conocimiento.',
    top_works: [
      'El puente de Alcántara',
      'La cruzada de los niños'
    ],
    birth_date: '1938'
  },
  'Ken Follett': {
    bio: 'Ken Follett (Cardiff, Gales, 1949) es uno de los autores de suspense, espionaje y novela histórica más leídos y aclamados del mundo, con más de 170 millones de ejemplares vendidos en más de 80 países.\n\n📚 Biografía y obra\n\n- Graduado en Filosofía por el University College de Londres, ejerció como reportero antes de dedicarse por completo a la literatura de intriga.\n- Saltó al éxito internacional fulgurante en 1978 con La isla de las tormentas (Eye of the Needle), galardonada con el prestigioso Premio Edgar al Mejor Thriller y adaptada magistralmente al cine en 1981 con el título El ojo de la aguja, protagonizada por Donald Sutherland.\n- Es mundialmente célebre por su ritmo trepidante, rigor en la ambientación histórica y capacidad insuperable para enganchar al lector, con obras maestras de suspense como El hombre de San Petersburgo (ambientada en el Londres convulso previo a la Primera Guerra Mundial), Vuelo final y sus monumentales sagas históricas (Los pilares de la Tierra, Un mundo sin fin, La caída de los gigantes).\n\n👉 En resumen: Maestro absoluto del suspense narrativo de alta tensión, donde la meticulosa reconstrucción histórica y política se entrelaza con personajes apasionantes y carreras contrarreloj.',
    top_works: [
      'El hombre de San Petersburgo',
      'La isla de las tormentas (El ojo de la aguja)',
      'Los pilares de la Tierra',
      'La caída de los gigantes',
      'Vuelo final'
    ],
    birth_date: '1949'
  },
  'Ken Follet': {
    bio: 'Ken Follett (Cardiff, Gales, 1949) es uno de los autores de suspense, espionaje y novela histórica más leídos y aclamados del mundo, con más de 170 millones de ejemplares vendidos en más de 80 países.\n\n📚 Biografía y obra\n\n- Graduado en Filosofía por el University College de Londres, ejerció como reportero antes de dedicarse por completo a la literatura de intriga.\n- Saltó al éxito internacional fulgurante en 1978 con La isla de las tormentas (Eye of the Needle), galardonada con el prestigioso Premio Edgar al Mejor Thriller y adaptada magistralmente al cine en 1981 con el título El ojo de la aguja, protagonizada por Donald Sutherland.\n- Es mundialmente célebre por su ritmo trepidante, rigor en la ambientación histórica y capacidad insuperable para enganchar al lector, con obras maestras de suspense como El hombre de San Petersburgo (ambientada en el Londres convulso previo a la Primera Guerra Mundial), Vuelo final y sus monumentales sagas históricas (Los pilares de la Tierra, Un mundo sin fin, La caída de los gigantes).\n\n👉 En resumen: Maestro absoluto del suspense narrativo de alta tensión, donde la meticulosa reconstrucción histórica y política se entrelaza con personajes apasionantes y carreras contrarreloj.',
    top_works: [
      'El hombre de San Petersburgo',
      'La isla de las tormentas (El ojo de la aguja)',
      'Los pilares de la Tierra',
      'La caída de los gigantes',
      'Vuelo final'
    ],
    birth_date: '1949'
  },
  'Stephen King': {
    bio: 'Stephen Edwin King (Portland, Maine, 1947) es el indiscutible maestro contemporáneo del terror, el suspense sobrenatural y la ficción psicológica, con más de 350 millones de ejemplares vendidos en todo el mundo.\n\n📚 Biografía y obra\n\n- Graduado en Filología Inglesa por la Universidad de Maine, saltó a la fama internacional en 1974 con Carrie, dando inicio a una carrera literaria prolífica sin precedentes.\n- Autor de hitos universales de la literatura como El resplandor, It, Misery, Apocalipsis (The Stand), Cementerio de animales y la monumental saga de La Torre Oscura.\n- Con La tormenta del siglo (1999), King demostró su dominio del formato guion original escrito expresamente para la televisión, creando una de sus atmósferas más inquietantes, frías y asfixiantes en la ficticia Little Tall Island (Maine), poniendo a prueba los límites morales de toda una comunidad frente al enigma de Andre Linoge.\n- Ha recibido prestigiosos galardones como la Medalla de la National Book Foundation por su destacada contribución a las letras estadounidenses y la National Medal of Arts.\n\n👉 En resumen: Una de las plumas más influyentes y leídas del último siglo, célebre por su portentosa habilidad para indagar en la psique humana, los secretos colectivos y la irrupción del mal en la vida cotidiana.',
    top_works: [
      'La tormenta del siglo',
      'El resplandor',
      'It',
      'Misery',
      'La milla verde',
      'Cementerio de animales'
    ],
    birth_date: '1947'
  },
  'Pushkin': {
    bio: 'Aleksandr Serguéievich Pushkin (Moscú, 1799 - San Petersburgo, 1837) es universalmente reconocido como el padre de la literatura rusa moderna y su más célebre poeta y narrador.\n\n📚 Biografía y obra\n\n- Revolucionó la literatura eslava al forjar el idioma literario ruso contemporáneo, fundiendo la espontaneidad del lenguaje popular con la elegancia culta y superando el afrancesamiento de la nobleza.\n- Su genialidad abarcó la lírica, el drama histórico (Boris Godunov), la novela en verso (Eugenio Oneguin) y la prosa narrativa de ficción y relatos históricos (Dubrovski, Los relatos de Belkin, La hija del capitán, La dama de picas).\n- Tras las guerras napoleónicas y el contacto con Europa occidental, sus relatos reflejan con aguda perspicacia el choque entre el honor aristocrático y la injusticia de la servidumbre feudal, así como las transformaciones en la mentalidad popular.\n- Murió trágicamente a los 37 años como consecuencia de un duelo en defensa del honor de su esposa, Natalia Goncharova.\n\n👉 En resumen: La cumbre indiscutible de las letras rusas, cuya maestría narrativa, agilidad y profundidad abrieron el camino a Gógol, Turguénev, Tolstói y Dostoievski.',
    top_works: [
      'Dubrovski',
      'Los relatos de Belkin',
      'Eugenio Oneguin',
      'La hija del capitán',
      'La dama de picas'
    ],
    birth_date: '1799',
    death_date: '1837'
  },
  'William Peter Blatty': {
    bio: 'William Peter Blatty (Nueva York, 1928 - Bethesda, Maryland, 2017) fue un célebre escritor, guionista y cineasta estadounidense, inmortalizado por su obra maestra de terror psicológico y religioso "El exorcista" (1971), así como por su adaptación cinematográfica galardonada con el Premio Óscar al Mejor Guion Adaptado.\n\n📚 Biografía y obra\n\n- Graduado en Literatura Inglesa por la Universidad de Georgetown y máster por George Washington University, trabajó como especialista en guerra psicológica antes de consolidarse en Hollywood como guionista de comedia (colaborando con Blake Edwards).\n- En 1971 conmocionó al mundo literario con El exorcista, inspirada en hechos reales acontecidos en Maryland en 1949. La novela se mantuvo en el número uno de las listas de superventas durante más de un año consecutivo.\n- Continuó profundizando en el misterio de la fe, el remordimiento y la redención con obras como Legión (adaptada al cine como El exorcista III), El noveno misterio (The Ninth Configuration) y Dimiter.\n- Su narrativa destaca por formular preguntas trascendentales sobre la naturaleza del mal, el sufrimiento de los inocentes y la fe en medio de la adversidad.\n\n👉 En resumen: Un maestro del suspense sobrenatural y el drama teológico, con una capacidad narrativa absorbente que trasciende las fronteras del género de terror.',
    top_works: [
      'El exorcista',
      'Legión (El exorcista III)',
      'El noveno misterio',
      'Dimiter'
    ],
    birth_date: '1928',
    death_date: '2017'
  },
  'Gustavo Frías': {
    bio: 'Gustavo Frías es un escritor, periodista y divulgador argentino, reconocido por sus investigaciones y publicaciones sobre enigmas históricos, folclore popular, mitología y misterios sin resolver de todo el mundo.\n\n📚 Biografía y obra\n\n- Es autor de la popular Colección Paradigmas, una serie de volúmenes dedicados a explorar con enfoque documental y testimonios fenómenos como civilizaciones desaparecidas, enigmas arqueológicos y leyendas folclóricas.\n- Ha dedicado especial atención a las tradiciones orales y leyendas del norte argentino y Sudamérica, rescatando figuras populares como La Telesita y otros mitos locales.\n- Su estilo combina el relato ameno y accesible con datos históricos y crónicas periodísticas que despiertan la curiosidad del lector.\n\n👉 En resumen: Divulgador ideal para los apasionados de los grandes misterios del planeta, la arqueología insólita y las leyendas universales.',
    top_works: [
      'Paradigmas 1',
      'Paradigmas: Mitos y enigmas',
      'Leyendas y misterios del mundo'
    ]
  },
  'Yael Guiladi': {
    bio: 'Yael Guiladi es una escritora, historiadora y periodista británica-israelí, especializada en la historia del judaísmo sefardí y la convivencia intercultural en la España medieval de Al-Ándalus.\n\n📚 Biografía y obra\n\n- Su novela más célebre y traducida internacionalmente es Los cipreses de Córdoba, una extensa saga familiar que retrata con minuciosidad la vida cotidiana, la medicina y las intrigas cortesanas de los médicos judíos en el Califato omeya de Abderramán III y Alhakén II.\n- Ha dedicado gran parte de su labor investigadora a visibilizar el papel de la mujer y de las minorías judías ("dhimmis") en el mundo islámico y mediterráneo medieval.\n- Su estilo combina el rigor en la ambientación histórica con relatos corales que exploran las contradicciones entre la lealtad al poder y la preservación de la identidad comunitaria.\n\n👉 En resumen: Una autora de referencia para quienes buscan adentrarse en el esplendor cultural, científico y médico de la Córdoba califal y la historia de los sefardíes.',
    top_works: [
      'Los cipreses de Córdoba',
      'Mujeres en la historia judía',
      'Sagas sefardíes del Mediterráneo'
    ],
  },
  'Luis Zueco': {
    bio: 'Luis Zueco (Borja, Zaragoza, 1979) es un novelista, historiador y divulgador español, considerado uno de los grandes referentes actuales de la novela histórica y de intriga medieval en España.\n\n📚 Biografía y obra\n\n- Es licenciado en Historia del Arte por la Universidad de Zaragoza, ingeniero técnico y máster en Investigación Artística e Histórica.\n- Destaca especialmente por su conocimiento exhaustivo de la arquitectura militar medieval y los castillos de España, habiendo dirigido la restauración y conservación de varios monumentos históricos como el Castillo de Grisel y el Castillo-Palacio de Bulbuente.\n- Su famosa "Trilogía Medieval" (El castillo, La ciudad, El monasterio), así como obras como El mercader de libros, El cirujano de almas y El escalón 33, lo han consagrado como un autor superventas traducido a múltiples idiomas.\n\n👉 En resumen: Novelas históricas de lectura muy ágil y visual, ideales para los amantes del patrimonio medieval, la arquitectura y los misterios del pasado español.',
    top_works: [
      'El castillo',
      'El escalón 33',
      'El mercader de libros',
      'La ciudad',
      'El cirujano de almas'
    ],
    birth_date: '1979'
  },
  'George Orwell': {
    bio: 'George Orwell, seudónimo de Eric Arthur Blair (Motihari, India británica, 1903 - Londres, 1950), fue un novelista, ensayista, periodista y crítico británico, considerado una de las voces morales y políticas más lúcidas del siglo XX.\n\n📚 Biografía y obra\n\n- Participó activamente en la Guerra Civil española como miliciano del POUM, experiencia desgarradora que plasmó en Homenaje a Cataluña.\n- Sus dos obras cumbres, Rebelión en la granja (1945) y 1984 (1949), constituyen las mayores advertencias jamás escritas contra el totalitarismo, la manipulación del lenguaje (Neolengua) y la vigilancia masiva.\n- Su estilo literario se caracteriza por una claridad cristalina y un compromiso inquebrantable con la verdad y la dignidad del individuo.\n\n👉 En resumen: Un clásico fundamental de la literatura universal cuya clarividencia sobre el poder, el lenguaje y la verdad sigue estando más vigente que nunca.',
    top_works: [
      '1984',
      'Rebelión en la granja',
      'Homenaje a Cataluña',
      'Sin blanca en París y Londres',
      'Subir a por aire'
    ],
    birth_date: '1903',
    death_date: '1950'
  },
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
      'Dioses y héroes de la antigua Grecia',
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
    <div className="min-h-screen bg-parchment pb-20 relative">
      {/* Subtle library watermark across the whole page */}
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center opacity-[0.035]"
        style={{ backgroundImage: 'url("/images/biblioteca-autores.png")' }}
      />

      {/* Hero Section styled like the Home page */}
      <section className="relative h-[340px] md:h-[380px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: 'url("/images/biblioteca-autores.png")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-library-dark/80 via-library-blue/70 to-library-dark/90 z-10" />

        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <Sparkles size={14} />
            Tu biblioteca & autores
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-serif text-white mb-4 drop-shadow-lg"
          >
            Autores
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-xl text-library-light max-w-2xl mx-auto font-light italic"
          >
            Descubre a los autores de tu biblioteca personal, sus biografías y grandes obras.
          </motion.p>
        </div>
      </section>

      {/* Authors List */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 mt-12">
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