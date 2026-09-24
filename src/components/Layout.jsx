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
    <div className="mx-auto flex min-h-screen max-w-page flex-col px-5 sm:px-6">
      <Header />
      <main key={pathname} className="fade-in flex-1 pb-20 pt-10 sm:pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
