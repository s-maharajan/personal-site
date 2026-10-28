import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

const LazyEssay = lazy(() => import("./pages/Essay"));
const LazyAbout = lazy(() => import("./pages/About"));

// Prerendering supplies eager pages so renderToString emits complete content.
export default function App({ Essay = LazyEssay, About = LazyAbout }) {
  return (
    <Suspense fallback={<p role="status" className="p-8 text-muted">Loading page…</p>}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/writing/:slug" element={<Essay />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
