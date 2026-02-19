import { Upload, ScanLine, ListChecks, CheckSquare, Share2 } from "lucide-react";
import { useNavigate } from "react-router";

const steps = [
  {
    icon: Upload,
    title: "Add Design",
    description: "Upload your design via Figma, PNG, PDF, or URL.",
    color: "#4B65E8",
    bg: "#EEF1FF",
  },
  {
    icon: ScanLine,
    title: "Scan the Design",
    description: "AI scans every element — spacing, contrast, type, layout.",
    color: "#8B5CF6",
    bg: "#F3EEFF",
  },
  {
    icon: ListChecks,
    title: "Review Issues",
    description: "Browse categorized, prioritized issues with explanations.",
    color: "#E8A44F",
    bg: "#FFF8EC",
  },
  {
    icon: CheckSquare,
    title: "Fix & Resolve",
    description: "Apply fixes and mark issues as resolved to track progress.",
    color: "#4CAF7D",
    bg: "#EEF7F1",
  },
  {
    icon: Share2,
    title: "Export Report",
    description: "Export as PDF, annotated PNG, or shareable link.",
    color: "#1C1C1E",
    bg: "#F0F0F2",
  },
];

export function HowItWorksSection() {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-6 bg-[#F7F7F8]" id="how-it-works">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-16">
          <div className="text-[12px] text-[#9595A0] uppercase tracking-widest mb-4">Detailed Flow</div>
          <h2 className="text-[32px] text-[#1C1C1E] leading-[1.3] tracking-tight mb-4">
            From upload to resolution in five steps.
          </h2>
          <p className="text-[15px] text-[#6E6E7A] leading-relaxed">
            A clear, repeatable process so your entire team follows the same audit workflow every time.
          </p>
        </div>

        {/* Desktop: horizontal flow */}
        <div className="hidden lg:flex items-start gap-0 relative">
          {steps.map((step, i) => (
            <div key={step.title} className="flex-1 relative">
              {/* Connector */}
              {i < steps.length - 1 && (
                <div className="absolute top-5 left-1/2 w-full h-px bg-[#E8E8EA] z-0" />
              )}
              <div className="relative z-10 flex flex-col items-center text-center px-4">
                <div
                  className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center mb-5 shadow-[0_0_0_1px_#E8E8EA]"
                  style={{ backgroundColor: step.bg }}
                >
                  <step.icon size={16} style={{ color: step.color }} strokeWidth={1.5} />
                </div>
                <div className="text-[10px] text-[#9595A0] mb-1.5" style={{ color: step.color }}>
                  Step {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="text-[13px] text-[#1C1C1E] mb-2">{step.title}</h3>
                <p className="text-[12px] text-[#6E6E7A] leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile / Tablet: vertical */}
        <div className="lg:hidden space-y-4">
          {steps.map((step, i) => (
            <div key={step.title} className="flex items-start gap-4 bg-white rounded-xl border border-[#E8E8EA] p-5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: step.bg }}
              >
                <step.icon size={15} style={{ color: step.color }} strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-[10px] mb-1" style={{ color: step.color }}>Step {String(i + 1).padStart(2, "0")}</div>
                <h3 className="text-[14px] text-[#1C1C1E] mb-1">{step.title}</h3>
                <p className="text-[13px] text-[#6E6E7A] leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/upload")}
            className="inline-flex items-center gap-2 bg-[#1C1C1E] text-white text-[13px] px-6 py-3 rounded-lg hover:bg-[#2C2C2E] transition-colors duration-150"
          >
            Try the full flow now
          </button>
        </div>
      </div>
    </section>
  );
}
