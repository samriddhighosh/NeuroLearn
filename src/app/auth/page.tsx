"use client";
import React, { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";

export default function AuthPage({ onSuccess }) {
  const router = useRouter();
  const [mode, setMode]       = useState("login");   // "login" | "signup"
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]       = useState("");
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleEmailAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // create profile row
        await supabase.from("profiles").insert({
          id: data.user.id,
          display_name: name,
        });
        setEmailSent(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      onSuccess?.();
      router.push("/");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-[#fdfcff] flex items-center justify-center px-4"
        style={{ fontFamily: '"Avenir Next","Poppins","Segoe UI",sans-serif' }}>
        <div className="w-full max-w-[400px] flex flex-col gap-4">

          {/* main card */}
          <div className="bg-white rounded-[24px] border border-[#e8e4f0] p-8 shadow-[0_8px_40px_rgba(40,20,80,0.08)] text-center">
            <div className="w-14 h-14 rounded-[16px] bg-[#f0ecff] border border-[#ddd6ff] flex items-center justify-center mx-auto mb-5 text-2xl">
              📬
            </div>
            <h1 className="text-[1.4rem] font-extrabold tracking-[-0.03em] text-[#1a1628] m-0 mb-2">
              Check your inbox
            </h1>
            <p className="text-[14px] text-[#6e687f] m-0">
              We sent a confirmation link to
            </p>
            <p className="text-[14px] font-bold text-[#1a1628] mt-1 mb-5">
              {email}
            </p>

            {/* shadcn Alert */}
            <Alert className="text-left border-[#ddd6ff] bg-[#f8f5ff]">
              <AlertTitle className="text-[#6b4fcf] text-[13px] font-bold">
                One more step
              </AlertTitle>
              <AlertDescription className="text-[13px] text-[#4d4766] mt-1">
                Click the link in your email to activate your account. Check your spam folder if you don't see it within a minute.
              </AlertDescription>
            </Alert>

            <button
              onClick={() => { setEmailSent(false); setMode("login"); }}
              className="w-full mt-5 py-3 rounded-[12px] bg-[#7257B1] text-white text-[14px] font-bold cursor-pointer hover:opacity-90 transition-opacity border-none"
            >
              Back to log in
            </button>
          </div>

          {/* resend option */}
          <p className="text-center text-[13px] text-[#9490a8]">
            Didn't get it?{" "}
            <button
              onClick={async () => {
                await supabase.auth.resend({ type: "signup", email });
                alert("Resent! Check your inbox.");
              }}
              className="text-[#7b61d9] font-bold bg-transparent border-none cursor-pointer p-0"
            >
              Resend email
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfcff] flex items-center justify-center px-4"
      style={{ fontFamily: '"Avenir Next","Poppins","Segoe UI",sans-serif' }}>
      <div className="w-full max-w-[400px] bg-white rounded-[24px] border border-[#e8e4f0] p-8 shadow-[0_8px_40px_rgba(40,20,80,0.08)]">
        
        {/* Logo */}
        <div className="text-center mb-7">
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9490a8] mb-1">NeuroAcademy</div>
          <h1 className="text-[1.6rem] font-extrabold tracking-[-0.03em] text-[#1a1628] m-0">
            {mode === "login" ? "Welcome back" : "Get started"}
          </h1>
          <p className="text-[14px] text-[#9490a8] mt-1 mb-0">
            {mode === "login" ? "Log in to continue learning" : "Create your free account"}
          </p>
        </div>

        {/* Google button */}
        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-[12px] border border-[#e8e4f0] bg-white text-[14px] font-bold text-[#1a1628] cursor-pointer hover:bg-[#f5f4f8] transition-colors mb-4"
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4c-7.8 0-14.5 4.4-17.7 10.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.5 35.5 26.9 36 24 36c-5.2 0-9.6-2.9-11.3-7.1l-6.5 5C9.6 39.6 16.3 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.5l6.2 5.2C41 35.2 44 30 44 24c0-1.3-.1-2.7-.4-4z"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-[#e8e4f0]" />
          <span className="text-[12px] text-[#b0acbe] font-medium">or</span>
          <div className="flex-1 h-px bg-[#e8e4f0]" />
        </div>

        {/* Name field (signup only) */}
        {mode === "signup" && (
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-[12px] border border-[#e8e4f0] text-[14px] text-[#1a1628] mb-3 outline-none focus:border-[#7b61d9] transition-colors"
          />
        )}

        {/* Email + password */}
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-[12px] border border-[#e8e4f0] text-[14px] text-[#1a1628] mb-3 outline-none focus:border-[#7b61d9] transition-colors"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-[12px] border border-[#e8e4f0] text-[14px] text-[#1a1628] mb-4 outline-none focus:border-[#7b61d9] transition-colors"
        />

        {/* Error */}
        {error && (
          <p className="text-[13px] text-[#c0392b] mb-3 text-center">{error}</p>
        )}

        {/* Submit */}
        <button
          onClick={handleEmailAuth}
          disabled={loading}
          className="w-full py-3 rounded-[12px] bg-[#7257B1] text-white text-[14px] font-bold cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-60 mb-4"
        >
          {loading ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
        </button>

        {/* Toggle mode */}
        <p className="text-center text-[13px] text-[#9490a8] m-0">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); }}
            className="text-[#7b61d9] font-bold bg-transparent border-none cursor-pointer p-0"
          >
            {mode === "login" ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}