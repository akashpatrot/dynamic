# Akash — Visual Studies (Vite + React)

Same design as the video-intro version of the static site, rebuilt so the
gallery is fully dynamic **and** efficient — nothing to run by hand, and no
huge images shipped to the browser unnecessarily.

## How the dynamic gallery works

`src/hooks/useGallery.js` uses Vite's `import.meta.glob()` to discover every
`.jpg` / `.jpeg` / `.png` / `.webp` in `src/assets/gallery/` automatically —
at dev-server start, and again on every file change while `npm run dev` is
running.

**To add a photo:** drop the file into `src/assets/gallery/`. It appears in
the hero stack, the archive collage, and the "view all" grid immediately —
no build script, no JSON manifest, no restart.

**To remove every photo:** the site does NOT fall back to broken images or
empty boxes. `src/components/EmptyGallery.jsx` renders a clear, on-brand
"no photos yet" message with the nav and footer intact, instead of showing
a hero section, archive collage, and gallery grid with nothing in them.

## How the "efficient" part works

Rather than shipping every original photo at full resolution (some of the
sample images here are 2+ MB), this project uses **`vite-imagetools`**
(backed by `sharp`) to generate three properly-sized, modern-format
variants of every photo automatically:

| Context           | Size used | Formats           |
|--------------------|-----------|--------------------|
| Archive collage / hero stack | `medium` (960px wide) | webp + jpg fallback |
| "View all" grid thumbnails    | `thumb` (480px wide)  | webp + jpg fallback |
| Lightbox (full view)          | `large` (1600px wide) | webp + jpg fallback |

This happens automatically — there's no separate `optimized/` folder to
regenerate by hand, no build script to remember to run. In dev, Vite
transforms each image the first time it's requested; in a production build
(`npm run build`), every size is generated once as part of the normal build
step. Add a new photo and all three sizes + both formats are created for it
the same way, with zero extra steps.

`src/components/Picture.jsx` renders the actual `<picture>` element with a
`webp` `<source>` and a `jpg` fallback `<img>`, at whichever size the
calling component asked for.

## EXIF data

Camera/lens/aperture/shutter/ISO/date are read directly from the **original**
file (the resized variants have metadata stripped, which is normal for
resized images) the first time a photo is opened in the lightbox, using
`exifr` in the browser — result is cached after that. Photos with no EXIF
data (screenshots, heavily edited exports) simply show no metadata line.

## Editing site details

Name, email, location, and SEO description live in one place:
`src/data/site.config.js`. The nav, about section, contact section, footer,
and page meta tags in `index.html` all read from it (update the meta tags
in `index.html` by hand if you change the title/description — those need
to exist before React loads for SEO purposes).

Optional per-photo titles/tags live in `src/data/captions.js`, keyed by
filename. Anything you don't specify is auto-generated from the filename.

## Commands

```bash
npm install       # first time only
npm run dev        # start the dev server — drop photos in while this runs
npm run build       # production build → dist/
npm run preview      # preview the production build locally
```

## Deploying

`npm run build` outputs a fully static `dist/` folder — upload it to
Netlify, Vercel, GitHub Pages, or any static host. There is no backend.
