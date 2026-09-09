import Nav from "./Nav.jsx";
import Footer from "./Footer.jsx";

export default function EmptyGallery() {
  return (
    <div className="site" id="site">
      <Nav />
      <main
        id="top"
        className="shell"
        style={{
          minHeight: "calc(100svh - 80px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 24,
          maxWidth: 560,
        }}
      >
        <p className="eyebrow">The archive is empty</p>
        <h2 style={{ fontSize: "clamp(32px,5vw,58px)", lineHeight: 1.05, letterSpacing: "-.03em", margin: 0 }}>
          No photos yet — <em>add your first one.</em>
        </h2>
        <p style={{ color: "var(--muted)", lineHeight: 1.7, maxWidth: 440 }}>
          Drop a <code>.jpg</code>, <code>.jpeg</code>, <code>.png</code>, or <code>.webp</code> file into{" "}
          <code>src/assets/gallery/</code> while <code>npm run dev</code> is running, and this page will populate
          itself automatically — the hero, the archive, and the full gallery view will all appear with no further
          setup.
        </p>
      </main>
      <Footer />
    </div>
  );
}
