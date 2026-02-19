import { createContext, useContext, useState, ReactNode } from "react";

export type AuditDepth = "Quick" | "Standard" | "Deep";
export type DesignType = "figma" | "png" | "pdf" | "url";
export type Severity = "High" | "Medium" | "Low";
export type Category = "Accessibility" | "UX" | "UI" | "Layout" | "Content";
export type IssueStatus = "open" | "resolved";

export interface AuditIssue {
  id: number;
  title: string;
  category: Category;
  severity: Severity;
  status: IssueStatus;
  explanation: string;
  howToFix: string;
  suggestion: string;
  x: number;
  y: number;
}

export interface DesignInput {
  type: DesignType;
  urlValue?: string;
  figmaToken?: string;
  fileDataUrl?: string;
  fileName?: string;
  auditDepth: AuditDepth;
  geminiKey: string;
}

interface AuditContextType {
  designInput: DesignInput | null;
  setDesignInput: (d: DesignInput) => void;
  designImageUrl: string | null;
  setDesignImageUrl: (url: string | null) => void;
  issues: AuditIssue[];
  setIssues: (issues: AuditIssue[]) => void;
  auditTitle: string;
  setAuditTitle: (t: string) => void;
}

const AuditContext = createContext<AuditContextType | null>(null);

export function AuditProvider({ children }: { children: ReactNode }) {
  const [designInput, setDesignInput] = useState<DesignInput | null>(null);
  const [designImageUrl, setDesignImageUrl] = useState<string | null>(null);
  const [issues, setIssues] = useState<AuditIssue[]>([]);
  const [auditTitle, setAuditTitle] = useState("Untitled Design");

  return (
    <AuditContext.Provider
      value={{
        designInput,
        setDesignInput,
        designImageUrl,
        setDesignImageUrl,
        issues,
        setIssues,
        auditTitle,
        setAuditTitle,
      }}
    >
      {children}
    </AuditContext.Provider>
  );
}

export function useAudit() {
  const ctx = useContext(AuditContext);
  if (!ctx) throw new Error("useAudit must be used inside AuditProvider");
  return ctx;
}
