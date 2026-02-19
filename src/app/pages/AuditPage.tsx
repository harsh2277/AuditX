import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  ZoomIn, ZoomOut, Maximize2, Download, Share2, ChevronDown,
  X, CheckCircle, Info, ArrowLeft, Zap,
  Sun, Moon, History, MessageSquare, BarChart2,
  ChevronUp, Layers, Copy, Check, FileDown, Link2, Move,
} from "lucide-react";
import { SmartScoresPanel } from "../components/audit/SmartScoresPanel";
import { useAudit } from "../context/AuditContext";
import type { AuditIssue, Severity, Category } from "../context/AuditContext";

// ── Static defaults / fallback issues ────────────────────────────────────────

const FALLBACK_ISSUES: AuditIssue[] = [
  { id: 1, title: "Low contrast body text", category: "Accessibility", severity: "High", status: "open", explanation: "Body text uses a colour that produces a contrast ratio of 3.2:1 on white — below the WCAG AA minimum of 4.5:1.", howToFix: "Darken the text colour to #595959 or darker to achieve a ratio of at least 4.5:1.", suggestion: "Replace #8A8A8A body text with #595959 throughout.", x: 72, y: 18 },
  { id: 2, title: "Inconsistent card padding", category: "Layout", severity: "Medium", status: "open", explanation: "Cards in the dashboard grid use different internal padding (16px, 20px, 24px), creating visual inconsistency.", howToFix: "Standardise all cards to a single padding value — 20px or 24px both work well at desktop.", suggestion: "Update Card component to use a uniform padding of 24px.", x: 18, y: 48 },
  { id: 3, title: "Missing focus ring on CTAs", category: "UX", severity: "Medium", status: "open", explanation: "Primary buttons have no visible focus ring when navigated via keyboard, creating an accessibility barrier.", howToFix: "Add focus-visible styles using outline or box-shadow. Never suppress the default outline without a replacement.", suggestion: "Add focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#4B65E8] to the Button component.", x: 55, y: 65 },
  { id: 4, title: "Icon buttons missing labels", category: "Accessibility", severity: "High", status: "open", explanation: "Icon-only buttons in the top navigation lack accessible labels. Screen readers cannot convey their purpose.", howToFix: "Add aria-label attributes to all icon-only interactive elements.", suggestion: "Add aria-label='Export report' to the export icon button and similar labels elsewhere.", x: 82, y: 42 },
  { id: 5, title: "Heading hierarchy skip", category: "Content", severity: "Medium", status: "open", explanation: "The page jumps from H1 to H4, skipping H2/H3. This breaks semantic structure for assistive technologies.", howToFix: "Restructure heading levels to follow H1 → H2 → H3 sequence.", suggestion: "Convert sidebar section titles from H4 to H2 and remove visual-only overrides.", x: 35, y: 28 },
  { id: 6, title: "Off-grid 8px spacing", category: "Layout", severity: "Low", status: "open", explanation: "Several elements use spacing values of 10px, 14px, or 18px that fall outside the 8px base grid.", howToFix: "Audit all margin/padding values and align them to the 8px scale: 8, 16, 24, 32, 40px.", suggestion: "Replace 10px gaps with 8px, and 14px with 16px.", x: 48, y: 82 },
];

// ── Color maps ────────────────────────────────────────────────────────────────

const severityColors: Record<Severity, { text: string; bg: string; border: string; pin: string }> = {
  High:   { text: "#D4505A", bg: "#FFF0F1", border: "#F5C5C8", pin: "#D4505A" },
  Medium: { text: "#C8882A", bg: "#FFF8EC", border: "#F0D9AB", pin: "#E8A44F" },
  Low:    { text: "#4B65E8", bg: "#EEF1FF", border: "#C5CFFC", pin: "#4B65E8" },
};

const categoryColors: Record<Category, { text: string; bg: string }> = {
  Accessibility: { text: "#D4505A", bg: "#FFF0F1" },
  UX:            { text: "#4B65E8", bg: "#EEF1FF" },
  UI:            { text: "#8B5CF6", bg: "#F3EEFF" },
  Layout:        { text: "#C8882A", bg: "#FFF8EC" },
  Content:       { text: "#4CAF7D", bg: "#EEF7F1" },
};

// ── ScoreRing ─────────────────────────────────────────────────────────────────

function ScoreRing({ score }: { score: number }) {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 80 ? "#4CAF7D" : score >= 60 ? "#E8A44F" : "#D4505A";
  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="56" height="56" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={r} fill="none" stroke="#E8E8EA" strokeWidth="3" />
        <circle cx="28" cy="28" r={r} fill="none" stroke={color} strokeWidth="3"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
      </svg>
      <span className="text-[14px] text-[#1C1C1E] relative z-10">{score}</span>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function AuditPage() {
  const navigate = useNavigate();
  const { issues: ctxIssues, setIssues: setCtxIssues, designImageUrl, auditTitle, designInput } = useAudit();

  // Use context issues if available, else fallback
  const [issues, setIssues] = useState<AuditIssue[]>(
    ctxIssues.length > 0 ? ctxIssues : FALLBACK_ISSUES
  );

  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(issues[0]?.id ?? null);
  const [focusedIssueId, setFocusedIssueId] = useState<number | null>(null); // pin-click focus
  const [activeTab, setActiveTab] = useState<"open" | "resolved">("open");
  const [darkMode, setDarkMode] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [panelOpen, setPanelOpen] = useState(true);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  // Canvas pan/zoom
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasTransform, setCanvasTransform] = useState({ x: 0, y: 0, scale: 1 });
  const isPanning = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const [isCursorPanning, setIsCursorPanning] = useState(false);

  // Derived
  const openIssues = issues.filter((i) => i.status === "open");
  const resolvedIssues = issues.filter((i) => i.status === "resolved");
  const displayedIssues = (activeTab === "open" ? openIssues : resolvedIssues).filter(
    (i) => categoryFilter === "All" || i.category === categoryFilter
  );
  const auditScore = Math.round(74 + (resolvedIssues.length / issues.length) * 20);
  const selectedIssue = issues.find((i) => i.id === selectedIssueId) ?? null;
  const focusedIssue = focusedIssueId ? issues.find((i) => i.id === focusedIssueId) : null;
  const categories = ["All", "Accessibility", "UX", "UI", "Layout", "Content"];

  // Theme
  const bg        = darkMode ? "#111114" : "#F7F7F8";
  const cardBg    = darkMode ? "#1C1C1F" : "#FFFFFF";
  const border    = darkMode ? "#2C2C2F" : "#E8E8EA";
  const textPrim  = darkMode ? "#F0F0F2" : "#1C1C1E";
  const textSec   = darkMode ? "#9595A0" : "#6E6E7A";
  const canvasBg  = darkMode ? "#0D0D10" : "#EBEBED";

  // Sync to context
  const handleResolve = (id: number) => {
    const updated = issues.map((i) => i.id === id ? { ...i, status: "resolved" as const } : i);
    setIssues(updated);
    setCtxIssues(updated);
    const next = updated.find((i) => i.id !== id && i.status === "open");
    setSelectedIssueId(next?.id ?? null);
    setFocusedIssueId(null);
  };
  const handleReopen = (id: number) => {
    const updated = issues.map((i) => i.id === id ? { ...i, status: "open" as const } : i);
    setIssues(updated);
    setCtxIssues(updated);
  };

  // ── Canvas pan/zoom ─────────────────────────────────────────────────────────

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.08 : 0.93;
      setCanvasTransform((t) => ({
        ...t,
        scale: Math.min(Math.max(t.scale * factor, 0.1), 5),
      }));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    // Allow panning anywhere on the canvas background, or with middle button
    if (e.button === 1 || e.button === 0) {
      isPanning.current = true;
      lastPos.current = { x: e.clientX, y: e.clientY };
      setIsCursorPanning(true);
    }
  }, []);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    setCanvasTransform((t) => ({ ...t, x: t.x + dx, y: t.y + dy }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleCanvasMouseUp = useCallback(() => {
    isPanning.current = false;
    setIsCursorPanning(false);
  }, []);

  const resetZoom = () => setCanvasTransform({ x: 0, y: 0, scale: 1 });
  const zoomIn  = () => setCanvasTransform((t) => ({ ...t, scale: Math.min(t.scale * 1.2, 5) }));
  const zoomOut = () => setCanvasTransform((t) => ({ ...t, scale: Math.max(t.scale * 0.8, 0.1) }));

  // ── Share ───────────────────────────────────────────────────────────────────

  const generateShareUrl = () => {
    const payload = {
      title: auditTitle,
      issues,
      score: auditScore,
      designType: designInput?.type ?? "unknown",
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    const encoded = encodeURIComponent(btoa(JSON.stringify(payload)));
    const url = `${window.location.origin}/audit/shared?data=${encoded}`;
    setShareUrl(url);
    setShowShareModal(true);
  };

  const copyShareUrl = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  // ── PDF Export ──────────────────────────────────────────────────────────────

  const exportPDF = () => {
    const scoreColor = auditScore >= 80 ? "#4CAF7D" : auditScore >= 60 ? "#E8A44F" : "#D4505A";
    const issueRows = issues.map((issue) => {
      const sevBg = issue.severity === "High" ? "#FFF0F1" : issue.severity === "Medium" ? "#FFF8EC" : "#EEF1FF";
      const sevColor = issue.severity === "High" ? "#D4505A" : issue.severity === "Medium" ? "#C8882A" : "#4B65E8";
      const catBg = issue.category === "Accessibility" ? "#FFF0F1" : issue.category === "UX" ? "#EEF1FF" : issue.category === "UI" ? "#F3EEFF" : issue.category === "Layout" ? "#FFF8EC" : "#EEF7F1";
      const catColor = issue.category === "Accessibility" ? "#D4505A" : issue.category === "UX" ? "#4B65E8" : issue.category === "UI" ? "#8B5CF6" : issue.category === "Layout" ? "#C8882A" : "#4CAF7D";
      return `
        <div style="border:1px solid #E8E8EA;border-radius:12px;padding:20px;margin-bottom:12px;${issue.status === "resolved" ? "opacity:0.65;" : ""}background:#fff;">
          <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px;">
            <div style="width:22px;height:22px;border-radius:50%;background:${issue.status === "resolved" ? "#4CAF7D" : sevColor};color:#fff;font-size:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0;min-width:22px;">
              ${issue.status === "resolved" ? "✓" : issue.id}
            </div>
            <div style="flex:1;">
              <div style="font-size:14px;color:#1C1C1E;margin-bottom:8px;">${issue.title}</div>
              <div style="display:flex;gap:6px;flex-wrap:wrap;">
                <span style="font-size:10px;padding:2px 8px;border-radius:6px;background:${catBg};color:${catColor};">${issue.category}</span>
                <span style="font-size:10px;padding:2px 8px;border-radius:6px;background:${sevBg};color:${sevColor};">${issue.severity}</span>
                ${issue.status === "resolved" ? '<span style="font-size:10px;padding:2px 8px;border-radius:6px;background:#EEF7F1;color:#4CAF7D;">Resolved</span>' : ""}
              </div>
            </div>
          </div>
          <div style="padding-left:34px;">
            <div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#9595A0;margin-bottom:4px;">What's wrong</div>
            <p style="font-size:12px;color:#1C1C1E;line-height:1.6;margin:0 0 12px;">${issue.explanation}</p>
            <div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#9595A0;margin-bottom:4px;">How to fix</div>
            <p style="font-size:12px;color:#1C1C1E;line-height:1.6;margin:0 0 12px;">${issue.howToFix}</p>
            <div style="background:#F4F6FF;border:1px solid rgba(75,101,232,.18);border-radius:8px;padding:10px;">
              <div style="font-size:10px;color:#4B65E8;margin-bottom:4px;">↳ AI Suggestion</div>
              <p style="font-size:11px;color:#1C1C1E;line-height:1.6;margin:0;">${issue.suggestion}</p>
            </div>
          </div>
        </div>`;
    }).join("");

    const statsHtml = [
      { label: "Total Issues", v: issues.length, c: "#1C1C1E", bg: "#F7F7F8" },
      { label: "High", v: issues.filter((i) => i.severity === "High").length, c: "#D4505A", bg: "#FFF0F1" },
      { label: "Medium", v: issues.filter((i) => i.severity === "Medium").length, c: "#C8882A", bg: "#FFF8EC" },
      { label: "Low", v: issues.filter((i) => i.severity === "Low").length, c: "#4B65E8", bg: "#EEF1FF" },
    ].map((s) => `<div style="background:${s.bg};border:1px solid #E8E8EA;border-radius:12px;padding:14px;text-align:center;"><div style="font-size:28px;color:${s.c};">${s.v}</div><div style="font-size:10px;color:#9595A0;margin-top:2px;">${s.label}</div></div>`).join("");

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
      <title>${auditTitle} — Auditwise Audit Report</title>
      <style>*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Helvetica Neue',Arial,sans-serif;background:#F7F7F8;color:#1C1C1E;}@media print{body{background:#fff;}@page{margin:15mm 12mm;}}</style>
    </head><body>
      <div style="max-width:760px;margin:0 auto;padding:32px 24px;">
        <div style="background:#4B65E8;color:#fff;border-radius:16px;padding:24px;margin-bottom:24px;">
          <div style="font-size:10px;opacity:.7;margin-bottom:6px;letter-spacing:.08em;">AUDITWISE · AI DESIGN AUDIT REPORT</div>
          <div style="font-size:26px;margin-bottom:4px;">${auditTitle}</div>
          <div style="font-size:12px;opacity:.75;">${(designInput?.type ?? "unknown").toUpperCase()} · ${designInput?.auditDepth ?? "Standard"} audit · ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
        </div>
        <div style="display:grid;grid-template-columns:auto 1fr;gap:16px;margin-bottom:24px;align-items:start;">
          <div style="background:#fff;border-radius:16px;border:1px solid #E8E8EA;padding:20px 24px;text-align:center;">
            <div style="font-size:48px;color:${scoreColor};">${auditScore}</div>
            <div style="font-size:11px;color:#9595A0;">AI Design Score</div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;">${statsHtml}</div>
        </div>
        <div style="font-size:15px;color:#1C1C1E;margin-bottom:16px;">Design Issues</div>
        ${issueRows}
        <div style="margin-top:24px;padding-top:16px;border-top:1px solid #E8E8EA;text-align:center;font-size:11px;color:#9595A0;">
          Generated by Auditwise · AI-powered design audit · ${new Date().toISOString().split("T")[0]}
        </div>
      </div>
    </body></html>`;

    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) { alert("Please allow popups to download the PDF."); return; }
    win.document.write(html);
    win.document.close();
    win.addEventListener("load", () => setTimeout(() => win.print(), 500));
    setShowExportMenu(false);
  };

  // Close menus on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest("[data-export-menu]")) setShowExportMenu(false);
      if (!t.closest("[data-share-modal]")) setShowShareModal(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ background: bg, fontFamily: "'Inter', sans-serif", color: textPrim, transition: "background 0.2s, color 0.2s" }}
    >
      {/* ── Top bar ── */}
      <header
        className="flex items-center justify-between px-4 py-2.5 border-b shrink-0 z-20"
        style={{ background: cardBg, borderColor: border }}
      >
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/upload")}
            className="flex items-center gap-1.5 text-[12px] transition-colors hover:opacity-70"
            style={{ color: textSec }}
          >
            <ArrowLeft size={13} />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="w-px h-4" style={{ background: border }} />
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-[#4B65E8] flex items-center justify-center">
              <Zap size={10} className="text-white" strokeWidth={2} />
            </div>
            <span className="text-[12px] hidden sm:inline" style={{ color: textSec }}>Auditwise</span>
          </div>
          <div className="w-px h-4 hidden sm:block" style={{ background: border }} />
          <span className="text-[13px] hidden sm:block truncate max-w-[160px]" style={{ color: textPrim }}>{auditTitle}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-md hidden sm:inline" style={{ color: "#6E6E7A", background: darkMode ? "#2C2C2F" : "#F0F0F2" }}>
            {designInput?.auditDepth ?? "Standard"}
          </span>
        </div>

        {/* Center */}
        <div className="flex items-center gap-3">
          <ScoreRing score={auditScore} />
          <div className="hidden md:block">
            <div className="text-[10px]" style={{ color: textSec }}>AI Design Score</div>
            <div className="text-[12px]" style={{ color: textPrim }}>
              {auditScore >= 80 ? "Good" : auditScore >= 60 ? "Needs Attention" : "Critical Issues"}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1.5">
          {/* Version */}
          <button
            className="hidden md:flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-lg border transition-colors hover:opacity-80"
            style={{ color: textSec, borderColor: border }}
          >
            <History size={12} />
            v1.0
            <ChevronDown size={11} />
          </button>

          {/* Dark mode */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-8 h-8 rounded-lg border flex items-center justify-center transition-all hover:opacity-80"
            style={{ borderColor: border }}
          >
            {darkMode ? <Sun size={13} style={{ color: textSec }} /> : <Moon size={13} style={{ color: textSec }} />}
          </button>

          {/* Export */}
          <div className="relative" data-export-menu>
            <button
              onClick={(e) => { e.stopPropagation(); setShowExportMenu(!showExportMenu); }}
              className="hidden md:flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-lg border transition-colors hover:opacity-80"
              style={{ color: textSec, borderColor: border }}
            >
              <Download size={12} />
              Export
              <ChevronDown size={11} />
            </button>
            {showExportMenu && (
              <div
                className="absolute right-0 top-10 w-44 rounded-xl border shadow-[0_4px_24px_rgba(0,0,0,0.10)] z-50 overflow-hidden"
                style={{ background: cardBg, borderColor: border }}
              >
                <button
                  onClick={exportPDF}
                  className="w-full text-left flex items-center gap-2.5 px-4 py-3 text-[12px] transition-colors hover:bg-[#F7F7F8] border-b"
                  style={{ color: textPrim, borderColor: border }}
                >
                  <FileDown size={13} className="text-[#D4505A]" />
                  Download PDF Report
                </button>
                <button
                  onClick={() => {
                    const openIss = issues.filter((i) => i.status === "open");
                    const lines = [`${auditTitle} — Audit Report`, `Score: ${auditScore}/100`, `\nIssues (${openIss.length} open):\n`,
                      ...openIss.map((i) => `[${i.severity}] ${i.title}\n  ${i.explanation}\n  Fix: ${i.howToFix}\n`)
                    ].join("\n");
                    const blob = new Blob([lines], { type: "text/plain" });
                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(blob);
                    a.download = `${auditTitle.replace(/[^a-z0-9]/gi, "-")}-audit.txt`;
                    a.click();
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left flex items-center gap-2.5 px-4 py-3 text-[12px] transition-colors hover:bg-[#F7F7F8]"
                  style={{ color: textPrim }}
                >
                  <FileDown size={13} className="text-[#4B65E8]" />
                  Export as Text
                </button>
              </div>
            )}
          </div>

          {/* Share */}
          <div className="relative" data-share-modal>
            <button
              onClick={(e) => { e.stopPropagation(); generateShareUrl(); }}
              className="flex items-center gap-1.5 text-[12px] px-4 py-1.5 rounded-lg transition-colors bg-[#4B65E8] text-white hover:bg-[#3a54d7]"
            >
              <Share2 size={12} />
              Share
            </button>
            {showShareModal && (
              <div
                className="absolute right-0 top-10 w-80 rounded-2xl border shadow-[0_8px_32px_rgba(0,0,0,0.12)] z-50 p-4 space-y-3"
                style={{ background: cardBg, borderColor: border }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link2 size={13} className="text-[#4B65E8]" />
                    <span className="text-[13px]" style={{ color: textPrim }}>Share audit link</span>
                  </div>
                  <button onClick={() => setShowShareModal(false)} style={{ color: textSec }}><X size={13} /></button>
                </div>
                <p className="text-[11px]" style={{ color: textSec }}>
                  Anyone with this link can view the full audit report (read-only).
                </p>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={shareUrl}
                    className="flex-1 min-w-0 px-3 py-2 text-[11px] rounded-lg border truncate"
                    style={{ background: darkMode ? "#111114" : "#F7F7F8", borderColor: border, color: textSec }}
                  />
                  <button
                    onClick={copyShareUrl}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] transition-colors bg-[#4B65E8] text-white hover:bg-[#3a54d7] shrink-0"
                  >
                    {shareCopied ? <Check size={12} /> : <Copy size={12} />}
                    {shareCopied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p className="text-[10px]" style={{ color: textSec }}>
                  Link contains the full audit data — no server required.
                </p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Canvas (70%) ── */}
        <div
          ref={canvasRef}
          className="flex-1 relative overflow-hidden select-none"
          style={{
            background: canvasBg,
            cursor: isCursorPanning ? "grabbing" : "grab",
          }}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
        >
          {/* Zoom controls */}
          <div
            className="absolute bottom-4 left-4 z-10 flex items-center gap-1 rounded-xl border shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
            style={{ background: cardBg, borderColor: border }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button onClick={zoomOut} className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:opacity-70">
              <ZoomOut size={13} style={{ color: textSec }} />
            </button>
            <span className="text-[11px] px-2 min-w-[44px] text-center" style={{ color: textSec }}>
              {Math.round(canvasTransform.scale * 100)}%
            </span>
            <button onClick={zoomIn} className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:opacity-70">
              <ZoomIn size={13} style={{ color: textSec }} />
            </button>
            <div className="w-px h-4 mx-0.5" style={{ background: border }} />
            <button onClick={resetZoom} className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:opacity-70">
              <Maximize2 size={12} style={{ color: textSec }} />
            </button>
          </div>

          {/* Pan hint */}
          <div
            className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-[11px] px-3 py-1.5 rounded-lg border flex items-center gap-1.5"
            style={{ color: textSec, background: cardBg, borderColor: border }}
          >
            <Move size={11} />
            Drag to pan · Scroll to zoom · Click pin to inspect
          </div>

          {/* Canvas viewport */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{
              transform: `translate(${canvasTransform.x}px, ${canvasTransform.y}px) scale(${canvasTransform.scale})`,
              transformOrigin: "center center",
              transition: isPanning.current ? "none" : "transform 0.05s ease",
            }}
          >
            {/* Design frame */}
            <div
              className="relative rounded-2xl border overflow-hidden pointer-events-auto"
              style={{
                width: "600px",
                minHeight: "420px",
                background: cardBg,
                borderColor: border,
                boxShadow: "0 8px 48px rgba(0,0,0,0.12)",
              }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: border, background: darkMode ? "#161618" : "#F7F7F8" }}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#E8E8EA]" />
                  <div className="w-3 h-3 rounded-full bg-[#E8E8EA]" />
                  <div className="w-3 h-3 rounded-full bg-[#E8E8EA]" />
                </div>
                <div className="flex-1 mx-4 h-5 rounded-md text-[10px] flex items-center px-2 truncate" style={{ background: darkMode ? "#2C2C2F" : "#EDEDEF", color: textSec }}>
                  {designInput?.type === "url" ? designInput.urlValue : (designInput?.fileName ?? "Design Preview")}
                </div>
              </div>

              {/* Design content */}
              {designImageUrl ? (
                <img
                  src={designImageUrl}
                  alt="Design being audited"
                  className="w-full block"
                  style={{ maxHeight: "600px", objectFit: "contain" }}
                  draggable={false}
                />
              ) : designInput?.type === "url" && designInput.urlValue ? (
                <div className="relative" style={{ height: "420px" }}>
                  <iframe
                    src={designInput.urlValue}
                    title="Website preview"
                    className="w-full h-full border-0"
                    style={{ pointerEvents: "none" }}
                    sandbox="allow-scripts allow-same-origin"
                  />
                  <div className="absolute inset-0 bg-transparent pointer-events-none" />
                </div>
              ) : (
                /* Fallback mock design */
                <div className="flex" style={{ minHeight: "400px" }}>
                  <div className="w-[140px] border-r p-4 space-y-2" style={{ borderColor: border }}>
                    <div className="h-6 w-20 rounded-md mb-4" style={{ background: darkMode ? "#2C2C2F" : "#F0F0F2" }} />
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-7 rounded-md flex items-center px-2 gap-2"
                        style={{ background: i === 1 ? (darkMode ? "#2C2C2F" : "#EEF1FF") : "transparent" }}>
                        <div className="w-3 h-3 rounded" style={{ background: darkMode ? "#3C3C3F" : "#E0E0E2" }} />
                        <div className="h-2 flex-1 rounded-full" style={{ background: darkMode ? "#3C3C3F" : "#F0F0F2" }} />
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 p-5 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-4 w-28 rounded-full" style={{ background: darkMode ? "#3C3C3F" : "#E8E8EA" }} />
                      <div className="flex gap-2">
                        <div className="h-7 w-20 rounded-lg" style={{ background: darkMode ? "#2C2C2F" : "#F0F0F2" }} />
                        <div className="h-7 w-7 rounded-lg bg-[#4B65E8]/20" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[{ color: "#EEF1FF" }, { color: "#EEF7F1" }, { color: "#FFF8EC" }].map((c, i) => (
                        <div key={i} className="rounded-xl border p-3 space-y-2" style={{ borderColor: border, background: darkMode ? "#1C1C1F" : c.color }}>
                          <div className="h-2 w-8 rounded-full" style={{ background: darkMode ? "#3C3C3F" : "#D8D8DA" }} />
                          <div className="h-5 w-14 rounded-full" style={{ background: darkMode ? "#3C3C3F" : "#C8C8CA" }} />
                        </div>
                      ))}
                    </div>
                    {[1, 2, 3, 4].map((r) => (
                      <div key={r} className="flex items-center gap-3 py-3 border-b" style={{ borderColor: darkMode ? "#2C2C2F" : "#F0F0F2" }}>
                        <div className="w-7 h-7 rounded-lg" style={{ background: darkMode ? "#2C2C2F" : "#F0F0F2" }} />
                        <div className="flex-1 space-y-1.5">
                          <div className="h-2 w-3/4 rounded-full" style={{ background: darkMode ? "#3C3C3F" : "#EDEDEF" }} />
                          <div className="h-2 w-1/2 rounded-full" style={{ background: darkMode ? "#2C2C2F" : "#F5F5F7" }} />
                        </div>
                        <div className="h-5 w-14 rounded-full border" style={{ borderColor: border, background: darkMode ? "#2C2C2F" : "#F7F7F8" }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Issue pins — overlaid absolutely */}
              {issues.map((issue) => {
                const isResolved = issue.status === "resolved";
                const colors = severityColors[issue.severity];
                const isSelected = selectedIssueId === issue.id;
                const isFocused = focusedIssueId === issue.id;

                return (
                  <button
                    key={issue.id}
                    onClick={() => {
                      setSelectedIssueId(issue.id);
                      setFocusedIssueId(issue.id); // focus mode on pin click
                      setPanelOpen(true);
                    }}
                    className="absolute flex items-center justify-center rounded-full text-white text-[11px] transition-all duration-150 hover:scale-110 focus:outline-none"
                    style={{
                      left: `${issue.x}%`,
                      top: `${issue.y}%`,
                      transform: `translate(-50%, -50%) scale(${isSelected || isFocused ? 1.25 : 1})`,
                      width: isSelected ? "30px" : "24px",
                      height: isSelected ? "30px" : "24px",
                      backgroundColor: isResolved ? "#4CAF7D" : colors.pin,
                      boxShadow: isResolved
                        ? "0 2px 10px rgba(76,175,125,0.45)"
                        : `0 2px 10px ${colors.pin}66`,
                      opacity: isResolved ? 0.65 : 1,
                      zIndex: isSelected || isFocused ? 30 : 10,
                      border: isSelected ? "2.5px solid white" : "none",
                    }}
                    title={issue.title}
                  >
                    {isResolved ? "✓" : issue.id}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Sidebar (30%) ── */}
        <div
          className={`
            fixed md:relative bottom-0 left-0 right-0 md:left-auto flex flex-col border-t md:border-t-0 md:border-l
            transition-transform duration-300 ease-out z-30 md:translate-y-0 md:w-[320px] lg:w-[350px]
            ${panelOpen ? "translate-y-0" : "translate-y-[calc(100%-48px)]"}
          `}
          style={{ background: cardBg, borderColor: border, height: "calc(100vh - 54px)", maxHeight: "calc(100vh - 54px)" }}
        >
          {/* Mobile drag handle */}
          <div
            className="md:hidden flex items-center justify-between px-4 py-3 border-b cursor-pointer"
            style={{ borderColor: border }}
            onClick={() => setPanelOpen(!panelOpen)}
          >
            <div className="flex items-center gap-2">
              <Layers size={13} style={{ color: textSec }} />
              <span className="text-[13px]" style={{ color: textPrim }}>Issues</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md" style={{ color: "#D4505A", background: "#FFF0F1" }}>{openIssues.length}</span>
            </div>
            {panelOpen ? <ChevronDown size={14} style={{ color: textSec }} /> : <ChevronUp size={14} style={{ color: textSec }} />}
          </div>

          {/* ── FOCUSED ISSUE VIEW ── */}
          {focusedIssue ? (
            <div className="flex flex-col h-full overflow-hidden">
              {/* Back header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b shrink-0" style={{ borderColor: border }}>
                <button
                  onClick={() => { setFocusedIssueId(null); }}
                  className="flex items-center gap-1.5 text-[12px] transition-colors hover:opacity-70"
                  style={{ color: textSec }}
                >
                  <ArrowLeft size={13} />
                  All Issues
                </button>
                <div className="w-px h-4 mx-1" style={{ background: border }} />
                <div
                  className="w-4 h-4 rounded-full text-white text-[9px] flex items-center justify-center shrink-0"
                  style={{ backgroundColor: focusedIssue.status === "resolved" ? "#4CAF7D" : severityColors[focusedIssue.severity].pin }}
                >
                  {focusedIssue.status === "resolved" ? "✓" : focusedIssue.id}
                </div>
                <span className="text-[11px] truncate" style={{ color: textSec }}>Issue #{focusedIssue.id}</span>
              </div>

              {/* Detail body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div>
                  <div className="text-[14px] mb-2.5" style={{ color: textPrim }}>{focusedIssue.title}</div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] px-2 py-0.5 rounded-md" style={{ color: categoryColors[focusedIssue.category].text, background: categoryColors[focusedIssue.category].bg }}>
                      {focusedIssue.category}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md" style={{ color: severityColors[focusedIssue.severity].text, background: severityColors[focusedIssue.severity].bg }}>
                      {focusedIssue.severity} severity
                    </span>
                    {focusedIssue.status === "resolved" && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md text-[#4CAF7D] bg-[#EEF7F1]">Resolved</span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase tracking-wider mb-1.5" style={{ color: textSec }}>What's wrong</div>
                  <p className="text-[12px] leading-relaxed" style={{ color: textPrim }}>{focusedIssue.explanation}</p>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider mb-1.5" style={{ color: textSec }}>How to fix</div>
                  <p className="text-[12px] leading-relaxed" style={{ color: textPrim }}>{focusedIssue.howToFix}</p>
                </div>
                <div className="rounded-lg border p-3" style={{ borderColor: "#4B65E8" + "30", background: darkMode ? "#1A1C2E" : "#F4F6FF" }}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Info size={11} className="text-[#4B65E8]" />
                    <span className="text-[10px] text-[#4B65E8]">AI Suggestion</span>
                  </div>
                  <p className="text-[11px] leading-relaxed" style={{ color: textPrim }}>{focusedIssue.suggestion}</p>
                </div>

                {/* Navigate prev/next */}
                <div className="flex gap-2 pt-2">
                  {(() => {
                    const openList = openIssues;
                    const idx = openList.findIndex((i) => i.id === focusedIssue.id);
                    const prev = openList[idx - 1];
                    const next = openList[idx + 1];
                    return (
                      <>
                        <button
                          disabled={!prev}
                          onClick={() => { setFocusedIssueId(prev?.id ?? null); setSelectedIssueId(prev?.id ?? null); }}
                          className="flex-1 py-2 rounded-lg border text-[11px] transition-colors disabled:opacity-40"
                          style={{ borderColor: border, color: textSec }}
                        >
                          ← Prev
                        </button>
                        <button
                          disabled={!next}
                          onClick={() => { setFocusedIssueId(next?.id ?? null); setSelectedIssueId(next?.id ?? null); }}
                          className="flex-1 py-2 rounded-lg border text-[11px] transition-colors disabled:opacity-40"
                          style={{ borderColor: border, color: textSec }}
                        >
                          Next →
                        </button>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Action */}
              <div className="p-3 border-t shrink-0" style={{ borderColor: border }}>
                {focusedIssue.status === "open" ? (
                  <button
                    onClick={() => { handleResolve(focusedIssue.id); setFocusedIssueId(null); }}
                    className="w-full py-2.5 rounded-lg text-[12px] text-white transition-colors bg-[#4CAF7D] hover:bg-[#3d9e6c]"
                  >
                    ✓ Mark as Resolved
                  </button>
                ) : (
                  <button
                    onClick={() => handleReopen(focusedIssue.id)}
                    className="w-full py-2.5 rounded-lg text-[12px] border transition-colors"
                    style={{ borderColor: border, color: textSec }}
                  >
                    Reopen Issue
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* ── NORMAL LIST VIEW ── */
            <>
              {/* Sidebar header */}
              <div className="px-4 py-3 border-b shrink-0" style={{ borderColor: border }}>
                <div className="hidden md:flex items-center justify-between mb-3">
                  <span className="text-[13px]" style={{ color: textPrim }}>Issues</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] px-2 py-0.5 rounded-md" style={{ color: "#D4505A", background: "#FFF0F1" }}>{openIssues.length} open</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md" style={{ color: "#4CAF7D", background: "#EEF7F1" }}>{resolvedIssues.length} resolved</span>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1.5 mb-3">
                  {(["open", "resolved"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className="flex-1 py-1.5 rounded-lg text-[11px] capitalize transition-colors duration-150"
                      style={{
                        background: activeTab === tab ? (tab === "open" ? "#1C1C1E" : "#4CAF7D") : "transparent",
                        color: activeTab === tab ? "#FFFFFF" : textSec,
                        border: activeTab === tab ? "none" : `1px solid ${border}`,
                      }}
                    >
                      {tab} ({tab === "open" ? openIssues.length : resolvedIssues.length})
                    </button>
                  ))}
                </div>

                {/* Filter */}
                <div className="flex gap-1 flex-wrap">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className="text-[10px] px-2 py-1 rounded-md transition-colors duration-100"
                      style={{
                        background: categoryFilter === cat ? "#4B65E8" : darkMode ? "#2C2C2F" : "#F0F0F2",
                        color: categoryFilter === cat ? "#FFFFFF" : textSec,
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* List + bottom detail */}
              <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                {/* Score breakdown */}
                {activeTab === "open" && categoryFilter === "All" && (
                  <div className="mb-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <BarChart2 size={11} style={{ color: textSec }} />
                      <span className="text-[10px] uppercase tracking-wider" style={{ color: textSec }}>Score breakdown</span>
                    </div>
                    <SmartScoresPanel darkMode={darkMode} />
                  </div>
                )}

                {displayedIssues.length === 0 && (
                  <div className="text-center py-10">
                    <CheckCircle size={24} className="mx-auto mb-2 text-[#4CAF7D]" />
                    <div className="text-[13px]" style={{ color: textSec }}>
                      {activeTab === "open" ? "No open issues" : "No resolved issues yet"}
                    </div>
                  </div>
                )}

                {displayedIssues.map((issue) => {
                  const isSelected = selectedIssueId === issue.id;
                  const sevColors = severityColors[issue.severity];
                  const catColors = categoryColors[issue.category];
                  const isResolved = issue.status === "resolved";

                  return (
                    <button
                      key={issue.id}
                      onClick={() => setSelectedIssueId(isSelected ? null : issue.id)}
                      className="w-full text-left p-3 rounded-xl border transition-all duration-150"
                      style={{
                        background: isSelected ? (darkMode ? "#2C2C2F" : "#F8F8FF") : "transparent",
                        borderColor: isSelected ? "#4B65E8" : border,
                        opacity: isResolved ? 0.75 : 1,
                      }}
                    >
                      <div className="flex items-start gap-2.5">
                        <div
                          className="w-5 h-5 rounded-full text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5"
                          style={{ backgroundColor: isResolved ? "#4CAF7D" : sevColors.pin }}
                        >
                          {isResolved ? "✓" : issue.id}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[12px] mb-1.5 leading-snug" style={{ color: textPrim }}>{issue.title}</div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md" style={{ color: catColors.text, background: catColors.bg }}>{issue.category}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md" style={{ color: sevColors.text, background: sevColors.bg }}>{issue.severity}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Issue detail (bottom panel) */}
              {selectedIssue && (
                <div
                  className="border-t shrink-0 flex flex-col"
                  style={{ borderColor: border, maxHeight: "48%", background: darkMode ? "#161618" : "#F7F7F8" }}
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: border }}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full text-white text-[9px] flex items-center justify-center"
                        style={{ backgroundColor: selectedIssue.status === "resolved" ? "#4CAF7D" : severityColors[selectedIssue.severity].pin }}
                      >
                        {selectedIssue.status === "resolved" ? "✓" : selectedIssue.id}
                      </div>
                      <span className="text-[11px]" style={{ color: textSec }}>Issue #{selectedIssue.id}</span>
                    </div>
                    <button onClick={() => setSelectedIssueId(null)}><X size={13} style={{ color: textSec }} /></button>
                  </div>
                  <div className="overflow-y-auto flex-1 p-4 space-y-3">
                    <div>
                      <div className="text-[13px] mb-2" style={{ color: textPrim }}>{selectedIssue.title}</div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] px-2 py-0.5 rounded-md" style={{ color: categoryColors[selectedIssue.category].text, background: categoryColors[selectedIssue.category].bg }}>{selectedIssue.category}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md" style={{ color: severityColors[selectedIssue.severity].text, background: severityColors[selectedIssue.severity].bg }}>{selectedIssue.severity}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: textSec }}>What's wrong</div>
                      <p className="text-[12px] leading-relaxed" style={{ color: textPrim }}>{selectedIssue.explanation}</p>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: textSec }}>How to fix</div>
                      <p className="text-[12px] leading-relaxed" style={{ color: textPrim }}>{selectedIssue.howToFix}</p>
                    </div>
                    <div className="rounded-lg border p-3" style={{ borderColor: "#4B65E8" + "30", background: darkMode ? "#1A1C2E" : "#F4F6FF" }}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <Info size={10} className="text-[#4B65E8]" />
                        <span className="text-[10px] text-[#4B65E8]">Suggestion</span>
                      </div>
                      <p className="text-[11px] leading-relaxed" style={{ color: textPrim }}>{selectedIssue.suggestion}</p>
                    </div>
                  </div>
                  <div className="p-3 border-t" style={{ borderColor: border }}>
                    {selectedIssue.status === "open" ? (
                      <button
                        onClick={() => handleResolve(selectedIssue.id)}
                        className="w-full py-2.5 rounded-lg text-[12px] text-white transition-colors bg-[#4CAF7D] hover:bg-[#3d9e6c]"
                      >
                        Mark as Resolved
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReopen(selectedIssue.id)}
                        className="w-full py-2.5 rounded-lg text-[12px] border transition-colors"
                        style={{ borderColor: border, color: textSec }}
                      >
                        Reopen Issue
                      </button>
                    )}
                  </div>
                </div>
              )}

              {!selectedIssue && displayedIssues.length > 0 && (
                <div className="border-t p-6 text-center" style={{ borderColor: border }}>
                  <MessageSquare size={20} className="mx-auto mb-2" style={{ color: textSec }} />
                  <div className="text-[12px]" style={{ color: textSec }}>Select an issue or click a pin to inspect</div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
