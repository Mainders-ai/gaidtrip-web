export const SITE = {
  name: "Gaid Trip",
  tagline: "Tu guía de viajes con IA",
  description:
    "Itinerarios personalizados con IA, compañeros de viaje, experiencias únicas. Planifica tu próximo viaje con Gaid Trip.",
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
    title: "Planifica con IA",
    description: "Itinerarios personalizados según tus gustos y presupuesto",
    icon: "Sparkles" as const,
  },
  {
    title: "Conecta con viajeros",
    description: "Encuentra compañeros de viaje con intereses similares",
    icon: "Users" as const,
  },
  {
    title: "Reserva experiencias",
    description: "Tours y actividades exclusivas con un solo tap",
    icon: "Ticket" as const,
  },
  {
    title: "Viaja seguro",
    description: "Monitoreo en tiempo real y contactos de emergencia",
    icon: "Shield" as const,
  },
];

export const STEPS = [
  {
    number: "01",
    title: "Cuéntanos tu viaje",
    description: "Elige destino, fechas, presupuesto e intereses",
  },
  {
    number: "02",
    title: "La IA crea tu itinerario",
    description: "GAID genera un plan día a día personalizado",
  },
  {
    number: "03",
    title: "Disfruta y reserva",
    description: "Modifica con chat IA, reserva tours y encuentra compañeros",
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
    description: "Perfecto para probar",
    features: [
      "1 itinerario con IA",
      "Hasta 3 días de viaje",
      "Mapa interactivo",
      "Con publicidad",
    ],
    highlighted: false,
    cta: "Comenzar gratis",
  },
  {
    name: "Por Viaje",
    price: "$29",
    period: "MXN / viaje",
    description: "Todo lo que necesitas para un viaje",
    features: [
      "Itinerario completo con IA",
      "Viajes de hasta 30 días",
      "Multi-destino (5 ciudades)",
      "Chat IA ilimitado",
      "Sin publicidad",
      "Colaboración en tiempo real",
    ],
    highlighted: false,
    cta: "Elegir plan",
  },
  {
    name: "Premium",
    price: "$79",
    period: "MXN / mes",
    description: "Para viajeros frecuentes",
    features: [
      "Itinerarios ilimitados",
      "Todas las features de Por Viaje",
      "Matching de viajeros",
      "Stories y postales",
      "Sin publicidad",
      "Nuevas features primero",
    ],
    highlighted: true,
    cta: "Suscribirme",
  },
];

export const FAQS = [
  {
    question: "¿Cómo funciona la IA para crear itinerarios?",
    answer:
      "Nuestra IA analiza tus preferencias, presupuesto, fechas y destinos. GAID genera un itinerario día a día con actividades, restaurantes, tips y tiempos de traslado optimizados para ti.",
  },
  {
    question: "¿Puedo modificar mi itinerario después de crearlo?",
    answer:
      "¡Por supuesto! Tienes un chat con IA integrado donde puedes pedir cambios como \"agrega un día de playa\" o \"cambia el restaurante del día 3\". También puedes editar manualmente cualquier actividad.",
  },
  {
    question: "¿En qué ciudades está disponible?",
    answer:
      "Gaid Trip funciona en cualquier ciudad del mundo. La IA tiene conocimiento de destinos en todos los continentes y puede crear itinerarios para cualquier lugar que quieras visitar.",
  },
  {
    question: "¿Es gratis? ¿Qué incluye cada plan?",
    answer:
      "Sí, puedes crear tu primer itinerario completamente gratis. El plan Por Viaje desbloquea multi-destino y chat ilimitado. Premium te da itinerarios ilimitados y matching con otros viajeros.",
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
