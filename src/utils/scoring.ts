import { ConceptId, ConceptScore, SurveyResponse, ValidationSignalLevel } from '../types/survey';
import { CONCEPTS } from '../data/concepts';

export function calculateConceptScore(
  conceptId: ConceptId,
  responses: SurveyResponse[]
): ConceptScore {
  const concept = CONCEPTS[conceptId];
  if (!concept) {
    throw new Error(`Unknown concept id: ${conceptId}`);
  }

  if (responses.length === 0) {
    return {
      conceptId,
      name: concept.name,
      category: concept.category,
      demandScore: 0,
      priceAcceptanceScore: 0,
      purchaseIntentScore: 0,
      repeatPotentialScore: 0,
      overallAppealScore: 0,
      totalSignalScore: 0,
      signalLevel: 'LOW VALIDATION SIGNAL',
      firstAttentionCount: 0,
      consideredCount: 0,
      finalChoiceCount: 0,
      tiktokInterestCount: 0,
      avgInterestRating: 0,
    };
  }

  const total = responses.length;

  // 1. Demand / Interest (25% Weight)
  // Measured by: First attention pick (weight 40%), considered buying pick (weight 30%), deep-dive rating if rated (weight 30%)
  const firstAttentionCount = responses.filter(r => r.firstConcept === conceptId).length;
  const consideredCount = responses.filter(r => r.buyingConcepts?.includes(conceptId)).length;
  
  // Extract concept-specific deep-dive ratings if available
  const deepRatings: number[] = [];
  responses.forEach(r => {
    if (conceptId === 'ryven' && r.ryvenInterest) deepRatings.push(r.ryvenInterest);
    if (conceptId === 'karvo' && r.karvoInterest) deepRatings.push(r.karvoInterest);
    if (conceptId === 'carcare' && r.carCareInterest) deepRatings.push(r.carCareInterest);
    if (conceptId === 'packaging' && (r.packagingBundle || r.packagingProducts?.length)) {
      // Packaging interest proxy
      const bundleScore = r.packagingBundle === 'Definitely' ? 5 : r.packagingBundle === 'Probably' ? 4 : 3;
      deepRatings.push(bundleScore);
    }
    if (conceptId === 'problemsolvers' && r.problemSolverFrequency) {
      const fScore = r.problemSolverFrequency === 'Very often' ? 5 : r.problemSolverFrequency === 'Often' ? 4 : 3;
      deepRatings.push(fScore);
    }
  });

  const avgInterestRating = deepRatings.length > 0
    ? deepRatings.reduce((a, b) => a + b, 0) / deepRatings.length
    : 3.0; // fallback neutral

  const firstAttentionRatio = (firstAttentionCount / total) * 100;
  const consideredRatio = (consideredCount / total) * 100;
  const normalizedRatingScore = (avgInterestRating / 5) * 100;

  // Demand normalized 0-100
  const demandScore = Math.min(100, Math.round(
    firstAttentionRatio * 0.45 +
    consideredRatio * 0.35 +
    normalizedRatingScore * 0.20
  ));

  // 2. Price Acceptance (20% Weight)
  // Measured by willingness to spend in the target sweet spots vs lowballing, and premium willingness
  let priceWillingnessSum = 0;
  let priceCount = 0;

  responses.forEach(r => {
    // Check general premium willingness
    const premVal = r.premiumWillingness === 'Definitely' ? 100
      : r.premiumWillingness === 'Probably' ? 80
      : r.premiumWillingness === 'Maybe' ? 60
      : r.premiumWillingness === 'Probably not' ? 30
      : 10;
    
    // Concept specific price tiers
    let conceptPriceVal = 70;
    if (conceptId === 'ryven' && r.ryvenPrice) {
      if (r.ryvenPrice.includes('2,000+') || r.ryvenPrice.includes('1,500–1,999')) conceptPriceVal = 95;
      else if (r.ryvenPrice.includes('1,000–1,499')) conceptPriceVal = 80;
      else if (r.ryvenPrice.includes('700–999')) conceptPriceVal = 65;
      else conceptPriceVal = 45;
    } else if (conceptId === 'karvo' && (r.karvoSmallPrice || r.karvoLampPrice)) {
      if (r.karvoLampPrice?.includes('3,500+') || r.karvoLampPrice?.includes('5,000+')) conceptPriceVal = 95;
      else if (r.karvoSmallPrice?.includes('1,500') || r.karvoLampPrice?.includes('2,500')) conceptPriceVal = 85;
      else conceptPriceVal = 60;
    } else if (conceptId === 'carcare' && r.carCarePrice) {
      if (r.carCarePrice.includes('2,500') || r.carCarePrice.includes('3,500+')) conceptPriceVal = 90;
      else if (r.carCarePrice.includes('1,500')) conceptPriceVal = 75;
      else conceptPriceVal = 55;
    } else if (conceptId === 'packaging' && r.packagingBudget) {
      if (r.packagingBudget.includes('5,000') || r.packagingBudget.includes('10,000+')) conceptPriceVal = 95;
      else if (r.packagingBudget.includes('3,000')) conceptPriceVal = 80;
      else conceptPriceVal = 60;
    }

    priceWillingnessSum += (premVal * 0.4 + conceptPriceVal * 0.6);
    priceCount++;
  });

  const priceAcceptanceScore = priceCount > 0
    ? Math.min(100, Math.round(priceWillingnessSum / priceCount))
    : 70;

  // 3. Purchase Intent (25% Weight)
  // Measured by: Final 30-day purchase selection, purchase intent 1-5 scale, launch selection
  const finalChoiceCount = responses.filter(r => r.finalPurchaseChoice === conceptId).length;
  const firstLaunchChoiceCount = responses.filter(r => r.firstPurchaseConcept === conceptId).length;

  const finalChoiceRatio = (finalChoiceCount / total) * 100;
  const launchChoiceRatio = (firstLaunchChoiceCount / total) * 100;

  // Intent score for users who picked this concept as final purchase or in general
  const intentScores: number[] = [];
  responses.forEach(r => {
    if (r.finalPurchaseChoice === conceptId && r.purchaseIntent) {
      intentScores.push((r.purchaseIntent / 5) * 100);
    } else if (r.buyingConcepts?.includes(conceptId)) {
      intentScores.push(((r.purchaseIntent || 3) / 5) * 80);
    }
  });

  const avgIntentScale = intentScores.length > 0
    ? intentScores.reduce((a, b) => a + b, 0) / intentScores.length
    : 50;

  const purchaseIntentScore = Math.min(100, Math.round(
    finalChoiceRatio * 0.45 +
    launchChoiceRatio * 0.25 +
    avgIntentScale * 0.30
  ));

  // 4. Repeat Potential (20% Weight)
  // Measured by concept repurchase frequency responses
  let repeatSum = 0;
  let repeatCount = 0;

  responses.forEach(r => {
    if (conceptId === 'ryven' && r.ryvenRepurchase) {
      if (r.ryvenRepurchase === 'Monthly') repeatSum += 100;
      else if (r.ryvenRepurchase === 'Every 2 months') repeatSum += 85;
      else if (r.ryvenRepurchase === 'Every 3–4 months') repeatSum += 70;
      else if (r.ryvenRepurchase === 'Twice a year') repeatSum += 50;
      else if (r.ryvenRepurchase === 'Only when finished') repeatSum += 45;
      else repeatSum += 10;
      repeatCount++;
    } else if (conceptId === 'packaging' && r.packagingRepeat) {
      if (r.packagingRepeat === 'Monthly') repeatSum += 100;
      else if (r.packagingRepeat === 'Every 2–3 months') repeatSum += 85;
      else if (r.packagingRepeat === 'Every 4–6 months') repeatSum += 65;
      else if (r.packagingRepeat === 'When stock finishes') repeatSum += 60;
      else repeatSum += 30;
      repeatCount++;
    } else if (conceptId === 'carcare') {
      // Car care refills (perfume, cleaner) have regular replacement cycle
      repeatSum += 72;
      repeatCount++;
    } else if (conceptId === 'problemsolvers') {
      // Problem solvers often have multi-item discovery buy
      repeatSum += 65;
      repeatCount++;
    } else if (conceptId === 'karvo') {
      // Home decor is more gift / seasonal / milestone
      repeatSum += 58;
      repeatCount++;
    }
  });

  const repeatPotentialScore = repeatCount > 0
    ? Math.min(100, Math.round(repeatSum / repeatCount))
    : 65;

  // 5. Overall Appeal (10% Weight)
  // Measured by TikTok stop-scroll choice + Social media follow willingness
  const tiktokInterestCount = responses.filter(r => r.socialMediaChoice === conceptId).length;
  const followCount = responses.filter(r => r.socialMediaFollowChoice?.includes(conceptId)).length;

  const tiktokRatio = (tiktokInterestCount / total) * 100;
  const followRatio = (followCount / total) * 100;

  const overallAppealScore = Math.min(100, Math.round(
    tiktokRatio * 0.6 +
    followRatio * 0.4
  ));

  // Total Weighted Calculation (100%):
  // Demand (25%) + Price (20%) + Purchase Intent (25%) + Repeat (20%) + Overall Appeal (10%)
  const rawWeightedScore = (
    demandScore * 0.25 +
    priceAcceptanceScore * 0.20 +
    purchaseIntentScore * 0.25 +
    repeatPotentialScore * 0.20 +
    overallAppealScore * 0.10
  );

  const totalSignalScore = Math.min(100, Math.max(0, Math.round(rawWeightedScore)));

  // Classifications:
  // 80–100: STRONG VALIDATION SIGNAL
  // 70–79: PROMISING — TEST WITH PROTOTYPE
  // 55–69: NEEDS MORE VALIDATION
  // Below 55: LOW VALIDATION SIGNAL
  let signalLevel: ValidationSignalLevel;
  if (totalSignalScore >= 80) {
    signalLevel = 'STRONG VALIDATION SIGNAL';
  } else if (totalSignalScore >= 70) {
    signalLevel = 'PROMISING — TEST WITH PROTOTYPE';
  } else if (totalSignalScore >= 55) {
    signalLevel = 'NEEDS MORE VALIDATION';
  } else {
    signalLevel = 'LOW VALIDATION SIGNAL';
  }

  return {
    conceptId,
    name: concept.name,
    category: concept.category,
    demandScore,
    priceAcceptanceScore,
    purchaseIntentScore,
    repeatPotentialScore,
    overallAppealScore,
    totalSignalScore,
    signalLevel,
    firstAttentionCount,
    consideredCount,
    finalChoiceCount,
    tiktokInterestCount,
    avgInterestRating: Number(avgInterestRating.toFixed(1)),
  };
}

export function calculateAllConceptScores(responses: SurveyResponse[]): ConceptScore[] {
  const conceptIds: ConceptId[] = ['ryven', 'karvo', 'carcare', 'packaging', 'problemsolvers'];
  const scores = conceptIds.map(id => calculateConceptScore(id, responses));
  // Sort descending by totalSignalScore
  return scores.sort((a, b) => b.totalSignalScore - a.totalSignalScore);
}
