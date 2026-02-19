import { Pen, LayoutGrid, Building2, Rocket } from "lucide-react";
import { useNavigate } from "react-router";

const useCases = [
  {
    icon: Pen,
    title: "UI Designers",
    description: "Catch spacing inconsistencies, contrast issues, and type hierarchy problems before handing off to dev.",
    tags: ["Spacing audit", "Typography check", "Before handoff"],
    color: "#4B65E8",
    bg: "#EEF1FF",
  },
  {
    icon: LayoutGrid,
    title: "Product Teams",
    description: "Review full product flows for UX gaps, accessibility compliance, and interaction consistency.",
    tags: ["Flow review", "A11y check", "UX scoring"],
    color: "#4CAF7D",
    bg: "#EEF7F1",
  },
  {
    icon: Building2,
    title: "Design Agencies",
    description: "Deliver structured audit reports to clients with clear issues, scores, and resolution tracking.",
    tags: ["Client reports", "PDF export", "Version history"],
    color: "#E8A44F",
    bg: "#FFF8EC",
  },
  {
    icon: Rocket,
    title: "SaaS Founders",
    description: "Audit your product's design quality before launch. Get actionable fixes without a full design team.",
    tags: ["Quick audit", "AI score", "Fix suggestions"],
    color: "#8B5CF6",
    bg: "#F3EEFF",
  },
];

export function UseCasesSection() {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-6 bg-[#F7F7F8]" id="use-cases">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-14">
          <div className="text-[12px] text-[#9595A0] uppercase tracking-widest mb-4">Use Cases</div>
          <h2 className="text-[32px] text-[#1C1C1E] leading-[1.3] tracking-tight mb-4">
            Built for everyone who cares about design quality.
          </h2>
          <p className="text-[15px] text-[#6E6E7A] leading-relaxed">
            Whether you're a solo designer or a cross-functional team, Auditwise adapts to your workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {useCases.map((useCase) => (
            <div
              key={useCase.title}
              className="bg-white rounded-xl border border-[#E8E8EA] p-7 space-y-5 hover:border-[#D0D0D4] hover:shadow-[0_2px_20px_rgba(0,0,0,0.04)] transition-all duration-200 cursor-pointer group"
              onClick={() => navigate("/upload")}
            >
              <div className="flex items-start justify-between">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: useCase.bg }}
                >
                  <useCase.icon size={20} style={{ color: useCase.color }} strokeWidth={1.5} />
                </div>
                <div
                  className="text-[12px] opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                  style={{ color: useCase.color }}
                >
                  Get started →
                </div>
              </div>

              <div>
                <h3 className="text-[17px] text-[#1C1C1E] mb-2">{useCase.title}</h3>
                <p className="text-[14px] text-[#6E6E7A] leading-relaxed">{useCase.description}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {useCase.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2.5 py-1 rounded-lg"
                    style={{ color: useCase.color, backgroundColor: useCase.bg }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
