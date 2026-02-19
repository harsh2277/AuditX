import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Menu, X, Zap, LogOut, User, Settings } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const avatarUrl = user?.user_metadata?.avatar_url;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStartAudit = () => {
    if (user) {
      navigate("/upload");
    } else {
      navigate("/signup");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    setShowDropdown(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E8E8EA]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-7 h-7 rounded-lg bg-[#4B65E8] flex items-center justify-center">
              <Zap size={14} className="text-white" strokeWidth={2} />
            </div>
            <span className="text-[#1C1C1E] text-sm font-medium tracking-tight">Auditwise</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {["Features", "How it Works", "Use Cases", "Pricing"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-[13px] text-[#6E6E7A] hover:text-[#1C1C1E] transition-colors duration-150"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {/* User Avatar Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4B65E8] to-[#3a54d7] flex items-center justify-center overflow-hidden border-2 border-white shadow-sm hover:shadow-md transition-all"
                  >
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User size={16} className="text-white" strokeWidth={2} />
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-[#E8E8EA] shadow-lg overflow-hidden z-50">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-[#E8E8EA] bg-[#F7F7F8]">
                        <div className="text-[13px] text-[#1C1C1E] font-medium truncate">
                          {user.user_metadata?.full_name || "User"}
                        </div>
                        <div className="text-[11px] text-[#9595A0] truncate">
                          {user.email}
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <button
                          onClick={() => {
                            navigate("/upload");
                            setShowDropdown(false);
                          }}
                          className="w-full px-4 py-2.5 text-left text-[13px] text-[#1C1C1E] hover:bg-[#F7F7F8] transition-colors flex items-center gap-2"
                        >
                          <Zap size={14} className="text-[#6E6E7A]" />
                          Start Audit
                        </button>
                        <button
                          onClick={() => {
                            navigate("/profile");
                            setShowDropdown(false);
                          }}
                          className="w-full px-4 py-2.5 text-left text-[13px] text-[#1C1C1E] hover:bg-[#F7F7F8] transition-colors flex items-center gap-2"
                        >
                          <Settings size={14} className="text-[#6E6E7A]" />
                          Profile Settings
                        </button>
                        <button
                          onClick={handleSignOut}
                          className="w-full px-4 py-2.5 text-left text-[13px] text-[#D4505A] hover:bg-[#FFF0F1] transition-colors flex items-center gap-2"
                        >
                          <LogOut size={14} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/signin")}
                  className="text-[13px] text-[#6E6E7A] hover:text-[#1C1C1E] transition-colors duration-150 px-3 py-1.5"
                >
                  Sign in
                </button>
                <button
                  onClick={handleStartAudit}
                  className="text-[13px] bg-[#1C1C1E] text-white px-4 py-2 rounded-lg hover:bg-[#2C2C2E] transition-colors duration-150"
                >
                  Start Free Audit
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-[#6E6E7A] p-1"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-[#E8E8EA] space-y-3">
            {["Features", "How it Works", "Use Cases", "Pricing"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="block text-[14px] text-[#6E6E7A] hover:text-[#1C1C1E] py-1 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-2 py-3 border-b border-[#E8E8EA]">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4B65E8] to-[#3a54d7] flex items-center justify-center overflow-hidden">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User size={18} className="text-white" strokeWidth={2} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] text-[#1C1C1E] font-medium truncate">
                        {user.user_metadata?.full_name || "User"}
                      </div>
                      <div className="text-[11px] text-[#9595A0] truncate">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      navigate("/upload");
                      setIsOpen(false);
                    }}
                    className="text-[13px] text-[#6E6E7A] py-2 text-left flex items-center gap-2"
                  >
                    <Zap size={14} />
                    Start Audit
                  </button>
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setIsOpen(false);
                    }}
                    className="text-[13px] text-[#6E6E7A] py-2 text-left flex items-center gap-2"
                  >
                    <Settings size={14} />
                    Profile Settings
                  </button>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                    className="text-[13px] text-[#D4505A] py-2 text-left flex items-center gap-2"
                  >
                    <LogOut size={14} />
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      navigate("/signin");
                      setIsOpen(false);
                    }}
                    className="text-[13px] text-[#6E6E7A] py-2 text-left"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => {
                      handleStartAudit();
                      setIsOpen(false);
                    }}
                    className="text-[13px] bg-[#1C1C1E] text-white px-4 py-2.5 rounded-lg w-full"
                  >
                    Start Free Audit
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
