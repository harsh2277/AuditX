import { useNavigate } from "react-router";
import { ArrowRight, Zap, Twitter, Linkedin, Github } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const footerLinks = {
  Product: ["Features", "How it Works", "Pricing", "Changelog", "Roadmap"],
  Resources: ["Documentation", "API Reference", "Blog", "Design Guides", "Support"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"],
};

export function CTAFooter() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStartAudit = () => {
    if (user) {
      navigate("/upload");
    } else {
      navigate("/signup");
    }
  };

  return (
    <>
      {/* Final CTA */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <div className="text-[12px] text-[#9595A0] uppercase tracking-widest">Get Started</div>
            <h2 className="text-[36px] text-[#1C1C1E] leading-[1.3] tracking-tight">
              Start your first audit today.
            </h2>
            <p className="text-[15px] text-[#6E6E7A] leading-relaxed max-w-lg mx-auto">
              Upload a design, get your AI score, and know exactly what to fix. No setup. No credit card. Ready in under a minute.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleStartAudit}
              className="inline-flex items-center justify-center gap-2 bg-[#4B65E8] text-white px-7 py-3.5 rounded-lg text-[14px] hover:bg-[#3a54d7] transition-colors duration-150"
            >
              Start Free Audit
              <ArrowRight size={15} />
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 border border-[#E8E8EA] text-[#1C1C1E] px-7 py-3.5 rounded-lg text-[14px] hover:border-[#C8C8CA] transition-colors duration-150"
            >
              View sample report
            </button>
          </div>

          <div className="text-[12px] text-[#9595A0]">
            Trusted by 320+ design teams · 14-day trial · No credit card
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E8E8EA] bg-[#F7F7F8] px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
            {/* Brand */}
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-[#4B65E8] flex items-center justify-center">
                  <Zap size={14} className="text-white" strokeWidth={2} />
                </div>
                <span className="text-[#1C1C1E] text-sm">Auditwise</span>
              </div>
              <p className="text-[13px] text-[#6E6E7A] leading-relaxed max-w-xs mb-5">
                AI-powered design audits for teams who care about quality. Clear insights, structured feedback, faster fixes.
              </p>
              <div className="flex items-center gap-3">
                {[
                  { icon: Twitter, label: "Twitter" },
                  { icon: Linkedin, label: "LinkedIn" },
                  { icon: Github, label: "GitHub" },
                ].map((social) => (
                  <button
                    key={social.label}
                    className="w-8 h-8 rounded-lg bg-white border border-[#E8E8EA] flex items-center justify-center text-[#6E6E7A] hover:text-[#1C1C1E] hover:border-[#C8C8CA] transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon size={14} strokeWidth={1.5} />
                  </button>
                ))}
              </div>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([section, links]) => (
              <div key={section}>
                <div className="text-[12px] text-[#1C1C1E] mb-4 uppercase tracking-wider">{section}</div>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-[13px] text-[#6E6E7A] hover:text-[#1C1C1E] transition-colors duration-150"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-[#E8E8EA] pt-7 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-[12px] text-[#9595A0]">
              © 2025 Auditwise. All rights reserved.
            </div>
            <div className="text-[12px] text-[#9595A0]">
              Made for designers who ship quality.
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
