import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Essay from "./pages/Essay";
import { site } from "./content/site";

export default function App() {
  return (
    <BrowserRouter>
      <main>
        <header>
          <Link to="/">{site.name}</Link>
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/writing/:slug" element={<Essay />} />
          <Route path="*" element={<p>Page not found. <Link to="/">Go home</Link>.</p>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
