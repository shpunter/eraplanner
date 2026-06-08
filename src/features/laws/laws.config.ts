// The law groups configured for a single faction.
export type FactionLaws = (typeof LAWS)[keyof typeof LAWS];
export type LawType = FactionLaws[number][number];
// A law is identified by its `id` from the config (e.g. "l00").
export type LawID = LawType["id"];

export const LAWS = {
  hive: [
    [
      {
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
      {
        id: "l010",
        cost: 1,
        max: 2,
        img: "010.webp",
        incomeType: "none",
      },
      {
        id: "l020",
        cost: 2,
        max: 3,
        img: "020.webp",
        incomeType: "none",
      },
      {
        id: "l030",
        cost: 4,
        max: 1,
        img: "030.webp",
        incomeType: "none",
      },
    ],
    [
      {
        id: "l100",
        cost: 2,
        max: 3,
        img: "100.webp",
        incomeType: "daily",
        income: {
          gold: 250,
        },
      },
      {
        id: "l110",
        cost: 2,
        max: 2,
        img: "110.webp",
        incomeType: "daily",
        income: {
          crystals: 1,
        },
      },
      {
        id: "l120",
        cost: 3,
        max: 1,
        img: "120.webp",
        incomeType: "none",
      },
    ],
    [
      {
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
      {
        id: "l210",
        cost: 4,
        max: 1,
        img: "210.webp",
        incomeType: "none",
      },
      {
        id: "l220",
        cost: 3,
        max: 1,
        img: "220.webp",
        incomeType: "none",
      },
    ],
    [
      {
        id: "l300",
        cost: 4,
        max: 2,
        img: "300.webp",
        incomeType: "none",
      },
      {
        id: "l310",
        cost: 3,
        max: 1,
        img: "310.webp",
        incomeType: "none",
      },
    ],
    [
      {
        id: "l400",
        cost: 4,
        max: 2,
        img: "400.webp",
        incomeType: "none",
      },
      {
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
      {
        id: "l420",
        cost: 3,
        max: 3,
        img: "420.webp",
        incomeType: "none",
      },
    ],
  ],
};
