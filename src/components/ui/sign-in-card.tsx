"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Mail, Lock, Eye, EyeClosed, ArrowRight, AlertCircle } from "lucide-react";

import { Input } from "@/components/ui/input";

/*
  Glass sign-in card for the /admin console. Adapted from a 21st.dev card:
  re-themed from the original purple "StyleMe" look to Kore Digital's
  emerald-on-obsidian brand, and stripped of the Google button, sign-up link
  and no-op "Remember me" (this is a single-admin panel — no self-registration,
  no social auth). Presentational + controlled: the parent owns email/password
  state and the real Supabase submit; this file only renders and animates.

  Respects `prefers-reduced-motion`: when set, the looping decorative motion
  (traveling light beams, breathing glows, pulse spots, 3D tilt, hover/tap
  scale, entrance transforms and the button shimmer) is dropped and the card
  renders as a calm static panel. Essential feedback — the loading spinner —
  is kept.
*/

export interface SignInCardProps {
  email: string;
  onEmailChange: (value: string) => void;
  password: string;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  error?: string | null;
  forgotPasswordHref?: string;
}

export function SignInCard({
  email,
  onEmailChange,
  password,
  onPasswordChange,
  onSubmit,
  isLoading = false,
  error = null,
  forgotPasswordHref = "/admin/forgot-password",
}: SignInCardProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<"email" | "password" | null>(
    null
  );

  // `null` on the server / first paint → treat as "no preference" (animate).
  const reduce = useReducedMotion() ?? false;

  // 3D card tilt driven by cursor position. Collapsed to 0 under reduced motion.
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], reduce ? [0, 0] : [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], reduce ? [0, 0] : [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    onSubmit();
  };

  return (
    <div className="min-h-screen w-full bg-obsidian relative overflow-hidden flex items-center justify-center px-4">
      {/* Brand ambient gradient — emerald over obsidian (was purple). */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald/25 via-emerald-ink/25 to-black" />

      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* Top radial glow (static base) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120vh] h-[60vh] rounded-b-[50%] bg-emerald/15 blur-[80px]" />
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vh] h-[60vh] rounded-b-full bg-emerald/15 blur-[60px]"
        animate={reduce ? undefined : { opacity: [0.15, 0.3, 0.15], scale: [0.98, 1.02, 0.98] }}
        transition={reduce ? undefined : { duration: 8, repeat: Infinity, repeatType: "mirror" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90vh] h-[90vh] rounded-t-full bg-emerald/15 blur-[60px]"
        animate={reduce ? undefined : { opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
        transition={
          reduce
            ? undefined
            : { duration: 6, repeat: Infinity, repeatType: "mirror", delay: 1 }
        }
      />

      {/* Animated glow spots — pulse only when motion is allowed. */}
      <div
        className={`absolute left-1/4 top-1/4 w-96 h-96 bg-white/5 rounded-full blur-[100px] opacity-40 ${
          reduce ? "" : "animate-pulse"
        }`}
      />
      <div
        className={`absolute right-1/4 bottom-1/4 w-96 h-96 bg-white/5 rounded-full blur-[100px] opacity-40 ${
          reduce ? "" : "animate-pulse delay-1000"
        }`}
      />

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.8 }}
        className="w-full max-w-sm relative z-10"
        style={{ perspective: 1500 }}
      >
        <motion.div
          className="relative"
          style={{ rotateX, rotateY }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          whileHover={reduce ? undefined : { z: 10 }}
        >
          <div className="relative group">
            {/* Looping decorative frame — breathing glow + traveling beams.
                Purely ornamental, so skipped entirely under reduced motion. */}
            {!reduce && (
              <>
                <motion.div
                  className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-700"
                  animate={{
                    boxShadow: [
                      "0 0 10px 2px rgba(16,185,129,0.03)",
                      "0 0 15px 5px rgba(16,185,129,0.06)",
                      "0 0 10px 2px rgba(16,185,129,0.03)",
                    ],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatType: "mirror",
                  }}
                />

                <div className="absolute -inset-[1px] rounded-2xl overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-0 h-[3px] w-[50%] bg-gradient-to-r from-transparent via-emerald to-transparent opacity-70"
                    initial={{ filter: "blur(2px)" }}
                    animate={{
                      left: ["-50%", "100%"],
                      opacity: [0.3, 0.7, 0.3],
                      filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"],
                    }}
                    transition={{
                      left: {
                        duration: 2.5,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatDelay: 1,
                      },
                      opacity: { duration: 1.2, repeat: Infinity, repeatType: "mirror" },
                      filter: { duration: 1.5, repeat: Infinity, repeatType: "mirror" },
                    }}
                  />
                  <motion.div
                    className="absolute top-0 right-0 h-[50%] w-[3px] bg-gradient-to-b from-transparent via-emerald to-transparent opacity-70"
                    initial={{ filter: "blur(2px)" }}
                    animate={{
                      top: ["-50%", "100%"],
                      opacity: [0.3, 0.7, 0.3],
                      filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"],
                    }}
                    transition={{
                      top: {
                        duration: 2.5,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatDelay: 1,
                        delay: 0.6,
                      },
                      opacity: {
                        duration: 1.2,
                        repeat: Infinity,
                        repeatType: "mirror",
                        delay: 0.6,
                      },
                      filter: {
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "mirror",
                        delay: 0.6,
                      },
                    }}
                  />
                  <motion.div
                    className="absolute bottom-0 right-0 h-[3px] w-[50%] bg-gradient-to-r from-transparent via-emerald to-transparent opacity-70"
                    initial={{ filter: "blur(2px)" }}
                    animate={{
                      right: ["-50%", "100%"],
                      opacity: [0.3, 0.7, 0.3],
                      filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"],
                    }}
                    transition={{
                      right: {
                        duration: 2.5,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatDelay: 1,
                        delay: 1.2,
                      },
                      opacity: {
                        duration: 1.2,
                        repeat: Infinity,
                        repeatType: "mirror",
                        delay: 1.2,
                      },
                      filter: {
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "mirror",
                        delay: 1.2,
                      },
                    }}
                  />
                  <motion.div
                    className="absolute bottom-0 left-0 h-[50%] w-[3px] bg-gradient-to-b from-transparent via-emerald to-transparent opacity-70"
                    initial={{ filter: "blur(2px)" }}
                    animate={{
                      bottom: ["-50%", "100%"],
                      opacity: [0.3, 0.7, 0.3],
                      filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"],
                    }}
                    transition={{
                      bottom: {
                        duration: 2.5,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatDelay: 1,
                        delay: 1.8,
                      },
                      opacity: {
                        duration: 1.2,
                        repeat: Infinity,
                        repeatType: "mirror",
                        delay: 1.8,
                      },
                      filter: {
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "mirror",
                        delay: 1.8,
                      },
                    }}
                  />
                </div>
              </>
            )}

            {/* Glass card */}
            <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/[0.05] shadow-2xl overflow-hidden">
              {/* Inner grid pattern */}
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `linear-gradient(135deg, white 0.5px, transparent 0.5px), linear-gradient(45deg, white 0.5px, transparent 0.5px)`,
                  backgroundSize: "30px 30px",
                }}
              />

              {/* Brand mark + heading */}
              <div className="text-center space-y-1 mb-5">
                <motion.div
                  initial={reduce ? false : { scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={reduce ? { duration: 0 } : { type: "spring", duration: 0.8 }}
                  className="mx-auto w-10 h-10 rounded-full border border-emerald/25 flex items-center justify-center relative overflow-hidden"
                >
                  <span className="text-lg font-bold text-emerald">K</span>
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald/15 to-transparent opacity-50" />
                </motion.div>

                <motion.h1
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={reduce ? { duration: 0 } : { delay: 0.2 }}
                  className="text-xl font-bold text-white"
                >
                  Welcome back
                </motion.h1>

                <motion.p
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={reduce ? { duration: 0 } : { delay: 0.3 }}
                  className="text-white/60 text-xs"
                >
                  Sign in to the Kore Digital investor data console
                </motion.p>
              </div>

              {/* Login form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-3">
                  {/* Email */}
                  <motion.div
                    className={`relative ${focusedInput === "email" ? "z-10" : ""}`}
                    whileHover={reduce ? undefined : { scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <div className="relative flex items-center overflow-hidden rounded-lg">
                      <Mail
                        className={`absolute left-3 w-4 h-4 transition-all duration-300 ${
                          focusedInput === "email"
                            ? "text-emerald"
                            : "text-white/40"
                        }`}
                      />
                      <Input
                        type="email"
                        autoComplete="username"
                        autoFocus
                        required
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => onEmailChange(e.target.value)}
                        onFocus={() => setFocusedInput("email")}
                        onBlur={() => setFocusedInput(null)}
                        className="w-full bg-white/5 border-transparent focus-visible:border-emerald/40 focus-visible:ring-emerald/20 text-white placeholder:text-white/30 h-10 transition-all duration-300 pl-10 pr-3 focus:bg-white/10"
                      />
                    </div>
                  </motion.div>

                  {/* Password */}
                  <motion.div
                    className={`relative ${
                      focusedInput === "password" ? "z-10" : ""
                    }`}
                    whileHover={reduce ? undefined : { scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <div className="relative flex items-center overflow-hidden rounded-lg">
                      <Lock
                        className={`absolute left-3 w-4 h-4 transition-all duration-300 ${
                          focusedInput === "password"
                            ? "text-emerald"
                            : "text-white/40"
                        }`}
                      />
                      <Input
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        placeholder="Password"
                        value={password}
                        onChange={(e) => onPasswordChange(e.target.value)}
                        onFocus={() => setFocusedInput("password")}
                        onBlur={() => setFocusedInput(null)}
                        className="w-full bg-white/5 border-transparent focus-visible:border-emerald/40 focus-visible:ring-emerald/20 text-white placeholder:text-white/30 h-10 transition-all duration-300 pl-10 pr-10 focus:bg-white/10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-3 cursor-pointer"
                      >
                        {showPassword ? (
                          <Eye className="w-4 h-4 text-white/40 hover:text-white transition-colors duration-300" />
                        ) : (
                          <EyeClosed className="w-4 h-4 text-white/40 hover:text-white transition-colors duration-300" />
                        )}
                      </button>
                    </div>
                  </motion.div>
                </div>

                {/* Error + forgot-password row */}
                <div className="flex items-center justify-between gap-3 pt-1 min-h-5">
                  {error ? (
                    <p className="flex items-center gap-1.5 text-xs text-red-400">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {error}
                    </p>
                  ) : (
                    <span />
                  )}
                  <Link
                    href={forgotPasswordHref}
                    className="relative z-10 text-xs text-white/60 hover:text-white transition-colors duration-200 shrink-0"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit */}
                <motion.button
                  whileHover={reduce ? undefined : { scale: 1.02 }}
                  whileTap={reduce ? undefined : { scale: 0.98 }}
                  type="submit"
                  disabled={isLoading || !email.trim() || !password}
                  className="w-full relative group/button mt-2 disabled:opacity-60 disabled:pointer-events-none"
                >
                  <div className="absolute inset-0 bg-emerald/20 rounded-lg blur-lg opacity-0 group-hover/button:opacity-70 transition-opacity duration-300" />

                  <div className="relative overflow-hidden bg-emerald text-obsidian font-semibold h-10 rounded-lg transition-all duration-300 flex items-center justify-center">
                    {/* Loading shimmer sweep — skipped under reduced motion. */}
                    {!reduce && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 -z-10"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{
                          duration: 1.5,
                          ease: "easeInOut",
                          repeat: Infinity,
                          repeatDelay: 1,
                        }}
                        style={{
                          opacity: isLoading ? 1 : 0,
                          transition: "opacity 0.3s ease",
                        }}
                      />
                    )}

                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center"
                        >
                          <div className="w-4 h-4 border-2 border-obsidian/70 border-t-transparent rounded-full animate-spin" />
                        </motion.div>
                      ) : (
                        <motion.span
                          key="button-text"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center gap-1 text-sm font-semibold"
                        >
                          Sign in
                          <ArrowRight className="w-3 h-3 group-hover/button:translate-x-1 transition-transform duration-300" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
