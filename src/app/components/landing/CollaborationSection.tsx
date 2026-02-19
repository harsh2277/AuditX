import { Link2, UserPlus, MessageCircle, Shield } from "lucide-react";

const colabFeatures = [
  {
    icon: Link2,
    title: "Share audit link",
    description: "Generate a read-only or collaborative link to share your full audit with anyone.",
  },
  {
    icon: UserPlus,
    title: "Invite team members",
    description: "Add designers, developers, and PMs directly to an audit session.",
  },
  {
    icon: MessageCircle,
    title: "Real-time comments",
    description: "Leave contextual feedback on any issue, pin, or element in real time.",
  },
  {
    icon: Shield,
    title: "Role-based access",
    description: "Control who can view, comment, or resolve issues with fine-grained permissions.",
  },
];

export function CollaborationSection() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className="space-y-10">
            <div>
              <div className="text-[12px] text-[#9595A0] uppercase tracking-widest mb-4">Collaboration</div>
              <h2 className="text-[32px] text-[#1C1C1E] leading-[1.3] tracking-tight mb-4">
                Review together, resolve faster.
              </h2>
              <p className="text-[15px] text-[#6E6E7A] leading-relaxed">
                Auditwise keeps your whole team in sync. Share audits, assign issues, and track resolution — without switching tools.
              </p>
            </div>

            <div className="space-y-5">
              {colabFeatures.map((feature) => (
                <div key={feature.title} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-[#F7F7F8] border border-[#E8E8EA] flex items-center justify-center shrink-0">
                    <feature.icon size={15} className="text-[#4B65E8]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-[14px] text-[#1C1C1E] mb-1">{feature.title}</h3>
                    <p className="text-[13px] text-[#6E6E7A] leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: collaboration UI mock */}
          <div className="bg-[#F7F7F8] rounded-2xl border border-[#E8E8EA] p-6 space-y-4">
            {/* Shared audit card */}
            <div className="bg-white rounded-xl border border-[#E8E8EA] p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-[13px] text-[#1C1C1E] mb-0.5">Landing Page Audit</div>
                  <div className="text-[11px] text-[#9595A0]">Last updated 2h ago</div>
                </div>
                <div className="flex items-center gap-1.5">
                  {["#4B65E8", "#4CAF7D", "#E8A44F", "#D4505A"].map((color, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white"
                      style={{ backgroundColor: color, marginLeft: i > 0 ? "-6px" : "0" }}
                    >
                      {["A", "B", "C", "+2"][i]}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#6E6E7A]">Open issues</span>
                  <span className="text-[#1C1C1E]">7</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#6E6E7A]">Resolved</span>
                  <span className="text-[#4CAF7D]">12</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#6E6E7A]">In review</span>
                  <span className="text-[#E8A44F]">3</span>
                </div>
                <div className="mt-3 h-1.5 bg-[#F0F0F2] rounded-full overflow-hidden">
                  <div className="h-full bg-[#4CAF7D] rounded-full" style={{ width: "63%" }} />
                </div>
                <div className="text-[10px] text-[#9595A0]">63% resolved</div>
              </div>
            </div>

            {/* Comment threads */}
            <div className="bg-white rounded-xl border border-[#E8E8EA] p-4 space-y-3">
              <div className="text-[12px] text-[#1C1C1E] mb-1">Recent comments</div>
              {[
                { avatar: "#4B65E8", name: "Arjun", comment: "Fixed the contrast on nav items — can you re-check?", time: "10m ago" },
                { avatar: "#4CAF7D", name: "Priya", comment: "Spacing on mobile still looks off at 320px.", time: "1h ago" },
              ].map((c, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="w-6 h-6 rounded-full text-white text-[10px] flex items-center justify-center shrink-0"
                    style={{ backgroundColor: c.avatar }}
                  >
                    {c.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[11px] text-[#1C1C1E]">{c.name}</span>
                      <span className="text-[10px] text-[#9595A0]">{c.time}</span>
                    </div>
                    <p className="text-[11px] text-[#6E6E7A] leading-relaxed">{c.comment}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Roles */}
            <div className="bg-white rounded-xl border border-[#E8E8EA] p-4">
              <div className="text-[12px] text-[#1C1C1E] mb-3">Team access</div>
              <div className="space-y-2">
                {[
                  { name: "Arjun S.", role: "Admin", color: "#4B65E8", bg: "#EEF1FF" },
                  { name: "Priya M.", role: "Editor", color: "#4CAF7D", bg: "#EEF7F1" },
                  { name: "Dev Team", role: "Viewer", color: "#9595A0", bg: "#F0F0F2" },
                ].map((m) => (
                  <div key={m.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-[#F0F0F2] flex items-center justify-center text-[10px] text-[#6E6E7A]">
                        {m.name[0]}
                      </div>
                      <span className="text-[12px] text-[#1C1C1E]">{m.name}</span>
                    </div>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-md"
                      style={{ color: m.color, backgroundColor: m.bg }}
                    >
                      {m.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
