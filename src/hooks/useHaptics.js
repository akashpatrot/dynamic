// Tiny wrapper around the Vibration API. Most desktop browsers simply don't
// expose navigator.vibrate, so this quietly no-ops there — it only does
// anything on mobile browsers that support it, and never throws.
const supportsVibration = typeof navigator !== "undefined" && typeof navigator.vibrate === "function";

/**
 * Fire a short haptic pulse. Kept intentionally subtle:
 * - "tap"   ~ light UI taps (nav links, filters, thumbnails)
 * - "select"~ a slightly stronger pulse for a state change (active filter, opening a modal)
 * - "success" ~ a two-pulse buzz for a completed action (message sent)
 */
export function haptic(kind = "tap") {
  if (!supportsVibration) return;
  const patterns = {
    tap: 8,
    select: 14,
    success: [12, 40, 12],
  };
  try {
    navigator.vibrate(patterns[kind] ?? patterns.tap);
  } catch {
    // Some browsers throw if called outside a user gesture — safe to ignore.
  }
}
