import { useMemo, useState } from "react";
import Picture from "./Picture.jsx";
import { useReveal } from "../hooks/useReveal.js";
import { haptic } from "../hooks/useHaptics.js";

export default function Archive({ photos, tags, onOpen, onViewAll }) {
  const [activeTag, setActiveTag] = useState("All");
  const headRef = useReveal();
  const stageRef = useReveal();

  const filtered = useMemo(() => {
    const list = activeTag === "All" ? photos : photos.filter((p) => p.tag === activeTag);
    return list.slice(0, 8);
  }, [photos, activeTag]);

  return (
    <section className="archive shell" id="archive">
      <div className="archive__head reveal" ref={headRef}>
        <div>
          <p className="eyebrow">The archive</p>
          <h2>
            Collected
            <br />
            <em>in layers.</em>
          </h2>
        </div>
        <p>Each image is a small pause: a living thing, a passing sky, a structure that has outlasted its moment.</p>
      </div>

      {tags.length >= 2 && (
        <div className="archive__filters" id="archive-filters" aria-label="Filter by category">
          {["All", ...tags].map((tag) => (
            <button
              key={tag}
              className={`filter-chip${tag === activeTag ? " is-active" : ""}`}
              onClick={() => {
                haptic("select");
                setActiveTag(tag);
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <div className="archive__stage reveal-stagger" id="archive-grid" aria-label="Photo collage" ref={stageRef}>
        {filtered.map((photo, i) => (
          <button
            key={photo.id}
            className={`archive-card archive-card--${i + 1}`}
            onClick={() => {
              haptic("tap");
              onOpen(photo.id);
            }}
          >
            <Picture photo={photo} size="medium" alt={photo.alt} loading="lazy" />
            <span>
              {photo.number} / {photo.title}
            </span>
          </button>
        ))}
      </div>

      <div className="archive__footer">
        <p className="archive__caption">
          Hover a study to bring it forward <span>↗</span>
        </p>
        <button
          className="gallery-button"
          id="open-gallery"
          onClick={() => {
            haptic("select");
            onViewAll();
          }}
        >
          View all studies <span>↗</span>
        </button>
      </div>
    </section>
  );
}
