import type { Changes } from "./useChangesInRange";
import { TAB_COLORS } from "#/shared/tabColors";

// r=18, C=2π*18≈113.097, quarter≈28.274
// Each arc is a centered 90° segment. strokeDashoffset positions the arc:
//   TOP  (castles)   = 5C/8 ≈ 70.69
//   RIGHT (law)      = -C/8 ≈ -14.14
//   BOTTOM (res)     = C/8  ≈ 14.14
//   LEFT  (mines)    = 3C/8 ≈ 42.41
const DASH = "28.27 84.82";

// All-true sentinel used when spinning — shows every arc regardless of actual data.
const ALL_SHOWN = { castles: true, mines: false, resources: true, law: false } as const;

type Props = {
  changes: Changes;
  /** Unique prefix per component instance to avoid document-level gradient ID collisions. */
  id: string;
  /** Spin all 4 arcs as a loading indicator. */
  spin?: boolean;
};

const ArcRings = ({ changes, id, spin = false }: Props) => {
  const show = spin ? ALL_SHOWN : changes;

  return (
    <svg
      style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }}
      viewBox="0 0 40 40"
      overflow="visible"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Radial gradient: transparent at center (near label), opaque at outer border (r=20). */}
      <defs>
        {show.castles && (
          <radialGradient id={`${id}C`} gradientUnits="userSpaceOnUse" cx="20" cy="20" r="20">
            <stop offset="75%" stopColor={TAB_COLORS.castles}   stopOpacity={0} />
            <stop offset="100%" stopColor={TAB_COLORS.castles}  stopOpacity={1} />
          </radialGradient>
        )}
        {show.law && (
          <radialGradient id={`${id}L`} gradientUnits="userSpaceOnUse" cx="20" cy="20" r="20">
            <stop offset="75%" stopColor={TAB_COLORS.law}       stopOpacity={0} />
            <stop offset="100%" stopColor={TAB_COLORS.law}      stopOpacity={1} />
          </radialGradient>
        )}
        {show.resources && (
          <radialGradient id={`${id}R`} gradientUnits="userSpaceOnUse" cx="20" cy="20" r="20">
            <stop offset="75%" stopColor={TAB_COLORS.resources} stopOpacity={0} />
            <stop offset="100%" stopColor={TAB_COLORS.resources} stopOpacity={1} />
          </radialGradient>
        )}
        {show.mines && (
          <radialGradient id={`${id}M`} gradientUnits="userSpaceOnUse" cx="20" cy="20" r="20">
            <stop offset="75%" stopColor={TAB_COLORS.mines}     stopOpacity={0} />
            <stop offset="100%" stopColor={TAB_COLORS.mines}    stopOpacity={1} />
          </radialGradient>
        )}
      </defs>
      <g>
        {spin && (
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 20 20; 360 20 20"
            keyTimes="0; 1"
            calcMode="spline"
            keySplines="0.45 0 0.55 1"
            dur="2.2s"
            repeatCount="indefinite"
          />
        )}
        {show.castles && (
          <circle cx="20" cy="20" r="18" fill="none"
            stroke={`url(#${id}C)`} strokeWidth="5"
            strokeDasharray={DASH} strokeDashoffset="70.69" />
        )}
        {show.law && (
          <circle cx="20" cy="20" r="18" fill="none"
            stroke={`url(#${id}L)`} strokeWidth="5"
            strokeDasharray={DASH} strokeDashoffset="-14.14" />
        )}
        {show.resources && (
          <circle cx="20" cy="20" r="18" fill="none"
            stroke={`url(#${id}R)`} strokeWidth="5"
            strokeDasharray={DASH} strokeDashoffset="14.14" />
        )}
        {show.mines && (
          <circle cx="20" cy="20" r="18" fill="none"
            stroke={`url(#${id}M)`} strokeWidth="5"
            strokeDasharray={DASH} strokeDashoffset="42.41" />
        )}
      </g>
    </svg>
  );
};

export default ArcRings;
