// The law groups configured for a single faction.
export type FactionLaws = (typeof LAWS)[keyof typeof LAWS];
export type LawType = FactionLaws[number][number];
// A law is identified by its `id` from the config (e.g. "l00").
export type LawID = LawType["id"];

export const LAWS = {
  hive: [
    [
      {
        id: "l00",
        cost: 1,
        max: 1,
        curr: 0,
        img: "00.webp",
        incomeType: "once",
        income: {
          gold: 2500,
          wood: 5,
          ore: 5,
        },
      },
      {
        id: "l01",
        cost: 1,
        max: 2,
        curr: 0,
        img: "01.webp",
        incomeType: "none",
      },
      {
        id: "l02",
        cost: 2,
        max: 3,
        curr: 0,
        img: "02.webp",
        incomeType: "none",
      },
      {
        id: "l03",
        cost: 3,
        max: 1,
        curr: 0,
        img: "03.webp",
        incomeType: "none",
      },
    ],
    [
      {
        id: "l10",
        cost: 2,
        max: 3,
        curr: 0,
        img: "10.webp",
        incomeType: "daily",
        income: {
          gold: 250,
        },
      },
      {
        id: "l11",
        cost: 2,
        max: 2,
        curr: 0,
        img: "11.webp",
        incomeType: "daily",
        income: {
          crystals: 1,
        },
      },
      {
        id: "l12",
        cost: 4,
        max: 1,
        curr: 0,
        img: "12.webp",
        incomeType: "none",
      },
    ],
  ],
};
