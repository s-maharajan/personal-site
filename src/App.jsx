import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

const LazyEssay = lazy(() => import("./pages/Essay"));
const LazyAbout = lazy(() => import("./pages/About"));
const LazyWriting = lazy(() => import("./pages/Writing"));
const LazyLearning = lazy(() => import("./pages/Learning"));
const LazyLearningSection = lazy(() => import("./pages/LearningSection"));

// Prerendering supplies eager pages so renderToString emits complete content.
export default function App({
  Essay = LazyEssay,
  About = LazyAbout,
  Writing = LazyWriting,
  Learning = LazyLearning,
  LearningSection = LazyLearningSection,
}) {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/writing" element={<Writing />} />
        <Route path="/writing/:slug" element={<Essay />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="/learning/:section" element={<LearningSection />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
