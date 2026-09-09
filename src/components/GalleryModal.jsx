import { useEffect, useRef } from "react";
import Picture from "./Picture.jsx";
import { haptic } from "../hooks/useHaptics.js";

export default function GalleryModal({ photos, open, onClose, onOpenPhoto }) {
  const dialogRef = useRef(null);

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

  return (
    <dialog className="gallery-modal" id="gallery-modal" aria-label="All studies" ref={dialogRef}>
      <div className="gallery-modal__bar">
        <p id="gallery-modal-count">All studies / 01—{photos.length}</p>
        <button
          className="gallery-modal__close"
          aria-label="Close gallery"
          onClick={() => {
            haptic("tap");
            onClose();
          }}
        >
          Close ×
        </button>
      </div>
      <div className="gallery-grid" id="gallery-grid">
        {photos.map((photo) => (
          <button
            key={photo.id}
            onClick={() => {
              haptic("tap");
              onOpenPhoto(photo.id);
            }}
          >
            <Picture photo={photo} size="thumb" alt={photo.alt} loading="lazy" />
            <span>
              {photo.number} / {photo.title}
            </span>
          </button>
        ))}
      </div>
    </dialog>
  );
}
