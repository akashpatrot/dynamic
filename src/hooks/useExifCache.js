import { useRef, useCallback } from "react";
import exifr from "exifr";

// Reads EXIF straight from the original file (resized variants have metadata
// stripped) — only when a photo is actually opened in the lightbox, cached
// after that so re-opening is instant.
export function useExifCache() {
  const cache = useRef(new Map());

  const getExif = useCallback(async (photo) => {
    if (cache.current.has(photo.id)) return cache.current.get(photo.id);
    try {
      const data = await exifr.parse(photo.originalUrl, {
        pick: ["Make", "Model", "LensModel", "FocalLength", "FNumber", "ExposureTime", "ISO", "DateTimeOriginal"],
      });
      if (!data) {
        cache.current.set(photo.id, null);
        return null;
      }
      const parts = {
        camera: [data.Make, data.Model].filter(Boolean).join(" "),
        lens: data.LensModel || null,
        focalLength: data.FocalLength ? `${Math.round(data.FocalLength)}mm` : null,
        aperture: data.FNumber ? `f/${data.FNumber}` : null,
        shutter: data.ExposureTime ? shutterLabel(data.ExposureTime) : null,
        iso: data.ISO ? `ISO ${data.ISO}` : null,
        date: data.DateTimeOriginal ? formatDate(data.DateTimeOriginal) : null,
      };
      const line = [parts.camera, parts.lens, parts.focalLength, parts.aperture, parts.shutter, parts.iso, parts.date]
        .filter(Boolean)
        .join(" · ");
      const result = line || null;
      cache.current.set(photo.id, result);
      return result;
    } catch {
      cache.current.set(photo.id, null);
      return null;
    }
  }, []);

  return getExif;
}

function shutterLabel(seconds) {
  if (seconds >= 1) return `${seconds}s`;
  return `1/${Math.round(1 / seconds)}s`;
}

function formatDate(date) {
  try {
    return new Date(date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return null;
  }
}
