"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  /** Target number to count to. */
  end: number;
  /** Animation duration in ms. Default 1200. */
  duration?: number;
  /** Decimal places to display. Default 0. */
  decimals?: number;
  /** String rendered before the number (e.g. "₹", "+"). */
  prefix?: string;
  /** String rendered after the number (e.g. "%", " km"). */
  suffix?: string;
  /** Locale grouping (default: en-IN — Indian numbering). */
  locale?: string;
  className?: string;
}

/**
 * <CountUp> — number that counts from 0 → end when it enters view.
 *
 * Uses requestAnimationFrame with an ease-out-cubic curve so the value
 * decelerates as it approaches the target — reads as intentional and
 * professional, not linear/mechanical.
 *
 * Respects `prefers-reduced-motion`: jumps straight to `end` on mount.
 */
export default function CountUp({
  end,
  duration = 1200,
  decimals = 0,
  prefix = "",
  suffix = "",
  locale = "en-IN",
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setValue(end);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            observer.disconnect();
            runAnimation();
          }
        }
      },
      { threshold: 0.3, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(node);

    function runAnimation() {
      const startTime = performance.now();
      const from = 0;
      const to = end;
      const range = to - from;

      const step = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        // easeOutCubic: 1 - (1 - t)^3
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(from + range * eased);
        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          setValue(to);
        }
      };
      requestAnimationFrame(step);
    }

    return () => observer.disconnect();
  }, [end, duration]);

  const formatted = value.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
