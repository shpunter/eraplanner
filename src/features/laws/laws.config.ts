// A law is identified by its `id` (e.g. "l000"), which is also its key in LAWS.
export type LawID = keyof FactionLaws;
// A single law's config.
export type LawType = FactionLaws[LawID];
// The flat law map for a single faction, keyed by law id.
export type FactionLaws = (typeof LAWS)[keyof typeof LAWS];

// Law configs, flattened per faction and keyed by id. The on-screen grouping
// lives separately in LAW_LAYOUT so the data and its layout can vary
// independently.
export const LAWS = {
  hive: {
    l000: {
      id: "l000",
      cost: 1,
      max: 1,
      img: "000.webp",
      incomeType: "once",
      income: {
        gold: 2500,
        wood: 5,
        ore: 5,
      },
    },
    l010: {
      id: "l010",
      cost: 1,
      max: 2,
      img: "010.webp",
      incomeType: "none",
    },
    l020: {
      id: "l020",
      cost: 2,
      max: 3,
      img: "020.webp",
      incomeType: "none",
    },
    l030: {
      id: "l030",
      cost: 4,
      max: 1,
      img: "030.webp",
      incomeType: "none",
    },
    l100: {
      id: "l100",
      cost: 2,
      max: 3,
      img: "100.webp",
      incomeType: "daily",
      income: {
        gold: 250,
      },
    },
    l110: {
      id: "l110",
      cost: 2,
      max: 2,
      img: "110.webp",
      incomeType: "daily",
      income: {
        crystals: 1,
      },
    },
    l120: {
      id: "l120",
      cost: 3,
      max: 1,
      img: "120.webp",
      incomeType: "none",
    },
    l200: {
      id: "l200",
      cost: 2,
      max: 1,
      img: "200.webp",
      incomeType: "once",
      income: {
        gold: 5000,
        wood: 10,
        ore: 10,
      },
    },
    l210: {
      id: "l210",
      cost: 4,
      max: 1,
      img: "210.webp",
      incomeType: "none",
    },
    l220: {
      id: "l220",
      cost: 3,
      max: 1,
      img: "220.webp",
      incomeType: "none",
    },
    l300: {
      id: "l300",
      cost: 4,
      max: 2,
      img: "300.webp",
      incomeType: "none",
    },
    l310: {
      id: "l310",
      cost: 3,
      max: 1,
      img: "310.webp",
      incomeType: "none",
    },
    l400: {
      id: "l400",
      cost: 4,
      max: 2,
      img: "400.webp",
      incomeType: "none",
    },
    l410: {
      id: "l410",
      cost: 3,
      max: 1,
      img: "410.webp",
      incomeType: "once",
      income: {
        gold: 7500,
        wood: 15,
        ore: 15,
      },
    },
    l420: {
      id: "l420",
      cost: 3,
      max: 3,
      img: "420.webp",
      incomeType: "none",
    },
  },
} as const;

// On-screen layout for each faction's law board: each inner array is a group
// (column) of law ids, mirroring the original nested-array positions.
export const LAW_LAYOUT: Record<keyof typeof LAWS, LawID[][]> = {
  hive: [
    ["l000", "l010", "l020", "l030"],
    ["l100", "l110", "l120"],
    ["l200", "l210", "l220"],
    ["l300", "l310"],
    ["l400", "l410", "l420"],
  ],
};
