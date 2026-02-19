import { useState, useRef } from "react";
import type { ElementType } from "react";
import { useNavigate } from "react-router";
import { Figma, Image, FileText, Globe, Zap, CloudUpload, Key } from "lucide-react";
import { useAudit, type AuditDepth, type DesignType } from "../context/AuditContext";

type TabType = DesignType;

const tabs: { id: TabType; label: string; icon: ElementType }[] = [
  { id: "figma", label: "Figma Link", icon: Figma },
  { id: "png", label: "PNG / JPG", icon: Image },
  { id: "pdf", label: "PDF", icon: FileText },
  { id: "url", label: "Website URL", icon: Globe },
];

const depthOptions: { label: AuditDepth; desc: string }[] = [
  { label: "Quick", desc: "~2 min" },
  { label: "Standard", desc: "~5 min" },
  { label: "Deep", desc: "~10 min" },
];

export default function UploadPage() {
  const navigate = useNavigate();
  const { setDesignInput, setDesignImageUrl, setAuditTitle } = useAudit();

  const [activeTab, setActiveTab] = useState<TabType>("figma");
  const [urlInput, setUrlInput] = useState("");
  const [figmaToken, setFigmaToken] = useState("");
  const [geminiKey, setGeminiKey] = useState("AIzaSyCyOvIos2S9lOa-NP7cAjOOiJznLHGC4LA");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [auditDepth, setAuditDepth] = useState<AuditDepth>("Standard");
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setUploadedFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  const isReady =
    (activeTab === "figma" && urlInput.includes("figma.com")) ||
    (activeTab === "url" && urlInput.startsWith("http")) ||
    ((activeTab === "png" || activeTab === "pdf") && uploadedFile !== null);

  const handleScan = async () => {
    if (!isReady) return;

    // For file uploads, read as data URL
    let fileDataUrl: string | undefined;
    let fileName: string | undefined;

    if (uploadedFile) {
      fileName = uploadedFile.name;
      try {
        fileDataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(uploadedFile);
        });
        // Preview the image immediately
        if (activeTab === "png") setDesignImageUrl(fileDataUrl);
      } catch {
        console.error("Failed to read file");
      }
    }

    // Determine audit title
    const title =
      activeTab === "figma" ? (urlInput.split("/").filter(Boolean).pop()?.split("?")[0] ?? "Figma Design")
        : activeTab === "url" ? (() => { try { return new URL(urlInput).hostname.replace("www.", ""); } catch { return urlInput; } })()
          : fileName ?? "Uploaded Design";

    setAuditTitle(title);

    setDesignInput({
      type: activeTab,
      urlValue: activeTab === "figma" || activeTab === "url" ? urlInput : undefined,
      figmaToken: activeTab === "figma" ? figmaToken : undefined,
      fileDataUrl,
      fileName,
      auditDepth,
      geminiKey,
    });

    navigate("/scanning");
  };

  const placeholders: Record<TabType, string> = {
    figma: "https://www.figma.com/design/XXXX/...",
    png: "",
    pdf: "",
    url: "https://yourwebsite.com",
  };

  return (
    <div className="min-h-screen bg-[#F7F7F8] flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-[28px] text-[#1C1C1E] tracking-tight mb-2.5">Add Your Design</h1>
            <p className="text-[14px] text-[#6E6E7A] leading-relaxed">
              Upload a design or paste a link. Gemini AI will scan it and generate a structured audit.
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-[#E8E8EA] overflow-hidden shadow-[0_2px_24px_rgba(0,0,0,0.04)]">
            {/* Tabs */}
            <div className="flex border-b border-[#E8E8EA]">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setUrlInput("");
                    setUploadedFile(null);
                  }}
                  className={`flex-1 flex flex-col items-center gap-1.5 py-4 text-[11px] transition-all duration-150 border-b-2 ${activeTab === tab.id
                    ? "border-[#4B65E8] text-[#4B65E8] bg-[#FAFAFE]"
                    : "border-transparent text-[#6E6E7A] hover:text-[#1C1C1E] hover:bg-[#F7F7F8]"
                    }`}
                >
                  <tab.icon size={15} strokeWidth={1.5} />
                  <span className="hidden sm:block">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-7 space-y-5">
              {/* Link-based tabs */}
              {(activeTab === "figma" || activeTab === "url") && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[12px] text-[#6E6E7A] block mb-2">
                      {activeTab === "figma" ? "Figma file URL" : "Website URL"}
                    </label>
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder={placeholders[activeTab]}
                      className="w-full px-4 py-3 bg-[#F7F7F8] border border-[#E8E8EA] rounded-xl text-[13px] text-[#1C1C1E] placeholder:text-[#C0C0C4] focus:outline-none focus:border-[#4B65E8] focus:ring-2 focus:ring-[#4B65E8]/10 transition-all duration-150"
                    />
                    {activeTab === "figma" && (
                      <p className="text-[11px] text-[#9595A0] mt-1.5">
                        Paste any Figma file, frame, or design URL
                      </p>
                    )}
                  </div>

                  {/* Figma Access Token */}
                  {activeTab === "figma" && (
                    <div>
                      <label className="text-[12px] text-[#6E6E7A] block mb-2 flex items-center gap-1.5">
                        <Key size={11} />
                        Figma Access Token
                        <span className="text-[10px] text-[#9595A0]">(required to fetch design)</span>
                      </label>
                      <input
                        type="password"
                        value={figmaToken}
                        onChange={(e) => setFigmaToken(e.target.value)}
                        placeholder="figd_XXXXXXXXXXXXXXXXXXXX"
                        className="w-full px-4 py-3 bg-[#F7F7F8] border border-[#E8E8EA] rounded-xl text-[13px] text-[#1C1C1E] placeholder:text-[#C0C0C4] focus:outline-none focus:border-[#4B65E8] focus:ring-2 focus:ring-[#4B65E8]/10 transition-all duration-150"
                      />
                      <p className="text-[11px] text-[#9595A0] mt-1.5">
                        Get your token at{" "}
                        <a href="https://www.figma.com/settings" target="_blank" rel="noreferrer" className="text-[#4B65E8] hover:underline">
                          figma.com/settings → Personal access tokens
                        </a>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* File upload tabs */}
              {(activeTab === "png" || activeTab === "pdf") && (
                <div className="space-y-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={activeTab === "png" ? "image/png,image/jpeg,image/jpg,image/webp" : "application/pdf"}
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-150 ${isDragging
                      ? "border-[#4B65E8] bg-[#EEF1FF]"
                      : uploadedFile
                        ? "border-[#4CAF7D] bg-[#F4FBF7]"
                        : "border-[#E8E8EA] bg-[#F7F7F8] hover:border-[#C8C8CA] hover:bg-[#F0F0F2]"
                      }`}
                  >
                    {uploadedFile ? (
                      <div className="space-y-2">
                        {activeTab === "png" && (uploadedFile.type.startsWith("image/")) ? (
                          <img
                            src={URL.createObjectURL(uploadedFile)}
                            alt="preview"
                            className="h-24 w-auto object-cover rounded-lg mx-auto border border-[#E8E8EA]"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-[#EEF7F1] flex items-center justify-center mx-auto">
                            <FileText size={18} className="text-[#4CAF7D]" strokeWidth={1.5} />
                          </div>
                        )}
                        <div className="text-[13px] text-[#4CAF7D]">{uploadedFile.name}</div>
                        <div className="text-[11px] text-[#9595A0]">
                          {(uploadedFile.size / 1024 / 1024).toFixed(1)} MB · Click to replace
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto transition-colors ${isDragging ? "bg-[#EEF1FF]" : "bg-white border border-[#E8E8EA]"}`}>
                          <CloudUpload size={20} className={isDragging ? "text-[#4B65E8]" : "text-[#9595A0]"} strokeWidth={1.5} />
                        </div>
                        <div>
                          <div className="text-[14px] text-[#1C1C1E] mb-1">
                            {isDragging ? "Drop to upload" : `Drop ${activeTab === "png" ? "image" : "PDF"} here`}
                          </div>
                          <div className="text-[12px] text-[#9595A0]">
                            or <span className="text-[#4B65E8]">click to browse</span>
                          </div>
                        </div>
                        <div className="text-[11px] text-[#C0C0C4]">
                          {activeTab === "png" ? "PNG, JPG, WEBP — up to 20MB" : "PDF — up to 50MB"}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Audit depth */}
              <div className="space-y-3 pt-1">
                <div className="text-[12px] text-[#9595A0] uppercase tracking-wider">Audit depth</div>
                <div className="grid grid-cols-3 gap-2">
                  {depthOptions.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => setAuditDepth(opt.label)}
                      className={`py-2.5 px-3 rounded-lg border text-[12px] transition-colors ${auditDepth === opt.label
                        ? "border-[#4B65E8] bg-[#EEF1FF] text-[#4B65E8]"
                        : "border-[#E8E8EA] text-[#6E6E7A] hover:border-[#C8C8CA] hover:bg-[#F7F7F8]"
                        }`}
                    >
                      <div>{opt.label}</div>
                      <div className={`text-[10px] mt-0.5 ${auditDepth === opt.label ? "text-[#4B65E8]/70" : "text-[#9595A0]"}`}>
                        {opt.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Gemini API Key - Hidden from UI but still used internally */}

              {/* Scan button */}
              <button
                onClick={handleScan}
                disabled={!isReady}
                className={`w-full py-3.5 rounded-xl text-[14px] transition-all duration-150 ${isReady
                  ? "bg-[#4B65E8] text-white hover:bg-[#3a54d7] active:scale-[0.99]"
                  : "bg-[#E8E8EA] text-[#9595A0] cursor-not-allowed"
                  }`}
              >
                {isReady ? "Scan Design with AI" : "Add a design to continue"}
              </button>

              <p className="text-[11px] text-[#9595A0] text-center">
                Your design is processed securely. File data is never stored permanently.
              </p>
            </div>
          </div>

          <div className="mt-6 text-center text-[12px] text-[#9595A0]">
            <button onClick={() => navigate("/")} className="text-[#4B65E8] hover:underline">
              ← Return to home
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}