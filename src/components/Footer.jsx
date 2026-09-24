import { site } from "../content/site";
import SocialLinks from "./SocialLinks";

export default function Footer() {
  return (
    <footer className="flex flex-col gap-4 border-t border-line py-8 text-sm text-faint sm:flex-row sm:items-center sm:justify-between">
      <span>© {new Date().getFullYear()} {site.name}</span>
      <SocialLinks />
    </footer>
  );
}
