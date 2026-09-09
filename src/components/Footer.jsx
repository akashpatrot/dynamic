import { site } from "../data/site.config.js";

export default function Footer() {
  return (
    <footer className="shell">
      © {site.year} {site.name} / VISUALS <span>All images © {site.name}</span>
    </footer>
  );
}
