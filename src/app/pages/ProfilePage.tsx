import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Zap, User, Mail, Calendar, LogOut, Camera, Save, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../../lib/supabase";

export default function ProfilePage() {
    const navigate = useNavigate();
    const { user, signOut, resetPassword } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [fullName, setFullName] = useState(user?.user_metadata?.full_name || "");
    const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url || "");
    const [sendingReset, setSendingReset] = useState(false);
    const [resetSent, setResetSent] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSignOut = async () => {
        await signOut();
        navigate("/");
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            setError("Image size should be less than 2MB");
            return;
        }

        // Check file type
        if (!file.type.startsWith("image/")) {
            setError("Please upload an image file");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // Convert to base64 for preview
            const reader = new FileReader();
            reader.onload = () => {
                setAvatarUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        } catch (err) {
            setError("Failed to upload image");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!user) return;

        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                data: {
                    full_name: fullName,
                    avatar_url: avatarUrl,
                },
            });

            if (updateError) throw updateError;

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!user?.email) return;

        setSendingReset(true);
        setError("");
        setResetSent(false);

        try {
            const { error: resetError } = await resetPassword(user.email);

            if (resetError) throw resetError;

            setResetSent(true);
            setTimeout(() => setResetSent(false), 5000);
        } catch (err: any) {
            setError(err.message || "Failed to send password reset email");
        } finally {
            setSendingReset(false);
        }
    };

    if (!user) {
        navigate("/signin");
        return null;
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-[#F7F7F8] flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Top bar */}
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
                <button
                    onClick={handleSignOut}
                    className="text-[12px] text-[#6E6E7A] hover:text-[#1C1C1E] transition-colors px-3 py-1.5 flex items-center gap-1.5"
                >
                    <LogOut size={12} />
                    Sign out
                </button>
            </header>

            <main className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-2xl">
                    {/* Title */}
                    <div className="text-center mb-8">
                        <h1 className="text-[28px] text-[#1C1C1E] tracking-tight mb-2.5">Your Profile</h1>
                        <p className="text-[14px] text-[#6E6E7A] leading-relaxed">
                            Manage your account settings and preferences
                        </p>
                    </div>

                    {/* Card */}
                    <div className="bg-white rounded-2xl border border-[#E8E8EA] overflow-hidden shadow-[0_2px_24px_rgba(0,0,0,0.04)]">
                        {/* Avatar Section */}
                        <div className="p-8 border-b border-[#E8E8EA] bg-gradient-to-br from-[#F7F7F8] to-white">
                            <div className="flex flex-col items-center">
                                <div className="relative group">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <div
                                        onClick={handleAvatarClick}
                                        className="w-24 h-24 rounded-full bg-gradient-to-br from-[#4B65E8] to-[#3a54d7] flex items-center justify-center cursor-pointer overflow-hidden border-4 border-white shadow-lg group-hover:shadow-xl transition-all"
                                    >
                                        {avatarUrl ? (
                                            <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={36} className="text-white" strokeWidth={1.5} />
                                        )}
                                    </div>
                                    <button
                                        onClick={handleAvatarClick}
                                        className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border-2 border-[#E8E8EA] flex items-center justify-center shadow-md hover:bg-[#F7F7F8] transition-colors"
                                    >
                                        <Camera size={14} className="text-[#6E6E7A]" />
                                    </button>
                                </div>
                                <p className="text-[11px] text-[#9595A0] mt-3">Click to upload profile picture</p>
                            </div>
                        </div>

                        {/* Form Section */}
                        <div className="p-7 space-y-5">
                            {/* Full Name */}
                            <div>
                                <label className="text-[12px] text-[#6E6E7A] block mb-2 flex items-center gap-1.5">
                                    <User size={12} />
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Enter your full name"
                                    className="w-full px-4 py-3 bg-[#F7F7F8] border border-[#E8E8EA] rounded-xl text-[13px] text-[#1C1C1E] placeholder:text-[#C0C0C4] focus:outline-none focus:border-[#4B65E8] focus:ring-2 focus:ring-[#4B65E8]/10 transition-all duration-150"
                                />
                            </div>

                            {/* Email (Read-only) */}
                            <div>
                                <label className="text-[12px] text-[#6E6E7A] block mb-2 flex items-center gap-1.5">
                                    <Mail size={12} />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="w-full px-4 py-3 bg-[#F0F0F2] border border-[#E8E8EA] rounded-xl text-[13px] text-[#9595A0] cursor-not-allowed"
                                />
                                <p className="text-[11px] text-[#9595A0] mt-1.5">
                                    Email cannot be changed
                                </p>
                            </div>

                            {/* Account Created */}
                            <div>
                                <label className="text-[12px] text-[#6E6E7A] block mb-2 flex items-center gap-1.5">
                                    <Calendar size={12} />
                                    Member Since
                                </label>
                                <input
                                    type="text"
                                    value={formatDate(user.created_at)}
                                    disabled
                                    className="w-full px-4 py-3 bg-[#F0F0F2] border border-[#E8E8EA] rounded-xl text-[13px] text-[#9595A0] cursor-not-allowed"
                                />
                            </div>

                            {/* Change Password Button */}
                            <div className="pt-2">
                                <button
                                    type="button"
                                    onClick={handleChangePassword}
                                    disabled={sendingReset}
                                    className="w-full py-3 rounded-xl text-[13px] border border-[#E8E8EA] text-[#6E6E7A] hover:bg-[#F7F7F8] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {sendingReset ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                            </svg>
                                            Sending Reset Link...
                                        </>
                                    ) : (
                                        <>
                                            <Lock size={14} />
                                            Change Password
                                        </>
                                    )}
                                </button>
                                <p className="text-[11px] text-[#9595A0] mt-1.5 text-center">
                                    We'll send a password reset link to your email
                                </p>
                            </div>

                            {/* Messages */}
                            {error && (
                                <div className="text-[12px] text-[#D4505A] bg-[#FFF0F1] px-4 py-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="text-[12px] text-[#4CAF7D] bg-[#EEF7F1] px-4 py-3 rounded-lg">
                                    Profile updated successfully!
                                </div>
                            )}

                            {resetSent && (
                                <div className="text-[12px] text-[#4B65E8] bg-[#EEF1FF] px-4 py-3 rounded-lg">
                                    Password reset link sent! Check your email.
                                </div>
                            )}

                            {/* Save Button */}
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="w-full py-3.5 rounded-xl text-[14px] bg-[#4B65E8] text-white hover:bg-[#3a54d7] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-6 text-center">
                        <p className="text-[12px] text-[#9595A0]">
                            Need help?{" "}
                            <button className="text-[#4B65E8] hover:underline">
                                Contact Support
                            </button>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
