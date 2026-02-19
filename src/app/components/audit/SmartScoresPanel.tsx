import type { ElementType } from "react";
import { Eye, Type, Grid3X3, Palette, AlignLeft, Copy } from "lucide-react";

interface Score {
  label: string;
  value: number;
  icon: ElementType;
  color: string;
  bg: string;
}

const scores: Score[] = [
  { label: "Accessibility", value: 62, icon: Eye,      color: "#D4505A", bg: "#FFF0F1" },
  { label: "Typography",    value: 81, icon: Type,     color: "#4CAF7D", bg: "#EEF7F1" },
  { label: "Spacing",       value: 70, icon: AlignLeft, color: "#E8A44F", bg: "#FFF8EC" },
  { label: "Contrast",      value: 58, icon: Palette,  color: "#D4505A", bg: "#FFF0F1" },
  { label: "Grid Align",    value: 88, icon: Grid3X3,  color: "#4CAF7D", bg: "#EEF7F1" },
  { label: "Components",    value: 75, icon: Copy,     color: "#4B65E8", bg: "#EEF1FF" },
];

interface Props {
  darkMode: boolean;
}

export function SmartScoresPanel({ darkMode }: Props) {
  const cardBg = darkMode ? "#1C1C1F" : "#FFFFFF";
  const border = darkMode ? "#2C2C2F" : "#E8E8EA";
  const textPrimary = darkMode ? "#F0F0F2" : "#1C1C1E";
  const textSecondary = darkMode ? "#9595A0" : "#6E6E7A";
  const trackBg = darkMode ? "#2C2C2F" : "#F0F0F2";

  return (
    <div className="grid grid-cols-2 gap-2">
      {scores.map((s) => (
        <div
          key={s.label}
          className="rounded-xl border p-3 space-y-2"
          style={{ background: cardBg, borderColor: border }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div
                className="w-5 h-5 rounded-md flex items-center justify-center"
                style={{ background: s.bg }}
              >
                <s.icon size={11} style={{ color: s.color }} strokeWidth={1.5} />
              </div>
              <span className="text-[10px]" style={{ color: textSecondary }}>{s.label}</span>
            </div>
            <span className="text-[11px]" style={{ color: textPrimary }}>{s.value}</span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: trackBg }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${s.value}%`, background: s.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}