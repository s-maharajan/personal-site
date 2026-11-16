import { learningSections } from "../content/learning.js";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "2026-11-06" -> "6 Nov 2026", without time zones getting involved.
export const formatDay = (iso) => {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
};

export const findSection = (slug) => learningSections.find((s) => s.slug === slug);

export const latestDate = (section) => section.entries.map((e) => e.date).sort().at(-1);

// Every entry, newest first, carrying its section for labels and links.
export const allEntries = learningSections
  .flatMap((section) => section.entries.map((entry) => ({ ...entry, section })))
  .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));

export const entryCount = allEntries.length;

export const entryPath = (entry) => `/learning/${entry.section.slug}#${entry.slug}`;

export const sourceHost = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};
