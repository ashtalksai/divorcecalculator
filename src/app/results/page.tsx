import { Metadata } from "next";
import ResultsView from "@/components/results-view";

export const metadata: Metadata = {
  title: "Your Divorce Cost Estimate — DivorceCalculator",
  description: "Your personalized divorce cost breakdown with best, likely, and worst case scenarios.",
};

export default function ResultsPage() {
  return (
    <main className="min-h-screen">
      <nav className="border-b border-border/50 bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-[#4A7C59]">
            DivorceCalculator
          </a>
          <a href="/calculator" className="text-sm text-[#4A7C59] hover:underline">
            ← New Estimate
          </a>
        </div>
      </nav>
      <ResultsView />
    </main>
  );
}
