import { site } from "../data/site.config.js";
import { haptic } from "../hooks/useHaptics.js";
import dynamicLogoDark from "../assets/site/dynamic-logo.png";
import dynamicLogoLight from "../assets/site/dynamic-logo-light.png";

export default function Nav() {
  return (
    <header className="nav">
      <a className="brand" href="#top" onClick={() => haptic("tap")}>
        <img className="brand__logo brand__logo--dark" src={dynamicLogoDark} alt="Dynamic" />
        <img className="brand__logo brand__logo--light" src={dynamicLogoLight} alt="Dynamic" />
      </a>
      <nav aria-label="Primary">
        <a href="#archive" onClick={() => haptic("tap")}>
          Archive
        </a>
        <a href="#about" onClick={() => haptic("tap")}>
          About
        </a>
        <a href="#contact" onClick={() => haptic("tap")}>
          Contact
        </a>
      </nav>
      <a className="nav__cta" href={`mailto:${site.email}`} onClick={() => haptic("select")}>
        Start a project ↗
      </a>
    </header>
  );
}
