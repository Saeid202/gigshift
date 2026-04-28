// ── GigShift Design System ──────────────────────────────────────
// Inspired by ICB Association: deep navy + gold luxury palette

export const C = {
  // Navy scale
  navyDeep:   "#0a1628",   // dominant dark bg, sidebar
  navyMid:    "#1a3a6b",   // cards on dark, section bg
  navyLight:  "#1e5bb5",   // buttons, active states
  navyBorder: "#1e3a5f",   // borders on dark bg

  // Gold scale
  gold:       "#c9a227",   // icon accents, badges, highlights
  goldLight:  "#e8c547",   // hover, thin lines
  goldBg:     "rgba(201,162,39,0.12)", // subtle gold bg

  // Neutral
  white:      "#ffffff",
  bgLight:    "#f0f4f8",   // light section bg
  bgCard:     "#ffffff",
  textMuted:  "#94a3b8",
  textDark:   "#0a1628",
  border:     "#e2e8f0",

  // Gradients
  heroGrad:   "linear-gradient(135deg, #0a1628 0%, #1a3a6b 60%, #1e5bb5 100%)",
  sidebarGrad:"linear-gradient(180deg, #0a1628 0%, #0d1f3c 100%)",
  goldGrad:   "linear-gradient(135deg, #c9a227 0%, #e8c547 100%)",
  navyGrad:   "linear-gradient(135deg, #1a3a6b 0%, #1e5bb5 100%)",
} as const;
