export type ConceptId = 'ryven' | 'karvo' | 'carcare' | 'packaging' | 'problemsolvers';

export interface ConceptInfo {
  id: ConceptId;
  name: string;
  category: string;
  tagline: string;
  description: string;
  positioning: string;
  potentialProducts: string[];
  accentColor: string;
  accentBg: string;
  tiktokHook: string;
  hookSubtitle: string;
}

export interface SurveyResponse {
  id: string;
  timestamp: string;

  // Profile
  occupation: string;
  age: string;
  city: string;
  onlineShoppingFrequency: string;

  // Concept Discovery & Early Interaction
  firstConcept: ConceptId | '';
  buyingConcepts: ConceptId[];
  tiktokConcept: ConceptId | '';
  firstPurchaseConcept: ConceptId | '';

  // RYVEN Deep-Dive (conditional)
  ryvenInterest?: number; // 1-5
  ryvenProducts?: string[];
  ryvenPrice?: string;
  ryvenRepurchase?: string;
  ryvenPakistaniWillingness?: string;
  ryvenDrivers?: string[];

  // KĀRVO Deep-Dive (conditional)
  karvoInterest?: number; // 1-5
  karvoProducts?: string[];
  karvoSmallPrice?: string;
  karvoLampPrice?: string;
  karvoDrivers?: string[];

  // CAR CARE Deep-Dive (conditional)
  carCareInterest?: number; // 1-5
  carCareProducts?: string[];
  carCareBuyFirst?: string;
  carCarePrice?: string;
  carCareDrivers?: string[];

  // SMALL BUSINESS PACKAGING Deep-Dive (conditional)
  packagingBusinessStatus?: string; // Yes | No | Planning
  packagingChannels?: string[];
  packagingProducts?: string[];
  packagingBundle?: string;
  packagingBudget?: string;
  packagingRepeat?: string;

  // EVERYDAY PROBLEM SOLVERS Deep-Dive (conditional)
  problemSolverFrequency?: string;
  problemSolverCategory?: string;
  problemSolverProblem?: string;

  // Price & Psychology
  onlinePriorityDrivers: string[];
  premiumWillingness: string;

  // Social Media
  socialMediaChoice: ConceptId | '';
  socialMediaFollowChoice: ConceptId[];

  // Real Purchase Intent
  finalPurchaseChoice: ConceptId | '';
  purchaseBudget: string;
  purchaseIntent: number; // 1-5

  // Open Feedback
  feedback: string;
  desiredProduct: string;

  // Launch Contact
  contactPermission: boolean;
  whatsapp?: string;
  email?: string;
}

export type ValidationSignalLevel = 
  | 'STRONG VALIDATION SIGNAL'
  | 'PROMISING — TEST WITH PROTOTYPE'
  | 'NEEDS MORE VALIDATION'
  | 'LOW VALIDATION SIGNAL';

export interface ConceptScore {
  conceptId: ConceptId;
  name: string;
  category: string;
  demandScore: number;       // 0-100 (25% weight)
  priceAcceptanceScore: number; // 0-100 (20% weight)
  purchaseIntentScore: number;  // 0-100 (25% weight)
  repeatPotentialScore: number; // 0-100 (20% weight)
  overallAppealScore: number;   // 0-100 (10% weight)
  totalSignalScore: number;     // 0-100 weighted
  signalLevel: ValidationSignalLevel;
  firstAttentionCount: number;
  consideredCount: number;
  finalChoiceCount: number;
  tiktokInterestCount: number;
  avgInterestRating: number;
}
