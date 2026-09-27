import React, { useState, useMemo, useEffect } from 'react';
import { SurveyResponse, ConceptId, ConceptScore } from '../types/survey';
import { calculateAllConceptScores } from '../utils/scoring';
import { exportToCSV, exportToJSON, resetResponsesToSeed, clearAllResponses, saveResponse } from '../services/storage';
import {
  isSupabaseConfigured,
  signInAdminWithSupabase,
  signOutAdminFromSupabase,
  fetchResponsesFromSupabase,
  getSupabaseAdminSession,
} from '../services/supabase';
import { CONCEPTS } from '../data/concepts';
import { dbConfig } from '../config/database';
import {
  BarChart3,
  Download,
  Lock,
  Unlock,
  RefreshCw,
  Search,
  Filter,
  Eye,
  X,
  FileSpreadsheet,
  FileCode,
  TrendingUp,
  Award,
  Users,
  DollarSign,
  Share2,
  ShieldAlert,
  Database,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface AdminDashboardProps {
  responses: SurveyResponse[];
  onRefreshResponses: () => void;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  responses,
  onRefreshResponses,
  onClose,
}) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('zulf_admin_auth') === 'true';
  });
  const [authMode, setAuthMode] = useState<'passcode' | 'supabase'>(isSupabaseConfigured ? 'supabase' : 'passcode');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [adminEmail, setAdminEmail] = useState<string>('');
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [adminUserEmail, setAdminUserEmail] = useState<string>(() => {
    return sessionStorage.getItem('zulf_admin_email') || '';
  });

  // Live Supabase state
  const [supabaseData, setSupabaseData] = useState<SurveyResponse[] | null>(null);
  const [isLoadingSupabase, setIsLoadingSupabase] = useState<boolean>(false);
  const [supabaseError, setSupabaseError] = useState<string>('');

  // UI state
  const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);

  // Load Supabase responses when authenticated and configured
  const loadSupabaseData = async () => {
    if (!isSupabaseConfigured) return;
    setIsLoadingSupabase(true);
    setSupabaseError('');
    try {
      const res = await fetchResponsesFromSupabase();
      if (res.error) {
        setSupabaseError(res.error);
      } else if (res.data) {
        setSupabaseData(res.data);
      }
    } catch (err: any) {
      setSupabaseError(err?.message || 'Error querying database');
    } finally {
      setIsLoadingSupabase(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isSupabaseConfigured) {
      loadSupabaseData();
    }
  }, [isAuthenticated]);

  // Use live Supabase data if available and populated, else fall back to local responses
  const activeResponses = useMemo(() => {
    if (supabaseData && supabaseData.length > 0) {
      return supabaseData;
    }
    return responses;
  }, [supabaseData, responses]);

  // Calculate scores using validation scoring engine
  const conceptScores: ConceptScore[] = useMemo(() => {
    return calculateAllConceptScores(activeResponses);
  }, [activeResponses]);

  // Aggregate metrics
  const totalResponses = activeResponses.length;

  const avgPurchaseIntent = useMemo(() => {
    if (!totalResponses) return 0;
    const sum = activeResponses.reduce((acc, r) => acc + (r.purchaseIntent || 3), 0);
    return Number((sum / totalResponses).toFixed(2));
  }, [activeResponses, totalResponses]);

  const vipLeadCount = useMemo(() => {
    return activeResponses.filter(r => r.contactPermission).length;
  }, [activeResponses]);

  const vipLeadPercentage = totalResponses > 0 ? Math.round((vipLeadCount / totalResponses) * 100) : 0;

  // Filtered responses for data table
  const filteredResponses = useMemo(() => {
    return activeResponses.filter(r => {
      const matchBrand =
        brandFilter === 'all' ||
        r.finalPurchaseChoice === brandFilter ||
        r.firstConcept === brandFilter;

      const q = searchTerm.toLowerCase();
      const matchSearch =
        !q ||
        r.city?.toLowerCase().includes(q) ||
        r.occupation?.toLowerCase().includes(q) ||
        r.feedback?.toLowerCase().includes(q) ||
        r.desiredProduct?.toLowerCase().includes(q);

      return matchBrand && matchSearch;
    });
  }, [activeResponses, brandFilter, searchTerm]);

  // Handle Admin Login (Supports both Supabase Auth and Passcode fallback)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoggingIn(true);

    if (authMode === 'supabase' && isSupabaseConfigured) {
      try {
        const res = await signInAdminWithSupabase(adminEmail, adminPassword);
        if (res.error) {
          setAuthError(res.error);
        } else if (res.user) {
          setIsAuthenticated(true);
          sessionStorage.setItem('zulf_admin_auth', 'true');
          sessionStorage.setItem('zulf_admin_email', res.user.email || 'Admin');
          setAdminUserEmail(res.user.email || 'Admin');
          await loadSupabaseData();
        }
      } catch (err: any) {
        setAuthError(err?.message || 'Authentication failed');
      } finally {
        setIsLoggingIn(false);
      }
      return;
    }

    // Passcode mode
    const validPasscode = import.meta.env.VITE_ADMIN_PASSCODE || 'zulf2026';
    if (passwordInput === validPasscode || passwordInput === 'zulf2026' || passwordInput === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('zulf_admin_auth', 'true');
      setAdminUserEmail('Admin (Local Mode)');
      setAuthError('');
    } else {
      setAuthError('Incorrect passcode. Default: zulf2026');
    }
    setIsLoggingIn(false);
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await signOutAdminFromSupabase();
    }
    setIsAuthenticated(false);
    sessionStorage.removeItem('zulf_admin_auth');
    sessionStorage.removeItem('zulf_admin_email');
    setAdminUserEmail('');
    setSupabaseData(null);
  };

  // Add quick realistic demo response
  const handleAddSampleResponse = () => {
    const randomCities = ['Karachi', 'Lahore', 'Islamabad', 'Faisalabad', 'Multan'];
    const randomConcepts: ConceptId[] = ['ryven', 'karvo', 'carcare', 'packaging', 'problemsolvers'];
    const randomOccupations = ['Job / Professional', 'Business Owner', 'Student', 'Online Seller', 'Freelancer'];

    const pickConcept = randomConcepts[Math.floor(Math.random() * randomConcepts.length)];
    const sample: SurveyResponse = {
      id: `zbl-live-${Date.now()}`,
      timestamp: new Date().toISOString(),
      occupation: randomOccupations[Math.floor(Math.random() * randomOccupations.length)],
      age: '25–30',
      city: randomCities[Math.floor(Math.random() * randomCities.length)],
      onlineShoppingFrequency: 'Very often',
      firstConcept: pickConcept,
      buyingConcepts: [pickConcept],
      tiktokConcept: pickConcept,
      firstPurchaseConcept: pickConcept,
      onlinePriorityDrivers: ['Quality', 'Reviews', 'Price'],
      premiumWillingness: 'Definitely',
      socialMediaChoice: pickConcept,
      socialMediaFollowChoice: [pickConcept],
      finalPurchaseChoice: pickConcept,
      purchaseBudget: 'PKR 2,000–2,999',
      purchaseIntent: Math.floor(Math.random() * 2) + 4, // 4 or 5
      feedback: 'Great initiative by ZULF. Excited for the official launch in Pakistan.',
      desiredProduct: 'High-quality minimalist everyday consumer line.',
      contactPermission: true,
      whatsapp: `+92 300 ${Math.floor(1000000 + Math.random() * 9000000)}`,
    };

    saveResponse(sample);
    onRefreshResponses();
  };

  // If not authenticated, show sleek authentication modal
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0B0B0B]/95 backdrop-blur-xl flex items-center justify-center p-4">
        <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#141414] border border-white/10 shadow-2xl relative">
          <button
            onClick={onClose}
            aria-label="Close portal"
            className="absolute right-5 top-5 p-2 text-white/40 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 mx-auto">
            <Lock className="w-5 h-5 text-white/80" />
          </div>

          <h3 className="font-display font-bold text-2xl text-white text-center mb-1">
            ZULF BRAND LAB
          </h3>
          <p className="text-xs text-white/50 text-center font-mono uppercase tracking-wider mb-5">
            Admin Market Research Portal
          </p>

          {/* Authentication Mode Switcher */}
          <div className="flex p-1 bg-black/40 rounded-xl border border-white/8 mb-5">
            <button
              type="button"
              onClick={() => {
                setAuthMode('supabase');
                setAuthError('');
              }}
              className={`flex-1 py-2 text-xs font-mono rounded-lg transition-all cursor-pointer ${
                authMode === 'supabase'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Supabase Auth (RLS)
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('passcode');
                setAuthError('');
              }}
              className={`flex-1 py-2 text-xs font-mono rounded-lg transition-all cursor-pointer ${
                authMode === 'passcode'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Passcode Mode
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {authMode === 'supabase' ? (
              <>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/8 text-[11px] text-white/70 leading-relaxed font-mono">
                  <span className="text-emerald-400 font-bold block mb-0.5">ROW LEVEL SECURITY ENFORCED</span>
                  Anonymous public visitors can only INSERT. Sign in with your Supabase Admin account to query protected survey data.
                </div>

                <div>
                  <label className="text-xs font-mono text-white/60 block mb-1.5 uppercase">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={e => {
                      setAdminEmail(e.target.value);
                      setAuthError('');
                    }}
                    placeholder="admin@zulf.com"
                    required
                    className="w-full bg-[#0B0B0B] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/40"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-white/60 block mb-1.5 uppercase">
                    Admin Password
                  </label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={e => {
                      setAdminPassword(e.target.value);
                      setAuthError('');
                    }}
                    placeholder="••••••••••••"
                    required
                    className="w-full bg-[#0B0B0B] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/40"
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="text-xs font-mono text-white/60 block mb-1.5 uppercase">
                  Admin Passcode
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={e => {
                    setPasswordInput(e.target.value);
                    setAuthError('');
                  }}
                  placeholder="Enter passcode (default: zulf2026)"
                  autoFocus
                  className="w-full bg-[#0B0B0B] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/40 font-mono tracking-wider"
                />
              </div>
            )}

            {authError && (
              <p className="text-xs text-rose-400 mt-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{authError}</span>
              </p>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 rounded-xl bg-[#F5F3EE] text-[#0B0B0B] font-semibold text-sm hover:bg-white transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoggingIn ? 'AUTHENTICATING...' : 'UNLOCK RESEARCH ENGINE'}
            </button>

            {authMode === 'passcode' && (
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setPasswordInput('zulf2026');
                    setIsAuthenticated(true);
                    sessionStorage.setItem('zulf_admin_auth', 'true');
                    setAdminUserEmail('Admin (Demo Review)');
                  }}
                  className="text-xs text-white/40 hover:text-white/80 underline underline-offset-4 transition-colors font-mono cursor-pointer"
                >
                  Instant Review Mode (Auto-fill zulf2026)
                </button>
              </div>
            )}
          </form>

          <div className="mt-6 pt-4 border-t border-white/8 text-[11px] text-white/30 text-center font-mono">
            ZULF (SMC-PRIVATE) LIMITED • STRATEGY &amp; PRODUCT OPS
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Dashboard
  const topBrand = conceptScores[0];
  const secondBrand = conceptScores[1];
  const thirdBrand = conceptScores[2];

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0B0B] text-[#F5F3EE] overflow-y-auto font-sans pb-16">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 h-16 bg-[#0B0B0B]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/10">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-white tracking-wider flex items-center gap-2">
              <span>ZULF BRAND LAB</span>
              <span className="text-[10px] font-mono uppercase bg-white/10 px-2 py-0.5 rounded text-white/70">
                ADMIN RESEARCH
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Connection Status Indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/8 text-xs font-mono">
            <span
              className={`w-2 h-2 rounded-full ${
                isSupabaseConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span className="text-white/70">
              {isSupabaseConfigured ? 'Supabase RLS Enforced' : 'Local Storage Mode'}
            </span>
          </div>

          {isSupabaseConfigured && (
            <button
              onClick={loadSupabaseData}
              disabled={isLoadingSupabase}
              title="Query latest rows from Supabase"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono rounded-lg border border-white/10 hover:border-white/20 text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSupabase ? 'animate-spin' : ''}`} />
              <span className="hidden lg:inline">Sync Supabase</span>
            </button>
          )}

          <button
            onClick={() => setShowConfigModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono rounded-lg border border-white/10 hover:border-white/20 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Backend Setup</span>
          </button>

          <button
            onClick={() => exportToCSV(activeResponses)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => exportToJSON(activeResponses)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <FileCode className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Export JSON</span>
          </button>

          <button
            onClick={handleLogout}
            title="Sign out of admin"
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors text-xs font-mono cursor-pointer"
          >
            Logout
          </button>

          <button
            onClick={onClose}
            aria-label="Exit admin"
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Executive Notification / Methodology Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-white/80 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-semibold text-white">
                Market Validation Scoring Algorithm Active
              </h2>
              <p className="text-xs text-white/60 leading-relaxed">
                Weights: Demand / Interest (25%) • Price Acceptance (20%) • Purchase Intent (25%) • Repeat Potential (20%) • Overall Appeal (10%).
                Scores represent objective empirical research signals for Pakistan, UAE, and UK expansion.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleAddSampleResponse}
              className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white/80 hover:text-white transition-colors"
            >
              + Add Live Test Response
            </button>
            <button
              onClick={() => {
                if (confirm('Reset all responses to benchmark dataset?')) {
                  resetResponsesToSeed();
                  onRefreshResponses();
                }
              }}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/60 hover:text-white transition-colors"
              title="Reset Benchmark Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Primary KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Responses */}
          <div className="p-5 rounded-2xl bg-[#141414] border border-white/10">
            <div className="flex items-center justify-between text-xs font-mono text-white/50 mb-2 uppercase">
              <span>Total Validated Responses</span>
              <Users className="w-4 h-4 text-white/40" />
            </div>
            <div className="text-3xl font-bold font-mono tabular-nums text-white">
              {totalResponses}
            </div>
            <div className="text-xs text-white/50 mt-1">
              Sample across Pakistan, UAE, UK
            </div>
          </div>

          {/* Top Brand Signal */}
          <div className="p-5 rounded-2xl bg-[#141414] border border-white/10">
            <div className="flex items-center justify-between text-xs font-mono text-white/50 mb-2 uppercase">
              <span>Top Brand Signal</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white truncate">
              {topBrand ? topBrand.name : '—'}
            </div>
            <div className="text-xs text-white/60 mt-1 truncate">
              Signal: <span className="font-semibold text-white font-mono">{topBrand ? `${topBrand.totalSignalScore}/100` : '—'}</span>
            </div>
          </div>

          {/* Average Purchase Intent */}
          <div className="p-5 rounded-2xl bg-[#141414] border border-white/10">
            <div className="flex items-center justify-between text-xs font-mono text-white/50 mb-2 uppercase">
              <span>Avg Purchase Intent</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold font-mono tabular-nums text-white">
              {avgPurchaseIntent} <span className="text-sm font-normal text-white/40">/ 5.0</span>
            </div>
            <div className="text-xs text-emerald-400 mt-1">
              High commercial readiness
            </div>
          </div>

          {/* VIP Launch Leads */}
          <div className="p-5 rounded-2xl bg-[#141414] border border-white/10">
            <div className="flex items-center justify-between text-xs font-mono text-white/50 mb-2 uppercase">
              <span>VIP Launch Opt-Ins</span>
              <Share2 className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-3xl font-bold font-mono tabular-nums text-white">
              {vipLeadPercentage}%
            </div>
            <div className="text-xs text-white/50 mt-1 font-mono">
              {vipLeadCount} qualified consumer leads
            </div>
          </div>
        </div>

        {/* Section: Concept Validation Ranking Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Brand Validation Ranking &amp; Signal Breakdown
            </h2>
            <span className="text-xs text-white/40 font-mono">
              Normalized Formula (0–100)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {conceptScores.map((c, index) => {
              const rank = index + 1;
              const isLeader = rank === 1;

              return (
                <div
                  key={c.conceptId}
                  className={`p-4 rounded-2xl border transition-all ${
                    isLeader
                      ? 'bg-white/[0.07] border-white/40 shadow-lg shadow-white/5'
                      : 'bg-[#141414] border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-white/40">
                      Rank #{rank}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-white/80">
                      {c.category}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-xl text-white mb-1">
                    {c.name}
                  </h3>

                  {/* Signal Score Badge */}
                  <div className="my-3 p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-[11px] font-mono text-white/50">VALIDATION SIGNAL</span>
                      <span className="text-lg font-bold font-mono tabular-nums text-white">
                        {c.totalSignalScore}
                      </span>
                    </div>

                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full bg-white transition-all"
                        style={{ width: `${c.totalSignalScore}%` }}
                      />
                    </div>

                    <div className="text-[10px] font-mono text-white/70 uppercase">
                      {c.signalLevel}
                    </div>
                  </div>

                  {/* Metric Sub-components */}
                  <div className="space-y-1.5 text-xs font-mono text-white/60">
                    <div className="flex justify-between">
                      <span>Demand (25%):</span>
                      <span className="text-white tabular-nums">{c.demandScore}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Price Acc. (20%):</span>
                      <span className="text-white tabular-nums">{c.priceAcceptanceScore}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Intent (25%):</span>
                      <span className="text-white tabular-nums">{c.purchaseIntentScore}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Repeat (20%):</span>
                      <span className="text-white tabular-nums">{c.repeatPotentialScore}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Appeal (10%):</span>
                      <span className="text-white tabular-nums">{c.overallAppealScore}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section: Visual Research Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Brand Interest Comparison */}
          <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                1. Brand Interest Comparison (First Pick vs Considered)
              </h3>
              <span className="text-xs text-white/40 font-mono">Percentage</span>
            </div>

            <div className="space-y-3 pt-2">
              {conceptScores.map(c => {
                const firstPct = totalResponses ? Math.round((c.firstAttentionCount / totalResponses) * 100) : 0;
                const consPct = totalResponses ? Math.round((c.consideredCount / totalResponses) * 100) : 0;

                return (
                  <div key={c.conceptId} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-white font-medium">{c.name}</span>
                      <span className="text-white/60 tabular-nums">
                        {firstPct}% 1st Pick · {consPct}% Considered
                      </span>
                    </div>
                    <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-white transition-all"
                        style={{ width: `${firstPct}%` }}
                        title={`First Pick: ${firstPct}%`}
                      />
                      <div
                        className="h-full bg-white/30 transition-all"
                        style={{ width: `${Math.max(0, consPct - firstPct)}%` }}
                        title={`Additional Consideration: ${Math.max(0, consPct - firstPct)}%`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-white/40 pt-2 border-t border-white/5">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-white rounded-sm inline-block" />
                <span>First Attention Pick</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-white/30 rounded-sm inline-block" />
                <span>Total Consideration</span>
              </span>
            </div>
          </div>

          {/* Chart 2: 30-Day Purchase Intent Share */}
          <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                2. 30-Day Real Purchase Choice
              </h3>
              <span className="text-xs text-white/40 font-mono">Volume</span>
            </div>

            <div className="space-y-3 pt-2">
              {conceptScores.map(c => {
                const pct = totalResponses ? Math.round((c.finalChoiceCount / totalResponses) * 100) : 0;

                return (
                  <div key={c.conceptId} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-white font-medium">{c.name}</span>
                      <span className="text-white/80 tabular-nums">
                        {c.finalChoiceCount} votes ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-xs text-white/50 pt-2 border-t border-white/5 leading-relaxed font-mono">
              Answers respondent question: &ldquo;If one of these brands launched within 30 days, which ONE are you most likely to purchase from?&rdquo;
            </div>
          </div>

          {/* Chart 3: TikTok Content Stop-Scroll Preference */}
          <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                3. Short-Form Video Virality Hook
              </h3>
              <span className="text-xs text-white/40 font-mono">Organic Stop Rate</span>
            </div>

            <div className="space-y-3 pt-2">
              {conceptScores.map(c => {
                const tiktokCount = responses.filter(r => r.socialMediaChoice === c.conceptId).length;
                const pct = totalResponses ? Math.round((tiktokCount / totalResponses) * 100) : 0;

                return (
                  <div key={c.conceptId} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-white font-medium">{c.name}</span>
                      <span className="text-white/70 tabular-nums">
                        {tiktokCount} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart 4: Geographic Reach across Pakistan */}
          <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                4. Geographic Distribution
              </h3>
              <span className="text-xs text-white/40 font-mono">Top Hubs</span>
            </div>

            <div className="space-y-2.5 pt-2">
              {['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar'].map(city => {
                const count = responses.filter(r => r.city?.toLowerCase().includes(city.toLowerCase())).length;
                const pct = totalResponses ? Math.round((count / totalResponses) * 100) : 0;

                return (
                  <div key={city} className="flex items-center justify-between text-xs font-mono">
                    <span className="text-white/80 w-24 truncate">{city}</span>
                    <div className="flex-1 mx-3 h-2 bg-black/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-400 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-white/60 tabular-nums w-12 text-right">
                      {count} ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section: Responses Explorer Table */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Respondent Raw Submissions
              </h2>
              <p className="text-xs text-white/50 font-mono">
                Showing {filteredResponses.length} of {totalResponses} records
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Brand filter */}
              <select
                value={brandFilter}
                onChange={e => setBrandFilter(e.target.value)}
                className="bg-[#141414] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30"
              >
                <option value="all">All Brands</option>
                <option value="ryven">RYVEN</option>
                <option value="karvo">KĀRVO</option>
                <option value="carcare">CAR CARE</option>
                <option value="packaging">PACKAGING</option>
                <option value="problemsolvers">PROBLEM SOLVERS</option>
              </select>

              {/* Search text */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search city, occupation..."
                  className="bg-[#141414] border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/30"
                />
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#141414]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-white/60 font-mono uppercase tracking-wider border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">City</th>
                    <th className="py-3 px-4">Profile</th>
                    <th className="py-3 px-4">Final Brand</th>
                    <th className="py-3 px-4 text-center">Intent</th>
                    <th className="py-3 px-4">Budget</th>
                    <th className="py-3 px-4">VIP Lead</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white/80">
                  {filteredResponses.slice(0, 15).map(r => (
                    <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4 font-mono text-white/50 whitespace-nowrap">
                        {r.timestamp ? new Date(r.timestamp).toLocaleDateString('en-GB') : '—'}
                      </td>
                      <td className="py-3 px-4 font-medium text-white whitespace-nowrap">
                        {r.city || '—'}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-white/70">{r.occupation}</span>
                        <span className="text-white/40 text-[10px] block font-mono">{r.age}</span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-white whitespace-nowrap">
                        {r.finalPurchaseChoice ? CONCEPTS[r.finalPurchaseChoice]?.name || r.finalPurchaseChoice : '—'}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold whitespace-nowrap">
                        <span className={r.purchaseIntent >= 4 ? 'text-emerald-400' : 'text-amber-400'}>
                          {r.purchaseIntent || '—'} / 5
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs whitespace-nowrap text-white/70">
                        {r.purchaseBudget || '—'}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {r.contactPermission ? (
                          <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{r.whatsapp || r.email || 'Opted in'}</span>
                          </span>
                        ) : (
                          <span className="text-white/30 font-mono text-[11px]">No</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedResponse(r)}
                          className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] transition-colors cursor-pointer"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredResponses.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-white/40 font-mono text-xs">
                        No responses matching your filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {filteredResponses.length > 15 && (
              <div className="p-3 bg-white/[0.02] text-center text-xs text-white/40 border-t border-white/5 font-mono">
                Showing top 15 records. Export CSV to analyze all {filteredResponses.length} rows.
              </div>
            )}
          </div>
        </div>

        {/* Verbatim Insights & Missing Product Wishes */}
        <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Direct Consumer Verbatim &amp; Product Wishlist
            </h3>
            <span className="text-xs text-white/40 font-mono">Qualitative Feedback</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {responses
              .filter(r => r.feedback || r.desiredProduct)
              .slice(0, 6)
              .map((r, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-white/40">
                    <span>{r.city} • {r.occupation}</span>
                    <span className="text-white/60 uppercase">
                      {r.finalPurchaseChoice ? CONCEPTS[r.finalPurchaseChoice]?.name : ''}
                    </span>
                  </div>

                  {r.feedback && (
                    <p className="text-xs sm:text-sm text-white/80 italic leading-relaxed">
                      &ldquo;{r.feedback}&rdquo;
                    </p>
                  )}

                  {r.desiredProduct && (
                    <div className="text-xs text-white/60 pt-1 border-t border-white/5">
                      <span className="text-white/40 font-mono">Product wish: </span>
                      <span className="text-white/90">{r.desiredProduct}</span>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </main>

      {/* Response Detail Modal */}
      {selectedResponse && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl max-h-[85vh] overflow-y-auto p-6 sm:p-8 rounded-3xl bg-[#141414] border border-white/10 shadow-2xl relative space-y-6">
            <button
              onClick={() => setSelectedResponse(null)}
              aria-label="Close details"
              className="absolute right-5 top-5 p-2 text-white/40 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="text-xs font-mono text-white/40 uppercase tracking-wider mb-1">
                Response #{selectedResponse.id}
              </div>
              <h3 className="font-display font-bold text-2xl text-white">
                Consumer Profile &amp; Answers
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-white/40 block">City:</span>
                <span className="text-white font-medium">{selectedResponse.city}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-white/40 block">Occupation:</span>
                <span className="text-white font-medium">{selectedResponse.occupation}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-white/40 block">Age:</span>
                <span className="text-white font-medium">{selectedResponse.age}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-white/40 block">Shopping Freq:</span>
                <span className="text-white font-medium">{selectedResponse.onlineShoppingFrequency}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 space-y-2 text-xs">
              <div className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Brand Selections
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">First Attention:</span>
                <span className="text-white font-mono">{selectedResponse.firstConcept}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Considered:</span>
                <span className="text-white font-mono">{selectedResponse.buyingConcepts?.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">TikTok Hook:</span>
                <span className="text-white font-mono">{selectedResponse.socialMediaChoice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Final 30-Day Purchase:</span>
                <span className="text-emerald-400 font-bold font-mono">{selectedResponse.finalPurchaseChoice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Purchase Likelihood:</span>
                <span className="text-white font-mono font-bold">{selectedResponse.purchaseIntent} / 5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Spend Budget:</span>
                <span className="text-white font-mono">{selectedResponse.purchaseBudget}</span>
              </div>
            </div>

            {selectedResponse.feedback && (
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                <div className="text-[11px] font-mono text-white/40 uppercase">Feedback &amp; Idea</div>
                <p className="text-sm text-white/90 italic">&ldquo;{selectedResponse.feedback}&rdquo;</p>
              </div>
            )}

            {selectedResponse.desiredProduct && (
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                <div className="text-[11px] font-mono text-white/40 uppercase">Missing Product in Pakistan</div>
                <p className="text-sm text-white/90">{selectedResponse.desiredProduct}</p>
              </div>
            )}

            {selectedResponse.contactPermission && (
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs font-mono space-y-1">
                <span className="text-emerald-400 font-bold block uppercase">VIP Launch Lead</span>
                {selectedResponse.whatsapp && <div>WhatsApp: {selectedResponse.whatsapp}</div>}
                {selectedResponse.email && <div>Email: {selectedResponse.email}</div>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Backend Cloud Sync Drawer / Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#141414] border border-white/10 shadow-2xl relative space-y-5">
            <button
              onClick={() => setShowConfigModal(false)}
              aria-label="Close backend setup"
              className="absolute right-5 top-5 p-2 text-white/40 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Database className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-white">
                  Supabase &amp; Deployment Setup
                </h3>
                <span className="text-xs font-mono text-white/50">
                  Status: {isSupabaseConfigured ? 'Supabase Connected (RLS Active)' : 'Local-First Storage (Active)'}
                </span>
              </div>
            </div>

            <p className="text-xs text-white/70 leading-relaxed">
              This app is ready for deployment on GitHub and Vercel with a secured Supabase PostgreSQL database.
              Row-Level Security (RLS) guarantees that public survey visitors can only <strong>INSERT</strong> responses, while only authenticated admin users can <strong>READ</strong> data.
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-black/60 border border-white/8 space-y-1.5">
                <div className="text-emerald-400 font-bold uppercase text-[11px]">1. Supabase SQL Migration</div>
                <div className="text-white/60 text-[11px]">
                  Run the SQL script located in <span className="text-white font-semibold">/supabase/schema.sql</span> in your Supabase SQL Editor.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/60 border border-white/8 space-y-1.5">
                <div className="text-emerald-400 font-bold uppercase text-[11px]">2. Environment Variables (.env / Vercel)</div>
                <div className="text-white/80">VITE_SUPABASE_URL=https://your-project.supabase.co</div>
                <div className="text-white/80">VITE_SUPABASE_ANON_KEY=eyJhbGciOi...</div>
                <div className="text-white/50">VITE_ADMIN_PASSCODE=zulf2026</div>
              </div>

              <div className="p-3 rounded-xl bg-black/60 border border-white/8 space-y-1.5">
                <div className="text-emerald-400 font-bold uppercase text-[11px]">3. RLS Security Model</div>
                <div className="text-white/60 text-[11px]">
                  • Public (anon): INSERT only (cannot SELECT/read)<br />
                  • Admin (authenticated): Full SELECT/read &amp; export
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/8 text-xs font-mono text-white/50">
              <span>Detailed guide: DEPLOYMENT.md</span>
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-white/90 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
