export const SITE = {
  name: "Gaid Trip",
  tagline: "Tu guía de viajes con IA",
  description:
    "Itinerarios personalizados con IA, guía en tiempo real durante tu viaje y compañeros de viaje. Planifica tu próximo viaje con Gaid Trip.",
  url: "https://gaidtrip.com",
};

export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Precios", href: "#precios" },
  { label: "FAQ", href: "#faq" },
];

export const FEATURES = [
  {
    title: "Itinerarios con IA",
    description: "Itinerarios multi-destino personalizados. Modifícalos con chat IA: \"agrega un día de playa\" y listo.",
    icon: "Sparkles" as const,
  },
  {
    title: "Planes del día",
    description: "¿Solo un día libre? GAID crea un plan social optimizado para cualquier ciudad con actividades, comida y tips.",
    icon: "CalendarDays" as const,
  },
  {
    title: "Modo Viaje en Vivo",
    description: "Tu itinerario se convierte en guía en tiempo real: clima, navegación, notificaciones y actividades completadas.",
    icon: "Navigation" as const,
  },
  {
    title: "Conecta viajeros",
    description: "Matching inteligente con viajeros afines. Chat cifrado de extremo a extremo para conocerse.",
    icon: "Users" as const,
  },
  {
    title: "32 idiomas",
    description: "Usa GAID en tu idioma. Disponible en 32 idiomas para viajeros de todo el mundo.",
    icon: "Globe" as const,
  },
  {
    title: "Colaboración en vivo",
    description: "Edita itinerarios con amigos en tiempo real. Ve quién está editando y los cambios al instante.",
    icon: "UserPlus" as const,
  },
];

export const STEPS = [
  {
    number: "01",
    title: "Cuéntanos tu viaje",
    description: "Elige destino, fechas, presupuesto e intereses. O crea un plan rápido de un día.",
  },
  {
    number: "02",
    title: "La IA crea tu plan",
    description: "GAID genera un itinerario completo o un plan del día con actividades, comida y tips.",
  },
  {
    number: "03",
    title: "Viaja con GAID",
    description: "El modo en vivo te guía con notificaciones, clima y sugerencias con IA",
  },
];

export const DESTINATIONS = [
  {
    name: "Roma",
    country: "Italia",
    emoji: "🇮🇹",
    days: 5,
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80",
    highlight: "Coliseo, Vaticano, Trastevere",
  },
  {
    name: "Tokio",
    country: "Japón",
    emoji: "🇯🇵",
    days: 7,
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80",
    highlight: "Shibuya, Senso-ji, Akihabara",
  },
  {
    name: "París",
    country: "Francia",
    emoji: "🇫🇷",
    days: 4,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80",
    highlight: "Torre Eiffel, Louvre, Montmartre",
  },
  {
    name: "Cancún",
    country: "México",
    emoji: "🇲🇽",
    days: 5,
    image: "https://images.unsplash.com/photo-1510097467424-192d713fd8b2?w=600&q=80",
    highlight: "Chichén Itzá, Xcaret, Isla Mujeres",
  },
  {
    name: "Nueva York",
    country: "Estados Unidos",
    emoji: "🇺🇸",
    days: 6,
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80",
    highlight: "Central Park, Times Square, Brooklyn",
  },
];

export const PRICING = [
  {
    name: "Gratis",
    price: "$0",
    period: "",
    description: "Para explorar sin compromiso",
    features: [
      "1 itinerario con IA",
      "1 plan del día",
      "Hasta 3 días de viaje",
      "Mapa interactivo",
      "Con publicidad",
    ],
    highlighted: false,
    cta: "Comenzar gratis",
  },
  {
    name: "Premium",
    price: "$79",
    period: "MXN / mes",
    description: "Todo ilimitado, 7 días gratis",
    features: [
      "Itinerarios ilimitados",
      "Planes del día ilimitados",
      "Viajes de hasta 30 días",
      "Multi-destino (5 ciudades)",
      "Modo Viaje en Vivo",
      "Chat IA ilimitado",
      "Matching de viajeros",
      "Colaboración en tiempo real",
      "Sin publicidad",
    ],
    highlighted: true,
    cta: "Probar 7 días gratis",
  },
];

export const FAQS = [
  {
    question: "¿Cómo funciona la IA para crear itinerarios?",
    answer:
      "Nuestra IA analiza tus preferencias, presupuesto, fechas y destinos. GAID genera un itinerario día a día con actividades, restaurantes, tips y tiempos de traslado optimizados para ti. También puedes crear planes rápidos de un solo día para cualquier ciudad.",
  },
  {
    question: "¿Puedo modificar mi itinerario después de crearlo?",
    answer:
      "¡Por supuesto! Tienes un chat con IA integrado donde puedes pedir cambios como \"agrega un día de playa\" o \"cambia el restaurante del día 3\". También puedes editar manualmente cualquier actividad.",
  },
  {
    question: "¿Qué es el Modo Viaje en Vivo?",
    answer:
      "Cuando llega la fecha de tu viaje, tu itinerario se convierte en un asistente personal en tiempo real. Recibes notificaciones antes de cada actividad, ves el clima actualizado, el tiempo de traslado entre lugares, sugerencias con IA según tu ubicación y puedes marcar actividades como completadas. Es como tener un guía de viajes en tu bolsillo.",
  },
  {
    question: "¿En qué ciudades está disponible?",
    answer:
      "Gaid Trip funciona en cualquier ciudad del mundo. La IA tiene conocimiento de destinos en todos los continentes y puede crear itinerarios para cualquier lugar que quieras visitar.",
  },
  {
    question: "¿Es gratis? ¿Qué incluye cada plan?",
    answer:
      "Sí, puedes crear tu primer itinerario completamente gratis. Si quieres más, Premium desbloquea itinerarios ilimitados, multi-destino, Modo Viaje en Vivo, chat IA ilimitado, matching de viajeros, stories y más. Puedes probarlo 7 días gratis antes de pagar $79 MXN/mes.",
  },
  {
    question: "¿Cómo funciona el matching de viajeros?",
    answer:
      "Basándonos en tus intereses, destinos y fechas de viaje, te conectamos con otros viajeros compatibles. Puedes chatear de forma segura con cifrado de extremo a extremo antes de decidir si quieres viajar juntos.",
  },
  {
    question: "¿Mis datos están seguros?",
    answer:
      "Tu privacidad es nuestra prioridad. Los chats están cifrados de extremo a extremo, usamos infraestructura segura con reglas de seguridad estrictas, y nunca compartimos tu información personal con terceros.",
  },
];
