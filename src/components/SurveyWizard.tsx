import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ConceptId, SurveyResponse } from '../types/survey';
import { CONCEPTS, CONCEPTS_LIST, OCCUPATION_OPTIONS, AGE_OPTIONS, ONLINE_SHOPPING_FREQ } from '../data/concepts';
import { QuestionContainer } from './QuestionContainer';
import { ProgressBar } from './ProgressBar';
import { OptionCard } from './OptionCard';
import { ScaleRating } from './ScaleRating';
import { CitySelector } from './CitySelector';
import { ConceptCard } from './ConceptCard';
import { SocialVideoCard } from './SocialVideoCard';
import { saveDraft, getStoredDraft, clearDraft, saveResponse } from '../services/storage';
import { Check, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

interface SurveyWizardProps {
  onComplete: (response: SurveyResponse) => void;
  onExit: () => void;
}

export const SurveyWizard: React.FC<SurveyWizardProps> = ({ onComplete, onExit }) => {
  // Wizard step counter and animation direction
  const [step, setStep] = useState<number>(1);
  const [direction, setDirection] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Survey state initialized from local draft if available
  const [formData, setFormData] = useState<Partial<SurveyResponse>>(() => {
    const draft = getStoredDraft();
    return (
      draft || {
        id: `zbl-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: new Date().toISOString(),
        occupation: '',
        age: '',
        city: '',
        onlineShoppingFrequency: '',
        firstConcept: '',
        buyingConcepts: [],
        tiktokConcept: '',
        firstPurchaseConcept: '',
        onlinePriorityDrivers: [],
        premiumWillingness: '',
        socialMediaChoice: '',
        socialMediaFollowChoice: [],
        finalPurchaseChoice: '',
        purchaseBudget: '',
        purchaseIntent: 4,
        feedback: '',
        desiredProduct: '',
        contactPermission: false,
        whatsapp: '',
        email: '',
      }
    );
  });

  // Autosave draft on form change
  useEffect(() => {
    saveDraft(formData);
  }, [formData]);

  // Determine active deep-dive concept based on user's choices
  const deepDiveConcept: ConceptId =
    formData.firstPurchaseConcept ||
    formData.firstConcept ||
    (formData.buyingConcepts && formData.buyingConcepts.length > 0
      ? formData.buyingConcepts[0]
      : 'ryven');

  // Step definitions:
  // Step 1: Occupation
  // Step 2: Age
  // Step 3: City
  // Step 4: Online shopping frequency
  // Step 5: Concept Discovery Overview
  // Step 6: First Attention (Single select)
  // Step 7: Consider Buying (Multi select)
  // Step 8: TikTok / IG Excitement (Single select)
  // Step 9: Launch ONE tomorrow (Single select)
  // Step 10: Concept Deep-Dive Part 1 (Interest & Products)
  // Step 11: Concept Deep-Dive Part 2 (Price & Repurchase / Factors)
  // Step 12: Price Sensitivity & Online Buying Priorities
  // Step 13: Social Media Stop-Scroll Content Test
  // Step 14: Real Purchase Intent (30-day choice, budget, 1-5 likelihood)
  // Step 15: Open Feedback & Missing Product in Pakistan
  // Step 16: Launch VIP Opt-in & Finish
  const TOTAL_STEPS = 16;

  const clearError = () => setErrorMessage('');

  const handleNext = () => {
    clearError();

    // Validation checks for current step
    switch (step) {
      case 1:
        if (!formData.occupation) {
          setErrorMessage('Just one quick choice before we continue.');
          return;
        }
        break;
      case 2:
        if (!formData.age) {
          setErrorMessage('Please select your age bracket.');
          return;
        }
        break;
      case 3:
        if (!formData.city) {
          setErrorMessage('Please select or enter your city.');
          return;
        }
        break;
      case 4:
        if (!formData.onlineShoppingFrequency) {
          setErrorMessage('Please choose your online shopping frequency.');
          return;
        }
        break;
      case 5:
        // Showcase overview step, simply proceed
        break;
      case 6:
        if (!formData.firstConcept) {
          setErrorMessage('Please select the concept that caught your attention first.');
          return;
        }
        break;
      case 7:
        if (!formData.buyingConcepts || formData.buyingConcepts.length === 0) {
          setErrorMessage('Please pick at least one concept you would consider buying.');
          return;
        }
        break;
      case 8:
        if (!formData.tiktokConcept) {
          setErrorMessage('Please select the concept you’d be most excited to see on social media.');
          return;
        }
        break;
      case 9:
        if (!formData.firstPurchaseConcept) {
          setErrorMessage('Please choose which one you would try first if launched tomorrow.');
          return;
        }
        break;
      case 10:
        // Deep dive part 1
        break;
      case 11:
        // Deep dive part 2
        break;
      case 12:
        if (!formData.premiumWillingness) {
          setErrorMessage('Please indicate if you would pay slightly more for premium quality.');
          return;
        }
        break;
      case 13:
        if (!formData.socialMediaChoice) {
          setErrorMessage('Please select which video would make you stop scrolling.');
          return;
        }
        break;
      case 14:
        if (!formData.finalPurchaseChoice) {
          setErrorMessage('Please pick which brand you would realistically purchase from within 30 days.');
          return;
        }
        if (!formData.purchaseBudget) {
          setErrorMessage('Please select your realistic first purchase budget.');
          return;
        }
        break;
      case 15:
        // Open feedback is optional but recommended
        break;
      case 16:
        // Final submission
        finalizeSubmission();
        return;
    }

    if (step < TOTAL_STEPS) {
      setDirection(1);
      setStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    clearError();
    if (step === 1) {
      onExit();
    } else {
      setDirection(-1);
      setStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const finalizeSubmission = () => {
    const finalResponse: SurveyResponse = {
      id: formData.id || `zbl-${Date.now()}`,
      timestamp: new Date().toISOString(),
      occupation: formData.occupation || 'Professional',
      age: formData.age || '25–30',
      city: formData.city || 'Karachi',
      onlineShoppingFrequency: formData.onlineShoppingFrequency || 'Often',
      firstConcept: formData.firstConcept || 'ryven',
      buyingConcepts: formData.buyingConcepts?.length ? formData.buyingConcepts : ['ryven'],
      tiktokConcept: formData.tiktokConcept || 'ryven',
      firstPurchaseConcept: formData.firstPurchaseConcept || 'ryven',

      // Deep dive specifics
      ryvenInterest: formData.ryvenInterest || (deepDiveConcept === 'ryven' ? 4 : undefined),
      ryvenProducts: formData.ryvenProducts || [],
      ryvenPrice: formData.ryvenPrice || 'PKR 1,000–1,499',
      ryvenRepurchase: formData.ryvenRepurchase || 'Every 2 months',
      ryvenPakistaniWillingness: formData.ryvenPakistaniWillingness || 'Probably',
      ryvenDrivers: formData.ryvenDrivers || ['Quality', 'Reviews'],

      karvoInterest: formData.karvoInterest || (deepDiveConcept === 'karvo' ? 4 : undefined),
      karvoProducts: formData.karvoProducts || [],
      karvoSmallPrice: formData.karvoSmallPrice || 'PKR 1,000–1,499',
      karvoLampPrice: formData.karvoLampPrice || 'PKR 2,500–3,499',
      karvoDrivers: formData.karvoDrivers || ['Design', 'Wood Quality'],

      carCareInterest: formData.carCareInterest || (deepDiveConcept === 'carcare' ? 4 : undefined),
      carCareProducts: formData.carCareProducts || [],
      carCareBuyFirst: formData.carCareBuyFirst || 'Interior Cleaner',
      carCarePrice: formData.carCarePrice || 'PKR 1,500–2,499',
      carCareDrivers: formData.carCareDrivers || ['Quality', 'Demonstration Videos'],

      packagingBusinessStatus: formData.packagingBusinessStatus || 'No',
      packagingChannels: formData.packagingChannels || [],
      packagingProducts: formData.packagingProducts || [],
      packagingBundle: formData.packagingBundle || 'Probably',
      packagingBudget: formData.packagingBudget || 'PKR 3,000–4,999',
      packagingRepeat: formData.packagingRepeat || 'Every 2–3 months',

      problemSolverFrequency: formData.problemSolverFrequency || 'Sometimes',
      problemSolverCategory: formData.problemSolverCategory || 'Desk',
      problemSolverProblem: formData.problemSolverProblem || '',

      onlinePriorityDrivers: formData.onlinePriorityDrivers?.length
        ? formData.onlinePriorityDrivers
        : ['Quality', 'Reviews', 'Price'],
      premiumWillingness: formData.premiumWillingness || 'Probably',

      socialMediaChoice: formData.socialMediaChoice || 'ryven',
      socialMediaFollowChoice: formData.socialMediaFollowChoice?.length
        ? formData.socialMediaFollowChoice
        : [formData.socialMediaChoice || 'ryven'],

      finalPurchaseChoice: formData.finalPurchaseChoice || formData.firstPurchaseConcept || 'ryven',
      purchaseBudget: formData.purchaseBudget || 'PKR 2,000–2,999',
      purchaseIntent: formData.purchaseIntent || 4,

      feedback: formData.feedback || '',
      desiredProduct: formData.desiredProduct || '',

      contactPermission: !!formData.contactPermission,
      whatsapp: formData.whatsapp || '',
      email: formData.email || '',
    };

    saveResponse(finalResponse);
    clearDraft();
    onComplete(finalResponse);
  };

  // Helper toggle for multi-select arrays
  const toggleArrayItem = <T extends string>(field: keyof SurveyResponse, item: T) => {
    clearError();
    const current = (formData[field] as T[]) || [];
    const updated = current.includes(item)
      ? current.filter(x => x !== item)
      : [...current, item];
    setFormData(prev => ({ ...prev, [field]: updated }));
  };

  // ================= STEP RENDERERS ================= //

  // Step 1: Occupation
  const renderStep1 = () => (
    <QuestionContainer
      sectionLabel="01 PROFILE"
      stepNumber={1}
      totalSteps={TOTAL_STEPS}
      title="What best describes you?"
      subtitle="Help us understand the perspective behind your recommendations."
      errorMessage={errorMessage}
      onNext={handleNext}
      onBack={handleBack}
    >
      <div className="space-y-2.5">
        {OCCUPATION_OPTIONS.map(opt => (
          <OptionCard
            key={opt}
            label={opt}
            isSelected={formData.occupation === opt}
            onSelect={() => {
              clearError();
              setFormData(p => ({ ...p, occupation: opt }));
            }}
          />
        ))}
      </div>
    </QuestionContainer>
  );

  // Step 2: Age
  const renderStep2 = () => (
    <QuestionContainer
      sectionLabel="01 PROFILE"
      stepNumber={2}
      totalSteps={TOTAL_STEPS}
      title="What's your age?"
      subtitle="Consumer preferences shift across generations."
      errorMessage={errorMessage}
      onNext={handleNext}
      onBack={handleBack}
    >
      <div className="grid grid-cols-2 gap-2.5">
        {AGE_OPTIONS.map(opt => (
          <OptionCard
            key={opt}
            label={opt}
            isSelected={formData.age === opt}
            onSelect={() => {
              clearError();
              setFormData(p => ({ ...p, age: opt }));
            }}
          />
        ))}
      </div>
    </QuestionContainer>
  );

  // Step 3: City
  const renderStep3 = () => (
    <QuestionContainer
      sectionLabel="01 PROFILE"
      stepNumber={3}
      totalSteps={TOTAL_STEPS}
      title="Where are you based?"
      subtitle="We are mapping city-by-city logistics across Pakistan and abroad."
      errorMessage={errorMessage}
      onNext={handleNext}
      onBack={handleBack}
    >
      <CitySelector
        value={formData.city || ''}
        onChange={city => {
          clearError();
          setFormData(p => ({ ...p, city }));
        }}
      />
    </QuestionContainer>
  );

  // Step 4: Online Shopping Frequency
  const renderStep4 = () => (
    <QuestionContainer
      sectionLabel="01 PROFILE"
      stepNumber={4}
      totalSteps={TOTAL_STEPS}
      title="How often do you shop online?"
      subtitle="From Daraz, Instagram, WhatsApp stores, or direct brand websites."
      errorMessage={errorMessage}
      onNext={handleNext}
      onBack={handleBack}
    >
      <div className="space-y-2.5">
        {ONLINE_SHOPPING_FREQ.map(opt => (
          <OptionCard
            key={opt}
            label={opt}
            isSelected={formData.onlineShoppingFrequency === opt}
            onSelect={() => {
              clearError();
              setFormData(p => ({ ...p, onlineShoppingFrequency: opt }));
            }}
          />
        ))}
      </div>
    </QuestionContainer>
  );

  // Step 5: Concept Discovery Overview
  const renderStep5 = () => (
    <QuestionContainer
      sectionLabel="02 EXPLORE"
      stepNumber={5}
      totalSteps={TOTAL_STEPS}
      title="Now comes the interesting part."
      subtitle="We've developed 5 brand concepts. Take a moment to review them before voting."
      helperText="Tap through to inspect what each brand stands for."
      nextLabel="LET'S COMPARE →"
      onNext={handleNext}
      onBack={handleBack}
    >
      <div className="space-y-3.5 max-h-[62vh] overflow-y-auto pr-1">
        {CONCEPTS_LIST.map(concept => (
          <ConceptCard
            key={concept.id}
            concept={concept}
            selectionType="none"
            showDetailsButton={true}
          />
        ))}
      </div>
    </QuestionContainer>
  );

  // Step 6: First Concept Attention (Single selection)
  const renderStep6 = () => (
    <QuestionContainer
      sectionLabel="03 COMPARE"
      stepNumber={6}
      totalSteps={TOTAL_STEPS}
      title="Which concept caught your attention first?"
      subtitle="Your initial gut reaction is the strongest indicator of organic brand pull."
      errorMessage={errorMessage}
      onNext={handleNext}
      onBack={handleBack}
    >
      <div className="space-y-3">
        {CONCEPTS_LIST.map(concept => (
          <ConceptCard
            key={concept.id}
            concept={concept}
            isSelected={formData.firstConcept === concept.id}
            onSelect={() => {
              clearError();
              setFormData(p => ({ ...p, firstConcept: concept.id }));
            }}
            selectionType="radio"
            compact={true}
          />
        ))}
      </div>
    </QuestionContainer>
  );

  // Step 7: Consider Buying (Multi select)
  const renderStep7 = () => (
    <QuestionContainer
      sectionLabel="03 COMPARE"
      stepNumber={7}
      totalSteps={TOTAL_STEPS}
      title="Which ones would you actually consider buying?"
      subtitle="Select every brand you would genuinely spend your own money on."
      helperText="Multiple selections allowed"
      errorMessage={errorMessage}
      onNext={handleNext}
      onBack={handleBack}
    >
      <div className="space-y-3">
        {CONCEPTS_LIST.map(concept => {
          const isSelected = formData.buyingConcepts?.includes(concept.id) || false;
          return (
            <ConceptCard
              key={concept.id}
              concept={concept}
              isSelected={isSelected}
              onSelect={() => toggleArrayItem<ConceptId>('buyingConcepts', concept.id)}
              selectionType="checkbox"
              compact={true}
            />
          );
        })}
      </div>
    </QuestionContainer>
  );

  // Step 8: TikTok/Instagram Excitement (Single select)
  const renderStep8 = () => (
    <QuestionContainer
      sectionLabel="03 COMPARE"
      stepNumber={8}
      totalSteps={TOTAL_STEPS}
      title="Which one would you be most excited to see on TikTok or Instagram?"
      subtitle="Think about visual appeal, transformations, and unboxing content."
      errorMessage={errorMessage}
      onNext={handleNext}
      onBack={handleBack}
    >
      <div className="space-y-3">
        {CONCEPTS_LIST.map(concept => (
          <ConceptCard
            key={concept.id}
            concept={concept}
            isSelected={formData.tiktokConcept === concept.id}
            onSelect={() => {
              clearError();
              setFormData(p => ({ ...p, tiktokConcept: concept.id }));
            }}
            selectionType="radio"
            compact={true}
          />
        ))}
      </div>
    </QuestionContainer>
  );

  // Step 9: Launch ONE tomorrow (Single select)
  const renderStep9 = () => (
    <QuestionContainer
      sectionLabel="03 COMPARE"
      stepNumber={9}
      totalSteps={TOTAL_STEPS}
      title="If we launched ONE tomorrow, which would you try first?"
      subtitle="If only one brand could open its store tomorrow morning, which gets your vote?"
      errorMessage={errorMessage}
      onNext={handleNext}
      onBack={handleBack}
    >
      <div className="space-y-3">
        {CONCEPTS_LIST.map(concept => (
          <ConceptCard
            key={concept.id}
            concept={concept}
            isSelected={formData.firstPurchaseConcept === concept.id}
            onSelect={() => {
              clearError();
              setFormData(p => ({ ...p, firstPurchaseConcept: concept.id }));
            }}
            selectionType="radio"
            compact={true}
          />
        ))}
      </div>
    </QuestionContainer>
  );

  // Step 10: Deep-Dive Part 1 (Interest rating & Product selection)
  const renderStep10 = () => {
    const concept = CONCEPTS[deepDiveConcept];

    return (
      <QuestionContainer
        sectionLabel="04 DEEP DIVE"
        stepNumber={10}
        totalSteps={TOTAL_STEPS}
        title={`Evaluating: ${concept.name}`}
        subtitle={`Because you showed strong interest in ${concept.category}, let's dial in the details.`}
        errorMessage={errorMessage}
        onNext={handleNext}
        onBack={handleBack}
      >
        <div className="space-y-6">
          {/* Interest scale 1-5 */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-white/50 block mb-2.5">
              How interested are you in this category? (1–5)
            </label>
            <ScaleRating
              value={
                deepDiveConcept === 'ryven'
                  ? formData.ryvenInterest || 4
                  : deepDiveConcept === 'karvo'
                  ? formData.karvoInterest || 4
                  : deepDiveConcept === 'carcare'
                  ? formData.carCareInterest || 4
                  : 4
              }
              onChange={val => {
                clearError();
                if (deepDiveConcept === 'ryven') setFormData(p => ({ ...p, ryvenInterest: val }));
                else if (deepDiveConcept === 'karvo') setFormData(p => ({ ...p, karvoInterest: val }));
                else if (deepDiveConcept === 'carcare') setFormData(p => ({ ...p, carCareInterest: val }));
              }}
            />
          </div>

          {/* Product checklist */}
          <div className="pt-2 border-t border-white/8">
            <label className="text-xs font-mono uppercase tracking-wider text-white/50 block mb-2.5">
              Which specific products would you want to see?
            </label>
            <div className="space-y-2">
              {concept.potentialProducts.map(prod => {
                const isSelected =
                  deepDiveConcept === 'ryven'
                    ? formData.ryvenProducts?.includes(prod)
                    : deepDiveConcept === 'karvo'
                    ? formData.karvoProducts?.includes(prod)
                    : deepDiveConcept === 'carcare'
                    ? formData.carCareProducts?.includes(prod)
                    : deepDiveConcept === 'packaging'
                    ? formData.packagingProducts?.includes(prod)
                    : false;

                return (
                  <OptionCard
                    key={prod}
                    label={prod}
                    isSelected={!!isSelected}
                    type="checkbox"
                    onSelect={() => {
                      clearError();
                      if (deepDiveConcept === 'ryven') toggleArrayItem('ryvenProducts', prod);
                      else if (deepDiveConcept === 'karvo') toggleArrayItem('karvoProducts', prod);
                      else if (deepDiveConcept === 'carcare') toggleArrayItem('carCareProducts', prod);
                      else if (deepDiveConcept === 'packaging') toggleArrayItem('packagingProducts', prod);
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </QuestionContainer>
    );
  };

  // Step 11: Deep-Dive Part 2 (Price & Repurchase / Trust Drivers)
  const renderStep11 = () => {
    const concept = CONCEPTS[deepDiveConcept];

    return (
      <QuestionContainer
        sectionLabel="04 DEEP DIVE"
        stepNumber={11}
        totalSteps={TOTAL_STEPS}
        title={`${concept.name}: Pricing & Trust`}
        subtitle="What makes a product worth your money and keeps you coming back?"
        errorMessage={errorMessage}
        onNext={handleNext}
        onBack={handleBack}
      >
        <div className="space-y-6">
          {/* Ryven Specific Pricing & Repurchase */}
          {deepDiveConcept === 'ryven' && (
            <>
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-white/50 block mb-2">
                  What price feels reasonable for ONE quality grooming product?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {['Under PKR 700', 'PKR 700–999', 'PKR 1,000–1,499', 'PKR 1,500–1,999', 'PKR 2,000+'].map(pr => (
                    <OptionCard
                      key={pr}
                      label={pr}
                      isSelected={formData.ryvenPrice === pr}
                      onSelect={() => setFormData(p => ({ ...p, ryvenPrice: pr }))}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/8">
                <label className="text-xs font-mono uppercase tracking-wider text-white/50 block mb-2">
                  How often would you realistically repurchase?
                </label>
                <div className="space-y-2">
                  {['Monthly', 'Every 2 months', 'Every 3–4 months', 'Twice a year', 'Only when finished'].map(f => (
                    <OptionCard
                      key={f}
                      label={f}
                      isSelected={formData.ryvenRepurchase === f}
                      onSelect={() => setFormData(p => ({ ...p, ryvenRepurchase: f }))}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Kārvo Specific Pricing */}
          {deepDiveConcept === 'karvo' && (
            <>
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-white/50 block mb-2">
                  What would you spend on a small wooden product (tissue box, organizer)?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {['Under PKR 700', 'PKR 700–999', 'PKR 1,000–1,499', 'PKR 1,500–2,499', 'PKR 2,500+'].map(pr => (
                    <OptionCard
                      key={pr}
                      label={pr}
                      isSelected={formData.karvoSmallPrice === pr}
                      onSelect={() => setFormData(p => ({ ...p, karvoSmallPrice: pr }))}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/8">
                <label className="text-xs font-mono uppercase tracking-wider text-white/50 block mb-2">
                  What would you spend on a decorative ambient lamp or fanoos?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {['Under PKR 1,500', 'PKR 1,500–2,499', 'PKR 2,500–3,499', 'PKR 3,500–4,999', 'PKR 5,000+'].map(pr => (
                    <OptionCard
                      key={pr}
                      label={pr}
                      isSelected={formData.karvoLampPrice === pr}
                      onSelect={() => setFormData(p => ({ ...p, karvoLampPrice: pr }))}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Car Care Specific */}
          {deepDiveConcept === 'carcare' && (
            <>
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-white/50 block mb-2">
                  What price feels reasonable for a starter car-care detailing kit?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {['Under PKR 1,000', 'PKR 1,000–1,499', 'PKR 1,500–2,499', 'PKR 2,500–3,499', 'PKR 3,500+'].map(pr => (
                    <OptionCard
                      key={pr}
                      label={pr}
                      isSelected={formData.carCarePrice === pr}
                      onSelect={() => setFormData(p => ({ ...p, carCarePrice: pr }))}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/8">
                <label className="text-xs font-mono uppercase tracking-wider text-white/50 block mb-2">
                  What makes you trust a car-care brand?
                </label>
                <div className="space-y-2">
                  {['Quality & Ingredients', 'Demonstration / Transformation Videos', 'Customer Reviews', 'Packaging & Aesthetics'].map(tr => (
                    <OptionCard
                      key={tr}
                      label={tr}
                      isSelected={formData.carCareDrivers?.includes(tr) || false}
                      type="checkbox"
                      onSelect={() => toggleArrayItem('carCareDrivers', tr)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Packaging Specific */}
          {deepDiveConcept === 'packaging' && (
            <>
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-white/50 block mb-2">
                  Do you currently sell products online?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Yes', 'No', 'Planning to start'].map(st => (
                    <OptionCard
                      key={st}
                      label={st}
                      isSelected={formData.packagingBusinessStatus === st}
                      onSelect={() => setFormData(p => ({ ...p, packagingBusinessStatus: st }))}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/8">
                <label className="text-xs font-mono uppercase tracking-wider text-white/50 block mb-2">
                  What would you spend on your first packaging starter order?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {['Under PKR 1,500', 'PKR 1,500–2,999', 'PKR 3,000–4,999', 'PKR 5,000–9,999', 'PKR 10,000+'].map(b => (
                    <OptionCard
                      key={b}
                      label={b}
                      isSelected={formData.packagingBudget === b}
                      onSelect={() => setFormData(p => ({ ...p, packagingBudget: b }))}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Problem Solvers Specific */}
          {deepDiveConcept === 'problemsolvers' && (
            <>
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-white/50 block mb-2">
                  Which category interests you most?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Home & Living', 'Desk & Workspace', 'Kitchen Utility', 'Travel & Carry', 'Tech Accessories'].map(cat => (
                    <OptionCard
                      key={cat}
                      label={cat}
                      isSelected={formData.problemSolverCategory === cat}
                      onSelect={() => setFormData(p => ({ ...p, problemSolverCategory: cat }))}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/8">
                <label className="text-xs font-mono uppercase tracking-wider text-white/50 block mb-2">
                  What type of product would you love someone to invent?
                </label>
                <textarea
                  rows={3}
                  value={formData.problemSolverProblem || ''}
                  onChange={e => setFormData(p => ({ ...p, problemSolverProblem: e.target.value }))}
                  placeholder="Tell us one annoying everyday problem you deal with..."
                  className="w-full bg-[#141414] border border-white/10 rounded-xl p-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/40"
                />
              </div>
            </>
          )}
        </div>
      </QuestionContainer>
    );
  };

  // Step 12: Price Sensitivity & Online Buying Priorities
  const renderStep12 = () => (
    <QuestionContainer
      sectionLabel="04 DECIDE"
      stepNumber={12}
      totalSteps={TOTAL_STEPS}
      title="When buying a new brand online, what matters most?"
      subtitle="Select up to 3 factors that influence your purchase decision."
      errorMessage={errorMessage}
      onNext={handleNext}
      onBack={handleBack}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-2">
          {[
            'Price & Value',
            'Material / Product Quality',
            'Genuine Customer Reviews',
            'Minimalist Design',
            'Fast Delivery Speed',
            'Easy Return Policy',
            'Unboxing & Packaging',
            'Brand Authenticity / Trust',
          ].map(factor => {
            const isSelected = formData.onlinePriorityDrivers?.includes(factor) || false;
            return (
              <OptionCard
                key={factor}
                label={factor}
                isSelected={isSelected}
                type="checkbox"
                onSelect={() => toggleArrayItem('onlinePriorityDrivers', factor)}
              />
            );
          })}
        </div>

        <div className="pt-4 border-t border-white/8">
          <label className="text-xs font-mono uppercase tracking-wider text-white/50 block mb-2.5">
            Would you pay slightly more for a product that looks and feels premium?
          </label>
          <div className="space-y-2">
            {['Definitely', 'Probably', 'Maybe', 'Probably not', 'No'].map(ans => (
              <OptionCard
                key={ans}
                label={ans}
                isSelected={formData.premiumWillingness === ans}
                onSelect={() => {
                  clearError();
                  setFormData(p => ({ ...p, premiumWillingness: ans }));
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </QuestionContainer>
  );

  // Step 13: Social Media Content Test
  const renderStep13 = () => (
    <QuestionContainer
      sectionLabel="04 DECIDE"
      stepNumber={13}
      totalSteps={TOTAL_STEPS}
      title="Now imagine you're scrolling TikTok or Instagram..."
      subtitle="Which video content hook would stop you from scrolling?"
      errorMessage={errorMessage}
      onNext={handleNext}
      onBack={handleBack}
    >
      <div className="space-y-3">
        {(['ryven', 'karvo', 'carcare', 'packaging', 'problemsolvers'] as ConceptId[]).map(cId => (
          <SocialVideoCard
            key={cId}
            conceptId={cId}
            isSelected={formData.socialMediaChoice === cId}
            onSelect={() => {
              clearError();
              setFormData(p => ({ ...p, socialMediaChoice: cId }));
            }}
            type="radio"
          />
        ))}
      </div>
    </QuestionContainer>
  );

  // Step 14: Real Purchase Intent
  const renderStep14 = () => (
    <QuestionContainer
      sectionLabel="04 DECIDE"
      stepNumber={14}
      totalSteps={TOTAL_STEPS}
      title="Forget what sounds interesting. What would you ACTUALLY buy?"
      subtitle="If one of these brands launched within the next 30 days, which ONE are you most likely to purchase from?"
      errorMessage={errorMessage}
      onNext={handleNext}
      onBack={handleBack}
    >
      <div className="space-y-6">
        {/* Brand Selection */}
        <div className="space-y-2.5">
          {CONCEPTS_LIST.map(concept => (
            <OptionCard
              key={concept.id}
              label={concept.name}
              sublabel={concept.tagline}
              isSelected={formData.finalPurchaseChoice === concept.id}
              onSelect={() => {
                clearError();
                setFormData(p => ({ ...p, finalPurchaseChoice: concept.id }));
              }}
            />
          ))}
        </div>

        {/* Realistic Spend */}
        <div className="pt-4 border-t border-white/8">
          <label className="text-xs font-mono uppercase tracking-wider text-white/50 block mb-2.5">
            How much would you realistically spend on your first order?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              'Under PKR 1,000',
              'PKR 1,000–1,999',
              'PKR 2,000–2,999',
              'PKR 3,000–4,999',
              'PKR 5,000+',
            ].map(budget => (
              <OptionCard
                key={budget}
                label={budget}
                isSelected={formData.purchaseBudget === budget}
                onSelect={() => {
                  clearError();
                  setFormData(p => ({ ...p, purchaseBudget: budget }));
                }}
              />
            ))}
          </div>
        </div>

        {/* Purchase Likelihood */}
        <div className="pt-4 border-t border-white/8">
          <label className="text-xs font-mono uppercase tracking-wider text-white/50 block mb-2.5">
            How likely are you to actually purchase? (1–5)
          </label>
          <ScaleRating
            value={formData.purchaseIntent || 4}
            labels={{
              1: 'Just curious',
              2: 'Probably not',
              3: 'Maybe',
              4: 'Probably',
              5: 'Very likely',
            }}
            onChange={val => {
              clearError();
              setFormData(p => ({ ...p, purchaseIntent: val }));
            }}
          />
        </div>
      </div>
    </QuestionContainer>
  );

  // Step 15: Open Feedback & Innovation Wish
  const renderStep15 = () => (
    <QuestionContainer
      sectionLabel="05 FINISH"
      stepNumber={15}
      totalSteps={TOTAL_STEPS}
      title="Shape the Final Brand"
      subtitle="Direct input into ZULF's brand strategy and product pipeline."
      nextLabel="CONTINUE TO VIP ACCESS →"
      onNext={handleNext}
      onBack={handleBack}
    >
      <div className="space-y-5">
        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-white/50 block mb-2">
            If ZULF launched ONE new brand, what would you want it to be?
          </label>
          <textarea
            rows={3}
            value={formData.feedback || ''}
            onChange={e => setFormData(p => ({ ...p, feedback: e.target.value }))}
            placeholder="Share your raw thoughts, wishlist, or vision..."
            className="w-full bg-[#141414] border border-white/10 rounded-xl p-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/40"
          />
        </div>

        <div className="pt-3 border-t border-white/8">
          <label className="text-xs font-mono uppercase tracking-wider text-white/50 block mb-2">
            What&apos;s one product you wish was easier to find in Pakistan?
          </label>
          <textarea
            rows={3}
            value={formData.desiredProduct || ''}
            onChange={e => setFormData(p => ({ ...p, desiredProduct: e.target.value }))}
            placeholder="e.g. Minimalist cable organizers, non-sticky hair clay, aesthetic coffee bar props..."
            className="w-full bg-[#141414] border border-white/10 rounded-xl p-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/40"
          />
        </div>
      </div>
    </QuestionContainer>
  );

  // Step 16: Launch VIP Interest & Finish
  const renderStep16 = () => (
    <QuestionContainer
      sectionLabel="05 FINISH"
      stepNumber={16}
      totalSteps={TOTAL_STEPS}
      title="Would you like to know when the winning brand launches?"
      subtitle="Get exclusive early-access pricing and prototype invitations."
      nextLabel="SUBMIT MY ANSWERS"
      onNext={handleNext}
      onBack={handleBack}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <OptionCard
            label="YES, NOTIFY ME"
            sublabel="VIP launch access"
            isSelected={!!formData.contactPermission}
            onSelect={() => setFormData(p => ({ ...p, contactPermission: true }))}
          />
          <OptionCard
            label="NO, THANKS"
            sublabel="Anonymous feedback"
            isSelected={formData.contactPermission === false}
            onSelect={() => setFormData(p => ({ ...p, contactPermission: false }))}
          />
        </div>

        {formData.contactPermission && (
          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-4">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-white/50 block mb-1.5">
                WhatsApp Number (Preferred for quick launch alerts)
              </label>
              <input
                type="tel"
                value={formData.whatsapp || ''}
                onChange={e => setFormData(p => ({ ...p, whatsapp: e.target.value }))}
                placeholder="+92 300 1234567"
                className="w-full bg-[#141414] border border-white/10 rounded-xl px-3.5 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/40 min-h-[48px]"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-white/50 block mb-1.5">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                placeholder="name@example.com"
                className="w-full bg-[#141414] border border-white/10 rounded-xl px-3.5 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/40 min-h-[48px]"
              />
            </div>

            <div className="flex items-start gap-2 pt-2 text-xs text-white/40 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Your contact information will only be used for launch updates if you choose to provide it. No spam, ever.
              </span>
            </div>
          </div>
        )}
      </div>
    </QuestionContainer>
  );

  const getSectionName = (currentStep: number) => {
    if (currentStep <= 4) return '01 PROFILE';
    if (currentStep === 5) return '02 EXPLORE';
    if (currentStep <= 9) return '03 COMPARE';
    if (currentStep <= 14) return '04 DECIDE';
    return '05 FINISH';
  };

  const stepVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      y: dir >= 0 ? 18 : -18,
    }),
    center: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.28,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      y: dir >= 0 ? -14 : 14,
      transition: {
        duration: 0.18,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
  };

  const renderCurrentStepContent = () => {
    switch (step) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      case 6:
        return renderStep6();
      case 7:
        return renderStep7();
      case 8:
        return renderStep8();
      case 9:
        return renderStep9();
      case 10:
        return renderStep10();
      case 11:
        return renderStep11();
      case 12:
        return renderStep12();
      case 13:
        return renderStep13();
      case 14:
        return renderStep14();
      case 15:
        return renderStep15();
      case 16:
        return renderStep16();
      default:
        return renderStep1();
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-start relative">
      {/* Sticky Progress Indicator */}
      <div className="sticky top-14 z-20 bg-[#0B0B0B]/90 backdrop-blur-md border-b border-white/5 pb-1">
        <ProgressBar
          currentStep={step}
          totalSteps={TOTAL_STEPS}
          sectionName={getSectionName(step)}
        />
      </div>

      {/* Animated Question Step View */}
      <div className="flex-1 w-full flex flex-col relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={step}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full flex-1 flex flex-col"
          >
            {renderCurrentStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
