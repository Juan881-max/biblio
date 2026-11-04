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
  },
  {
    id: 'el-escalon-33-luis-zueco',
    title: 'El escalón 33',
    author: 'Luis Zueco',
    coverUrl: '/covers/el-escalon-33.png',
    readDate: '2026-05-10',
    summary: 'El escalón 33 de Luis Zueco es una novela de aventuras e intriga ambientada en el mundo de los castillos medievales. Dos jóvenes aventureros viajan de castillo en castillo tras unos enigmas ocultos en sus muros y en las marcas de los canteros. Combina acción y acertijos con divulgación histórica, en la línea de El código Da Vinci.',
    review: `Si quieres un libro que aporte infornacion sobre castillos, este es el libro.

Este es un libro de aventuras que narra como una joven que trabaja en el Archivo Nacional descubre un antiguo manuscrito por accidente. 
Ese manuscrito codiciado por un extraño personaje da las claves para hallar algo de inmenso valor, y esto hara que nuestros protagonistas hagan un increible viaje de castillo en castillo por toda España buscando huellas de cantero y diferentes simbolos.

Como el autor es historiador, se ve que domina el tema de los castillos, nos lleva de la mano a conocer fantasticos castillos, nos habla de sus constructores, de las marcas de canteros, de ordenes religiosas.

Sin ser algo maravilloso, se hace entretenido. El autor es aragones y nos lleva de lamano por Zaragoza, por el Tubo, por la plaza del Pilar, por Huesca, por Aguero y Riglos, para terminar en el Castillo de Mora de Rubielos(un lugar para visitar).

No es literatura desde luego y parece que los siguientes son algo mejores, pero si tegunstan los castillos, hay que leerlo.`,
    rating: 3,
    userId: 'bibliotheca',
    createdAt: Timestamp.fromDate(new Date('2026-05-10T12:00:00Z'))
  },
  {
    id: 'los-cipreses-de-cordoba-yael-guiladi',
    title: 'Los cipreses de Córdoba',
    author: 'Yael Guiladi',
    coverUrl: '/covers/los-cipreses-de-cordoba.png',
    readDate: '2026-10-01',
    summary: 'Se habla de la historia de tres generaciones judías en la Córdoba del siglo X. Familia dotada de gran inteligencia y que ejerció la medicina, estando así cerca de la corte, con sus lujos y también sus intrigas.',
    review: `Libro histórico de la colección Planeta DeAgostini, ya tengo varios de la misma colección.

Estoy leyéndolo todavía, por el momento bastante interesante.
El libro situado históricamente en el Siglo X transcurre casi en su totalidad en Córdoba (España) y nos habla de toda una saga familiar de un médico y confidente judío en la corte del califa de Córdoba.

Terminado el libro. Al final se me ha hecho bola. Largo.

En el libro se habla de una saga familiar, tres generaciones de judíos, de sus vidas, de sus familias, de sus éxitos y sus fracasos. Familia de médicos muy cercanos al poder, al califato de Córdoba. Compleja situación para unos judíos ya que suscitaban envidias y rencores. Personas inteligentes que daban un gran valor a la familia y al estudio, una ambición desmedida por aprender y servir a los demás, curar.

Cabe destacar la impresión que se da de lo adelantada que estaba la vida en esa zona musulmana (Córdoba) en relación con la España cristiana. Allí resurgían las artes, la construcción de palacios alcanzaba niveles maravillosos, en el campo de la medicina también estaban mucho más adelantados que los cristianos. En fin, una rica cultura musulmana que recuerda los maravillosos relatos de Las mil y una noches.

Los judíos no eran tratados como iguales ('dhimmis' o gente del Libro), tenían que pagar un impuesto especial y vivían bajo restricciones.

No ha sido un libro con el nivel de detalle de otros de esta colección, como El puente de Alcántara, por ejemplo.`,
    rating: 3,
    userId: 'bibliotheca',
    createdAt: Timestamp.fromDate(new Date('2026-10-01T12:00:00Z'))
  },
  {
    id: 'paradigmas-1-gustavo-frias',
    title: 'Paradigmas 1',
    author: 'Gustavo Frías',
    coverUrl: '/covers/paradigmas-1.png',
    readDate: '2026-10-25',
    summary: 'En esta colección de libros vemos misterios a lo largo y ancho del planeta. Con pruebas y datos reales.',
    review: `Libro de la Colección Paradigmas. Este es el número 1 y contiene 4 historias:

Tutankamón:
Nos habla de la posible maldición de la tumba, historia que ha creado no pocas películas y libros.

La Telesita:
Habla de una joven del norte argentino, ¿hechicera o santa?. Todavía hoy en día se le hacen ofrendas en busca de curación o "por mal de amores". Interesante la invocación que se le hace con el baile y alcohol, recuerda a otras invocaciones haitianas.

Triángulo de las Bermudas:
Nos da información sobre dónde está el Triángulo de las Bermudas y las inexplicables desapariciones que allí han tenido lugar.

Los Gigantes:
Gigantes que en otras épocas han habitado la tierra, lectura más que interesante.

Este libro documental trata estos 4 temas, es un volumen corto y no se profundiza mucho, pero sí resulta muy interesante. Aporta comentarios, leyendas y datos reales, así que resulta una grata lectura. Recuerdo haber comprado otro volumen de la misma colección cuando era mucho más joven, y siempre me parecieron muy interesantes todas estas historias.`,
    rating: 3,
    userId: 'bibliotheca',
    createdAt: Timestamp.fromDate(new Date('2026-10-25T12:00:00Z'))
  },
  {
    id: 'el-exorcista-william-peter-blatty',
    title: 'El exorcista',
    author: 'William Peter Blatty',
    coverUrl: '/covers/el-exorcista.png',
    readDate: '2026-08-02',
    summary: '‘El exorcista’ es una novela escrita en 1971 que relata la posesión demoníaca de Reagan MacNeil, una niña de 12 años que es hija de una famosa actriz. Reagan contrae una repentina y extraña enfermedad y, tras varios tratamientos médicos infructuosos, su madre decide recurrir a un sacerdote para que la ayude.',
    review: `Hoy Domingo 2 de Agosto comienzo a leer el exorcista. Lo tengo en la estanteria desde hace mucho, y al empezarlo a leer me parece fantastico, a pesar de haber visto la pelicula varias veces.

Libro terminado el 6 de Agosto. Con el sol radiante queriendo entrar por la ventana, el calor que todo lo inunda, parece que el libro sea algo extraño entanto alli era el frio y la lluvia los que dominaban el ambiente.

Este es uno de los libros que se debe leer, un libro que te hace pensar en muchas cosas importantes de la vida como: el remordimiento, Dios, el demonio, la culpa, la entrega, la fe, el trabajo ... son muchas cosas.

En si el libro habla de una niña inocente aquejada de una terrible enfermedad con la que los medicos no tienen cura, finalmente parece que un demonio o demonios han entrado en ella y dos sacerdotes tratan de exorcizarla, finalmente y con un inesperado final la niña sobrevive, y eso parece ser lo mas importante, el bien ha triunfado sobre el mal.

Buscando informacion sobre exorcismos, parece que en el Vaticano, hay decenas sino centenares de sacerdotes que son exorcistas ¿Quien lo hubiera creido?`,
    rating: 5,
    userId: 'bibliotheca',
    createdAt: Timestamp.fromDate(new Date('2026-08-02T12:00:00Z'))
  },
  {
    id: 'rebelion-en-la-granja-george-orwell',
    title: 'Rebelión en la granja',
    author: 'George Orwell',
    coverUrl: '/covers/rebelion-en-la-granja.png',
    readDate: '2026-06-15',
    summary: 'Un grupo de animales de una granja expulsa a los humanos tiranos y crean un sistema de gobierno propio que acaba convirtiéndose en otra tiranía brutal.',
    review: `Tras leer '1984' en Vacaciones decido comprar 'Rebelion en la granja' por el mismo autor.

Si '1984' ha sido un gran libro, un libro que no te deja indiferente y te hace pensar, 'Rebelion en la granja' es mas de lo mismo.

Critica absoluta a los totalitarismos. Critica feroz al sistema comunista de la URSS.
En el libro se muestra que aunque las ideas son buenas, la idea de igualdad, la idea de 'rememos todos hacia el mismo sentido y todos saldremos beneficiados' no funciona, el hombre (en este caso los cerdos), tras luchar contra la clase superior, tras intentar abolir las clases, se convierten ellos mismos en la clase superior. Todo esto ha pasado, esta pasndo y pasara mientras el hombre sea hombre.

Tras leer 2 libros de este magnifico autor me queda ese poso de ver como en la decada de los 40 se aprecia un hombre valiente que escribe claramente contra los abusos del totalitarismo, el era de izquierdas, pero veia claramente que la direccion que estaba tomando la politica en la URSS no era lo que debia ser. Se habia creado una nueva clase social, y la manipulacion de la informacion, las mentiras, la coaccion, corrompian todo un sistema.

El fue quien escribio: "todos los animales son iguales pero unos son las iguales que otros". En fin un libro imprescindible, que muchos hoy en dia deberian leer, todos aquellos que optan por posiciones extremas como solucion a los problemas actuales, lo mismo da derecha que izquierda, al final no funciona, el hombre en si mismo hace que nada de esto pueda funcionar.

Los mismos que intentan corregir la corrupcion se convierten en corruptos.`,
    rating: 5,
    userId: 'bibliotheca',
    createdAt: Timestamp.fromDate(new Date('2026-06-15T12:00:00Z'))
  },
  {
    id: 'dubrovski-los-relatos-de-belkin-aleksandr-pushkin',
    title: 'Dubrovski, Los relatos de Belkin',
    author: 'Aleksandr Serguéievich Pushkin',
    coverUrl: '/covers/dubrovski-los-relatos-de-belkin.png',
    readDate: '2026-11-03',
    summary: 'Serie de relatos cortos de este gran poeta ruso, donde amores y desamores nos trasladan a la Rusia de principios del siglo XIX.',
    review: `Aleksandr Serguéievich Pushkin, nacido en 1799, y fallecido en 1837. Posiblemente el mas grande poeta ruso.

El libro que nos ocupa *Dubrovski, Los relatos de Belkin* es un compendio de relatos, el primero un relato mas largo y luego unos cuantos relatos mas bien cortos.

Se habla en ellos de amores y desamores, y de la nobleza rusa que en aquellos tiempos todavia tenia como siervos a sus trabajadores, como en la edad media, parece que poco a poco, esto va cambiando, se empieza a notar algo asi en la mentalidad de la gente, despues de la guerra contra Napoleon y todo lo que soldados y oficiales ven en la guerra. Observan como en otros paises el nivel de vida es mucho mejor entre la poblacion rural, las cosas iran cambiando.

El libro en si traducido por Jose Lain Entralgo (Turolense), exiliado en la Union Sovietica tras la Guerra Civil, es una serie de historias curiosas, de lectura mas bien sencilla donde amores y desamores ocupan un lugar esencial. Decir tambien que algunos terminos, palabras se hacen dificiles de comprender, pero es una lectura agradable.`,
    rating: 4,
    userId: 'bibliotheca',
    createdAt: Timestamp.fromDate(new Date('2026-11-03T12:00:00Z'))
  },
  {
    id: 'la-tormenta-del-siglo-stephen-king',
    title: 'La tormenta del siglo',
    author: 'Stephen King',
    coverUrl: '/covers/la-tormenta-del-siglo.png',
    readDate: '2026-11-04',
    summary: "Una pequeña isla pesquera en el estado de Maine donde llega una gran tormenta de nieve. La isla queda aislada, nunca mejor dicho, pero lo peor no es eso, un asesino o mago o diablo, no sabemos lo que es comenza a causar estragos en el pueblo, y dice que no se ira hasta que consiga lo que quiere. Lo que quiere es un niño al que enseñara todo lo que sabe pues el va a morir. Tras una votacion los habitantes de la isla acceden a su peticion, hacen un sorteo y la bola negra le toca al protagonista y su mujer, se llevara a su hijo. Se lo lleva .. y como los isleños 'saben guardar un secreto' nadie en el exterior sabra lo sucedido.",
    review: `No es una novela en si, es un guion para una miniserie para la television, esto hace que el relato sea totalmente diferente.
Estoy a mitad de libro, y la atmosfera es es inquietante, fria, terrible ... King sabe crear una atmosfera especial, por algo es uno de los escritores de terror mas leido del mundo.
La idea de una isla aislada en medio de una terrible tormenta es escelente, y el le saca todo su jugo. Juega con la psicologia de los personajes, con sus debilidades y fortalezas, con sus 'pecados'.
El mal con mayusculas esta presente en todo momento, realmente estremece. Estoy deseando terminarla.
Novela/guion terminado. 
Una pequeña isla pesquera en el estado de Maine donde llega una gran tormenta de nieve. La isla queda aislada, nunca mejor dicho, pero lo peor no es eso, un asesino o mago o diablo, no sabemos lo que es comenza a causar estragos en el pueblo, y dice que no se ira hasta que consiga lo que quiere. Lo que quiere es un niño al que enseñara todo lo que sabe pues el va a morir. Tras una votacion los habitantes de la isla acceden a su peticion, hacen un sorteo y la bola negra le toca al protagonista y su mujer, se llevara a su hijo. Se lo lleva .. y como los isleños 'saben guardar un secreto' nadie en el exterior sabra lo sucedido.
Terrorifico guion del cual salio una miniserie para television, Stephen King en estado puro. Te deja sin aliento, no puedes parar de leer.`,
    rating: 5,
    userId: 'bibliotheca',
    createdAt: Timestamp.fromDate(new Date('2026-11-04T12:00:00Z'))
  },
  {
    id: 'dioses-y-heroes-de-la-antigua-grecia-robert-graves',
    title: 'Dioses y héroes de la antigua Grecia',
    author: 'Robert Graves',
    coverUrl: 'https://images-eu.ssl-images-amazon.com/images/I/61QVgO4aXWL._AC_UL232_SR232,232_.jpg',
    readDate: '2025-10-19',
    summary: 'Este libro se adentra en la Mitologia Griega',
    review: `Con un interesante prologo de Ramon Irigoyen, este pequeño libro se adentra en la Mitologia Griega, nos cuenta historias sucedidas a Dioses y Diosas, heroes y hombres.
Una delicia.`,
    rating: 4,
    userId: 'gaudiosomarcojuan@gmail.com',
    createdAt: Timestamp.fromDate(new Date('2025-10-19T12:00:00Z'))
  },
  {
    id: 'la-isla-de-las-tormentas-ken-follet',
    title: 'La isla de las tormentas',
    author: 'Ken Follet',
    coverUrl: '/covers/la-isla-de-las-tormentas.png',
    readDate: '2026-07-13',
    summary: 'Un espía alemán, uno de los mejores agentes de Hitler, descubre una información crucial que podría cambiar el rumbo de la guerra. Perseguido por los servicios secretos británicos, intenta regresar a Alemania para comunicar su hallazgo. Su huida lo lleva a una remota isla escocesa, donde conoce a una mujer cuya vida también está marcada por la guerra. A partir de ese momento comienza una intensa carrera contrarreloj llena de suspense, espionaje y peligro.',
    review: `Libro de espionaje ambientado en Inglaterra. Un espia especialmente habilidoso envia informacion a Alemania.

¿Que decir de Ken Follet? He leido varios libros  suyos, uno de los autores mas leidos del mundo, con obras de espionaje con un ritmo trepidante.

No te puedes separar del libro, uno de esos libros que te atrapa. La historia fantastica, los personajes creibles, y a mi me gusta mucho la descripcion y la integracion en esa Inglaterra de los 70/80.

Este es uno de esos libros que inducen a leer mas sobre el mismo autor.

Lo he terminado hoy, y me ha encantado, de hecho quiero ver la pelicula basada en este libro:
'El ojo de la aguja' del año 1981 y el director es Richard Marquand. Actor principal el magnifico Donald Sutherland.

Me gusta la trama, la ambientacion, la idea de esa isla desolada barrida por las tormentas. En fin, un gran libro, que sin ser literatura te hace pasar un rato muy bueno.`,
    rating: 3,
    userId: 'gaudiosomarcojuan@gmail.com',
    createdAt: Timestamp.fromDate(new Date('2026-07-13T12:00:00Z'))
  },
  {
    id: 'el-puente-de-alcantara-frank-baer',
    title: 'El puente de Alcántara',
    author: 'Frank Baer',
    coverUrl: '/covers/el-puente-de-alcantara.png',
    readDate: '2026-04-19',
    summary: 'Novela histórica ambientada en la España medieval de los siglos XI y XII. Narra la vida de un médico musulmán de gran talento que se ve obligado a afrontar los profundos cambios políticos, religiosos y culturales de una época marcada por la convivencia y el enfrentamiento entre musulmanes, cristianos y judíos. A través de viajes, intrigas y conflictos personales, la obra muestra el choque de civilizaciones y la lucha por el conocimiento y la supervivencia. Es una novela épica, rica en detalles históricos y con una gran reconstrucción de la Península Ibérica medieval.',
    review: `He comenzado a leer este libro, que por el momento me tiene atrapado. Lo debí de leer hace muchos años, lo tenia en la Libreria y ahi estaba, pero la verdad es que no recuerdo nada, al menos por el momento.

Argumento, hasta ahora (que solo llevo 100 paginas); son tres historias separadas, todo en el entorno del año 1064 en España, esa España musulmana por aquellos tiempos. Historia de musulmanes, de judios y de cristianos.

Nos da mucha informacion, sobre la riqueza de ciudades como Murcia, Sevilla, Cordoba, de usos y costumbres de las tres culturas. Nos habla de medicina, que interesante, de escribientes y poesia, de gente quese ganaba la vida asi, de jugadores de ajedrez, de hermosas mujeres ocultas en el haren, de cristianos y castillos, de caballos y señores, de siervos y condes ... muy entretenido y ademas muy detallista, parece que el autor sabe mucho del tema y transmite bien.

===============

El argumento nos habla de tres personajes distintos de las tres comunidades religiosas y culturales que habia en la España (si podemos llamarla España) del siglo XI, concretamente en el año 1064 que es en el que se basa la gran parte de la novela.

¿Que me llama la atencion?

Bien, son muchas cosas:

- En primer lugar me parece maravilloso como el autor describe la suntuosidad, el lujo y el refinamiento de la comunidad arabe a traves del Poeta, osea del protagonista de la parte arabe. Me parece terrible las luchas por el poder, que habia en las familias principales. Tambien es muy curioso el tema del haren y como las mujeres, confinadas y ocultadas, tenian en ocasiones la forma de burlar la vigilancia y bueno dar lugar a leyendas, historias, en fin la vida en aquellos tiempos.
- Por la parte de Lope, el joven escudero cristiano, es curioso y a la vez duro, ver las condiciones en las que vivia la gente 'cristiana' en aquellos tiempos. Los castillos y los señores, que diferencias con la gente del pueblo, y que decir del clero, que como siempre medraba a costa de los pobres ignorantes, siempre la religion ha supuesto un problema para los pobres y una forma maravillosa de ganarse la vida para unos pocos.
- El medico judio, un sabio. Ahora estoy en la parte donde van a atacar la ciudad de Barbastro. Que mavavilla ver a esos sabios de la antiguedad, tan reales, tan inteligentes, tanto mas cuanto mas ignorante era el populacho.

Una epoca cruel, donde solo unos pocos vivian bien, con grandes diferencias entre el mundo musulman en España y el Cristiano. Por una parte, la educacion, las buenas formas, la sensibilidad y la belleza . Po otra parte, ese mundo cristiano mas salvaje y violento, con el terror que creo que se tenia a obispos y demas jerarquia de la iglesia.

Se convivia pese a todo en este pais hace 1000 años, las tres religiones convivian, quiza ahora 1000 años despues es igual de dificil o mas, la religion sige siendo un escollo, un gran problema, no te parece? Seria maravilloso poder ver una de esas ciudades musulmanas, imagina caminar por las calles de Cordoba o de Sevilla en el siglo XI.

Imagina escuchar a uno de esos sabios judios hablar de medicina o de religion, de sus costumbres ...

Termino la primera parte del libro y me ha parecido fantastico. Para terminar, y como colofon esta el asedio y conquista por parte de normandos, francos y el Rey de Aragon del Castillo de Barbastro.

Aqui el autor lo describe con toda su crudeza, parecen los atacantes unos salvajes sedientos de riquezas, de oro y esclavos. Gente del norte que queria eliminar y asesinar a los musulmanes, que de alguna forma en aquellos entonces representaban la civilizacion, el refinamiento, el desarrollo de la medicina, en fin, eran los 'civilizados' y el invasor el salvaje, los asesinos, gentes sin principios ... da que pensar esto.

 1. *El choque cultural: Cruzados vs. Peninsulares*

Lo que describe el libro es históricamente exacto. Barbastro no fue una batalla más; se considera la **"primera cruzada"** (antes incluso de la de Jerusalén).

- **Los "Ultramontanos":** Los caballeros que bajaron de Francia y Normandía traían una mentalidad de "Guerra Santa" mucho más radical. Para ellos, el musulmán era un enemigo que debía ser exterminado o esclavizado.
    
- **Los Cristianos locales:** Los reyes de Aragón o Castilla, aunque guerreaban contra los musulmanes, estaban acostumbrados a convivir, comerciar y hasta aliarse con ellos. La crueldad extrema que mencionas vino, en gran medida, impulsada por esos caballeros extranjeros que no entendían la compleja realidad peninsular.
    

2. *¿Era el Sur más civilizado?*

En el siglo XI, la respuesta corta es **sí**, en términos de desarrollo urbano, ciencia y refinamiento.

- **Al-Ándalus (el Sur):** Era el heredero del esplendor del Califato. Tenían bibliotecas, sistemas de alcantarillado, una medicina avanzadísima y una economía basada en el comercio de seda y especias. La vida era, como dices, mucho más "cómoda".
    
- **Los Reinos Cristianos (el Norte):** Eran sociedades más rurales, guerreras y austeras. Su economía era de subsistencia y su estructura social estaba volcada casi exclusivamente hacia la guerra.
    
 3. *El mito de la tolerancia absoluta*

Es tentador ver a los musulmanes como los "buenos" y a los cristianos como los "malos", pero la historia es de un **gris oscuro**:

- **La convivencia:** Existía, pero era una "jerarquía". Cristianos y judíos en territorio musulmán (mozárabes y sefardíes) podían practicar su religión, pero pagando impuestos especiales y con derechos limitados.
    
- **La crueldad:** No era exclusiva del Norte. Cuando los Almorávides y Almohades (extremistas del norte de África) cruzaron el estrecho poco después de estos eventos, aplicaron una violencia y un fanatismo que horrorizó incluso a los propios musulmanes de la península.
Lo que hace grande a _El Puente de Alcántara_ es que no nos presenta caballeros de armadura brillante y valores puros, sino hombres de su tiempo: codiciosos, sucios y capaces de una crueldad que hoy nos parece impensable.

Esa caída desde la "vida cómoda" a la esclavitud que mencionas es el gran drama de la España del siglo XI: el fin de un modelo de convivencia y el inicio de una era de fanatismo religioso en ambos bandos.`,
    rating: 5,
    userId: 'gaudiosomarcojuan@gmail.com',
    createdAt: Timestamp.fromDate(new Date('2026-04-19T12:00:00Z'))
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
      const booksData = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        let title = data.title || '';
        let review = data.review || '';

        // Correct 'Diosoes y héroesde la antigua Grecia' typo
        if (title.toLowerCase().includes('diosoes') || title.toLowerCase().includes('héroesde')) {
          title = 'Dioses y héroes de la antigua Grecia';
        }

        // If La tormenta del siglo, enforce exact verbatim user review
        if (title.toLowerCase().includes('tormenta del siglo')) {
          review = `No es una novela en si, es un guion para una miniserie para la television, esto hace que el relato sea totalmente diferente.
Estoy a mitad de libro, y la atmosfera es es inquietante, fria, terrible ... King sabe crear una atmosfera especial, por algo es uno de los escritores de terror mas leido del mundo.
La idea de una isla aislada en medio de una terrible tormenta es escelente, y el le saca todo su jugo. Juega con la psicologia de los personajes, con sus debilidades y fortalezas, con sus 'pecados'.
El mal con mayusculas esta presente en todo momento, realmente estremece. Estoy deseando terminarla.
Novela/guion terminado. 
Una pequeña isla pesquera en el estado de Maine donde llega una gran tormenta de nieve. La isla queda aislada, nunca mejor dicho, pero lo peor no es eso, un asesino o mago o diablo, no sabemos lo que es comenza a causar estragos en el pueblo, y dice que no se ira hasta que consiga lo que quiere. Lo que quiere es un niño al que enseñara todo lo que sabe pues el va a morir. Tras una votacion los habitantes de la isla acceden a su peticion, hacen un sorteo y la bola negra le toca al protagonista y su mujer, se llevara a su hijo. Se lo lleva .. y como los isleños 'saben guardar un secreto' nadie en el exterior sabra lo sucedido.
Terrorifico guion del cual salio una miniserie para television, Stephen King en estado puro. Te deja sin aliento, no puedes parar de leer.`;
        }

        return {
          id: docSnap.id,
          ...data,
          title,
          review
        };
      }) as Book[];

      // Merge seeded books if not already in Firestore
      const firestoreTitles = new Set(booksData.map(b => b.title.toLowerCase().trim()));
      const combined = [...booksData];
      for (const seeded of SEEDED_BOOKS) {
        if (!firestoreTitles.has(seeded.title.toLowerCase().trim())) {
          combined.push(seeded);
        }
      }

      // Deduplicate books strictly by normalized title to prevent any duplicate entries (e.g. 1984)
      const seenTitles = new Set<string>();
      const uniqueBooks: Book[] = [];
      for (const b of combined) {
        const titleKey = b.title.toLowerCase().trim();
        if (!seenTitles.has(titleKey)) {
          seenTitles.add(titleKey);
          uniqueBooks.push(b);
        }
      }

      setBooks(uniqueBooks);
      setLoading(false);
    }, (error) => {
      console.warn('Error al conectar con Firestore, usando colección local:', error);
      // Even in local fallback, ensure deduplication
      const seenTitles = new Set<string>();
      const uniqueLocal: Book[] = [];
      for (const b of SEEDED_BOOKS) {
        const titleKey = b.title.toLowerCase().trim();
        if (!seenTitles.has(titleKey)) {
          seenTitles.add(titleKey);
          uniqueLocal.push(b);
        }
      }
      setBooks(uniqueLocal);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Auto-sync seeded books to Firestore when user logs in (without re-adding existing titles)
  useEffect(() => {
    if (!user) return;
    async function syncToFirestore() {
      try {
        const existingTitles = new Set(books.map(b => b.title.toLowerCase().trim()));
        for (const seeded of SEEDED_BOOKS) {
          if (!existingTitles.has(seeded.title.toLowerCase().trim())) {
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

            <div className="flex items-center gap-3 sm:gap-6">
              <nav className="flex items-center gap-3 sm:gap-6 md:gap-8 text-xs sm:text-sm uppercase tracking-wider font-semibold text-slate-600">
                <Link to="/" className="hover:text-library-blue transition-colors">Libros y Reseñas</Link>
                <Link to="/authors" className="hover:text-library-blue transition-colors">Autores</Link>
                <Link to="/explore" className="hover:text-library-blue transition-colors font-bold text-library-blue sm:text-slate-600">Explorar</Link>
              </nav>

              <div className="h-6 w-px bg-slate-200" />

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
              <a href="mailto:gaudiosomarcojuan@gmail.com" className="text-white hover:underline">gaudiosomarcojuan@gmail.com</a>
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