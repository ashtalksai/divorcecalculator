"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  calculateCosts,
  getStateData,
  type Situation,
  type Asset,
  type ScenarioResult,
} from "@/lib/calculator";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function ScenarioCard({
  scenario,
  isLikely,
}: {
  scenario: ScenarioResult;
  isLikely?: boolean;
}) {
  return (
    <Card
      className={`p-6 relative overflow-hidden ${
        isLikely ? "ring-2 ring-[#D4845A] shadow-lg" : ""
      }`}
      style={{ borderTopColor: scenario.color, borderTopWidth: "4px" }}
    >
      {isLikely && (
        <Badge className="absolute top-3 right-3 bg-[#D4845A] text-white">
          Most Likely
        </Badge>
      )}
      <div className="mb-4">
        <h3 className="text-lg font-semibold" style={{ color: scenario.color }}>
          {scenario.label}
        </h3>
        <div className="text-3xl font-bold mt-1">
          {formatCurrency(scenario.total)}
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          Est. timeline: {scenario.timeline}
        </div>
      </div>
      <Separator className="mb-4" />
      <div className="space-y-3">
        {scenario.lineItems.map((item, i) => (
          <div
            key={i}
            className={`flex items-center justify-between text-sm ${
              i >= 2 ? "blur-content" : ""
            }`}
          >
            <div>
              <div className="font-medium">{item.category}</div>
              <div className="text-xs text-muted-foreground">
                {item.description}
              </div>
            </div>
            <div className="font-semibold">{formatCurrency(item.amount)}</div>
          </div>
        ))}
      </div>
      {scenario.lineItems.length > 2 && (
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            + {scenario.lineItems.length - 2} more line items
          </p>
        </div>
      )}
    </Card>
  );
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const stateSlug = searchParams.get("state") || "";
  const situation = (searchParams.get("situation") || "uncontested") as Situation;
  const assetsParam = searchParams.get("assets") || "";
  const assets = assetsParam ? (assetsParam.split(",") as Asset[]) : [];
  const hasChildren = searchParams.get("children") === "yes";

  const stateData = getStateData(stateSlug);

  if (!stateData) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <p className="text-muted-foreground mb-6">
          We couldn&apos;t find cost data for your selection. Please try again.
        </p>
        <a href="/calculator">
          <Button>Start Over</Button>
        </a>
      </div>
    );
  }

  const results = calculateCosts(stateSlug, situation, assets, hasChildren);

  const situationLabels: Record<Situation, string> = {
    uncontested: "Uncontested",
    contested: "Contested",
    highConflict: "High Conflict",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Your Divorce Cost Estimate
        </h1>
        <p className="text-muted-foreground">
          {stateData.name} • {situationLabels[situation]} •{" "}
          {assets.length} asset{assets.length !== 1 ? "s" : ""} •{" "}
          {hasChildren ? "With children" : "No children"}
        </p>
      </div>

      {/* Scenario Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <ScenarioCard scenario={results.best} />
        <ScenarioCard scenario={results.likely} isLikely />
        <ScenarioCard scenario={results.worst} />
      </div>

      {/* Upgrade CTA */}
      <Card className="p-8 bg-gradient-to-br from-[#4A7C59] to-[#3A6249] text-white text-center">
        <h2 className="text-2xl font-bold mb-3">
          Get Your Complete Detailed Report
        </h2>
        <p className="text-white/80 mb-6 max-w-xl mx-auto">
          Unlock all line items, state-specific legal tips, a preparation
          checklist, and cost-saving strategies — all in a downloadable PDF.
        </p>
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="text-3xl font-bold">$9.99</span>
          <span className="text-white/60 line-through text-lg">$29.99</span>
          <Badge className="bg-[#D4845A] text-white">67% OFF</Badge>
        </div>
        <Button
          size="lg"
          variant="secondary"
          className="text-[#4A7C59] font-semibold text-lg px-8"
          onClick={() => alert("Stripe checkout coming soon!")}
        >
          Get Detailed Report — $9.99
        </Button>
        <p className="text-xs text-white/50 mt-3">
          Instant PDF download • 30-day money-back guarantee
        </p>
      </Card>

      {/* State Info */}
      <div className="mt-12 bg-white rounded-xl p-6 border border-border/50">
        <h3 className="font-semibold mb-2">
          About divorce in {stateData.name}
        </h3>
        <p className="text-sm text-muted-foreground">{stateData.notes}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div>
            <div className="text-xs text-muted-foreground">Filing Fees</div>
            <div className="font-semibold">
              {formatCurrency(stateData.filingFee.min)}–
              {formatCurrency(stateData.filingFee.max)}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Attorney/hr</div>
            <div className="font-semibold">
              {formatCurrency(stateData.attorneyHourly.min)}–
              {formatCurrency(stateData.attorneyHourly.max)}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Mediation/session</div>
            <div className="font-semibold">
              {formatCurrency(stateData.mediationPerSession.min)}–
              {formatCurrency(stateData.mediationPerSession.max)}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Process Server</div>
            <div className="font-semibold">
              {formatCurrency(stateData.processServer.min)}–
              {formatCurrency(stateData.processServer.max)}
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground text-center mt-8 max-w-2xl mx-auto">
        This estimate is for informational purposes only and does not constitute
        legal advice. Actual costs may vary based on your specific circumstances,
        attorney selection, and court requirements. Consult with a qualified
        attorney in your state for personalized guidance.
      </p>
    </div>
  );
}

export default function ResultsView() {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto px-4 py-20 text-center">
          <div className="text-4xl animate-calculating mb-4">📊</div>
          <p className="text-muted-foreground">Loading your results...</p>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
