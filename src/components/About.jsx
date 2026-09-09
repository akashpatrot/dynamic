import { site } from "../data/site.config.js";
import { useReveal } from "../hooks/useReveal.js";

// Dynamically discovered, like the gallery — NOT a literal import. Vite
// resolves literal `import x from "./file.jpg"` paths at compile time, so
// deleting that exact file is a hard build/dev crash. A glob has no such
// file to resolve ahead of time: if nothing matches, it just returns an
// empty object and the app renders a graceful fallback below instead.
const portraitModules = import.meta.glob("../assets/site/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}", {
  eager: true,
  import: "default",
});
const portraitEntries = Object.entries(portraitModules);
// Prefer a file that looks like a portrait if there's more than one photo
// sitting in assets/site/, otherwise just use whatever is there.
const preferred = portraitEntries.find(([path]) => /portrait|akash|profile|headshot/i.test(path));
const portrait = (preferred || portraitEntries[0])?.[1];

export default function About() {
  const ref = useReveal();
  return (
    <section className="about shell reveal" id="about" ref={ref}>
      <figure>
        {portrait ? (
          <img src={portrait} alt={`Portrait of ${site.name}`} loading="lazy" />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#c7bfb3",
              color: "#6f695f",
              textAlign: "center",
              padding: 24,
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            Add a photo to <code>src/assets/site/</code> to show a portrait here.
          </div>
        )}
      </figure>
      <div className="about__copy">
        <p className="eyebrow">Behind the camera</p>
        <h2>
          Quietly curious.
          <br />
          <em>Always looking.</em>
        </h2>
        <p>
          I'm {site.name}, an India-based photographer and student at {site.education}, drawn to images with
          atmosphere and pulse. My work moves between commissioned stories and personal observations.
        </p>
        <a className="line-link" href={`mailto:${site.email}`}>
          More about my practice <span>↗</span>
        </a>
      </div>
    </section>
  );
}
