import { useMemo } from "react";
import { captions } from "../data/captions.js";

// Every matched file below is discovered automatically by Vite. Drop a new
// .jpg/.jpeg/.png/.webp into src/assets/gallery/ and it appears on the site
// immediately — nothing to run, nothing to regenerate.
//
// NOTE: import.meta.glob requires a literal glob string and a literal options
// object at each call site (Vite parses these statically at build time — a
// variable holding the pattern or the query will silently match nothing), so
// the same pattern is intentionally repeated below rather than shared via a
// constant or a helper function.

// The unmodified original — used only to read EXIF metadata (resizing strips it).
const originals = import.meta.glob("../assets/gallery/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}", {
  eager: true,
  import: "default",
});

// Three efficient, auto-generated sizes per photo, each in modern webp with a
// jpg fallback — this is what actually ships to the browser. vite-imagetools
// (backed by sharp) creates these on the fly: at dev-server request time
// while you work, and once per size at production build time. No separate
// "optimized/" folder to maintain by hand.
const resized = {
  thumb: {
    webp: import.meta.glob("../assets/gallery/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}", {
      eager: true,
      import: "default",
      query: { w: "480", format: "webp" },
    }),
    jpg: import.meta.glob("../assets/gallery/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}", {
      eager: true,
      import: "default",
      query: { w: "480", format: "jpg" },
    }),
  },
  medium: {
    webp: import.meta.glob("../assets/gallery/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}", {
      eager: true,
      import: "default",
      query: { w: "960", format: "webp" },
    }),
    jpg: import.meta.glob("../assets/gallery/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}", {
      eager: true,
      import: "default",
      query: { w: "960", format: "jpg" },
    }),
  },
  large: {
    webp: import.meta.glob("../assets/gallery/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}", {
      eager: true,
      import: "default",
      query: { w: "1600", format: "webp" },
    }),
    jpg: import.meta.glob("../assets/gallery/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}", {
      eager: true,
      import: "default",
      query: { w: "1600", format: "jpg" },
    }),
  },
};

const SIZES = { thumb: 480, medium: 960, large: 1600 };

function titleCaseFromFilename(filename) {
  const base = filename.replace(/\.[^.]+$/, "");
  return base
    .replace(/[-_]+/g, " ")
    .trim()
    .split(" ")
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function slugFromFilename(filename) {
  return filename
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function useGallery() {
  return useMemo(() => {
    const paths = Object.keys(originals).sort((a, b) => a.localeCompare(b));

    const photos = paths.map((path, index) => {
      const filename = path.split("/").pop();
      const override = captions[filename] || {};
      const title = override.title || titleCaseFromFilename(filename);

      const sources = Object.fromEntries(
        Object.keys(SIZES).map((label) => [
          label,
          {
            webp: resized[label].webp[path],
            jpg: resized[label].jpg[path],
          },
        ])
      );

      return {
        id: slugFromFilename(filename),
        file: filename,
        originalUrl: originals[path],
        number: String(index + 1).padStart(2, "0"),
        title,
        alt: override.alt || title,
        tag: override.tag || null,
        sources,
      };
    });

    const tags = [...new Set(photos.map((p) => p.tag).filter(Boolean))];

    return { photos, tags };
  }, []);
}
