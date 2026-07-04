import type { Changes } from "./useChangesInRange";

// r=18, C=2π*18≈113.097, quarter≈28.274
// Each arc is a centered 90° segment. strokeDashoffset positions the arc:
//   TOP  (castles)   = 5C/8 ≈ 70.69
//   RIGHT (law)      = -C/8 ≈ -14.14
//   BOTTOM (res)     = C/8  ≈ 14.14
//   LEFT  (mines)    = 3C/8 ≈ 42.41
const DASH = "28.27 84.82";

// Colors match CSS variables but are hardcoded — SVG presentation attrs don't support var().
const COLORS = {
  castles:   "oklch(0.5 0.14 133)",  // --green-50
  law:       "oklch(0.7 0.1 108)",   // --yellow-70
  mines:     "oklch(0.8 0 0)",       // --black-80
  resources: "oklch(0.65 0.18 50)",   // orange
} as const;

type Props = {
  changes: Changes;
  /** Unique prefix per component instance to avoid document-level gradient ID collisions. */
  id: string;
};

const ArcRings = ({ changes, id }: Props) => (
  <svg
    style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }}
    viewBox="0 0 40 40"
    overflow="visible"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Radial gradient: transparent at center (near label), opaque at outer border (r=20). */}
    <defs>
      {changes.castles && (
        <radialGradient id={`${id}C`} gradientUnits="userSpaceOnUse" cx="20" cy="20" r="20">
          <stop offset="75%" stopColor={COLORS.castles}   stopOpacity={0} />
          <stop offset="100%" stopColor={COLORS.castles}  stopOpacity={1} />
        </radialGradient>
      )}
      {changes.law && (
        <radialGradient id={`${id}L`} gradientUnits="userSpaceOnUse" cx="20" cy="20" r="20">
          <stop offset="75%" stopColor={COLORS.law}       stopOpacity={0} />
          <stop offset="100%" stopColor={COLORS.law}      stopOpacity={1} />
        </radialGradient>
      )}
      {changes.resources && (
        <radialGradient id={`${id}R`} gradientUnits="userSpaceOnUse" cx="20" cy="20" r="20">
          <stop offset="75%" stopColor={COLORS.resources} stopOpacity={0} />
          <stop offset="100%" stopColor={COLORS.resources} stopOpacity={1} />
        </radialGradient>
      )}
      {changes.mines && (
        <radialGradient id={`${id}M`} gradientUnits="userSpaceOnUse" cx="20" cy="20" r="20">
          <stop offset="75%" stopColor={COLORS.mines}     stopOpacity={0} />
          <stop offset="100%" stopColor={COLORS.mines}    stopOpacity={1} />
        </radialGradient>
      )}
    </defs>
    {changes.castles && (
      <circle cx="20" cy="20" r="18" fill="none"
        stroke={`url(#${id}C)`} strokeWidth="5"
        strokeDasharray={DASH} strokeDashoffset="70.69" />
    )}
    {changes.law && (
      <circle cx="20" cy="20" r="18" fill="none"
        stroke={`url(#${id}L)`} strokeWidth="5"
        strokeDasharray={DASH} strokeDashoffset="-14.14" />
    )}
    {changes.resources && (
      <circle cx="20" cy="20" r="18" fill="none"
        stroke={`url(#${id}R)`} strokeWidth="5"
        strokeDasharray={DASH} strokeDashoffset="14.14" />
    )}
    {changes.mines && (
      <circle cx="20" cy="20" r="18" fill="none"
        stroke={`url(#${id}M)`} strokeWidth="5"
        strokeDasharray={DASH} strokeDashoffset="42.41" />
    )}
  </svg>
);

export default ArcRings;
