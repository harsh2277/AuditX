import { Upload, Cpu, FileText } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Upload,
    title: "Upload Your Design",
    description: "Share a Figma link, drop a PNG or PDF, or paste a live website URL. Any format works.",
    color: "#4B65E8",
    bg: "#EEF1FF",
  },
  {
    step: "02",
    icon: Cpu,
    title: "AI Scans Everything",
    description: "Our AI analyzes spacing, contrast, typography, accessibility, layout, and content in seconds.",
    color: "#4CAF7D",
    bg: "#EEF7F1",
  },
  {
    step: "03",
    icon: FileText,
    title: "Get Structured Feedback",
    description: "Receive categorized, prioritized issues with explanations, fix suggestions, and an audit score.",
    color: "#E8A44F",
    bg: "#FFF8EC",
  },
];

export function SolutionSection() {
  return (
    <section className="py-24 px-6 bg-[#F7F7F8]" id="how-it-works">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-16">
          <div className="text-[12px] text-[#9595A0] uppercase tracking-widest mb-4">The Solution</div>
          <h2 className="text-[32px] text-[#1C1C1E] leading-[1.3] tracking-tight mb-4">
            Structured audits, powered by AI.
          </h2>
          <p className="text-[15px] text-[#6E6E7A] leading-relaxed">
            Auditwise replaces scattered feedback with a consistent, AI-driven process that gives you clarity in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connector lines - desktop only */}
          <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-px bg-[#E8E8EA]" />

          {steps.map((step, i) => (
            <div key={step.step} className="relative">
              <div className="bg-white rounded-xl border border-[#E8E8EA] p-8 space-y-5 h-full hover:border-[#D0D0D4] transition-colors duration-200">
                <div className="flex items-start justify-between">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: step.bg }}
                  >
                    <step.icon size={20} style={{ color: step.color }} strokeWidth={1.5} />
                  </div>
                  <span className="text-[13px] text-[#D0D0D4]">{step.step}</span>
                </div>
                <div>
                  <h3 className="text-[16px] text-[#1C1C1E] mb-2.5">{step.title}</h3>
                  <p className="text-[13px] text-[#6E6E7A] leading-relaxed">{step.description}</p>
                </div>
              </div>
              {/* Step connector (mobile) */}
              {i < steps.length - 1 && (
                <div className="md:hidden flex justify-center py-4">
                  <div className="w-px h-8 bg-[#E8E8EA]" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
