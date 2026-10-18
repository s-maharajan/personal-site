import { useEffect } from "react";
import { useLocation, Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div className="relative min-h-screen print:min-h-0 print:overflow-visible print:bg-white">
      {/* Skip to Content for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:bg-accent focus:px-3 focus:py-1.5 focus:text-xs focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>

      <div className="mx-auto flex min-h-screen max-w-page flex-col px-4 sm:px-6 print:max-w-none print:p-0">
        <Header />
        <main id="main-content" key={pathname} className="fade-in flex-1 pb-16 pt-8 sm:pt-12 print:p-0">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
