import { MessageSquare, AlertTriangle, CheckCircle, ZoomIn, ZoomOut, Maximize } from "lucide-react";

export function DemoSection() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-14">
          <div className="text-[12px] text-[#9595A0] uppercase tracking-widest mb-4">Product Preview</div>
          <h2 className="text-[32px] text-[#1C1C1E] leading-[1.3] tracking-tight mb-4">
            The audit interface, up close.
          </h2>
          <p className="text-[15px] text-[#6E6E7A] leading-relaxed">
            A clean canvas with contextual comments, a structured issue sidebar, and instant fix suggestions.
          </p>
        </div>

        {/* Large demo mock */}
        <div className="bg-[#F7F7F8] rounded-2xl border border-[#E8E8EA] overflow-hidden shadow-[0_4px_32px_rgba(0,0,0,0.06)]">
          {/* Top bar */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-white border-b border-[#E8E8EA]">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#E8E8EA]" />
                <div className="w-3 h-3 rounded-full bg-[#E8E8EA]" />
                <div className="w-3 h-3 rounded-full bg-[#E8E8EA]" />
              </div>
              <div className="h-4 w-px bg-[#E8E8EA]" />
              <span className="text-[12px] text-[#6E6E7A]">SaaS Dashboard — v1.2.fig</span>
              <div className="text-[11px] text-[#9595A0] bg-[#F7F7F8] px-2 py-0.5 rounded-md border border-[#E8E8EA]">Draft</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-[#EEF1FF] rounded-md px-3 py-1.5">
                <div className="w-2 h-2 rounded-full bg-[#4B65E8]" />
                <span className="text-[11px] text-[#4B65E8]">AI Score: 74 / 100</span>
              </div>
              <button className="text-[11px] text-[#6E6E7A] border border-[#E8E8EA] px-3 py-1.5 rounded-md hover:border-[#C8C8CA] transition-colors">
                Export
              </button>
              <button className="text-[11px] text-white bg-[#4B65E8] px-3 py-1.5 rounded-md">
                Share
              </button>
            </div>
          </div>

          <div className="flex" style={{ minHeight: "480px" }}>
            {/* Canvas */}
            <div className="flex-1 bg-[#EBEBED] relative p-8 flex items-center justify-center">
              {/* Zoom controls */}
              <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-white border border-[#E8E8EA] rounded-lg p-1">
                <button className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#F7F7F8] transition-colors">
                  <ZoomOut size={13} className="text-[#6E6E7A]" />
                </button>
                <span className="text-[11px] text-[#6E6E7A] px-2">100%</span>
                <button className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#F7F7F8] transition-colors">
                  <ZoomIn size={13} className="text-[#6E6E7A]" />
                </button>
                <div className="w-px h-4 bg-[#E8E8EA] mx-1" />
                <button className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#F7F7F8] transition-colors">
                  <Maximize size={12} className="text-[#6E6E7A]" />
                </button>
              </div>

              {/* Design Mock */}
              <div className="w-full max-w-xl bg-white rounded-xl border border-[#E8E8EA] shadow-[0_2px_16px_rgba(0,0,0,0.05)] relative">
                {/* Design header */}
                <div className="px-6 py-4 border-b border-[#E8E8EA] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-[#4B65E8]/10" />
                    <div className="h-2.5 w-24 bg-[#F0F0F2] rounded-full" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-16 bg-[#F7F7F8] rounded-md border border-[#E8E8EA]" />
                    <div className="h-7 w-7 bg-[#4B65E8] rounded-md" />
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3">
                    {["#EEF1FF", "#EEF7F1", "#FFF8EC"].map((bg, i) => (
                      <div key={i} className="rounded-lg border border-[#E8E8EA] p-3" style={{ backgroundColor: bg }}>
                        <div className="h-3 w-8 bg-[#E8E8EA] rounded-full mb-2" />
                        <div className="h-5 w-12 bg-[#E0E0E2] rounded-full" />
                      </div>
                    ))}
                  </div>

                  {/* Content rows */}
                  {[1, 2, 3].map((row) => (
                    <div key={row} className="flex items-center gap-3 py-2 border-b border-[#F0F0F2]">
                      <div className="w-7 h-7 rounded-lg bg-[#F7F7F8] border border-[#E8E8EA] shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-2 w-3/4 bg-[#F0F0F2] rounded-full" />
                        <div className="h-2 w-1/2 bg-[#F7F7F8] rounded-full" />
                      </div>
                      <div className="h-5 w-14 bg-[#F7F7F8] rounded-full border border-[#E8E8EA]" />
                    </div>
                  ))}
                </div>

                {/* Comment pins */}
                <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-[#D4505A] text-white text-[11px] flex items-center justify-center shadow-[0_2px_8px_rgba(212,80,90,0.35)] cursor-pointer hover:scale-110 transition-transform">
                  1
                </div>
                <div className="absolute top-16 -left-3 w-7 h-7 rounded-full bg-[#E8A44F] text-white text-[11px] flex items-center justify-center shadow-[0_2px_8px_rgba(232,164,79,0.35)] cursor-pointer hover:scale-110 transition-transform">
                  2
                </div>
                <div className="absolute bottom-10 right-1/4 w-7 h-7 rounded-full bg-[#4B65E8] text-white text-[11px] flex items-center justify-center shadow-[0_2px_8px_rgba(75,101,232,0.35)] cursor-pointer hover:scale-110 transition-transform">
                  3
                </div>
                <div className="absolute bottom-3 left-8 w-7 h-7 rounded-full bg-[#4CAF7D] text-white text-[11px] flex items-center justify-center shadow-[0_2px_8px_rgba(76,175,125,0.35)] cursor-pointer hover:scale-110 transition-transform">
                  4
                </div>
              </div>
            </div>

            {/* Issue Sidebar */}
            <div className="w-[280px] bg-white border-l border-[#E8E8EA] flex flex-col">
              {/* Sidebar header */}
              <div className="px-4 py-3.5 border-b border-[#E8E8EA]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[13px] text-[#1C1C1E]">Issues</span>
                  <span className="text-[11px] text-[#9595A0] bg-[#F7F7F8] border border-[#E8E8EA] px-2 py-0.5 rounded-md">4 open</span>
                </div>
                <div className="flex gap-1.5">
                  {["All", "UX", "UI", "A11y"].map((tab, i) => (
                    <button
                      key={tab}
                      className={`text-[11px] px-2.5 py-1 rounded-md transition-colors ${i === 0 ? "bg-[#1C1C1E] text-white" : "text-[#6E6E7A] hover:bg-[#F7F7F8]"}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Issues list */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {[
                  { num: 1, title: "Low contrast body text", cat: "Accessibility", sev: "High", color: "#D4505A", bg: "#FFF0F1" },
                  { num: 2, title: "Inconsistent padding in cards", cat: "Layout", sev: "Medium", color: "#E8A44F", bg: "#FFF8EC" },
                  { num: 3, title: "Missing focus ring on buttons", cat: "UX", sev: "Medium", color: "#4B65E8", bg: "#EEF1FF" },
                  { num: 4, title: "Font size inconsistency", cat: "UI", sev: "Low", color: "#4CAF7D", bg: "#EEF7F1", resolved: true },
                ].map((issue) => (
                  <div
                    key={issue.num}
                    className={`p-3 rounded-xl border transition-all duration-150 cursor-pointer ${issue.resolved ? "bg-[#F9FAF9] border-[#E8E8EA] opacity-60" : "bg-white border-[#E8E8EA] hover:border-[#C8C8CA]"} ${issue.num === 1 ? "border-[#D4505A]/30 bg-[#FFF8F8]" : ""}`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div
                        className="w-5 h-5 rounded-full text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5"
                        style={{ backgroundColor: issue.resolved ? "#9595A0" : issue.color }}
                      >
                        {issue.resolved ? "✓" : issue.num}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] text-[#1C1C1E] mb-1 leading-snug">{issue.title}</div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md" style={{ color: issue.color, backgroundColor: issue.bg }}>
                            {issue.cat}
                          </span>
                          <span className="text-[10px] text-[#9595A0]">{issue.sev}</span>
                          {issue.resolved && <span className="text-[10px] text-[#4CAF7D]">Resolved</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Active issue detail */}
              <div className="border-t border-[#E8E8EA] p-4 bg-[#F7F7F8]">
                <div className="text-[10px] text-[#9595A0] mb-2">Issue #1 — Active</div>
                <div className="text-[12px] text-[#1C1C1E] mb-2">Low contrast body text</div>
                <div className="text-[11px] text-[#6E6E7A] mb-3 leading-relaxed">
                  Text color #8A8A8A on white fails WCAG AA at 3.2:1 ratio. Minimum 4.5:1 required.
                </div>
                <button className="w-full text-[11px] text-white bg-[#4B65E8] py-2 rounded-lg hover:bg-[#3a54d7] transition-colors">
                  Mark as Resolved
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
