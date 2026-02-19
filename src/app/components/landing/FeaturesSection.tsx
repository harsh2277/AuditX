import {
  MessageSquare, Lightbulb, CheckCircle, FileDown, Link2, Users,
  GitCompare, BarChart3, Eye, AlignLeft, Palette, Grid3X3
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Comment on canvas",
    description: "Click anywhere on the design to add contextual comment pins.",
    color: "#4B65E8",
    bg: "#EEF1FF",
  },
  {
    icon: Lightbulb,
    title: "Issue explanation panel",
    description: "Every issue comes with a detailed why and how-to-fix.",
    color: "#E8A44F",
    bg: "#FFF8EC",
  },
  {
    icon: CheckCircle,
    title: "Resolution tracking",
    description: "Mark issues resolved and watch your audit score improve.",
    color: "#4CAF7D",
    bg: "#EEF7F1",
  },
  {
    icon: FileDown,
    title: "Export as PDF",
    description: "Generate a clean, shareable audit report in one click.",
    color: "#6E6E7A",
    bg: "#F0F0F2",
  },
  {
    icon: Link2,
    title: "Shareable audit link",
    description: "Share your full audit with clients or team members via a link.",
    color: "#8B5CF6",
    bg: "#F3EEFF",
  },
  {
    icon: Users,
    title: "Team collaboration",
    description: "Invite team members with role-based access to comment and resolve.",
    color: "#4B65E8",
    bg: "#EEF1FF",
  },
  {
    icon: GitCompare,
    title: "Version comparison",
    description: "Compare before/after versions to validate improvements.",
    color: "#D4505A",
    bg: "#FFF0F1",
  },
  {
    icon: BarChart3,
    title: "AI design score",
    description: "A 0–100 composite score measuring your design quality.",
    color: "#4CAF7D",
    bg: "#EEF7F1",
  },
  {
    icon: Eye,
    title: "Accessibility insights",
    description: "WCAG compliance checks, contrast ratios, and focus states.",
    color: "#E8A44F",
    bg: "#FFF8EC",
  },
  {
    icon: AlignLeft,
    title: "Spacing consistency",
    description: "Detects off-grid spacing and inconsistent padding/margin.",
    color: "#8B5CF6",
    bg: "#F3EEFF",
  },
  {
    icon: Palette,
    title: "Color contrast checker",
    description: "Automatically measures all text-background contrast pairs.",
    color: "#D4505A",
    bg: "#FFF0F1",
  },
  {
    icon: Grid3X3,
    title: "Grid alignment checker",
    description: "Validates alignment against your defined layout grid.",
    color: "#6E6E7A",
    bg: "#F0F0F2",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 px-6 bg-[#F7F7F8]" id="features">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-14">
          <div className="text-[12px] text-[#9595A0] uppercase tracking-widest mb-4">Features</div>
          <h2 className="text-[32px] text-[#1C1C1E] leading-[1.3] tracking-tight mb-4">
            Everything a thorough audit needs.
          </h2>
          <p className="text-[15px] text-[#6E6E7A] leading-relaxed">
            Twelve intelligent features working together to give you the most complete design audit available.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-xl border border-[#E8E8EA] p-5 space-y-3.5 hover:border-[#D0D0D4] hover:shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-all duration-200"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: feature.bg }}
              >
                <feature.icon size={15} style={{ color: feature.color }} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-[13px] text-[#1C1C1E] mb-1.5">{feature.title}</h3>
                <p className="text-[12px] text-[#6E6E7A] leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
