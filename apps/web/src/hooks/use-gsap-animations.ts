"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function usePageEntrance() {
  const container = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (!container.current) return;
    gsap.fromTo(
      container.current.children,
      { opacity: 0, y: 12, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.04, ease: "power2.out" }
    );
  }, { scope: container });
  return container;
}

export function useStaggeredList(itemsRef: React.RefObject<(HTMLElement | null)[]>) {
  useGSAP(() => {
    const els = itemsRef.current?.filter(Boolean);
    if (!els || els.length === 0) return;
    gsap.fromTo(
      els,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.3, stagger: 0.03, ease: "power2.out", overwrite: true }
    );
  }, { dependencies: [itemsRef.current] });
}

export function useScrollReveal(ref: React.RefObject<HTMLElement | null>) {
  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
      }
    );
  }, { scope: ref });
}

export function useModalEntrance(ref: React.RefObject<HTMLElement | null>, isOpen: boolean) {
  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    if (isOpen) {
      gsap.fromTo(
        el,
        { opacity: 0, scale: 0.92, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: "back.out(1.4)" }
      );
    } else {
      gsap.to(el, { opacity: 0, scale: 0.95, y: 10, duration: 0.15, ease: "power2.in" });
    }
  }, { dependencies: [isOpen] });
}

export function useDetailSlide(ref: React.RefObject<HTMLElement | null>, isOpen: boolean) {
  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    if (isOpen) {
      gsap.fromTo(
        el,
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.35, ease: "power3.out" }
      );
    } else {
      gsap.to(el, { x: 40, opacity: 0, duration: 0.2, ease: "power2.in" });
    }
  }, { dependencies: [isOpen] });
}

export function useBoardCardEntrance(containerRef: React.RefObject<HTMLElement | null>) {
  useGSAP(() => {
    const container = containerRef.current;
    if (!container) return;
    const cards = container.querySelectorAll("[data-board-card]");
    if (cards.length === 0) return;
    gsap.fromTo(
      cards,
      { opacity: 0, y: 16, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.3, stagger: 0.04, ease: "back.out(1.2)" }
    );
  }, { scope: containerRef });
}

export function useProgressBar(ref: React.RefObject<HTMLElement | null>, targetWidth: number) {
  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    gsap.fromTo(el, { width: "0%" }, { width: `${targetWidth}%`, duration: 0.8, ease: "power2.out" });
  }, { dependencies: [targetWidth] });
}

export function useCountUp(ref: React.RefObject<HTMLElement | null>, target: number) {
  const obj = useRef({ val: 0 });
  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    gsap.fromTo(
      obj.current,
      { val: 0 },
      {
        val: target,
        duration: 0.6,
        ease: "power2.out",
        onUpdate: () => {
          if (el) el.textContent = String(Math.round(obj.current.val));
        },
      }
    );
  }, { dependencies: [target] });
}

export function useHoverScale(ref: React.RefObject<HTMLElement | null>) {
  const enter = useCallback(() => {
    if (ref.current) gsap.to(ref.current, { scale: 1.02, duration: 0.2, ease: "power2.out" });
  }, [ref]);
  const leave = useCallback(() => {
    if (ref.current) gsap.to(ref.current, { scale: 1, duration: 0.2, ease: "power2.out" });
  }, [ref]);
  return { onMouseEnter: enter, onMouseLeave: leave };
}

export function useSidebarStagger(ref: React.RefObject<HTMLElement | null>) {
  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    const items = el.querySelectorAll("[data-sidebar-item]");
    gsap.fromTo(
      items,
      { opacity: 0, x: -12 },
      { opacity: 1, x: 0, duration: 0.3, stagger: 0.02, ease: "power2.out", delay: 0.1 }
    );
  }, { scope: ref });
}

export function useSpringBounce(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.fromTo(el, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" });
  }, [ref]);
}

export function useRoadmapBarGrow(ref: React.RefObject<HTMLElement | null>, width: string) {
  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "power2.out", transformOrigin: "left center" });
  }, { dependencies: [width] });
}

export function useTypingReveal(containerRef: React.RefObject<HTMLElement | null>) {
  useGSAP(() => {
    const container = containerRef.current;
    if (!container) return;
    const children = container.children;
    gsap.fromTo(
      children,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.2, stagger: 0.06, ease: "power2.out" }
    );
  }, { scope: containerRef });
}

export function useFadeIn(ref: React.RefObject<HTMLElement | null>, delay = 0) {
  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.4, delay, ease: "power2.out" });
  }, { scope: ref });
}