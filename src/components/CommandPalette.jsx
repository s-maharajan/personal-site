import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, FileText, Briefcase, BookOpen, Mail, Check, Terminal, MessageSquare } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./Icons";
import { work } from "../content/work";
import { articles } from "../content/writing";
import { tools } from "../content/tools";
import { banterPosts } from "../content/banter";
import { site } from "../content/site";

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleClose = () => {
    setQuery("");
    setSelectedIndex(0);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Aggregate searchable items
  const items = [
    // Navigation Pages
    { id: "page-home", title: "Overview / Home", category: "Navigation", icon: ArrowRight, action: () => navigate("/") },
    { id: "page-work", title: `Case Studies (${work.length} dossiers)`, category: "Navigation", icon: Briefcase, action: () => navigate("/work") },
    { id: "page-writing", title: `Field Notes (${articles.length} essays)`, category: "Navigation", icon: BookOpen, action: () => navigate("/writing") },
    { id: "page-tools", title: `Tools & Open Source (${tools.length} blueprints)`, category: "Navigation", icon: Terminal, action: () => navigate("/tools") },
    { id: "page-banter", title: `Byte-Sized Banter (${banterPosts.length} takes)`, category: "Navigation", icon: MessageSquare, action: () => navigate("/banter") },
    { id: "page-about", title: "Engineering Philosophy & Background", category: "Navigation", icon: ArrowRight, action: () => navigate("/about") },
    { id: "page-resume", title: "Printable Executive Resume", category: "Navigation", icon: FileText, action: () => navigate("/resume") },

    // Case studies
    ...work.map((w) => ({
      id: `work-${w.slug}`,
      title: w.title,
      subtitle: `${w.metric.value} ${w.metric.label} · ${w.tags.join(", ")}`,
      category: "Case Studies",
      icon: Briefcase,
      action: () => navigate(`/work/${w.slug}`),
    })),

    // Tools
    ...tools.map((t) => ({
      id: `tool-${t.slug}`,
      title: t.title,
      subtitle: `${t.category} · ${t.metrics.label}: ${t.metrics.value}`,
      category: "Tools & Blueprints",
      icon: Terminal,
      action: () => navigate("/tools"),
    })),

    // Writing
    ...articles.map((a) => ({
      id: `article-${a.slug}`,
      title: a.title,
      subtitle: `${a.topic} · ${a.readTime}`,
      category: "Field Notes",
      icon: BookOpen,
      action: () => navigate(`/writing/${a.slug}`),
    })),

    // Banter
    ...banterPosts.map((b) => ({
      id: `banter-${b.slug}`,
      title: b.title,
      subtitle: `#${b.tag.toLowerCase()} · ${b.readTime}`,
      category: "Byte-Sized Banter",
      icon: MessageSquare,
      action: () => navigate("/banter"),
    })),

    // Actions
    {
      id: "action-email",
      title: "Copy Email: " + site.email,
      category: "Actions",
      icon: Mail,
      action: async () => {
        await navigator.clipboard.writeText(site.email);
        setCopiedEmail(true);
        setTimeout(() => {
          setCopiedEmail(false);
          handleClose();
        }, 1200);
      },
    },
    {
      id: "action-github",
      title: "Open GitHub Profile",
      category: "Actions",
      icon: GithubIcon,
      action: () => window.open(site.links.github, "_blank"),
    },
    {
      id: "action-linkedin",
      title: "Open LinkedIn Profile",
      category: "Actions",
      icon: LinkedinIcon,
      action: () => window.open(site.links.linkedin, "_blank"),
    },
  ];

  const filteredItems = items.filter((item) => {
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
      e.preventDefault();
      filteredItems[selectedIndex].action();
      if (filteredItems[selectedIndex].id !== "action-email") {
        handleClose();
      }
    } else if (e.key === "Escape") {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 pt-16 backdrop-blur-sm sm:pt-24"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
          <Search className="h-5 w-5 text-muted" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search dossiers, tools, field notes, banter, tech stack..."
            className="w-full bg-transparent font-sans text-sm text-text placeholder-faint focus:outline-none"
          />
          <kbd className="rounded border border-line bg-raised px-1.5 py-0.5 font-mono text-[11px] text-faint">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted">
              No matching results found for "{query}".
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    item.action();
                    if (item.id !== "action-email") handleClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left transition ${
                    isSelected ? "bg-raised text-text" : "text-muted hover:text-text"
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Icon className={`h-4 w-4 shrink-0 ${isSelected ? "text-accent" : "text-faint"}`} />
                    <div className="truncate">
                      <div className="text-sm font-medium text-text">{item.title}</div>
                      {item.subtitle && (
                        <div className="text-xs text-faint">{item.subtitle}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.id === "action-email" && copiedEmail && (
                      <span className="flex items-center gap-1 font-mono text-xs text-accent">
                        <Check className="h-3.5 w-3.5" /> Copied!
                      </span>
                    )}
                    <span className="font-mono text-[10px] uppercase tracking-wider text-faint">
                      {item.category}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-line bg-raised/40 px-4 py-2 font-mono text-[11px] text-faint">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
          <span>Antigravity Command Palette</span>
        </div>
      </div>
    </div>
  );
}
