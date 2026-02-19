import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Zap, Eye, EyeOff, Lock, CheckCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function ChangePasswordPage() {
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // Check if user has a valid recovery token
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const type = hashParams.get('type');

        if (!accessToken || type !== 'recovery') {
            setError("Invalid or expired password reset link. Please request a new one.");
        }
    }, []);

    const validatePassword = (password: string): string | null => {
        if (password.length < 8) {
            return "Password must be at least 8 characters long";
        }
        if (!/[A-Z]/.test(password) && !/[a-z]/.test(password)) {
            return "Password must contain letters";
        }
        if (!/[0-9]/.test(password)) {
            return "Password must contain at least one number";
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!newPassword || !confirmPassword) {
            setError("Please fill in all fields");
            return;
        }

        const passwordError = validatePassword(newPassword);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (updateError) throw updateError;

            setSuccess(true);

            // Redirect to sign in after 2 seconds
            setTimeout(() => {
                navigate("/signin");
            }, 2000);
        } catch (err: any) {
            setError(err.message || "Failed to update password. Please try again.");
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#F7F7F8] flex items-center justify-center px-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                <div className="w-full max-w-md text-center">
                    <div className="bg-white rounded-2xl border border-[#E8E8EA] p-10 shadow-[0_2px_24px_rgba(0,0,0,0.04)]">
                        <div className="w-16 h-16 rounded-full bg-[#EEF7F1] flex items-center justify-center mx-auto mb-4">
                            <CheckCircle size={32} className="text-[#4CAF7D]" />
                        </div>
                        <h1 className="text-[24px] text-[#1C1C1E] tracking-tight mb-2">Password Changed!</h1>
                        <p className="text-[14px] text-[#6E6E7A] mb-6">
                            Your password has been successfully updated. Redirecting to sign in...
                        </p>
                        <div className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-[#4B65E8]" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            <span className="text-[13px] text-[#6E6E7A]">Redirecting...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F7F7F8] flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-[#E8E8EA] bg-white">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 text-[13px] text-[#6E6E7A] hover:text-[#1C1C1E] transition-colors"
                >
                    <ArrowLeft size={14} />
                    Back
                </button>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-[#4B65E8] flex items-center justify-center">
                        <Zap size={12} className="text-white" strokeWidth={2} />
                    </div>
                    <span className="text-[13px] text-[#1C1C1E]">Auditwise</span>
                </div>
                <div className="w-16" />
            </header>

            <main className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-[#4B65E8] flex items-center justify-center mx-auto mb-4">
                            <Lock size={22} className="text-white" strokeWidth={1.5} />
                        </div>
                        <h1 className="text-[24px] text-[#1C1C1E] tracking-tight mb-1.5">Change Your Password</h1>
                        <p className="text-[13px] text-[#6E6E7A]">Enter your new password below</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-[#E8E8EA] p-7 shadow-[0_2px_24px_rgba(0,0,0,0.04)]">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* New Password */}
                            <div>
                                <label className="text-[12px] text-[#6E6E7A] block mb-1.5">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showNewPass ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        className="w-full px-4 py-2.5 pr-10 bg-[#F7F7F8] border border-[#E8E8EA] rounded-xl text-[13px] text-[#1C1C1E] placeholder:text-[#C0C0C4] focus:outline-none focus:border-[#4B65E8] focus:ring-2 focus:ring-[#4B65E8]/10 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPass(!showNewPass)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9595A0] hover:text-[#6E6E7A] transition-colors"
                                    >
                                        {showNewPass ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="text-[12px] text-[#6E6E7A] block mb-1.5">Confirm New Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPass ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                        className="w-full px-4 py-2.5 pr-10 bg-[#F7F7F8] border border-[#E8E8EA] rounded-xl text-[13px] text-[#1C1C1E] placeholder:text-[#C0C0C4] focus:outline-none focus:border-[#4B65E8] focus:ring-2 focus:ring-[#4B65E8]/10 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9595A0] hover:text-[#6E6E7A] transition-colors"
                                    >
                                        {showConfirmPass ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                </div>
                            </div>

                            {/* Password Requirements */}
                            <div className="bg-[#F7F7F8] border border-[#E8E8EA] rounded-xl p-4">
                                <p className="text-[11px] text-[#6E6E7A] mb-2 font-medium">Password must contain:</p>
                                <ul className="space-y-1.5">
                                    <li className="flex items-center gap-2 text-[11px] text-[#6E6E7A]">
                                        <div className={`w-1 h-1 rounded-full ${newPassword.length >= 8 ? 'bg-[#4CAF7D]' : 'bg-[#E8E8EA]'}`} />
                                        At least 8 characters
                                    </li>
                                    <li className="flex items-center gap-2 text-[11px] text-[#6E6E7A]">
                                        <div className={`w-1 h-1 rounded-full ${/[A-Za-z]/.test(newPassword) ? 'bg-[#4CAF7D]' : 'bg-[#E8E8EA]'}`} />
                                        Letters (uppercase or lowercase)
                                    </li>
                                    <li className="flex items-center gap-2 text-[11px] text-[#6E6E7A]">
                                        <div className={`w-1 h-1 rounded-full ${/[0-9]/.test(newPassword) ? 'bg-[#4CAF7D]' : 'bg-[#E8E8EA]'}`} />
                                        At least one number
                                    </li>
                                </ul>
                            </div>

                            {error && (
                                <p className="text-[12px] text-[#D4505A] bg-[#FFF0F1] px-3 py-2 rounded-lg">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 rounded-xl text-[13px] bg-[#4B65E8] text-white hover:bg-[#3a54d7] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                        Updating Password...
                                    </span>
                                ) : "Update Password"}
                            </button>
                        </form>
                    </div>

                    <p className="text-center text-[12px] text-[#9595A0] mt-5">
                        Remember your password?{" "}
                        <button onClick={() => navigate("/signin")} className="text-[#4B65E8] hover:underline">
                            Sign in
                        </button>
                    </p>
                </div>
            </main>
        </div>
    );
}
