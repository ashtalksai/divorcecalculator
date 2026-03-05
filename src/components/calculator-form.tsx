"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllStates, type Situation, type Asset } from "@/lib/calculator";

const states = getAllStates();

const situationOptions: { value: Situation; label: string; desc: string; icon: string }[] = [
  {
    value: "uncontested",
    label: "Uncontested",
    desc: "We agree on most things",
    icon: "🤝",
  },
  {
    value: "contested",
    label: "Contested",
    desc: "We disagree on key issues",
    icon: "⚖️",
  },
  {
    value: "highConflict",
    label: "High Conflict",
    desc: "Significant disputes expected",
    icon: "🔥",
  },
];

const assetOptions: { value: Asset; label: string; icon: string }[] = [
  { value: "realEstate", label: "Real Estate / Home", icon: "🏠" },
  { value: "retirement", label: "Retirement Accounts", icon: "💰" },
  { value: "business", label: "Business Ownership", icon: "🏢" },
  { value: "investments", label: "Investments / Stocks", icon: "📈" },
  { value: "vehicles", label: "Vehicles", icon: "🚗" },
  { value: "debt", label: "Significant Debt", icon: "💳" },
];

export default function CalculatorForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [stateSlug, setStateSlug] = useState("");
  const [situation, setSituation] = useState<Situation | "">("");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [hasChildren, setHasChildren] = useState<boolean | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const toggleAsset = (asset: Asset) => {
    setAssets((prev) =>
      prev.includes(asset) ? prev.filter((a) => a !== asset) : [...prev, asset]
    );
  };

  const handleCalculate = () => {
    setIsCalculating(true);
    // Simulate calculation delay for UX
    setTimeout(() => {
      const params = new URLSearchParams({
        state: stateSlug,
        situation: situation as string,
        assets: assets.join(","),
        children: hasChildren ? "yes" : "no",
      });
      router.push(`/results?${params.toString()}`);
    }, 2000);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return stateSlug !== "";
      case 2: return situation !== "";
      case 3: return true; // assets are optional
      case 4: return hasChildren !== null;
      default: return false;
    }
  };

  if (isCalculating) {
    return (
      <div className="text-center py-20">
        <div className="mb-8">
          <div className="inline-flex items-center gap-3 text-4xl animate-calculating">
            <span>📊</span>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-3">Crunching the numbers...</h2>
        <p className="text-muted-foreground mb-8">
          Analyzing costs for your state and situation
        </p>
        <div className="max-w-xs mx-auto space-y-3">
          {[
            "Checking court filing fees...",
            "Estimating attorney costs...",
            "Calculating mediation expenses...",
          ].map((text, i) => (
            <div
              key={i}
              className="text-sm text-muted-foreground animate-slide-up"
              style={{ animationDelay: `${i * 0.5}s`, opacity: 0 }}
            >
              ✓ {text}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            Step {step} of {totalSteps}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step 1: State */}
      {step === 1 && (
        <div className="animate-slide-up">
          <h2 className="text-2xl font-bold mb-2">Where do you live?</h2>
          <p className="text-muted-foreground mb-6">
            Divorce costs vary significantly by state. This helps us give you
            accurate numbers.
          </p>
          <Select value={stateSlug} onValueChange={setStateSlug}>
            <SelectTrigger className="w-full bg-white h-12 text-base">
              <SelectValue placeholder="Select your state" />
            </SelectTrigger>
            <SelectContent>
              {states.map((s) => (
                <SelectItem key={s.slug} value={s.slug}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Step 2: Situation */}
      {step === 2 && (
        <div className="animate-slide-up">
          <h2 className="text-2xl font-bold mb-2">
            How would you describe your situation?
          </h2>
          <p className="text-muted-foreground mb-6">
            This is the biggest factor in your overall cost. Be honest — it
            helps get you a better estimate.
          </p>
          <RadioGroup
            value={situation}
            onValueChange={(val) => setSituation(val as Situation)}
            className="space-y-3"
          >
            {situationOptions.map((opt) => (
              <Label
                key={opt.value}
                htmlFor={opt.value}
                className="cursor-pointer"
              >
                <Card
                  className={`p-5 transition-all cursor-pointer hover:border-[#4A7C59]/50 ${
                    situation === opt.value
                      ? "border-[#4A7C59] bg-[#4A7C59]/5 shadow-sm"
                      : "bg-white"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <RadioGroupItem value={opt.value} id={opt.value} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{opt.icon}</span>
                        <span className="font-semibold">{opt.label}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {opt.desc}
                      </p>
                    </div>
                  </div>
                </Card>
              </Label>
            ))}
          </RadioGroup>
        </div>
      )}

      {/* Step 3: Assets */}
      {step === 3 && (
        <div className="animate-slide-up">
          <h2 className="text-2xl font-bold mb-2">
            What assets are involved?
          </h2>
          <p className="text-muted-foreground mb-6">
            More assets typically means more complexity and cost. Select all that
            apply — or skip if none.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {assetOptions.map((opt) => (
              <Card
                key={opt.value}
                onClick={() => toggleAsset(opt.value)}
                className={`p-4 cursor-pointer transition-all hover:border-[#4A7C59]/50 ${
                  assets.includes(opt.value)
                    ? "border-[#4A7C59] bg-[#4A7C59]/5 shadow-sm"
                    : "bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={assets.includes(opt.value)}
                    onClick={(e) => e.stopPropagation()}
                    onCheckedChange={() => toggleAsset(opt.value)}
                  />
                  <span className="text-lg">{opt.icon}</span>
                  <span className="text-sm font-medium">{opt.label}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Children */}
      {step === 4 && (
        <div className="animate-slide-up">
          <h2 className="text-2xl font-bold mb-2">
            Do you have children together?
          </h2>
          <p className="text-muted-foreground mb-6">
            Child custody and support add complexity and cost to the process.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: true, label: "Yes", icon: "👨‍👩‍👧‍👦" },
              { value: false, label: "No", icon: "👤" },
            ].map((opt) => (
              <Card
                key={opt.label}
                onClick={() => setHasChildren(opt.value)}
                className={`p-6 cursor-pointer text-center transition-all hover:border-[#4A7C59]/50 ${
                  hasChildren === opt.value
                    ? "border-[#4A7C59] bg-[#4A7C59]/5 shadow-sm"
                    : "bg-white"
                }`}
              >
                <div className="text-3xl mb-2">{opt.icon}</div>
                <div className="font-semibold">{opt.label}</div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        {step > 1 ? (
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            className="bg-white"
          >
            ← Back
          </Button>
        ) : (
          <div />
        )}
        {step < totalSteps ? (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
          >
            Continue →
          </Button>
        ) : (
          <Button
            onClick={handleCalculate}
            disabled={!canProceed()}
            className="bg-[#D4845A] hover:bg-[#C47550] text-white"
          >
            Calculate My Costs →
          </Button>
        )}
      </div>
    </div>
  );
}
