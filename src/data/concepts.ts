import { ConceptInfo, ConceptId } from '../types/survey';

export const CONCEPTS: Record<ConceptId, ConceptInfo> = {
  ryven: {
    id: 'ryven',
    name: 'RYVEN',
    category: "MEN'S GROOMING",
    tagline: 'Look Fresh. Feel Ready.',
    description: 'Simple, modern grooming essentials engineered specifically for men.',
    positioning: 'Look Fresh. Feel Ready.',
    potentialProducts: [
      'Face Wash',
      'Hair Clay & Matte Pomade',
      'Beard Growth & Conditioning Oil',
      'Signature Fragrance',
      'Curated All-in-One Grooming Kit',
    ],
    accentColor: '#D4AF37', // Warm refined champagne gold
    accentBg: 'rgba(212, 175, 55, 0.12)',
    tiktokHook: "5-minute men's grooming transformation",
    hookSubtitle: 'From messy bedhead to razor-sharp confidence before the event.',
  },
  karvo: {
    id: 'karvo',
    name: 'KĀRVO',
    category: 'WOOD + HOME + CAFÉ',
    tagline: 'Crafted Wood. Everyday Character.',
    description: 'Handcrafted solid wooden products for modern homes, cafés and boutique spaces.',
    positioning: 'Crafted Wood. Everyday Character.',
    potentialProducts: [
      'Ambient Wooden Lamps & Lanterns',
      'Traditional Hand-carved Fanoos',
      'Minimalist Tissue Boxes',
      'Café Table Accessories & QR Stands',
      'Desk Organizers & Trays',
      'Custom Wood Décor & Wall Accents',
    ],
    accentColor: '#C89666', // Warm artisanal wood tone
    accentBg: 'rgba(200, 150, 102, 0.12)',
    tiktokHook: 'Raw wood → finished luxury ambient lamp',
    hookSubtitle: 'A 45-second timelapse turning salvaged sheesham into a warm glowing masterpiece.',
  },
  carcare: {
    id: 'carcare',
    name: 'CAR CARE BRAND',
    category: 'CAR CARE + ORGANIZATION',
    tagline: 'Better Car. Better Drive.',
    description: 'Practical, professional-grade products that keep your car immaculate, smelling fresh, and organized.',
    positioning: 'Better Car. Better Drive.',
    potentialProducts: [
      'Interior Deep Cleaning Kit',
      'Long-lasting Signature Car Perfume',
      'Plush Microfiber Drying & Buffing Towels',
      'Dashboard & Trim Satin Restorer',
      'Seat-Gap & Trunk Organizers',
      'Compact Leak-proof Car Bins',
      'Premium Leather Balm',
    ],
    accentColor: '#38BDF8', // Crisp automotive cyan
    accentBg: 'rgba(56, 189, 248, 0.12)',
    tiktokHook: 'Extremely dirty dashboard → satisfying transformation',
    hookSubtitle: '10 years of dust cleaned in seconds with deep satisfying foam.',
  },
  packaging: {
    id: 'packaging',
    name: 'SMALL BUSINESS PACKAGING',
    category: 'PACKAGING FOR ONLINE SELLERS',
    tagline: 'Make Your Small Business Look Big.',
    description: 'Affordable, aesthetic, and professional packaging solutions for Instagram, WhatsApp, and Daraz sellers.',
    positioning: 'Make Your Small Business Look Big.',
    potentialProducts: [
      'Luxury Textured Thank You Cards',
      'Waterproof Holographic & Matte Stickers',
      'Custom Review & Instagram QR Cards',
      'Matte Courier Poly Mailers',
      'Sturdy Custom Shipping Boxes',
      'Embossed Product Labels & Hang Tags',
      'All-In-One Starter Packaging Kits',
    ],
    accentColor: '#FB923C', // Energetic creator orange
    accentBg: 'rgba(251, 146, 60, 0.12)',
    tiktokHook: 'Small Instagram business → premium packaging makeover',
    hookSubtitle: 'How a simple unboxing upgrade doubled a local candle seller’s customer reviews.',
  },
  problemsolvers: {
    id: 'problemsolvers',
    name: 'EVERYDAY PROBLEM SOLVERS',
    category: 'SMART EVERYDAY PRODUCTS',
    tagline: 'Small Problems. Smart Solutions.',
    description: 'Clever, minimalist products specifically designed to eliminate friction and clutter from daily routines.',
    positioning: 'Small Problems. Smart Solutions.',
    potentialProducts: [
      'Magnetic Desk Cable Organizers',
      'Modular Drawer & Kitchen Dividers',
      'Ultra-compact Aluminum Phone & Tablet Stands',
      'Space-saving Wardrobe Hangers',
      'Anti-tangle Travel Tech Pouches',
      'Multi-surface Sticky Mounts',
    ],
    accentColor: '#4ADE80', // Fresh functional green
    accentBg: 'rgba(74, 222, 128, 0.12)',
    tiktokHook: 'We fixed one annoying everyday problem.',
    hookSubtitle: 'Watch cables stop falling behind the nightstand forever with this 10-second fix.',
  },
};

export const CONCEPTS_LIST = Object.values(CONCEPTS);

export const PAKISTAN_MAJOR_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Gujranwala',
  'Sialkot',
  'Quetta',
  'Hyderabad',
  'Abbottabad',
  'Bahawalpur',
  'Sargodha',
  'Sukkur',
  'Gujrat',
  'Sheikhupura',
  'Jhelum',
  'Wah Cantt',
  'Mardan',
  'Overseas (UAE/Dubai)',
  'Overseas (UK/London)',
  'Other Pakistani City',
];

export const OCCUPATION_OPTIONS = [
  'Student',
  'Job / Professional',
  'Business Owner',
  'Freelancer',
  'Online Seller',
  'Homemaker',
  'Other',
];

export const AGE_OPTIONS = [
  'Under 18',
  '18–24',
  '25–30',
  '31–40',
  '41–50',
  '50+',
];

export const ONLINE_SHOPPING_FREQ = [
  'Very often',
  'Often',
  'Sometimes',
  'Rarely',
  'Almost never',
];
