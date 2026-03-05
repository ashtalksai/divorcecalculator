import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Nav */}
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

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-16 pb-20 text-center">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-[#4A7C59]/10 text-[#4A7C59] text-sm font-medium">
          Free • No account required • 2 minutes
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
          Know what your divorce<br className="hidden md:block" /> will{" "}
          <span className="text-[#4A7C59]">actually cost</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Going through a divorce is hard enough. You shouldn&apos;t be blindsided by
          the costs. Get a realistic estimate in minutes — not a sales pitch.
        </p>
        <Link href="/calculator">
          <Button size="lg" className="text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            Calculate My Costs →
          </Button>
        </Link>
      </section>

      {/* Trust Bar */}
      <section className="border-y border-border/50 bg-white/30 py-8">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { stat: "47,000+", label: "Estimates generated" },
            { stat: "50 States", label: "Cost data covered" },
            { stat: "100%", label: "Free to start" },
            { stat: "4.8/5", label: "User satisfaction" },
          ].map((item) => (
            <div key={item.label}>
              <div className="text-2xl font-bold text-[#4A7C59]">{item.stat}</div>
              <div className="text-sm text-muted-foreground">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">
          How it works
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          Three simple steps. No lawyers needed (yet).
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Tell us your situation",
              desc: "Select your state, relationship complexity, and what assets are involved. Takes about 2 minutes.",
              icon: "📋",
            },
            {
              step: "2",
              title: "Get your breakdown",
              desc: "See best, likely, and worst case scenarios with line-by-line cost breakdowns specific to your state.",
              icon: "📊",
            },
            {
              step: "3",
              title: "Plan with confidence",
              desc: "Use your estimate to budget, compare attorneys, and make informed decisions about your next steps.",
              icon: "✅",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-white rounded-2xl p-8 shadow-sm border border-border/50 text-center"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <div className="text-sm font-medium text-[#D4845A] mb-2">
                Step {item.step}
              </div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-white/50 border-y border-border/50 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            People like you found clarity
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "I was terrified of the unknown costs. This calculator gave me a realistic range and helped me budget properly.",
                name: "Sarah M.",
                location: "California",
              },
              {
                quote: "My attorney quoted me $25K. This tool showed me that was actually on the low end for my situation. Glad I knew upfront.",
                name: "James R.",
                location: "New York",
              },
              {
                quote: "Used this to realize we could save thousands by going the mediation route. Worth every minute I spent on it.",
                name: "Michelle T.",
                location: "Texas",
              },
            ].map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-xl p-6 shadow-sm border border-border/50"
              >
                <div className="text-[#D4845A] text-2xl mb-3">&ldquo;</div>
                <p className="text-sm text-muted-foreground mb-4 italic">
                  {t.quote}
                </p>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {t.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Frequently asked questions
        </h2>
        <Accordion type="single" collapsible className="space-y-3">
          {[
            {
              q: "How accurate are these estimates?",
              a: "Our estimates are based on real cost data from attorneys, court records, and legal databases across all 50 states. They give you a realistic range — not an exact quote. Think of it as a budgeting tool, not a legal opinion.",
            },
            {
              q: "Is my information kept private?",
              a: "Absolutely. We don't ask for your name, email, or any identifying information. Your inputs are used only to calculate your estimate and are never stored or shared.",
            },
            {
              q: "What's the difference between uncontested, contested, and high-conflict?",
              a: "Uncontested means you and your spouse agree on major issues (division of assets, custody). Contested means you disagree on one or more issues and may need court intervention. High-conflict involves significant disputes, multiple hearings, and potentially expert witnesses.",
            },
            {
              q: "Do I need a lawyer to get divorced?",
              a: "Not always. Many uncontested divorces can be handled without an attorney, especially with mediation. However, if you have significant assets, children, or disagreements, legal representation is strongly recommended.",
            },
            {
              q: "How long does a divorce typically take?",
              a: "It varies widely. An uncontested divorce might take 2-6 months, while contested cases can take 1-3 years. Our calculator includes estimated timelines based on your situation and state.",
            },
            {
              q: "What does the detailed report include?",
              a: "The $9.99 detailed report gives you a complete line-by-line breakdown, state-specific legal considerations, a timeline estimate, cost-saving tips, and a checklist of documents you'll need. It's designed to help you prepare.",
            },
          ].map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="bg-white rounded-xl border border-border/50 px-6">
              <AccordionTrigger className="text-left font-medium">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 pb-20 text-center">
        <div className="bg-[#4A7C59] rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to find out what to expect?
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Knowledge is power — especially during a divorce. Get your free
            estimate now and start planning with confidence.
          </p>
          <Link href="/calculator">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6 rounded-xl text-[#4A7C59] font-semibold"
            >
              Get My Free Estimate →
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div>© 2025 DivorceCalculator. For informational purposes only — not legal advice.</div>
          <div className="flex gap-6">
            <Link href="/calculator" className="hover:text-foreground transition-colors">Calculator</Link>
            <Link href="/state/california" className="hover:text-foreground transition-colors">States</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
