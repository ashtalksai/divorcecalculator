import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getStateData, getAllStates } from "@/lib/calculator";

type Props = {
  params: Promise<{ state: string }>;
};

export async function generateStaticParams() {
  return getAllStates().map((s) => ({ state: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug } = await params;
  const stateData = getStateData(stateSlug);
  if (!stateData) return {};
  return {
    title: `How Much Does a Divorce Cost in ${stateData.name}? — DivorceCalculator`,
    description: `Get a realistic divorce cost estimate for ${stateData.name}. Attorney fees from $${stateData.attorneyHourly.min}-$${stateData.attorneyHourly.max}/hr, filing fees from $${stateData.filingFee.min}. Free calculator.`,
  };
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function StatePage({ params }: Props) {
  const { state: stateSlug } = await params;
  const stateData = getStateData(stateSlug);

  if (!stateData) {
    notFound();
  }

  const allStates = getAllStates().filter((s) => s.slug !== stateSlug);

  return (
    <main className="min-h-screen">
      <nav className="border-b border-border/50 bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#4A7C59]">
            DivorceCalculator
          </Link>
          <Link href="/calculator">
            <Button size="sm">Get Your Estimate</Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="mb-10">
          <div className="text-sm text-[#D4845A] font-medium mb-2">
            State Guide
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            How Much Does a Divorce Cost in {stateData.name}?
          </h1>
          <p className="text-lg text-muted-foreground">
            {stateData.notes} Here&apos;s what you can expect to pay.
          </p>
        </div>

        {/* Cost Overview Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <Card className="p-6 border-t-4 border-t-[#4A7C59]">
            <div className="text-sm text-muted-foreground mb-1">
              Uncontested Divorce
            </div>
            <div className="text-2xl font-bold text-[#4A7C59]">
              {formatCurrency(stateData.categories.uncontested.totalMin)} –{" "}
              {formatCurrency(stateData.categories.uncontested.totalMax)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              ~{stateData.categories.uncontested.avgMonths} months avg
            </div>
          </Card>
          <Card className="p-6 border-t-4 border-t-[#D4845A]">
            <div className="text-sm text-muted-foreground mb-1">
              Contested Divorce
            </div>
            <div className="text-2xl font-bold text-[#D4845A]">
              {formatCurrency(stateData.categories.contested.totalMin)} –{" "}
              {formatCurrency(stateData.categories.contested.totalMax)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              ~{stateData.categories.contested.avgMonths} months avg
            </div>
          </Card>
          <Card className="p-6 border-t-4 border-t-red-700">
            <div className="text-sm text-muted-foreground mb-1">
              High-Conflict Divorce
            </div>
            <div className="text-2xl font-bold text-red-700">
              {formatCurrency(stateData.categories.highConflict.totalMin)} –{" "}
              {formatCurrency(stateData.categories.highConflict.totalMax)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              ~{stateData.categories.highConflict.avgMonths} months avg
            </div>
          </Card>
        </div>

        {/* Fee Breakdown */}
        <Card className="p-6 mb-10">
          <h2 className="text-xl font-bold mb-4">
            {stateData.name} Divorce Fee Breakdown
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Court Filing Fees</div>
                <div className="text-sm text-muted-foreground">
                  Required to initiate divorce proceedings
                </div>
              </div>
              <div className="font-semibold text-right">
                {formatCurrency(stateData.filingFee.min)} –{" "}
                {formatCurrency(stateData.filingFee.max)}
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Attorney Hourly Rate</div>
                <div className="text-sm text-muted-foreground">
                  Varies by experience and location within the state
                </div>
              </div>
              <div className="font-semibold text-right">
                {formatCurrency(stateData.attorneyHourly.min)} –{" "}
                {formatCurrency(stateData.attorneyHourly.max)}/hr
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Mediation (per session)</div>
                <div className="text-sm text-muted-foreground">
                  Alternative dispute resolution sessions
                </div>
              </div>
              <div className="font-semibold text-right">
                {formatCurrency(stateData.mediationPerSession.min)} –{" "}
                {formatCurrency(stateData.mediationPerSession.max)}
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Process Server</div>
                <div className="text-sm text-muted-foreground">
                  Serving divorce papers to your spouse
                </div>
              </div>
              <div className="font-semibold text-right">
                {formatCurrency(stateData.processServer.min)} –{" "}
                {formatCurrency(stateData.processServer.max)}
              </div>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="bg-[#4A7C59] rounded-2xl p-8 text-white text-center mb-10">
          <h2 className="text-2xl font-bold mb-3">
            Get your personalized estimate for {stateData.name}
          </h2>
          <p className="text-white/80 mb-6">
            Answer a few questions about your specific situation and get a
            detailed cost breakdown in minutes.
          </p>
          <Link href="/calculator">
            <Button
              size="lg"
              variant="secondary"
              className="text-[#4A7C59] font-semibold"
            >
              Calculate My Costs — Free →
            </Button>
          </Link>
        </div>

        {/* Other States */}
        <div>
          <h2 className="text-xl font-bold mb-4">
            Divorce costs in other states
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {allStates.map((s) => (
              <Link
                key={s.slug}
                href={`/state/${s.slug}`}
                className="bg-white rounded-lg p-3 border border-border/50 hover:border-[#4A7C59]/50 transition-colors text-sm font-medium"
              >
                {s.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2025 DivorceCalculator. For informational purposes only — not legal
          advice.
        </div>
      </footer>
    </main>
  );
}
