import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Work from "./pages/Work";
import CaseStudy from "./pages/CaseStudy";
import Writing from "./pages/Writing";
import Essay from "./pages/Essay";
import Tools from "./pages/Tools";
import Banter from "./pages/Banter";
import About from "./pages/About";
import Resume from "./pages/Resume";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:slug" element={<CaseStudy />} />
          <Route path="/writing" element={<Writing />} />
          <Route path="/writing/:slug" element={<Essay />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/banter" element={<Banter />} />
          <Route path="/about" element={<About />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
