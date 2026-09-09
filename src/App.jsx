import { useCallback, useState } from "react";
import { useGallery } from "./hooks/useGallery.js";
import Welcome from "./components/Welcome.jsx";
import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import Statement from "./components/Statement.jsx";
import Archive from "./components/Archive.jsx";
import Strip from "./components/Strip.jsx";
import About from "./components/About.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import GalleryModal from "./components/GalleryModal.jsx";
import Lightbox from "./components/Lightbox.jsx";
import EmptyGallery from "./components/EmptyGallery.jsx";

export default function App() {
  const { photos, tags } = useGallery();
  const [showWelcome, setShowWelcome] = useState(true);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const openLightboxById = useCallback(
    (id) => {
      const idx = photos.findIndex((p) => p.id === id);
      if (idx >= 0) setLightboxIndex(idx);
    },
    [photos]
  );

  // No photos yet: show one honest empty state instead of an intro screen,
  // a broken hero stack, and empty collage boxes.
  if (!photos.length) return <EmptyGallery />;

  return (
    <>
      {showWelcome && <Welcome onEnter={() => setShowWelcome(false)} />}

      <div className="site" id="site" hidden={showWelcome}>
        <Nav />
        <main id="top">
          <Hero photos={photos} onOpen={openLightboxById} />
          <Statement count={photos.length} />
          <Archive photos={photos} tags={tags} onOpen={openLightboxById} onViewAll={() => setGalleryOpen(true)} />
          <Strip />
          <About />
          <Contact />
        </main>
        <Footer />
      </div>

      <GalleryModal
        photos={photos}
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        onOpenPhoto={(id) => {
          openLightboxById(id);
        }}
      />

      <Lightbox photos={photos} index={lightboxIndex} onClose={() => setLightboxIndex(-1)} onNav={setLightboxIndex} />
    </>
  );
}
