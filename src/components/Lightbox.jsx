import { useEffect, useRef, useState } from "react";
import { useExifCache } from "../hooks/useExifCache.js";
import { haptic } from "../hooks/useHaptics.js";
import Picture from "./Picture.jsx";

const SWIPE_THRESHOLD = 45;

export default function Lightbox({ photos, index, onClose, onNav }) {
  const dialogRef = useRef(null);
  const touchStart = useRef(null);
  const getExif = useExifCache();
  const [exifLine, setExifLine] = useState("");
  const open = index >= 0;
  const photo = open ? photos[index] : null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleCancel = (e) => {
      e.preventDefault();
      onClose();
    };
    const handleClick = (e) => {
      if (e.target === dialog) onClose();
    };
    dialog.addEventListener("cancel", handleCancel);
    dialog.addEventListener("click", handleClick);
    return () => {
      dialog.removeEventListener("cancel", handleCancel);
      dialog.removeEventListener("click", handleClick);
    };
  }, [onClose]);

  useEffect(() => {
    if (!photo) return;
    let cancelled = false;
    setExifLine("");
    getExif(photo).then((line) => {
      if (!cancelled) setExifLine(line || "");
    });
    return () => {
      cancelled = true;
    };
  }, [photo, getExif]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === "ArrowRight") onNav((index + 1) % photos.length);
      if (e.key === "ArrowLeft") onNav((index - 1 + photos.length) % photos.length);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, index, photos.length, onNav]);

  const handleTouchStart = (e) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
    haptic("tap");
    if (dx < 0) onNav((index + 1) % photos.length);
    else onNav((index - 1 + photos.length) % photos.length);
  };

  return (
    <dialog
      className="lightbox"
      id="lightbox"
      ref={dialogRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button
        className="lightbox__close"
        aria-label="Close image"
        onClick={() => {
          haptic("tap");
          onClose();
        }}
      >
        ×
      </button>
      <button
        className="lightbox__prev"
        aria-label="Previous image"
        onClick={() => {
          haptic("tap");
          onNav((index - 1 + photos.length) % photos.length);
        }}
      >
        ‹
      </button>
      <button
        className="lightbox__next"
        aria-label="Next image"
        onClick={() => {
          haptic("tap");
          onNav((index + 1) % photos.length);
        }}
      >
        ›
      </button>
      {photo && (
        <>
          <Picture key={photo.id} photo={photo} size="large" alt={photo.alt} />
          <p className="lightbox__counter">
            {String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
          </p>
          <p className="lightbox__title">
            {photo.number} / {photo.title}
          </p>
          <p className="lightbox__meta">{exifLine}</p>
        </>
      )}
    </dialog>
  );
}
