import { Figma, Image, FileText, Globe, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

const formats = [
  {
    icon: Figma,
    title: "Figma Link",
    description: "Paste any Figma frame or prototype URL directly.",
    action: "Paste Link",
    placeholder: "figma.com/file/...",
    color: "#4B65E8",
    bg: "#EEF1FF",
  },
  {
    icon: Image,
    title: "PNG / JPG",
    description: "Upload screen exports or design screenshots.",
    action: "Upload File",
    placeholder: "Drop image here",
    color: "#4CAF7D",
    bg: "#EEF7F1",
  },
  {
    icon: FileText,
    title: "PDF",
    description: "Upload multi-page PDFs for complete flow reviews.",
    action: "Upload PDF",
    placeholder: "Drop PDF here",
    color: "#E8A44F",
    bg: "#FFF8EC",
  },
  {
    icon: Globe,
    title: "Live Website",
    description: "Audit any live URL — landing pages, apps, dashboards.",
    action: "Paste URL",
    placeholder: "https://yoursite.com",
    color: "#8B5CF6",
    bg: "#F3EEFF",
  },
];

export function FormatsSection() {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-14">
          <div className="text-[12px] text-[#9595A0] uppercase tracking-widest mb-4">Supported Formats</div>
          <h2 className="text-[32px] text-[#1C1C1E] leading-[1.3] tracking-tight mb-4">
            Works with any design format.
          </h2>
          <p className="text-[15px] text-[#6E6E7A] leading-relaxed">
            No matter where your design lives, Auditwise can scan it. Four flexible input methods, one consistent audit output.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {formats.map((format) => (
            <div
              key={format.title}
              className="bg-[#F7F7F8] rounded-xl border border-[#E8E8EA] p-6 space-y-5 hover:border-[#D0D0D4] hover:bg-white transition-all duration-200 cursor-pointer group"
              onClick={() => navigate("/upload")}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: format.bg }}
              >
                <format.icon size={18} style={{ color: format.color }} strokeWidth={1.5} />
              </div>

              <div>
                <h3 className="text-[14px] text-[#1C1C1E] mb-1.5">{format.title}</h3>
                <p className="text-[12px] text-[#6E6E7A] leading-relaxed">{format.description}</p>
              </div>

              {/* Mini input preview */}
              <div className="bg-white rounded-lg border border-[#E8E8EA] px-3 py-2 text-[11px] text-[#9595A0] group-hover:border-[#D0D0D4] transition-colors">
                {format.placeholder}
              </div>

              <div className="flex items-center gap-1.5 text-[12px]" style={{ color: format.color }}>
                {format.action}
                <ArrowRight size={12} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
