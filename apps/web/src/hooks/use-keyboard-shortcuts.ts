"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

export function useKeyboardShortcuts() {
  const {
    setCommandOpen,
    setCreateIssueOpen,
    setCreateProjectOpen,
    setCreateCycleOpen,
    setCreateSubIssueOpen,
    setSaveViewOpen,
    setMainView,
    setIssueViewMode,
    mainView,
  } = useStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen(true);
        return;
      }

      if (!isTyping && e.key === "c" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setCreateIssueOpen(true);
        return;
      }

      if (!isTyping && e.key === "g" && !e.metaKey && !e.ctrlKey) {
        const navHandler = (ev: KeyboardEvent) => {
          window.removeEventListener("keydown", navHandler);
          switch (ev.key) {
            case "i":
              setMainView("issues");
              break;
            case "p":
              setMainView("projects");
              break;
            case "c":
              setMainView("cycles");
              break;
            case "r":
              setMainView("roadmap");
              break;
            case "t":
              setMainView("triage");
              break;
          }
        };
        window.addEventListener("keydown", navHandler);
        return;
      }

      if (!isTyping && e.key === "1") {
        e.preventDefault();
        setIssueViewMode("list");
        return;
      }
      if (!isTyping && e.key === "2") {
        e.preventDefault();
        setIssueViewMode("board");
        return;
      }

      if (e.key === "Escape") {
        setCommandOpen(false);
        setCreateIssueOpen(false);
        setCreateProjectOpen(false);
        setCreateCycleOpen(false);
        setCreateSubIssueOpen(false);
        setSaveViewOpen(false);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [
    setCommandOpen,
    setCreateIssueOpen,
    setCreateProjectOpen,
    setCreateCycleOpen,
    setCreateSubIssueOpen,
    setSaveViewOpen,
    setMainView,
    setIssueViewMode,
    mainView,
  ]);
}