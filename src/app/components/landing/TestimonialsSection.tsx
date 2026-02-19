const testimonials = [
  {
    quote: "Auditwise cut our pre-handoff review time from 3 hours to 20 minutes. The AI catches things we consistently missed.",
    name: "Mira Okonkwo",
    role: "Senior UI Designer",
    company: "Flux Studio",
    avatar: "#4B65E8",
    initials: "MO",
  },
  {
    quote: "We use it for every client project. The PDF export is clean enough to send directly — clients love seeing the structured score.",
    name: "Tomás Reyes",
    role: "Creative Director",
    company: "Forma Agency",
    avatar: "#4CAF7D",
    initials: "TR",
  },
  {
    quote: "As a SaaS founder with no in-house designer, this gave me clarity on exactly what to fix before our product launch.",
    name: "Sana Kapoor",
    role: "Founder & CEO",
    company: "Layerstack",
    avatar: "#8B5CF6",
    initials: "SK",
  },
  {
    quote: "The accessibility checks alone are worth it. We went from failing WCAG to passing in one sprint using the audit recommendations.",
    name: "David Mensah",
    role: "Product Design Lead",
    company: "Orbit Health",
    avatar: "#E8A44F",
    initials: "DM",
  },
  {
    quote: "Finally, a tool that speaks both design and product language. Our cross-functional reviews are now structured and fast.",
    name: "Yuki Tanaka",
    role: "Product Manager",
    company: "Pulse IO",
    avatar: "#D4505A",
    initials: "YT",
  },
  {
    quote: "The version comparison feature is a game changer. We can clearly show clients how much the design improved after revisions.",
    name: "Isabelle Laurent",
    role: "UX Consultant",
    company: "Independent",
    avatar: "#6E6E7A",
    initials: "IL",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-14">
          <div className="text-[12px] text-[#9595A0] uppercase tracking-widest mb-4">Testimonials</div>
          <h2 className="text-[32px] text-[#1C1C1E] leading-[1.3] tracking-tight mb-4">
            Trusted by designers who ship with confidence.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-[#F7F7F8] rounded-xl border border-[#E8E8EA] p-6 space-y-5 hover:border-[#D0D0D4] transition-colors duration-150"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="#E8A44F">
                    <path d="M6 0.5l1.545 3.13 3.455.502-2.5 2.437.59 3.44L6 8.25l-3.09 1.759.59-3.44L1 4.132l3.455-.503L6 .5z" />
                  </svg>
                ))}
              </div>

              <p className="text-[14px] text-[#3A3A3F] leading-relaxed">"{t.quote}"</p>

              <div className="flex items-center gap-3 pt-1">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] shrink-0"
                  style={{ backgroundColor: t.avatar }}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="text-[13px] text-[#1C1C1E]">{t.name}</div>
                  <div className="text-[11px] text-[#9595A0]">{t.role} · {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
