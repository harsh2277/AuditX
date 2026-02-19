import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { Zap } from "lucide-react";
import { useAudit, type AuditIssue, type Category, type Severity } from "../context/AuditContext";

const scanSteps = [
  "Parsing design structure…",
  "Analysing spacing system…",
  "Checking color contrast…",
  "Evaluating typography hierarchy…",
  "Scanning layout alignment…",
  "Running accessibility checks…",
  "Detecting component inconsistencies…",
  "Generating AI issue explanations…",
  "Calculating AI design score…",
  "Preparing audit report…",
];

// ── Gemini helpers ────────────────────────────────────────────────────────────

const GEMINI_PROMPT = `You are an expert UI/UX design auditor. Analyze this design and identify 6-10 specific design issues.

Return ONLY a valid JSON array — no markdown, no extra text. Each item must follow this exact shape:
{
  "title": "Short issue title (max 60 chars)",
  "category": "Accessibility" | "UX" | "UI" | "Layout" | "Content",
  "severity": "High" | "Medium" | "Low",
  "explanation": "2-3 sentences explaining what is wrong and why it matters.",
  "howToFix": "2-3 sentences with concrete steps to fix this issue.",
  "suggestion": "One concrete implementation suggestion.",
  "x": <number 5-95, estimated x% position in the image where this issue appears>,
  "y": <number 5-95, estimated y% position in the image where this issue appears>
}

Focus on: contrast ratios, spacing consistency, typography hierarchy, accessibility (WCAG), touch target sizes, visual hierarchy, component consistency, and content clarity.`;

const URL_PROMPT = (url: string) =>
  `You are an expert UI/UX design auditor. Analyze the website at URL: ${url}

Based on common patterns for this type of website and what you know about it, identify 6-10 likely design issues.

Return ONLY a valid JSON array — no markdown, no extra text. Each item must follow:
{
  "title": "Short issue title (max 60 chars)",
  "category": "Accessibility" | "UX" | "UI" | "Layout" | "Content",
  "severity": "High" | "Medium" | "Low",
  "explanation": "2-3 sentences explaining what might be wrong.",
  "howToFix": "2-3 sentences with steps to fix this.",
  "suggestion": "One concrete implementation suggestion.",
  "x": <number 5-95>,
  "y": <number 5-95>
}`;

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Model fallback chain – each has progressively higher free-tier quotas
const GEMINI_MODELS = [
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
];

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

/** Try each model in order; return issues as soon as one succeeds.
 *  On 429 skip immediately to the next model (no long wait).
 *  Only waits briefly (2 s) between non-rate-limit server errors. */
async function callGeminiWithFallback(
  apiKey: string,
  buildBody: (model: string) => object,
  onStatus: (msg: string) => void
): Promise<{ text: string } | null> {
  for (let i = 0; i < GEMINI_MODELS.length; i++) {
    const model = GEMINI_MODELS[i];
    try {
      onStatus(
        i === 0
          ? "Running Gemini AI analysis…"
          : `Retrying with ${model}…`
      );
      const res = await fetch(
        `${GEMINI_BASE}/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildBody(model)),
        }
      );
      if (res.status === 429) {
        // Rate limited — skip to next model immediately
        console.warn(`[Auditwise] ${model} rate-limited (429), trying next model…`);
        continue;
      }
      if (res.status === 503 || res.status === 500) {
        // Transient server error — short wait then try next
        await sleep(2000);
        continue;
      }
      if (!res.ok) throw new Error(`Gemini API error ${res.status}`);
      const data = await res.json();
      const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      return { text };
    } catch (err) {
      // Network / CORS error — try next model
      console.warn(`[Auditwise] ${model} failed:`, err);
      if (i < GEMINI_MODELS.length - 1) continue;
    }
  }
  return null; // all models exhausted
}

async function callGeminiVision(
  apiKey: string,
  imageBase64: string,
  mimeType: string,
  onStatus: (msg: string) => void
): Promise<AuditIssue[]> {
  const result = await callGeminiWithFallback(
    apiKey,
    () => ({
      contents: [
        {
          parts: [
            { inlineData: { mimeType, data: imageBase64 } },
            { text: GEMINI_PROMPT },
          ],
        },
      ],
      generationConfig: { temperature: 0.4 },
    }),
    onStatus
  );
  return result ? parseIssues(result.text) : fallbackIssues();
}

async function callGeminiText(
  apiKey: string,
  prompt: string,
  onStatus: (msg: string) => void
): Promise<AuditIssue[]> {
  const result = await callGeminiWithFallback(
    apiKey,
    () => ({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.4 },
    }),
    onStatus
  );
  return result ? parseIssues(result.text) : fallbackIssues();
}

function parseIssues(raw: string): AuditIssue[] {
  try {
    // Strip markdown code fences if present
    const cleaned = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
    const arr = JSON.parse(cleaned);
    if (!Array.isArray(arr)) throw new Error("Not array");
    return arr.map((item: Record<string, unknown>, idx: number) => ({
      id: idx + 1,
      title: String(item.title ?? "Untitled issue"),
      category: (item.category as Category) ?? "UI",
      severity: (item.severity as Severity) ?? "Medium",
      status: "open" as const,
      explanation: String(item.explanation ?? ""),
      howToFix: String(item.howToFix ?? ""),
      suggestion: String(item.suggestion ?? ""),
      x: Math.min(95, Math.max(5, Number(item.x ?? 50))),
      y: Math.min(95, Math.max(5, Number(item.y ?? 50))),
    }));
  } catch {
    // Fallback: try to extract JSON array with regex
    const match = raw.match(/\[[\s\S]*\]/);
    if (match) {
      try {
        const arr = JSON.parse(match[0]);
        if (Array.isArray(arr)) return parseIssues(JSON.stringify(arr));
      } catch { /* ignore */ }
    }
    return fallbackIssues();
  }
}

function fallbackIssues(): AuditIssue[] {
  return [
    { id: 1, title: "Low contrast body text", category: "Accessibility", severity: "High", status: "open", explanation: "The body text may not meet WCAG AA contrast requirements. Ensure a minimum contrast ratio of 4.5:1 for normal text.", howToFix: "Darken the text color or lighten the background to achieve the required contrast.", suggestion: "Use #595959 or darker for body text on white backgrounds.", x: 70, y: 20 },
    { id: 2, title: "Inconsistent spacing", category: "Layout", severity: "Medium", status: "open", explanation: "Multiple spacing values detected that fall outside an 8px base grid. This creates visual inconsistency.", howToFix: "Audit all margin and padding values and align them to the 8px scale.", suggestion: "Replace non-standard gaps (10px, 14px) with 8px or 16px values.", x: 30, y: 45 },
    { id: 3, title: "Missing focus indicators", category: "UX", severity: "Medium", status: "open", explanation: "Interactive elements may lack visible focus rings for keyboard navigation.", howToFix: "Add focus-visible styles using outline or box-shadow.", suggestion: "Add .focus-visible:ring-2 to all interactive elements.", x: 55, y: 65 },
    { id: 4, title: "Icon-only buttons without labels", category: "Accessibility", severity: "High", status: "open", explanation: "Icon-only buttons lack accessible text for screen readers.", howToFix: "Add aria-label attributes to all icon-only interactive elements.", suggestion: "Add aria-label='Action name' to all icon buttons.", x: 80, y: 15 },
    { id: 5, title: "Heading hierarchy skip", category: "Content", severity: "Medium", status: "open", explanation: "The page skips heading levels, breaking semantic document structure.", howToFix: "Restructure headings to follow logical H1 → H2 → H3 sequence.", suggestion: "Use CSS for visual sizing, not semantic heading levels.", x: 40, y: 30 },
    { id: 6, title: "Touch targets too small", category: "UX", severity: "Low", status: "open", explanation: "Some interactive elements may be smaller than the recommended 44×44px touch target.", howToFix: "Increase the clickable area of small buttons and links.", suggestion: "Use min-width: 44px; min-height: 44px for all interactive elements.", x: 60, y: 80 },
  ];
}

// ── Figma API helpers ─────────────────────────────────────────────────────────

function parseFigmaFileKey(url: string): { fileKey: string; nodeId?: string } | null {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split("/");
    // Handles /file/KEY, /design/KEY, /proto/KEY
    const keyIndex = parts.findIndex((p) => ["file", "design", "proto"].includes(p));
    if (keyIndex === -1 || !parts[keyIndex + 1]) return null;
    const fileKey = parts[keyIndex + 1];
    const nodeId = parsed.searchParams.get("node-id") ?? undefined;
    return { fileKey, nodeId };
  } catch {
    return null;
  }
}

async function fetchFigmaImage(
  fileKey: string,
  token: string,
  nodeId?: string
): Promise<string | null> {
  const headers = { "X-Figma-Token": token };

  // Get file to find the first frame
  let targetNodeId = nodeId;
  if (!targetNodeId) {
    const fileRes = await fetch(`https://api.figma.com/v1/files/${fileKey}`, { headers });
    if (!fileRes.ok) throw new Error("Figma API: " + fileRes.status);
    const file = await fileRes.json();
    // Get first canvas page → first child (usually a frame)
    const firstPage = file?.document?.children?.[0];
    const firstFrame = firstPage?.children?.[0];
    if (firstFrame?.id) targetNodeId = firstFrame.id;
    else return null;
  }

  // Get rendered image
  const imgRes = await fetch(
    `https://api.figma.com/v1/images/${fileKey}?ids=${encodeURIComponent(targetNodeId)}&format=png&scale=2`,
    { headers }
  );
  if (!imgRes.ok) throw new Error("Figma images API: " + imgRes.status);
  const imgData = await imgRes.json();
  const imageUrl = imgData?.images?.[targetNodeId];
  return imageUrl ?? null;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ScanningPage() {
  const navigate = useNavigate();
  const { designInput, setIssues, setDesignImageUrl } = useAudit();
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    let cancelled = false;

    const runScan = async () => {
      // Animate progress bar (visual only — actual work happens in parallel)
      let prog = 0;
      const totalDur = 6000;
      const interval = 80;
      const steps = totalDur / interval;
      let tick = 0;

      const timer = setInterval(() => {
        if (cancelled) { clearInterval(timer); return; }
        tick++;
        prog = Math.min((tick / steps) * 90, 90); // max 90% until AI finishes
        setProgress(prog);
        setStepIndex(Math.min(Math.floor((prog / 90) * (scanSteps.length - 2)), scanSteps.length - 2));
      }, interval);

      try {
        const input = designInput;
        let imageDataUrl: string | null = null;
        let issues: AuditIssue[] = [];

        if (input) {
          // ── Figma ──────────────────────────────────────────────────────
          if (input.type === "figma" && input.urlValue && input.figmaToken) {
            setStatusMsg("Fetching Figma design…");
            const parsed = parseFigmaFileKey(input.urlValue);
            if (parsed) {
              try {
                const imgUrl = await fetchFigmaImage(parsed.fileKey, input.figmaToken, parsed.nodeId);
                if (imgUrl) {
                  // Proxy-fetch the image to convert to data URL (needed for Gemini)
                  const imgRes = await fetch(imgUrl);
                  const blob = await imgRes.blob();
                  imageDataUrl = await new Promise<string>((res) => {
                    const r = new FileReader();
                    r.onload = () => res(r.result as string);
                    r.readAsDataURL(blob);
                  });
                  setDesignImageUrl(imageDataUrl);
                }
              } catch (err) {
                console.warn("Figma fetch error:", err);
              }
            }
          }

          // ── PNG/JPG ───────────────────────────────────────────────────
          if ((input.type === "png" || input.type === "pdf") && input.fileDataUrl) {
            imageDataUrl = input.fileDataUrl;
            if (input.type === "png") setDesignImageUrl(imageDataUrl);
          }

          // ── Call Gemini ───────────────────────────────────────────────
          if (input.geminiKey) {
            setStepIndex(7);
            const onStatus = (msg: string) => setStatusMsg(msg);

            if (imageDataUrl && input.type !== "pdf") {
              const base64 = imageDataUrl.split(",")[1];
              const mime = imageDataUrl.split(";")[0].split(":")[1];
              issues = await callGeminiVision(input.geminiKey, base64, mime, onStatus);
            } else {
              const prompt =
                input.type === "url" && input.urlValue
                  ? URL_PROMPT(input.urlValue)
                  : GEMINI_PROMPT;
              issues = await callGeminiText(input.geminiKey, prompt, onStatus);
            }
          } else {
            issues = fallbackIssues();
          }
        } else {
          issues = fallbackIssues();
        }

        if (cancelled) return;
        setIssues(issues);
        clearInterval(timer);
        setProgress(100);
        setStepIndex(scanSteps.length - 1);
        setDone(true);
        setTimeout(() => { if (!cancelled) navigate("/audit"); }, 700);
      } catch (err) {
        // Only truly unexpected errors land here — log as warning, not error
        console.warn("Scan unexpected error:", err);
        if (!cancelled) {
          setIssues(fallbackIssues());
          clearInterval(timer);
          setProgress(100);
          setDone(true);
          setTimeout(() => { if (!cancelled) navigate("/audit"); }, 700);
        }
      }
    };

    runScan();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="min-h-screen bg-[#F7F7F8] flex flex-col items-center justify-center px-6"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #4B65E8 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative w-full max-w-lg text-center space-y-12">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 opacity-40">
          <div className="w-6 h-6 rounded-md bg-[#4B65E8] flex items-center justify-center">
            <Zap size={12} className="text-white" strokeWidth={2} />
          </div>
          <span className="text-[13px] text-[#1C1C1E]">Auditwise</span>
        </div>

        {/* Design preview */}
        <div className="relative mx-auto" style={{ width: "320px" }}>
          <div className="absolute inset-0 rounded-2xl bg-[#4B65E8]/5 blur-2xl scale-110" />
          <div className="relative bg-white rounded-2xl border border-[#E8E8EA] overflow-hidden shadow-[0_4px_40px_rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-[#E8E8EA] bg-[#F7F7F8]">
              <div className="w-2 h-2 rounded-full bg-[#E8E8EA]" />
              <div className="w-2 h-2 rounded-full bg-[#E8E8EA]" />
              <div className="w-2 h-2 rounded-full bg-[#E8E8EA]" />
              <div className="flex-1 mx-3 h-4 bg-[#EDEDEF] rounded-full" />
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-3 w-24 bg-[#F0F0F2] rounded-full animate-pulse" />
                <div className="h-6 w-14 bg-[#EDEDEF] rounded-md" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-14 rounded-lg bg-[#F7F7F8] border border-[#E8E8EA]" />
                ))}
              </div>
              <div className="space-y-2">
                <div className="h-2 w-full bg-[#F0F0F2] rounded-full animate-pulse" />
                <div className="h-2 w-3/4 bg-[#F0F0F2] rounded-full animate-pulse" />
                <div className="h-2 w-1/2 bg-[#F0F0F2] rounded-full animate-pulse" />
              </div>
            </div>
            {/* Scan line */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(to bottom, transparent ${progress - 8}%, rgba(75,101,232,0.06) ${progress}%, transparent ${progress + 8}%)`,
                transition: "background 0.15s ease",
              }}
            />
            <div
              className="absolute left-0 right-0 h-px bg-[#4B65E8]/30 pointer-events-none transition-all duration-75"
              style={{ top: `${progress}%` }}
            />
          </div>
          {progress > 30 && (
            <div className="absolute -right-3 top-8 w-5 h-5 rounded-full bg-[#D4505A] text-white text-[9px] flex items-center justify-center shadow-[0_2px_8px_rgba(212,80,90,0.3)]" style={{ animation: "fadeIn 0.3s ease" }}>!</div>
          )}
          {progress > 55 && (
            <div className="absolute -left-3 bottom-14 w-5 h-5 rounded-full bg-[#E8A44F] text-white text-[9px] flex items-center justify-center shadow-[0_2px_8px_rgba(232,164,79,0.3)]" style={{ animation: "fadeIn 0.3s ease" }}>!</div>
          )}
          {progress > 75 && (
            <div className="absolute -right-3 bottom-8 w-5 h-5 rounded-full bg-[#4B65E8] text-white text-[9px] flex items-center justify-center shadow-[0_2px_8px_rgba(75,101,232,0.3)]" style={{ animation: "fadeIn 0.3s ease" }}>i</div>
          )}
        </div>

        {/* Status */}
        <div className="space-y-5">
          <div>
            <p className="text-[15px] text-[#1C1C1E] mb-1 transition-all duration-300">
              {done ? "Audit complete." : "Scanning your design…"}
            </p>
            <p className="text-[13px] text-[#9595A0] h-5 transition-all duration-200">
              {done ? "Opening your results…" : (statusMsg || scanSteps[stepIndex])}
            </p>
          </div>
          <div className="w-full max-w-xs mx-auto">
            <div className="h-[2px] bg-[#E8E8EA] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4B65E8] rounded-full transition-all duration-150 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[11px] text-[#C0C0C4]">Scanning</span>
              <span className="text-[11px] text-[#9595A0]">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}