import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope } from "react-icons/fa6";
import { site } from "../data/site.config.js";
import { useReveal } from "../hooks/useReveal.js";
import { haptic } from "../hooks/useHaptics.js";

const socialLinks = [
  { key: "github", label: "GitHub", icon: FaGithub, href: site.social.github },
  { key: "linkedin", label: "LinkedIn", icon: FaLinkedin, href: site.social.linkedin },
  { key: "instagram", label: "Instagram", icon: FaInstagram, href: site.social.instagram },
  { key: "email", label: "Email", icon: FaEnvelope, href: `mailto:${site.email}` },
];

export default function Contact() {
  const ref = useReveal();
  const handleSubmit = (event) => {
    event.preventDefault();
    haptic("success");
    const form = event.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const subject = encodeURIComponent(`Project inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section className="contact shell" id="contact">
      <div className="reveal" ref={ref}>
        <p className="eyebrow">Have a project in mind?</p>
        <div className="contact__headline">
          <span aria-hidden="true">MAKE</span>
          <h2>
            Let's make something
            <br />
            <em>worth remembering.</em>
          </h2>
        </div>
        <a className="contact__email" href={`mailto:${site.email}`}>
          {site.email} ↗
        </a>
        <ul className="contact__socials" aria-label="Social media links">
          {socialLinks
            .filter((link) => link.href)
            .map(({ key, label, icon: Icon, href }) => (
              <li key={key}>
                <a
                  className="social-link"
                  href={href}
                  target={href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  onClick={() => haptic("tap")}
                >
                  <Icon aria-hidden="true" />
                  <span>{label}</span>
                </a>
              </li>
            ))}
        </ul>
        <form className="contact__form" id="contact-form" onSubmit={handleSubmit}>
          <div className="contact__form-row">
            <label htmlFor="cf-name">Name</label>
            <input id="cf-name" name="name" type="text" required />
          </div>
          <div className="contact__form-row">
            <label htmlFor="cf-email">Your email</label>
            <input id="cf-email" name="email" type="email" required />
          </div>
          <div className="contact__form-row">
            <label htmlFor="cf-message">Message</label>
            <textarea id="cf-message" name="message" rows="4" required />
          </div>
          <button type="submit" className="line-link contact__form-submit">
            Send message <span>↗</span>
          </button>
        </form>
      </div>
      <div className="contact__bottom">
        <span>{site.location}</span>
        <span />
      </div>
      <div className="signature" aria-label={site.name}>
        {site.name}
      </div>
    </section>
  );
}
