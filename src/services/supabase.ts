import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { SurveyResponse } from '../types/survey';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('placeholder')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Convert domain survey response to database row
export function mapResponseToRow(r: SurveyResponse) {
  return {
    id: r.id,
    created_at: r.timestamp || new Date().toISOString(),
    occupation: r.occupation,
    age: r.age,
    city: r.city,
    online_shopping_frequency: r.onlineShoppingFrequency,
    first_concept: r.firstConcept,
    buying_concepts: r.buyingConcepts || [],
    tiktok_concept: r.tiktokConcept,
    first_purchase_concept: r.firstPurchaseConcept,
    ryven_interest: r.ryvenInterest || null,
    ryven_products: r.ryvenProducts || [],
    ryven_price: r.ryvenPrice || null,
    ryven_repurchase: r.ryvenRepurchase || null,
    ryven_drivers: r.ryvenDrivers || [],
    karvo_interest: r.karvoInterest || null,
    karvo_products: r.karvoProducts || [],
    karvo_small_price: r.karvoSmallPrice || null,
    karvo_lamp_price: r.karvoLampPrice || null,
    karvo_drivers: r.karvoDrivers || [],
    car_care_interest: r.carCareInterest || null,
    car_care_products: r.carCareProducts || [],
    car_care_buy_first: r.carCareBuyFirst || null,
    car_care_price: r.carCarePrice || null,
    car_care_drivers: r.carCareDrivers || [],
    packaging_business_status: r.packagingBusinessStatus || null,
    packaging_channels: r.packagingChannels || [],
    packaging_products: r.packagingProducts || [],
    packaging_bundle: r.packagingBundle || null,
    packaging_budget: r.packagingBudget || null,
    packaging_repeat: r.packagingRepeat || null,
    problem_solver_frequency: r.problemSolverFrequency || null,
    problem_solver_category: r.problemSolverCategory || null,
    problem_solver_problem: r.problemSolverProblem || null,
    online_priority_drivers: r.onlinePriorityDrivers || [],
    premium_willingness: r.premiumWillingness || null,
    social_media_choice: r.socialMediaChoice || null,
    social_media_follow_choice: r.socialMediaFollowChoice || [],
    final_purchase_choice: r.finalPurchaseChoice || null,
    purchase_budget: r.purchaseBudget || null,
    purchase_intent: r.purchaseIntent || null,
    feedback: r.feedback || null,
    desired_product: r.desiredProduct || null,
    contact_permission: !!r.contactPermission,
    whatsapp: r.whatsapp || null,
    email: r.email || null,
  };
}

// Convert database row back to SurveyResponse
export function mapRowToResponse(row: Record<string, any>): SurveyResponse {
  return {
    id: row.id,
    timestamp: row.created_at,
    occupation: row.occupation || '',
    age: row.age || '',
    city: row.city || '',
    onlineShoppingFrequency: row.online_shopping_frequency || '',
    firstConcept: row.first_concept || '',
    buyingConcepts: row.buying_concepts || [],
    tiktokConcept: row.tiktok_concept || '',
    firstPurchaseConcept: row.first_purchase_concept || '',
    ryvenInterest: row.ryven_interest || undefined,
    ryvenProducts: row.ryven_products || [],
    ryvenPrice: row.ryven_price || undefined,
    ryvenRepurchase: row.ryven_repurchase || undefined,
    ryvenDrivers: row.ryven_drivers || [],
    karvoInterest: row.karvo_interest || undefined,
    karvoProducts: row.karvo_products || [],
    karvoSmallPrice: row.karvo_small_price || undefined,
    karvoLampPrice: row.karvo_lamp_price || undefined,
    karvoDrivers: row.karvo_drivers || [],
    carCareInterest: row.car_care_interest || undefined,
    carCareProducts: row.car_care_products || [],
    carCareBuyFirst: row.car_care_buy_first || undefined,
    carCarePrice: row.car_care_price || undefined,
    carCareDrivers: row.car_care_drivers || [],
    packagingBusinessStatus: row.packaging_business_status || undefined,
    packagingChannels: row.packaging_channels || [],
    packagingProducts: row.packaging_products || [],
    packagingBundle: row.packaging_bundle || undefined,
    packagingBudget: row.packaging_budget || undefined,
    packagingRepeat: row.packaging_repeat || undefined,
    problemSolverFrequency: row.problem_solver_frequency || undefined,
    problemSolverCategory: row.problem_solver_category || undefined,
    problemSolverProblem: row.problem_solver_problem || '',
    onlinePriorityDrivers: row.online_priority_drivers || [],
    premiumWillingness: row.premium_willingness || '',
    socialMediaChoice: row.social_media_choice || '',
    socialMediaFollowChoice: row.social_media_follow_choice || [],
    finalPurchaseChoice: row.final_purchase_choice || '',
    purchaseBudget: row.purchase_budget || '',
    purchaseIntent: row.purchase_intent || 4,
    feedback: row.feedback || '',
    desiredProduct: row.desired_product || '',
    contactPermission: !!row.contact_permission,
    whatsapp: row.whatsapp || '',
    email: row.email || '',
  };
}

// 1. Submit response to Supabase (Anon insertion only)
export async function submitResponseToSupabase(response: SurveyResponse): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Supabase client not initialized' };
  }

  try {
    const row = mapResponseToRow(response);
    const { error } = await supabase.from('responses').insert([row]);
    if (error) {
      console.warn('Supabase insert warning:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error' };
  }
}

// 2. Fetch responses from Supabase (Only succeeds for Authenticated Admin)
export async function fetchResponsesFromSupabase(): Promise<{ data: SurveyResponse[] | null; error?: string }> {
  if (!supabase) {
    return { data: null, error: 'Supabase client not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('responses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    const mapped = (data || []).map(mapRowToResponse);
    return { data: mapped };
  } catch (err: any) {
    return { data: null, error: err?.message || 'Network error' };
  }
}

// 3. Admin Authentication via Supabase
export async function signInAdminWithSupabase(email: string, password: string): Promise<{ user: User | null; error?: string }> {
  if (!supabase) {
    return { user: null, error: 'Supabase is not configured' };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { user: null, error: error.message };
  }

  return { user: data.user };
}

export async function signOutAdminFromSupabase(): Promise<void> {
  if (supabase) {
    await supabase.auth.signOut();
  }
}

export async function getSupabaseAdminSession(): Promise<User | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.user || null;
}
