"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

interface RevealProps {
  children: ReactNode;
  /** Milliseconds to delay the reveal after entering the viewport. */
  delay?: number;
  /** Direction the content translates FROM before revealing. */
  direction?: Direction;
  /** Transition duration in ms. Default 500. */
  duration?: number;
  /** Distance (px) of the translate. Default 16. Keep subtle — 8–20 px range. */
  distance?: number;
  /** If true (default), reveal fires once and observer disconnects. */
  once?: boolean;
  /** Underlying element type. Default 'div'. */
  as?: ElementType;
  className?: string;
  /** Extra inline styles merged with the reveal transition style. */
  style?: CSSProperties;
}

/**
 * <Reveal> — subtle scroll-triggered fade + translate.
 *
 * Uses IntersectionObserver to add `data-reveal="in"` when the element enters
 * the viewport. The actual transition is defined in globals.css via the
 * [data-reveal] / [data-reveal="in"] selectors, so JSX stays lightweight.
 *
 * Respects `prefers-reduced-motion`: if the user has requested reduced
 * motion, the element is revealed immediately on mount with no animation.
 */
export default function Reveal({
  children,
  delay = 0,
  direction = "up",
  duration = 500,
  distance = 16,
  once = true,
  as: Tag = "div",
  className,
  style,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Reduced-motion → skip observer, reveal instantly
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -80px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  // Initial (hidden) transform based on direction
  const initialTransform =
    direction === "up"
      ? `translate3d(0, ${distance}px, 0)`
      : direction === "down"
        ? `translate3d(0, -${distance}px, 0)`
        : direction === "left"
          ? `translate3d(${distance}px, 0, 0)`
          : direction === "right"
            ? `translate3d(-${distance}px, 0, 0)`
            : "none";

  return (
    <Tag
      ref={ref}
      data-reveal={visible ? "in" : ""}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : initialTransform,
        transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
        transitionDelay: `${delay}ms`,
        willChange: visible ? "auto" : "opacity, transform",
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
