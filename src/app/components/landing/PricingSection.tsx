import { Check } from "lucide-react";
import { useNavigate } from "react-router";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Try Auditwise with a single project.",
    features: [
      "3 audits per month",
      "PNG and PDF upload",
      "Basic AI scoring",
      "5 comment pins per audit",
      "Export as PDF",
    ],
    cta: "Start Free",
    recommended: false,
    ctaStyle: "border",
  },
  {
    name: "Pro",
    price: "$18",
    period: "per month",
    description: "For designers and freelancers who audit regularly.",
    features: [
      "Unlimited audits",
      "All formats (Figma, PNG, PDF, URL)",
      "Full AI audit suite",
      "Unlimited comment pins",
      "Before / After comparison",
      "Version history",
      "Dark mode",
      "Export as PDF & PNG",
      "Shareable link",
    ],
    cta: "Start Pro Trial",
    recommended: true,
    ctaStyle: "filled",
  },
  {
    name: "Team",
    price: "$49",
    period: "per month",
    description: "For teams that review designs collaboratively.",
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "Role-based access control",
      "Real-time collaboration",
      "Team audit history",
      "Priority support",
      "Custom audit templates",
    ],
    cta: "Start Team Trial",
    recommended: false,
    ctaStyle: "border",
  },
];

export function PricingSection() {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-6 bg-[#F7F7F8]" id="pricing">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-14">
          <div className="text-[12px] text-[#9595A0] uppercase tracking-widest mb-4">Pricing</div>
          <h2 className="text-[32px] text-[#1C1C1E] leading-[1.3] tracking-tight mb-4">
            Simple, transparent pricing.
          </h2>
          <p className="text-[15px] text-[#6E6E7A] leading-relaxed">
            Start free. Upgrade when your workflow demands more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-xl border p-7 space-y-6 transition-all duration-200 ${
                plan.recommended
                  ? "border-[#4B65E8]/40 shadow-[0_4px_32px_rgba(75,101,232,0.08)] relative"
                  : "border-[#E8E8EA] hover:border-[#D0D0D4]"
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4B65E8] text-white text-[10px] px-3 py-1 rounded-full">
                  Recommended
                </div>
              )}

              <div>
                <div className="text-[13px] text-[#6E6E7A] mb-1">{plan.name}</div>
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-[36px] text-[#1C1C1E] tracking-tight">{plan.price}</span>
                  <span className="text-[13px] text-[#9595A0]">{plan.period}</span>
                </div>
                <p className="text-[13px] text-[#6E6E7A] leading-relaxed">{plan.description}</p>
              </div>

              <button
                onClick={() => navigate("/upload")}
                className={`w-full py-2.5 rounded-lg text-[13px] transition-colors duration-150 ${
                  plan.ctaStyle === "filled"
                    ? "bg-[#4B65E8] text-white hover:bg-[#3a54d7]"
                    : "border border-[#E8E8EA] text-[#1C1C1E] hover:border-[#C8C8CA] hover:bg-[#F7F7F8]"
                }`}
              >
                {plan.cta}
              </button>

              <div className="space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2.5">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${plan.recommended ? "bg-[#EEF1FF]" : "bg-[#F0F0F2]"}`}>
                      <Check size={9} className={plan.recommended ? "text-[#4B65E8]" : "text-[#6E6E7A]"} />
                    </div>
                    <span className="text-[13px] text-[#3A3A3F] leading-snug">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-[13px] text-[#9595A0]">All plans include a 14-day free trial. No credit card required.</p>
        </div>
      </div>
    </section>
  );
}
