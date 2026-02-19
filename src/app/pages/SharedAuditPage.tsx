import { useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Zap, AlertTriangle, Info, CheckCircle, ExternalLink } from "lucide-react";
import type { AuditIssue } from "../context/AuditContext";

type Severity = "High" | "Medium" | "Low";
type Category = "Accessibility" | "UX" | "UI" | "Layout" | "Content";

const severityColors: Record<Severity, { text: string; bg: string; border: string }> = {
  High:   { text: "#D4505A", bg: "#FFF0F1", border: "#F5C5C8" },
  Medium: { text: "#C8882A", bg: "#FFF8EC", border: "#F0D9AB" },
  Low:    { text: "#4B65E8", bg: "#EEF1FF", border: "#C5CFFC" },
};

const categoryColors: Record<Category, { text: string; bg: string }> = {
  Accessibility: { text: "#D4505A", bg: "#FFF0F1" },
  UX:            { text: "#4B65E8", bg: "#EEF1FF" },
  UI:            { text: "#8B5CF6", bg: "#F3EEFF" },
  Layout:        { text: "#C8882A", bg: "#FFF8EC" },
  Content:       { text: "#4CAF7D", bg: "#EEF7F1" },
};

interface SharePayload {
  title: string;
  issues: AuditIssue[];
  score: number;
  designType: string;
  createdAt: string;
}

export default function SharedAuditPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dataParam = searchParams.get("data");

  const payload = useMemo<SharePayload | null>(() => {
    if (!dataParam) return null;
    try {
      const json = atob(decodeURIComponent(dataParam));
      return JSON.parse(json) as SharePayload;
    } catch {
      return null;
    }
  }, [dataParam]);

  if (!payload) {
    return (
      <div className="min-h-screen bg-[#F7F7F8] flex flex-col items-center justify-center px-6" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF0F1] flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={20} className="text-[#D4505A]" />
          </div>
          <h1 className="text-[20px] text-[#1C1C1E] mb-2">Invalid share link</h1>
          <p className="text-[13px] text-[#6E6E7A] mb-6">This audit link is invalid or has expired.</p>
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2.5 rounded-xl bg-[#4B65E8] text-white text-[13px] hover:bg-[#3a54d7] transition-colors"
          >
            Go to Auditwise
          </button>
        </div>
      </div>
    );
  }

  const openIssues = payload.issues.filter((i) => i.status === "open");
  const resolvedIssues = payload.issues.filter((i) => i.status === "resolved");
  const highCount = payload.issues.filter((i) => i.severity === "High").length;
  const medCount = payload.issues.filter((i) => i.severity === "Medium").length;
  const lowCount = payload.issues.filter((i) => i.severity === "Low").length;

  return (
    <div className="min-h-screen bg-[#F7F7F8]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b border-[#E8E8EA] bg-white/90 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#4B65E8] flex items-center justify-center">
            <Zap size={13} className="text-white" strokeWidth={2} />
          </div>
          <span className="text-[14px] text-[#1C1C1E]">Auditwise</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] px-2 py-1 rounded-md bg-[#EEF1FF] text-[#4B65E8]">
            Shared Audit Report
          </span>
        </div>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-[12px] text-[#6E6E7A] hover:text-[#4B65E8] transition-colors"
        >
          <ExternalLink size={12} />
          Try Auditwise
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Cover */}
        <div className="bg-white rounded-2xl border border-[#E8E8EA] p-8 mb-6 shadow-[0_2px_24px_rgba(0,0,0,0.04)]">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-[22px] text-[#1C1C1E] tracking-tight mb-1">{payload.title}</h1>
              <p className="text-[12px] text-[#9595A0]">
                {payload.designType.toUpperCase()} · Shared audit · {payload.createdAt}
              </p>
            </div>
            {/* Score ring */}
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14">
                <svg className="absolute inset-0 -rotate-90" width="56" height="56" viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r="22" fill="none" stroke="#E8E8EA" strokeWidth="3" />
                  <circle
                    cx="28" cy="28" r="22" fill="none"
                    stroke={payload.score >= 80 ? "#4CAF7D" : payload.score >= 60 ? "#E8A44F" : "#D4505A"}
                    strokeWidth="3"
                    strokeDasharray={`${(payload.score / 100) * 138.2} 138.2`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[15px] text-[#1C1C1E]">
                  {payload.score}
                </span>
              </div>
              <div>
                <div className="text-[10px] text-[#9595A0]">AI Score</div>
                <div className="text-[12px] text-[#1C1C1E]">
                  {payload.score >= 80 ? "Good" : payload.score >= 60 ? "Needs work" : "Critical"}
                </div>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-3 mt-6">
            {[
              { label: "Total Issues", value: payload.issues.length, color: "#1C1C1E", bg: "#F7F7F8" },
              { label: "High", value: highCount, color: "#D4505A", bg: "#FFF0F1" },
              { label: "Medium", value: medCount, color: "#C8882A", bg: "#FFF8EC" },
              { label: "Low", value: lowCount, color: "#4B65E8", bg: "#EEF1FF" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-[#E8E8EA] p-3 text-center" style={{ background: s.bg }}>
                <div className="text-[18px]" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[10px] text-[#9595A0] mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Issues */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] text-[#1C1C1E]">
              Issues <span className="text-[#9595A0]">({payload.issues.length})</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] px-2 py-0.5 rounded-md text-[#D4505A] bg-[#FFF0F1]">{openIssues.length} open</span>
              <span className="text-[11px] px-2 py-0.5 rounded-md text-[#4CAF7D] bg-[#EEF7F1]">{resolvedIssues.length} resolved</span>
            </div>
          </div>

          {payload.issues.map((issue) => {
            const sev = severityColors[issue.severity as Severity];
            const cat = categoryColors[issue.category as Category];
            const isResolved = issue.status === "resolved";

            return (
              <div
                key={issue.id}
                className="bg-white rounded-xl border border-[#E8E8EA] overflow-hidden"
                style={{ opacity: isResolved ? 0.7 : 1 }}
              >
                <div className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="w-6 h-6 rounded-full text-white text-[11px] flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: isResolved ? "#4CAF7D" : sev.text }}
                    >
                      {isResolved ? <CheckCircle size={12} /> : issue.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] text-[#1C1C1E] mb-2">{issue.title}</div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md" style={{ color: cat.text, background: cat.bg }}>
                          {issue.category}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md" style={{ color: sev.text, background: sev.bg }}>
                          {issue.severity}
                        </span>
                        {isResolved && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md text-[#4CAF7D] bg-[#EEF7F1]">Resolved</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pl-9">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-[#9595A0] mb-1">What's wrong</div>
                      <p className="text-[12px] text-[#1C1C1E] leading-relaxed">{issue.explanation}</p>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-[#9595A0] mb-1">How to fix</div>
                      <p className="text-[12px] text-[#1C1C1E] leading-relaxed">{issue.howToFix}</p>
                    </div>
                    <div className="rounded-lg border border-[#4B65E8]/20 bg-[#F4F6FF] p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Info size={10} className="text-[#4B65E8]" />
                        <span className="text-[10px] text-[#4B65E8]">Suggestion</span>
                      </div>
                      <p className="text-[11px] text-[#1C1C1E] leading-relaxed">{issue.suggestion}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-10 text-center space-y-4">
          <p className="text-[12px] text-[#9595A0]">
            This audit was generated by Auditwise · AI-powered design audit tool
          </p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4B65E8] text-white text-[13px] hover:bg-[#3a54d7] transition-colors"
          >
            <Zap size={13} />
            Run your own audit
          </button>
        </div>
      </main>
    </div>
  );
}
