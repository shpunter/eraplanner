// Total law required to reach a given hero level.
//
// Derived as a cubic least-squares fit over the known data (levels 1–35):
//   law(l) = 0.3087·l³ + 15.1212·l² + 839.2846·l + 760.388
// Rounded to the nearest 100 this reproduces every known level except L29
// (off by 100), and extrapolates monotonically to arbitrarily high levels.
//
// Source data (level -> law; 15 and 22 had no data):
//   1 -> 1600     2 -> 2500     3 -> 3400     4 -> 4400     5 -> 5400
//   6 -> 6400     7 -> 7500     8 -> 8600     9 -> 9800    10 -> 11000
//  11 -> 12200   12 -> 13500   13 -> 14900   14 -> 16300   15 -> no data
//  16 -> 19300   17 -> 20900   18 -> 22600   19 -> 24300   20 -> 26100
//  21 -> 27900   22 -> no data 23 -> 31800   24 -> 33900   25 -> 36000
//  26 -> 38200   27 -> 40500   28 -> 42900   29 -> 45400   30 -> 47900
//  31 -> 50500   32 -> 53200   33 -> 56000   34 -> 58900   35 -> 61900
const C3 = 0.3087;
const C2 = 15.1212;
const C1 = 839.2846;
const C0 = 760.388;

/**
 * Law needed to reach the given hero level (>= 1), rounded to the nearest 100.
 * Returns `undefined` for non-finite or sub-1 levels.
 */
export const calcLawForLevel = (level: number): number | undefined => {
  if (!Number.isFinite(level) || level < 1) return undefined;

  const law = C3 * level ** 3 + C2 * level ** 2 + C1 * level + C0;

  return Math.round(law / 100) * 100;
};
