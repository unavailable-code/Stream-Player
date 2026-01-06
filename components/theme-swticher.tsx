"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, PaletteIcon } from "lucide-react";

const THEMES = [
  { id: "dark", label: "Dark " },
  { id: "crimson", label: "Crimson " },
  { id: "emerald", label: "Emerald " },
  { id: "sakura", label: "Sakura " },
  { id: "gold", label: "gold " },

];

export function ThemeDropdown() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const ref = useRef<HTMLDivElement>(null);

  // Load saved theme
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const changeTheme = (id: string) => {
    setTheme(id);
    document.documentElement.setAttribute("data-theme", id);
    localStorage.setItem("theme", id);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative w-44">

   <button
  onClick={() => setOpen((v) => !v)}
  className="
    flex items-center gap-2
    rounded-lg border border-theme
    bg-button p-2
    hover:bg-card
  "
  aria-label="Change theme"
>

  <PaletteIcon className="h-4 w-4" />


  <ChevronDown
    className={`h-4 w-4 transition-transform ${
      open ? "rotate-180" : ""
    }`}
  />
</button>

      {open && (
        <div
          className="
            absolute right-0 mt-2 
            rounded-lg border border-theme
            bg-card shadow-lg z-50
          "
        >
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => changeTheme(t.id)}
              className={`
                w-full px-3 py-2 text-left text-sm
                hover:bg-white/10
                ${theme === t.id ? "bg-white/10 font-medium" : ""}
              `}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
