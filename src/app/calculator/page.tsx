import { Metadata } from "next";
import CalculatorForm from "@/components/calculator-form";

export const metadata: Metadata = {
  title: "Divorce Cost Calculator — Estimate Your Costs",
  description:
    "Answer a few simple questions about your situation and get a realistic divorce cost estimate for your state.",
};

export default function CalculatorPage() {
  return (
    <main className="min-h-screen">
      <nav className="border-b border-border/50 bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-[#4A7C59]">
            DivorceCalculator
          </a>
          <span className="text-sm text-muted-foreground">Free Estimate</span>
        </div>
      </nav>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <CalculatorForm />
      </div>
    </main>
  );
}
