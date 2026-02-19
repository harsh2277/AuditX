import { useNavigate } from "react-router";
import { ArrowRight, Play, MessageSquare, AlertTriangle, CheckCircle, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function HeroSection() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStartAudit = () => {
    if (user) {
      navigate("/upload");
    } else {
      navigate("/signup");
    }
  };

  return (
    <section className="pt-32 pb-20 px-6 bg-[#F7F7F8]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-white border border-[#E8E8EA] rounded-full px-3 py-1.5 text-[12px] text-[#4B65E8]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4B65E8]" />
              AI-Powered Design Review
            </div>

            <div className="space-y-4">
              <h1 className="text-[42px] leading-[1.2] text-[#1C1C1E] tracking-tight">
                Review designs with<br />structured AI insight.
              </h1>
              <p className="text-[16px] text-[#6E6E7A] leading-relaxed max-w-md">
                Upload any design — Figma, PNG, PDF, or a live URL — and get a detailed, structured audit in seconds. Know what to fix and why.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleStartAudit}
                className="inline-flex items-center justify-center gap-2 bg-[#4B65E8] text-white px-6 py-3 rounded-lg text-[14px] hover:bg-[#3a54d7] transition-colors duration-150"
              >
                Start Free Audit
                <ArrowRight size={15} />
              </button>
              <button
                className="inline-flex items-center justify-center gap-2 bg-white border border-[#E8E8EA] text-[#1C1C1E] px-6 py-3 rounded-lg text-[14px] hover:border-[#C8C8CA] transition-colors duration-150"
                onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
              >
                <Play size={13} className="text-[#6E6E7A]" />
                See How It Works
              </button>
            </div>

            <div className="flex items-center gap-6 pt-2">
              {[
                { label: "Audits run", value: "12,400+" },
                { label: "Issues caught", value: "84K+" },
                { label: "Teams using it", value: "320+" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-[18px] text-[#1C1C1E]">{stat.value}</div>
                  <div className="text-[12px] text-[#9595A0]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: UI Mock Preview */}
          <div className="relative">
            <div className="bg-white rounded-2xl border border-[#E8E8EA] overflow-hidden shadow-[0_2px_24px_rgba(0,0,0,0.06)]">
              {/* Mock top bar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#E8E8EA] bg-[#F7F7F8]">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#E8E8EA]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#E8E8EA]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#E8E8EA]" />
                  </div>
                  <span className="text-[11px] text-[#9595A0] ml-2">dashboard-v2.fig</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-[#EEF1FF] text-[#4B65E8] text-[11px] px-2 py-0.5 rounded-md">Score: 78</div>
                  <div className="w-6 h-6 rounded-md bg-[#E8E8EA]" />
                  <div className="w-6 h-6 rounded-md bg-[#E8E8EA]" />
                </div>
              </div>

              <div className="flex">
                {/* Canvas mock */}
                <div className="flex-1 bg-[#F0F0F2] p-6 relative min-h-[320px]">
                  {/* Fake design element */}
                  <div className="bg-white rounded-xl border border-[#E8E8EA] p-5 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-3 w-24 bg-[#E8E8EA] rounded-full" />
                      <div className="h-6 w-16 bg-[#4B65E8]/10 rounded-md" />
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="h-2 w-full bg-[#F0F0F2] rounded-full" />
                      <div className="h-2 w-3/4 bg-[#F0F0F2] rounded-full" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 bg-[#F7F7F8] rounded-lg border border-[#E8E8EA]" />
                      ))}
                    </div>
                  </div>

                  {/* Comment pins */}
                  <div className="absolute top-12 right-16 w-6 h-6 rounded-full bg-[#D4505A] text-white text-[10px] flex items-center justify-center shadow-[0_2px_8px_rgba(212,80,90,0.3)]">1</div>
                  <div className="absolute bottom-16 left-12 w-6 h-6 rounded-full bg-[#E8A44F] text-white text-[10px] flex items-center justify-center shadow-[0_2px_8px_rgba(232,164,79,0.3)]">2</div>
                  <div className="absolute top-20 left-1/3 w-6 h-6 rounded-full bg-[#4B65E8] text-white text-[10px] flex items-center justify-center shadow-[0_2px_8px_rgba(75,101,232,0.3)]">3</div>
                </div>

                {/* Issues sidebar mock */}
                <div className="w-[180px] border-l border-[#E8E8EA] bg-white p-3 space-y-2">
                  <div className="text-[10px] text-[#9595A0] mb-3 uppercase tracking-wider">Issues (3)</div>
                  {[
                    { num: 1, label: "Low contrast text", color: "#D4505A", bg: "#FFF0F1", cat: "Accessibility" },
                    { num: 2, label: "Inconsistent spacing", color: "#E8A44F", bg: "#FFF8EC", cat: "Layout" },
                    { num: 3, label: "Missing hover state", color: "#4B65E8", bg: "#EEF1FF", cat: "UX" },
                  ].map((issue) => (
                    <div key={issue.num} className="p-2.5 rounded-lg border border-[#E8E8EA] space-y-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] text-white" style={{ backgroundColor: issue.color }}>{issue.num}</div>
                        <span className="text-[10px]" style={{ color: issue.color }}>{issue.cat}</span>
                      </div>
                      <div className="text-[11px] text-[#1C1C1E]">{issue.label}</div>
                    </div>
                  ))}
                  <div className="mt-4 p-2.5 rounded-lg bg-[#F7F7F8] border border-[#E8E8EA]">
                    <div className="text-[10px] text-[#9595A0] mb-1.5">AI Score</div>
                    <div className="flex items-center gap-2">
                      <div className="text-[18px] text-[#1C1C1E]">78</div>
                      <div className="flex-1 h-1.5 bg-[#E8E8EA] rounded-full overflow-hidden">
                        <div className="h-full bg-[#4B65E8] rounded-full" style={{ width: "78%" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating annotation */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl border border-[#E8E8EA] p-3 shadow-[0_4px_16px_rgba(0,0,0,0.06)] max-w-[160px]">
              <div className="flex items-start gap-2">
                <AlertTriangle size={14} className="text-[#E8A44F] mt-0.5 shrink-0" />
                <div>
                  <div className="text-[11px] text-[#1C1C1E]">Spacing issue</div>
                  <div className="text-[10px] text-[#9595A0]">8px → 16px gap</div>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 bg-white rounded-xl border border-[#E8E8EA] p-3 shadow-[0_4px_16px_rgba(0,0,0,0.06)] max-w-[160px]">
              <div className="flex items-start gap-2">
                <CheckCircle size={14} className="text-[#4CAF7D] mt-0.5 shrink-0" />
                <div>
                  <div className="text-[11px] text-[#1C1C1E]">Resolved</div>
                  <div className="text-[10px] text-[#9595A0]">Contrast fixed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
