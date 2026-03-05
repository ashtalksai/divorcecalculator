import costData from "@/data/divorce-costs.json";

export type StateData = {
  name: string;
  slug: string;
  filingFee: { min: number; max: number };
  attorneyHourly: { min: number; max: number };
  mediationPerSession: { min: number; max: number };
  processServer: { min: number; max: number };
  categories: {
    uncontested: { totalMin: number; totalMax: number; avgMonths: number };
    contested: { totalMin: number; totalMax: number; avgMonths: number };
    highConflict: { totalMin: number; totalMax: number; avgMonths: number };
  };
  notes: string;
};

export type Situation = "uncontested" | "contested" | "highConflict";

export type Asset = "realEstate" | "retirement" | "business" | "investments" | "vehicles" | "debt";

export type ScenarioResult = {
  label: string;
  total: number;
  timeline: string;
  lineItems: LineItem[];
  color: string;
};

export type LineItem = {
  category: string;
  amount: number;
  description: string;
};

export function getStateData(slug: string): StateData | null {
  return (costData as Record<string, StateData>)[slug] || null;
}

export function getAllStates(): StateData[] {
  return Object.values(costData as Record<string, StateData>);
}

export function calculateCosts(
  stateSlug: string,
  situation: Situation,
  assets: Asset[],
  hasChildren: boolean
): { best: ScenarioResult; likely: ScenarioResult; worst: ScenarioResult } {
  const state = getStateData(stateSlug);
  if (!state) throw new Error("State not found");

  const cat = state.categories[situation];
  const assetMultiplier = 1 + assets.length * 0.12;
  const childrenMultiplier = hasChildren ? 1.25 : 1;

  const filingFee = Math.round((state.filingFee.min + state.filingFee.max) / 2);
  const processServer = Math.round((state.processServer.min + state.processServer.max) / 2);

  // Best case
  const bestAttorney = Math.round(state.attorneyHourly.min * (situation === "uncontested" ? 5 : situation === "contested" ? 20 : 40));
  const bestMediation = Math.round(state.mediationPerSession.min * (situation === "uncontested" ? 1 : 3));
  const bestTotal = Math.round((cat.totalMin * assetMultiplier * childrenMultiplier));

  // Likely case
  const avgHourly = (state.attorneyHourly.min + state.attorneyHourly.max) / 2;
  const likelyAttorney = Math.round(avgHourly * (situation === "uncontested" ? 10 : situation === "contested" ? 40 : 80));
  const likelyMediation = Math.round(((state.mediationPerSession.min + state.mediationPerSession.max) / 2) * (situation === "uncontested" ? 2 : 5));
  const likelyTotal = Math.round(((cat.totalMin + cat.totalMax) / 2) * assetMultiplier * childrenMultiplier);

  // Worst case
  const worstAttorney = Math.round(state.attorneyHourly.max * (situation === "uncontested" ? 15 : situation === "contested" ? 80 : 150));
  const worstMediation = Math.round(state.mediationPerSession.max * (situation === "uncontested" ? 3 : 8));
  const worstTotal = Math.round(cat.totalMax * assetMultiplier * childrenMultiplier);

  const childCustodyBest = hasChildren ? Math.round(bestTotal * 0.1) : 0;
  const childCustodyLikely = hasChildren ? Math.round(likelyTotal * 0.15) : 0;
  const childCustodyWorst = hasChildren ? Math.round(worstTotal * 0.2) : 0;

  const assetValuation = assets.length > 2 ? Math.round(likelyTotal * 0.08) : 0;

  return {
    best: {
      label: "Best Case",
      total: bestTotal,
      timeline: `${Math.max(1, cat.avgMonths - 2)} months`,
      color: "#4A7C59",
      lineItems: [
        { category: "Court Filing Fees", amount: filingFee, description: "Initial court filing" },
        { category: "Attorney Fees", amount: bestAttorney, description: "Legal representation" },
        { category: "Mediation", amount: bestMediation, description: "Mediation sessions" },
        { category: "Process Server", amount: processServer, description: "Serving papers" },
        ...(hasChildren ? [{ category: "Child Custody Evaluation", amount: childCustodyBest, description: "Custody-related costs" }] : []),
        ...(assets.length > 0 ? [{ category: "Asset Valuation", amount: Math.round(bestTotal * 0.05), description: "Property appraisals" }] : []),
      ],
    },
    likely: {
      label: "Likely Case",
      total: likelyTotal,
      timeline: `${cat.avgMonths} months`,
      color: "#D4845A",
      lineItems: [
        { category: "Court Filing Fees", amount: filingFee, description: "Initial court filing" },
        { category: "Attorney Fees", amount: likelyAttorney, description: "Legal representation" },
        { category: "Mediation", amount: likelyMediation, description: "Mediation sessions" },
        { category: "Process Server", amount: processServer, description: "Serving papers" },
        ...(hasChildren ? [{ category: "Child Custody Evaluation", amount: childCustodyLikely, description: "Custody evaluation & GAL fees" }] : []),
        ...(assets.length > 2 ? [{ category: "Asset Valuation", amount: assetValuation, description: "Forensic accounting & appraisals" }] : []),
        { category: "Miscellaneous", amount: Math.round(likelyTotal * 0.05), description: "Copies, notary, parking, etc." },
      ],
    },
    worst: {
      label: "Worst Case",
      total: worstTotal,
      timeline: `${cat.avgMonths + 6} months`,
      color: "#B91C1C",
      lineItems: [
        { category: "Court Filing Fees", amount: filingFee, description: "Initial filing + motions" },
        { category: "Attorney Fees", amount: worstAttorney, description: "Extended litigation" },
        { category: "Mediation", amount: worstMediation, description: "Multiple mediation attempts" },
        { category: "Process Server", amount: processServer * 2, description: "Multiple service attempts" },
        ...(hasChildren ? [{ category: "Child Custody Evaluation", amount: childCustodyWorst, description: "Full custody evaluation, experts" }] : []),
        ...(assets.length > 0 ? [{ category: "Asset Valuation", amount: Math.round(worstTotal * 0.1), description: "Forensic accounting & multiple appraisals" }] : []),
        { category: "Expert Witnesses", amount: Math.round(worstTotal * 0.08), description: "Financial & custody experts" },
        { category: "Miscellaneous", amount: Math.round(worstTotal * 0.05), description: "Document prep, copies, travel, etc." },
      ],
    },
  };
}
