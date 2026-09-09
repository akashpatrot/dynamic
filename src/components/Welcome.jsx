import { useEffect, useRef, useState } from "react";
import { haptic } from "../hooks/useHaptics.js";
import welcomePoster from "../assets/site/welcome-poster.jpg";

// Dynamic, like the gallery — if welcome.mp4 (or any video) is deleted, this
// simply finds none instead of crashing the build/dev server.
const videoModules = import.meta.glob("../assets/site/*.{mp4,webm,mov,MP4,WEBM,MOV}", {
  eager: true,
  import: "default",
});
const welcomeVideoSrc = Object.values(videoModules)[0];

export default function Welcome({ onEnter }) {
  const [leaving, setLeaving] = useState(false);
  const videoRef = useRef(null);
  const finishedRef = useRef(false);
  const prefersReducedMotion = useRef(
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setLeaving(true);
  };

  useEffect(() => {
    // No video available (deleted, or none added yet) — skip the intro
    // entirely rather than showing a black screen with nothing playing.
    if (prefersReducedMotion.current || !welcomeVideoSrc) {
      onEnter();
      return;
    }
    const video = videoRef.current;
    if (!video) return;
    const handleEnded = () => finish();
    const handleError = () => setTimeout(finish, 1200);
    video.addEventListener("ended", handleEnded, { once: true });
    video.addEventListener("error", handleError, { once: true });
    const playPromise = video.play();
    if (playPromise?.catch) playPromise.catch(() => setTimeout(finish, 1500));
    return () => {
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("error", handleError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(onEnter, 450);
    return () => clearTimeout(t);
  }, [leaving, onEnter]);

  const skip = () => {
    haptic("tap");
    videoRef.current?.pause();
    finish();
  };

  if (!welcomeVideoSrc) return null;

  return (
    <section
      className={`welcome welcome--video${leaving ? " welcome--leaving" : ""}`}
      id="welcome"
      aria-label="Welcome animation"
    >
      <video
        className="welcome__video"
        id="welcome-video"
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        poster={welcomePoster}
        aria-hidden="true"
      >
        <source src={welcomeVideoSrc} type="video/mp4" />
      </video>
      <div className="welcome__video-overlay" aria-hidden="true" />
      <button className="welcome__skip" id="skip-intro" type="button" onClick={skip}>
        Skip intro
      </button>
    </section>
  );
}
