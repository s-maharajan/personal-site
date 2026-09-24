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
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="backdrop pointer-events-none absolute inset-x-0 top-0 h-[36rem]" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-screen max-w-page flex-col px-5 sm:px-8">
        <Header />
        <main key={pathname} className="fade-in flex-1 pb-24 pt-12 sm:pt-20">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
