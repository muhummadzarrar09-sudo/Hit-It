"use client";

import { useEffect, useState } from "react";
import { WifiOff, Wifi } from "lucide-react";
import gsap from "gsap";

export function OfflineIndicator() {
  const [online, setOnline] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = () => {
      setVisible(true);
      gsap.fromTo(
        "#offline-badge",
        { y: -24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: "back.out(1.4)" }
      );
    };
    const hide = () => {
      gsap.to("#offline-badge", {
        y: -24,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => setVisible(false),
      });
    };

    const handleOnline = () => {
      setOnline(true);
      show();
      setTimeout(hide, 2500);
    };
    const handleOffline = () => {
      setOnline(false);
      show();
    };

    setOnline(navigator.onLine);
    if (!navigator.onLine) show();

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      id="offline-badge"
      className={`fixed top-3 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 rounded-full text-xs font-medium shadow-lg backdrop-blur-md border flex items-center gap-2 ${
        online
          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
          : "bg-amber-500/10 border-amber-500/20 text-amber-400"
      }`}
    >
      {online ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
      {online ? "Back online — changes sync when ready" : "You're offline — working locally"}
    </div>
  );
}