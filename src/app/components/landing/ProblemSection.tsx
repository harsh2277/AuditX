import { Clock, MessageSquare, AlertCircle, Users } from "lucide-react";

const problems = [
  {
    icon: Clock,
    title: "Reviews take too long",
    description: "Manual design reviews eat hours of design and product time with no clear structure.",
  },
  {
    icon: MessageSquare,
    title: "Feedback is scattered",
    description: "Comments spread across Slack, email, and Figma threads make issues hard to track.",
  },
  {
    icon: AlertCircle,
    title: "Inconsistency slips through",
    description: "Spacing gaps, misaligned grids, and contrast issues get missed in manual walkthroughs.",
  },
  {
    icon: Users,
    title: "No shared source of truth",
    description: "Teams disagree on priorities because there's no structured, objective audit process.",
  },
];

export function ProblemSection() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl mb-14">
          <div className="text-[12px] text-[#9595A0] uppercase tracking-widest mb-4">The Problem</div>
          <h2 className="text-[32px] text-[#1C1C1E] leading-[1.3] tracking-tight mb-4">
            Design reviews are broken.
          </h2>
          <p className="text-[15px] text-[#6E6E7A] leading-relaxed">
            Most teams rely on informal feedback loops that miss critical issues and create confusion. The result is shipped designs that underperform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {problems.map((problem) => (
            <div
              key={problem.title}
              className="bg-[#F7F7F8] rounded-xl border border-[#E8E8EA] p-6 space-y-4 hover:border-[#D0D0D4] transition-colors duration-150"
            >
              <div className="w-9 h-9 rounded-lg bg-white border border-[#E8E8EA] flex items-center justify-center">
                <problem.icon size={16} className="text-[#6E6E7A]" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-[14px] text-[#1C1C1E] mb-2">{problem.title}</h3>
                <p className="text-[13px] text-[#6E6E7A] leading-relaxed">{problem.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
