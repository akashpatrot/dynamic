import { useReveal } from "../hooks/useReveal.js";

export default function Statement({ count }) {
  const ref = useReveal();
  return (
    <section className="statement shell reveal" ref={ref}>
      <p className="eyebrow">Selected observations</p>
      <p>
        Not a record of where I have been.
        <br />
        <em>A practice of paying attention.</em>
      </p>
      <div>
        <span id="statement-count">01—{String(count).padStart(2, "0")}</span>
        <span>Shot across India</span>
      </div>
    </section>
  );
}
