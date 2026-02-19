import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Zap, Mail, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email) {
            setError("Please enter your email address");
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setLoading(true);

        try {
            const { error: resetError } = await resetPassword(email);

            if (resetError) throw resetError;

            setSuccess(true);
        } catch (err: any) {
            setError(err.message || "Failed to send reset email. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#F7F7F8] flex items-center justify-center px-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl border border-[#E8E8EA] p-10 shadow-[0_2px_24px_rgba(0,0,0,0.04)] text-center">
                        <div className="w-16 h-16 rounded-full bg-[#EEF1FF] flex items-center justify-center mx-auto mb-4">
                            <CheckCircle size={32} className="text-[#4B65E8]" />
                        </div>
                        <h1 className="text-[24px] text-[#1C1C1E] tracking-tight mb-2">Check Your Email</h1>
                        <p className="text-[14px] text-[#6E6E7A] mb-6">
                            We've sent a password reset link to <strong className="text-[#1C1C1E]">{email}</strong>
                        </p>
                        <div className="bg-[#F7F7F8] border border-[#E8E8EA] rounded-xl p-4 mb-6 text-left">
                            <p className="text-[12px] text-[#6E6E7A] mb-2">
                                <strong className="text-[#1C1C1E]">Next steps:</strong>
                            </p>
                            <ol className="space-y-1.5 text-[12px] text-[#6E6E7A] list-decimal list-inside">
                                <li>Check your email inbox</li>
                                <li>Click the reset password link</li>
                                <li>Create your new password</li>
                            </ol>
                        </div>
                        <p className="text-[11px] text-[#9595A0] mb-4">
                            Didn't receive the email? Check your spam folder or try again.
                        </p>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => setSuccess(false)}
                                className="w-full py-2.5 rounded-xl text-[13px] bg-[#4B65E8] text-white hover:bg-[#3a54d7] transition-colors"
                            >
                                Send Again
                            </button>
                            <button
                                onClick={() => navigate("/signin")}
                                className="w-full py-2.5 rounded-xl text-[13px] border border-[#E8E8EA] text-[#6E6E7A] hover:bg-[#F7F7F8] transition-colors"
                            >
                                Back to Sign In
                            </button>
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
                    onClick={() => navigate("/signin")}
                    className="flex items-center gap-2 text-[13px] text-[#6E6E7A] hover:text-[#1C1C1E] transition-colors"
                >
                    <ArrowLeft size={14} />
                    Back to Sign In
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
                            <Mail size={22} className="text-white" strokeWidth={1.5} />
                        </div>
                        <h1 className="text-[24px] text-[#1C1C1E] tracking-tight mb-1.5">Forgot Password?</h1>
                        <p className="text-[13px] text-[#6E6E7A]">
                            No worries! Enter your email and we'll send you a reset link.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-[#E8E8EA] p-7 shadow-[0_2px_24px_rgba(0,0,0,0.04)]">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-[12px] text-[#6E6E7A] block mb-1.5">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full px-4 py-2.5 bg-[#F7F7F8] border border-[#E8E8EA] rounded-xl text-[13px] text-[#1C1C1E] placeholder:text-[#C0C0C4] focus:outline-none focus:border-[#4B65E8] focus:ring-2 focus:ring-[#4B65E8]/10 transition-all"
                                />
                                <p className="text-[11px] text-[#9595A0] mt-1.5">
                                    Enter the email associated with your account
                                </p>
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
                                        Sending Reset Link...
                                    </span>
                                ) : "Send Reset Link"}
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
