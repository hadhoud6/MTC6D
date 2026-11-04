const QUOTE_BUTTON_ID = "quote-basket-button";
const FLIGHT_DURATION_MS = 1500;
const ACCENT_COLOR = "#ef5d36";
let nextArrowId = 0;

type Point = { x: number; y: number };

function cubicPoint(start: Point, control1: Point, control2: Point, end: Point, t: number): Point {
  const inverse = 1 - t;
  return {
    x:
      inverse ** 3 * start.x +
      3 * inverse ** 2 * t * control1.x +
      3 * inverse * t ** 2 * control2.x +
      t ** 3 * end.x,
    y:
      inverse ** 3 * start.y +
      3 * inverse ** 2 * t * control1.y +
      3 * inverse * t ** 2 * control2.y +
      t ** 3 * end.y,
  };
}

function cubicTangent(start: Point, control1: Point, control2: Point, end: Point, t: number): Point {
  const inverse = 1 - t;
  return {
    x:
      3 * inverse ** 2 * (control1.x - start.x) +
      6 * inverse * t * (control2.x - control1.x) +
      3 * t ** 2 * (end.x - control2.x),
    y:
      3 * inverse ** 2 * (control1.y - start.y) +
      6 * inverse * t * (control2.y - control1.y) +
      3 * t ** 2 * (end.y - control2.y),
  };
}

function createArrow(id: number): HTMLDivElement {
  const arrow = document.createElement("div");
  arrow.setAttribute("aria-hidden", "true");
  Object.assign(arrow.style, {
    position: "fixed",
    inset: "0 auto auto 0",
    width: "48px",
    height: "24px",
    zIndex: "120",
    pointerEvents: "none",
    willChange: "transform, opacity",
    filter: `drop-shadow(0 0 5px ${ACCENT_COLOR}b3)`,
  });

  const gradientId = `quote-arrow-trail-${id}`;
  arrow.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="24" viewBox="0 0 48 24" fill="none">
      <defs>
        <linearGradient id="${gradientId}" x1="2" y1="12" x2="36" y2="12" gradientUnits="userSpaceOnUse">
          <stop stop-color="${ACCENT_COLOR}" stop-opacity="0.08" />
          <stop offset="1" stop-color="${ACCENT_COLOR}" stop-opacity="0.9" />
        </linearGradient>
      </defs>
      <path d="M2 12H34" stroke="url(#${gradientId})" stroke-width="3" stroke-linecap="round" />
      <path d="M27 4L36 12L27 20" stroke="${ACCENT_COLOR}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `;
  return arrow;
}

/** Animates a decorative arrow from a clicked catalogue control to the floating quote button. */
export function flyQuoteArrow(source: HTMLElement): void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const sourceRect = source.getBoundingClientRect();
  const start = {
    x: sourceRect.left + sourceRect.width / 2,
    y: sourceRect.top + sourceRect.height / 2,
  };
  let targetAttempts = 0;

  const startFlight = () => {
    const target = document.getElementById(QUOTE_BUTTON_ID);
    if (!target) {
      targetAttempts += 1;
      if (targetAttempts < 6) window.requestAnimationFrame(startFlight);
      return;
    }

    const targetRect = target.getBoundingClientRect();
    const end = {
      x: targetRect.left + targetRect.width / 2,
      y: targetRect.top + targetRect.height / 2,
    };
    const distance = Math.hypot(end.x - start.x, end.y - start.y);
    const curveLift = Math.min(120, Math.max(36, distance * 0.18));
    const control1 = {
      x: start.x + (end.x - start.x) * 0.32,
      y: start.y + (end.y - start.y) * 0.32 - curveLift,
    };
    const control2 = {
      x: start.x + (end.x - start.x) * 0.68,
      y: start.y + (end.y - start.y) * 0.68 - curveLift,
    };
    const arrow = createArrow(++nextArrowId);
    document.body.appendChild(arrow);

    const startedAt = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - startedAt) / FLIGHT_DURATION_MS, 1);
      const eased = 0.5 - Math.cos(Math.PI * progress) / 2;
      const point = cubicPoint(start, control1, control2, end, eased);
      const tangent = cubicTangent(start, control1, control2, end, eased);
      const angle = (Math.atan2(tangent.y, tangent.x) * 180) / Math.PI;
      const scale = 1 - eased * 0.18;
      const fade = progress > 0.84 ? (1 - progress) / 0.16 : 1;

      arrow.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate(-50%, -50%) rotate(${angle}deg) scale(${scale})`;
      arrow.style.opacity = String(Math.max(0, fade));

      if (progress < 1) {
        window.requestAnimationFrame(animate);
      } else {
        arrow.remove();
      }
    };

    window.requestAnimationFrame(animate);
  };

  window.requestAnimationFrame(startFlight);
}
