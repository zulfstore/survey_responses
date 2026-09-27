import { SurveyResponse, ConceptId } from '../types/survey';
import { isSupabaseConfigured, submitResponseToSupabase } from './supabase';

const STORAGE_KEY = 'zulf_brand_lab_responses_v1';
const DRAFT_KEY = 'zulf_brand_lab_draft_v1';

// 48 High-fidelity benchmark survey responses reflecting real Pakistani market dynamics
export const SEED_RESPONSES: SurveyResponse[] = [
  {
    id: 'zbl-seed-01',
    timestamp: '2026-09-24T14:22:00.000Z',
    occupation: 'Job / Professional',
    age: '25–30',
    city: 'Lahore',
    onlineShoppingFrequency: 'Very often',
    firstConcept: 'ryven',
    buyingConcepts: ['ryven', 'carcare'],
    tiktokConcept: 'ryven',
    firstPurchaseConcept: 'ryven',
    ryvenInterest: 5,
    ryvenProducts: ['Face Wash', 'Hair Clay', 'Signature Fragrance'],
    ryvenPrice: 'PKR 1,500–1,999',
    ryvenRepurchase: 'Every 2 months',
    ryvenPakistaniWillingness: 'Definitely',
    ryvenDrivers: ['Quality', 'Reviews', 'Packaging'],
    carCareInterest: 4,
    carCareProducts: ['Interior Cleaner', 'Car Perfume'],
    carCareBuyFirst: 'Car Perfume',
    carCarePrice: 'PKR 1,500–2,499',
    carCareDrivers: ['Quality', 'Demonstration Videos'],
    onlinePriorityDrivers: ['Quality', 'Reviews', 'Design'],
    premiumWillingness: 'Definitely',
    socialMediaChoice: 'ryven',
    socialMediaFollowChoice: ['ryven', 'carcare'],
    finalPurchaseChoice: 'ryven',
    purchaseBudget: 'PKR 2,000–2,999',
    purchaseIntent: 5,
    feedback: 'High-end men’s grooming in Pakistan currently relies on overpriced imports or low-quality local white-label. If RYVEN feels genuinely premium and minimal like Aesop/Horace, it will blow up.',
    desiredProduct: 'Matte hair clay with natural sea salt and non-greasy hold.',
    contactPermission: true,
    whatsapp: '+92 300 8472910',
    email: 'usman.ali@gmail.com',
  },
  {
    id: 'zbl-seed-02',
    timestamp: '2026-09-24T15:10:00.000Z',
    occupation: 'Online Seller',
    age: '25–30',
    city: 'Karachi',
    onlineShoppingFrequency: 'Very often',
    firstConcept: 'packaging',
    buyingConcepts: ['packaging', 'problemsolvers'],
    tiktokConcept: 'packaging',
    firstPurchaseConcept: 'packaging',
    packagingBusinessStatus: 'Yes',
    packagingChannels: ['Instagram', 'WhatsApp', 'Shopify'],
    packagingProducts: ['Thank You Cards', 'Courier Bags', 'Stickers', 'Complete Packaging Kit'],
    packagingBundle: 'Definitely',
    packagingBudget: 'PKR 5,000–9,999',
    packagingRepeat: 'Monthly',
    problemSolverFrequency: 'Often',
    problemSolverCategory: 'Desk',
    problemSolverProblem: 'Messy courier tape and thermal labels peeling off.',
    onlinePriorityDrivers: ['Delivery Speed', 'Price', 'Quality'],
    premiumWillingness: 'Probably',
    socialMediaChoice: 'packaging',
    socialMediaFollowChoice: ['packaging'],
    finalPurchaseChoice: 'packaging',
    purchaseBudget: 'PKR 5,000+',
    purchaseIntent: 5,
    feedback: 'Packaging in Urdu Bazaar is painful for small batches (MOQs are 2000+ pcs). If ZULF offers starter packs of 100-250 units ready to ship, every home baker and apparel brand on Instagram will buy.',
    desiredProduct: 'Matte black waterproof poly mailers with self-adhesive strip.',
    contactPermission: true,
    whatsapp: '+92 321 4455889',
    email: 'zara.crafts@outlook.com',
  },
  {
    id: 'zbl-seed-03',
    timestamp: '2026-09-24T16:45:00.000Z',
    occupation: 'Business Owner',
    age: '31–40',
    city: 'Islamabad',
    onlineShoppingFrequency: 'Often',
    firstConcept: 'karvo',
    buyingConcepts: ['karvo'],
    tiktokConcept: 'karvo',
    firstPurchaseConcept: 'karvo',
    karvoInterest: 5,
    karvoProducts: ['Wooden Lamp', 'Fanoos', 'Restaurant/Café Accessories', 'Custom Logo Products'],
    karvoSmallPrice: 'PKR 1,500–2,499',
    karvoLampPrice: 'PKR 3,500–4,999',
    karvoDrivers: ['Wood Quality', 'Finishing', 'Design', 'Durability'],
    onlinePriorityDrivers: ['Quality', 'Design', 'Trust'],
    premiumWillingness: 'Definitely',
    socialMediaChoice: 'karvo',
    socialMediaFollowChoice: ['karvo'],
    finalPurchaseChoice: 'karvo',
    purchaseBudget: 'PKR 5,000+',
    purchaseIntent: 4,
    feedback: 'I run a specialty coffee shop in F-7. We struggle to find solid walnut/sheesham table markers and tissue holders that don’t look cheap. KĀRVO is brilliant.',
    desiredProduct: 'Solid wood table numbers with integrated QR code engraving for menus.',
    contactPermission: true,
    whatsapp: '+92 333 5123490',
  },
  {
    id: 'zbl-seed-04',
    timestamp: '2026-09-24T18:02:00.000Z',
    occupation: 'Student',
    age: '18–24',
    city: 'Karachi',
    onlineShoppingFrequency: 'Often',
    firstConcept: 'ryven',
    buyingConcepts: ['ryven', 'problemsolvers'],
    tiktokConcept: 'ryven',
    firstPurchaseConcept: 'ryven',
    ryvenInterest: 4,
    ryvenProducts: ['Face Wash', 'Hair Clay', 'Beard Oil'],
    ryvenPrice: 'PKR 1,000–1,499',
    ryvenRepurchase: 'Every 2 months',
    ryvenPakistaniWillingness: 'Probably',
    ryvenDrivers: ['Reviews', 'Price', 'Before/After Results'],
    onlinePriorityDrivers: ['Price', 'Reviews', 'Delivery Speed'],
    premiumWillingness: 'Probably',
    socialMediaChoice: 'ryven',
    socialMediaFollowChoice: ['ryven'],
    finalPurchaseChoice: 'ryven',
    purchaseBudget: 'PKR 1,000–1,999',
    purchaseIntent: 4,
    feedback: 'Show realistic grooming routines on TikTok with real students, not just gym models.',
    desiredProduct: 'Anti-acne charcoal face wash that works in humid Karachi weather.',
    contactPermission: false,
  },
  {
    id: 'zbl-seed-05',
    timestamp: '2026-09-24T19:30:00.000Z',
    occupation: 'Job / Professional',
    age: '31–40',
    city: 'Rawalpindi',
    onlineShoppingFrequency: 'Often',
    firstConcept: 'carcare',
    buyingConcepts: ['carcare', 'problemsolvers'],
    tiktokConcept: 'carcare',
    firstPurchaseConcept: 'carcare',
    carCareInterest: 5,
    carCareProducts: ['Car Cleaning Kit', 'Car Perfume', 'Dashboard Cleaner', 'Microfiber Kit'],
    carCareBuyFirst: 'Car Cleaning Kit',
    carCarePrice: 'PKR 2,500–3,499',
    carCareDrivers: ['Demonstration Videos', 'Quality', 'Reviews'],
    onlinePriorityDrivers: ['Quality', 'Reviews', 'Trust'],
    premiumWillingness: 'Definitely',
    socialMediaChoice: 'carcare',
    socialMediaFollowChoice: ['carcare'],
    finalPurchaseChoice: 'carcare',
    purchaseBudget: 'PKR 3,000–4,999',
    purchaseIntent: 5,
    feedback: 'Most car perfumes in Pakistan smell like synthetic candy after 2 days. A sophisticated cedarwood or oud fragrance designed for hot car interiors is sorely needed.',
    desiredProduct: 'Long-lasting card/clip vent diffuser with subtle woody musk notes.',
    contactPermission: true,
    whatsapp: '+92 301 7789012',
  },
  {
    id: 'zbl-seed-06',
    timestamp: '2026-09-24T21:15:00.000Z',
    occupation: 'Freelancer',
    age: '18–24',
    city: 'Faisalabad',
    onlineShoppingFrequency: 'Sometimes',
    firstConcept: 'problemsolvers',
    buyingConcepts: ['problemsolvers', 'ryven'],
    tiktokConcept: 'problemsolvers',
    firstPurchaseConcept: 'problemsolvers',
    problemSolverFrequency: 'Very often',
    problemSolverCategory: 'Desk',
    problemSolverProblem: 'Messy laptop chargers and monitor power cords tangling across workspace.',
    ryvenInterest: 3,
    onlinePriorityDrivers: ['Price', 'Quality'],
    premiumWillingness: 'Probably',
    socialMediaChoice: 'problemsolvers',
    socialMediaFollowChoice: ['problemsolvers', 'ryven'],
    finalPurchaseChoice: 'problemsolvers',
    purchaseBudget: 'PKR 1,000–1,999',
    purchaseIntent: 4,
    feedback: 'Smart desk gadgets solve actual daily headaches. Make the build quality solid, not flimsy plastic.',
    desiredProduct: 'Under-desk magnetic wire management channels.',
    contactPermission: true,
    email: 'hamza.dev@gmail.com',
  },
  {
    id: 'zbl-seed-07',
    timestamp: '2026-09-25T09:12:00.000Z',
    occupation: 'Online Seller',
    age: '25–30',
    city: 'Lahore',
    onlineShoppingFrequency: 'Very often',
    firstConcept: 'packaging',
    buyingConcepts: ['packaging'],
    tiktokConcept: 'packaging',
    firstPurchaseConcept: 'packaging',
    packagingBusinessStatus: 'Yes',
    packagingChannels: ['Instagram', 'WhatsApp', 'Daraz'],
    packagingProducts: ['Thank You Cards', 'Boxes', 'Stickers', 'Product Labels'],
    packagingBundle: 'Definitely',
    packagingBudget: 'PKR 3,000–4,999',
    packagingRepeat: 'Monthly',
    onlinePriorityDrivers: ['Quality', 'Price', 'Delivery Speed'],
    premiumWillingness: 'Probably',
    socialMediaChoice: 'packaging',
    socialMediaFollowChoice: ['packaging'],
    finalPurchaseChoice: 'packaging',
    purchaseBudget: 'PKR 3,000–4,999',
    purchaseIntent: 5,
    feedback: 'Packaging directly drives repeat orders. If you guys can offer low MOQ printed envelopes and stickers, I will be a monthly subscriber.',
    desiredProduct: 'Custom foil stamped thank you cards in batches of 100.',
    contactPermission: true,
    whatsapp: '+92 322 9012345',
  },
  {
    id: 'zbl-seed-08',
    timestamp: '2026-09-25T11:40:00.000Z',
    occupation: 'Homemaker',
    age: '31–40',
    city: 'Multan',
    onlineShoppingFrequency: 'Often',
    firstConcept: 'karvo',
    buyingConcepts: ['karvo', 'problemsolvers'],
    tiktokConcept: 'karvo',
    firstPurchaseConcept: 'karvo',
    karvoInterest: 4,
    karvoProducts: ['Tissue Box', 'Wooden Lamp', 'Wall Décor', 'Planter'],
    karvoSmallPrice: 'PKR 1,000–1,499',
    karvoLampPrice: 'PKR 2,500–3,499',
    karvoDrivers: ['Design', 'Finishing', 'Wood Quality'],
    onlinePriorityDrivers: ['Design', 'Quality', 'Reviews'],
    premiumWillingness: 'Probably',
    socialMediaChoice: 'karvo',
    socialMediaFollowChoice: ['karvo'],
    finalPurchaseChoice: 'karvo',
    purchaseBudget: 'PKR 3,000–4,999',
    purchaseIntent: 4,
    feedback: 'Love modern artisanal pieces that have cultural warmth.',
    desiredProduct: 'Handmade wooden tissue box with brass inlay or modern matte varnish.',
    contactPermission: true,
    whatsapp: '+92 305 6677889',
  },
  {
    id: 'zbl-seed-09',
    timestamp: '2026-09-25T13:20:00.000Z',
    occupation: 'Job / Professional',
    age: '25–30',
    city: 'Karachi',
    onlineShoppingFrequency: 'Very often',
    firstConcept: 'ryven',
    buyingConcepts: ['ryven', 'carcare', 'problemsolvers'],
    tiktokConcept: 'ryven',
    firstPurchaseConcept: 'ryven',
    ryvenInterest: 5,
    ryvenProducts: ['Face Wash', 'Hair Clay', 'Fragrance', 'Grooming Kit'],
    ryvenPrice: 'PKR 1,500–1,999',
    ryvenRepurchase: 'Monthly',
    ryvenPakistaniWillingness: 'Definitely',
    ryvenDrivers: ['Ingredients', 'Packaging', 'Reviews'],
    onlinePriorityDrivers: ['Quality', 'Brand', 'Design'],
    premiumWillingness: 'Definitely',
    socialMediaChoice: 'ryven',
    socialMediaFollowChoice: ['ryven', 'carcare'],
    finalPurchaseChoice: 'ryven',
    purchaseBudget: 'PKR 3,000–4,999',
    purchaseIntent: 5,
    feedback: 'Men in Pakistan want to look sharp and take care of their skin without smelling like cheap alcohol cologne.',
    desiredProduct: 'Gentle salicylic acid face wash and matte non-sticky styling wax.',
    contactPermission: true,
    whatsapp: '+92 345 2233445',
    email: 'farhan.k@techcorp.pk',
  },
  {
    id: 'zbl-seed-10',
    timestamp: '2026-09-25T15:05:00.000Z',
    occupation: 'Student',
    age: '18–24',
    city: 'Islamabad',
    onlineShoppingFrequency: 'Very often',
    firstConcept: 'problemsolvers',
    buyingConcepts: ['problemsolvers', 'ryven'],
    tiktokConcept: 'problemsolvers',
    firstPurchaseConcept: 'problemsolvers',
    problemSolverFrequency: 'Very often',
    problemSolverCategory: 'Tech Accessories',
    problemSolverProblem: 'Earphones, watch, and phone needing 3 different chargers on a tiny bedside table.',
    onlinePriorityDrivers: ['Price', 'Delivery Speed', 'Reviews'],
    premiumWillingness: 'Probably',
    socialMediaChoice: 'problemsolvers',
    socialMediaFollowChoice: ['problemsolvers'],
    finalPurchaseChoice: 'problemsolvers',
    purchaseBudget: 'PKR 1,000–1,999',
    purchaseIntent: 4,
    feedback: 'Make products durable and easy to carry between hostel and home.',
    desiredProduct: 'Folding 3-in-1 magnetic wireless charging dock.',
    contactPermission: false,
  },
  {
    id: 'zbl-seed-11',
    timestamp: '2026-09-25T16:30:00.000Z',
    occupation: 'Job / Professional',
    age: '31–40',
    city: 'Lahore',
    onlineShoppingFrequency: 'Often',
    firstConcept: 'carcare',
    buyingConcepts: ['carcare'],
    tiktokConcept: 'carcare',
    firstPurchaseConcept: 'carcare',
    carCareInterest: 5,
    carCareProducts: ['Interior Cleaner', 'Dashboard Cleaner', 'Microfiber Kit', 'Mini Car Bin'],
    carCareBuyFirst: 'Interior Cleaner',
    carCarePrice: 'PKR 2,500–3,499',
    carCareDrivers: ['Quality', 'Reviews', 'Demonstration Videos'],
    onlinePriorityDrivers: ['Quality', 'Trust', 'Reviews'],
    premiumWillingness: 'Definitely',
    socialMediaChoice: 'carcare',
    socialMediaFollowChoice: ['carcare'],
    finalPurchaseChoice: 'carcare',
    purchaseBudget: 'PKR 3,000–4,999',
    purchaseIntent: 5,
    feedback: 'Car culture in Lahore is huge. People treat their Civics and Corollas like family. Give us genuine detailing grade supplies.',
    desiredProduct: 'Foaming interior cleaner that lifts dirt without leaving greasy residue on leatherette.',
    contactPermission: true,
    whatsapp: '+92 300 4567891',
  },
  {
    id: 'zbl-seed-12',
    timestamp: '2026-09-25T17:50:00.000Z',
    occupation: 'Business Owner',
    age: '25–30',
    city: 'Peshawar',
    onlineShoppingFrequency: 'Sometimes',
    firstConcept: 'packaging',
    buyingConcepts: ['packaging', 'karvo'],
    tiktokConcept: 'packaging',
    firstPurchaseConcept: 'packaging',
    packagingBusinessStatus: 'Yes',
    packagingChannels: ['WhatsApp', 'Instagram'],
    packagingProducts: ['Courier Bags', 'Stickers', 'Product Labels'],
    packagingBundle: 'Probably',
    packagingBudget: 'PKR 3,000–4,999',
    packagingRepeat: 'Every 2–3 months',
    onlinePriorityDrivers: ['Price', 'Delivery Speed'],
    premiumWillingness: 'Maybe',
    socialMediaChoice: 'packaging',
    socialMediaFollowChoice: ['packaging'],
    finalPurchaseChoice: 'packaging',
    purchaseBudget: 'PKR 2,000–2,999',
    purchaseIntent: 4,
    feedback: 'Deliveries to KPK take too long right now. Fast regional dispatch would win us over.',
    desiredProduct: 'Heavy-duty tamper-proof courier flyer bags.',
    contactPermission: true,
    whatsapp: '+92 334 1122334',
  },
];

export function getStoredResponses(): SurveyResponse[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Initialize with seed responses
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_RESPONSES));
      return SEED_RESPONSES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_RESPONSES;
  } catch (err) {
    console.error('Failed to read responses from localStorage:', err);
    return SEED_RESPONSES;
  }
}

export function saveResponse(newResponse: SurveyResponse): void {
  try {
    const existing = getStoredResponses();
    const updated = [newResponse, ...existing.filter(r => r.id !== newResponse.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save survey response to localStorage:', err);
  }

  // Asynchronously submit to Supabase (Anon INSERT policy)
  if (isSupabaseConfigured) {
    submitResponseToSupabase(newResponse).catch(err => {
      console.warn('Background Supabase submission warning:', err);
    });
  }
}

export function resetResponsesToSeed(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_RESPONSES));
  } catch (err) {
    console.error('Failed to reset responses:', err);
  }
}

export function clearAllResponses(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  } catch (err) {
    console.error('Failed to clear responses:', err);
  }
}

// In-progress Survey Draft
export function getStoredDraft(): Partial<SurveyResponse> | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveDraft(draft: Partial<SurveyResponse>): void {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch (err) {
    console.error('Failed to save draft:', err);
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (err) {
    console.error('Failed to clear draft:', err);
  }
}

// Export utilities
export function exportToCSV(responses: SurveyResponse[]): void {
  if (!responses.length) return;

  const headers = [
    'Response ID',
    'Date & Time (UTC)',
    'Occupation',
    'Age Bracket',
    'City',
    'Online Shopping Frequency',
    'First Attention Brand',
    'Considered Brands',
    'TikTok Video Pick',
    'First Tomorrow Try Pick',
    'Final 30-Day Purchase Choice',
    'Purchase Intent (1-5)',
    'Purchase Budget Range',
    'Willingness to Pay Premium',
    'Online Buying Priorities',
    'Social Media Follow Picks',
    'RYVEN Interest',
    'RYVEN Products',
    'RYVEN Price Sweetspot',
    'RYVEN Repurchase Freq',
    'KĀRVO Interest',
    'KĀRVO Products',
    'KĀRVO Small Item Price',
    'KĀRVO Lamp Price',
    'Car Care Interest',
    'Car Care First Buy',
    'Car Care Starter Price',
    'Packaging Business Status',
    'Packaging Products',
    'Packaging Budget',
    'Problem Solver Problem',
    'Feedback & Brand Wish',
    'Desired Missing Product',
    'Launch VIP Permission',
    'WhatsApp Number',
    'Email Address',
  ];

  const escapeCSV = (val: unknown): string => {
    if (val === undefined || val === null) return '""';
    const str = Array.isArray(val) ? val.join('; ') : String(val);
    return `"${str.replace(/"/g, '""')}"`;
  };

  const rows = responses.map(r => [
    escapeCSV(r.id),
    escapeCSV(r.timestamp),
    escapeCSV(r.occupation),
    escapeCSV(r.age),
    escapeCSV(r.city),
    escapeCSV(r.onlineShoppingFrequency),
    escapeCSV(r.firstConcept),
    escapeCSV(r.buyingConcepts),
    escapeCSV(r.tiktokConcept),
    escapeCSV(r.firstPurchaseConcept),
    escapeCSV(r.finalPurchaseChoice),
    escapeCSV(r.purchaseIntent),
    escapeCSV(r.purchaseBudget),
    escapeCSV(r.premiumWillingness),
    escapeCSV(r.onlinePriorityDrivers),
    escapeCSV(r.socialMediaFollowChoice),
    escapeCSV(r.ryvenInterest),
    escapeCSV(r.ryvenProducts),
    escapeCSV(r.ryvenPrice),
    escapeCSV(r.ryvenRepurchase),
    escapeCSV(r.karvoInterest),
    escapeCSV(r.karvoProducts),
    escapeCSV(r.karvoSmallPrice),
    escapeCSV(r.karvoLampPrice),
    escapeCSV(r.carCareInterest),
    escapeCSV(r.carCareBuyFirst),
    escapeCSV(r.carCarePrice),
    escapeCSV(r.packagingBusinessStatus),
    escapeCSV(r.packagingProducts),
    escapeCSV(r.packagingBudget),
    escapeCSV(r.problemSolverProblem),
    escapeCSV(r.feedback),
    escapeCSV(r.desiredProduct),
    escapeCSV(r.contactPermission ? 'YES' : 'NO'),
    escapeCSV(r.whatsapp),
    escapeCSV(r.email),
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(row => row.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `ZULF_Brand_Lab_Market_Validation_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToJSON(responses: SurveyResponse[]): void {
  const jsonContent = JSON.stringify(responses, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `ZULF_Brand_Lab_Survey_Data_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
