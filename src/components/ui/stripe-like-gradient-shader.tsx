"use client";

import { GradFlow } from "gradflow";

/*
  Animated WebGL gradient background — 21st.dev @meerbahadin10
  "stripe-like gradient-shader", wrapping the `gradflow` package (over `ogl`).
  Used ONLY as the /admin page-layout background, never as a card surface.

  Re-tuned from the vivid white/cyan/purple default to Kore Digital's brand
  greens/cyans so the motion sits *behind* the dark console without blowing out
  the translucent glass cards. The canvas is opaque (gradflow renders with
  alpha:false) and fills its positioned parent, so mount it inside a
  `fixed inset-0` container and lay a scrim over it for card legibility.

  Motion / accessibility is handled *inside* gradflow: it already freezes to a
  single static frame under prefers-reduced-motion (reacting live to the OS
  toggle) and pauses when the tab or canvas is offscreen. So we deliberately do
  NOT pass `paused` or add our own reduced-motion gate — double-gating was what
  left the shader frozen even with Reduce Motion off.
*/
export function StripeGradientShader({ className }: { className?: string }) {
  return (
    <GradFlow
      className={className}
      config={{
        color1: { r: 6, g: 78, b: 76 }, // deep teal (#064E4C)
        color2: { r: 16, g: 185, b: 129 }, // emerald (#10B981)
        color3: { r: 34, g: 211, b: 238 }, // cyan-glow (#22D3EE)
        speed: 0.3,
        scale: 1.1,
        type: "stripe",
        noise: 0.08,
      }}
    />
  );
}
