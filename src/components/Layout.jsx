import { useState, useEffect } from "react";
import { useLocation, Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import CommandPalette from "./CommandPalette";

export default function Layout() {
  const { pathname } = useLocation();
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden print:min-h-0 print:overflow-visible print:bg-white">
      {/* Skip to Content for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:text-bg focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Decorative Top Glow */}
      <div
        className="backdrop pointer-events-none absolute inset-x-0 top-0 h-[36rem] print:hidden"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-screen max-w-page flex-col px-5 sm:px-8 print:max-w-none print:p-0 print:m-0">
        <Header onOpenPalette={() => setIsPaletteOpen(true)} />
        <main id="main-content" key={pathname} className="fade-in flex-1 pb-24 pt-12 sm:pt-20 print:p-0 print:m-0">
          <Outlet context={{ onOpenPalette: () => setIsPaletteOpen(true) }} />
        </main>
        <Footer />
      </div>

      <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />
    </div>
  );
}
