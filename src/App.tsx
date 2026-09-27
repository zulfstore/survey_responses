/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LandingScreen } from './components/LandingScreen';
import { IntroScreen } from './components/IntroScreen';
import { SurveyWizard } from './components/SurveyWizard';
import { CompletionScreen } from './components/CompletionScreen';
import { AdminDashboard } from './components/AdminDashboard';
import { SurveyResponse, ConceptId } from './types/survey';
import { getStoredResponses, clearDraft } from './services/storage';

export default function App() {
  const [view, setView] = useState<'landing' | 'intro' | 'survey' | 'complete'>('landing');
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [latestChoice, setLatestChoice] = useState<ConceptId | ''>('');

  // Load responses from storage on mount
  useEffect(() => {
    setResponses(getStoredResponses());
  }, []);

  const refreshResponses = () => {
    setResponses(getStoredResponses());
  };

  const handleStartSurvey = () => {
    setView('intro');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleIntroContinue = () => {
    setView('survey');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSurveyComplete = (newResponse: SurveyResponse) => {
    setLatestChoice(newResponse.finalPurchaseChoice || newResponse.firstConcept || 'ryven');
    refreshResponses();
    setView('complete');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestart = () => {
    clearDraft();
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5F3EE] flex flex-col font-sans selection:bg-[#F5F3EE] selection:text-[#0B0B0B]">
      {/* 3-Zone Header Contract */}
      <Header
        onOpenAdmin={() => setIsAdminOpen(prev => !prev)}
        onRestart={view !== 'landing' ? handleRestart : undefined}
        showAdminButton={true}
        isAdminOpen={isAdminOpen}
        sectionName={view === 'survey' ? 'SURVEY LAB' : view === 'complete' ? 'COMPLETED' : undefined}
      />

      {/* Main Flow Views */}
      <div className="flex-1 flex flex-col">
        {view === 'landing' && (
          <LandingScreen
            onStart={handleStartSurvey}
            onExploreAdmin={() => setIsAdminOpen(true)}
          />
        )}

        {view === 'intro' && (
          <IntroScreen
            onContinue={handleIntroContinue}
            onBack={() => setView('landing')}
          />
        )}

        {view === 'survey' && (
          <SurveyWizard
            onComplete={handleSurveyComplete}
            onExit={handleRestart}
          />
        )}

        {view === 'complete' && (
          <CompletionScreen
            finalChoice={latestChoice}
            onViewInsights={() => setIsAdminOpen(true)}
            onRestart={handleRestart}
          />
        )}
      </div>

      {/* Admin Dashboard Fullscreen Overlay */}
      {isAdminOpen && (
        <AdminDashboard
          responses={responses}
          onRefreshResponses={refreshResponses}
          onClose={() => setIsAdminOpen(false)}
        />
      )}
    </div>
  );
}
