import Picture from "./Picture.jsx";
import { haptic } from "../hooks/useHaptics.js";

export default function Hero({ photos, onOpen }) {
  const [a, b, c, d] = photos;
  const roles = [
    { photo: a, role: "back" },
    { photo: b, role: "left" },
    { photo: c, role: "front" },
    { photo: d, role: "right" },
  ].filter((r) => r.photo);

  return (
    <section className="hero shell">
      <div className="hero__copy">
        <p className="eyebrow">Photographer & visual storyteller</p>
        <h2>
          Stories hiding
          <br />
          in <em>plain sight.</em>
        </h2>
        <p>An ongoing collection of wildlife, weather, architecture, and life as it happens.</p>
        <a className="line-link" href="#archive">
          Explore the work <span>↓</span>
        </a>
      </div>
      <div className="hero__stack" id="hero-stack" aria-label="A layered selection of photographs">
        {roles.map(({ photo, role }) => (
          <button
            key={photo.id}
            className={`stack-card stack-card--${role}`}
            onClick={() => {
              haptic("tap");
              onOpen(photo.id);
            }}
          >
            <Picture photo={photo} size="medium" alt={photo.alt} />
          </button>
        ))}
        <span className="stack-note">Drag your eyes through the frame ↗</span>
      </div>
    </section>
  );
}
