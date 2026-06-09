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
      title: "Resource Riches I",
      description: () =>
        "Provides a one-time allotment of 2500 Gold, 5 Wood, and 5 Ore when enacted.",
    },
    l010: {
      id: "l010",
      cost: 1,
      max: 2,
      img: "010.webp",
      incomeType: "none",
      title: "Laws of the Hive",
      description: ({ lvl }: LVL) =>
        `Requirements for unlocking higher-level Laws are reduced by ${Math.min(4, lvl * 2)}.`,
    },
    l020: {
      id: "l020",
      cost: 2,
      max: 3,
      img: "020.webp",
      incomeType: "none",
      title: "Mana Devour",
      description: ({ lvl }: LVL) =>
        `Your heroes' spells const  -${Math.min(3, lvl)} mana`,
    },
    l030: {
      id: "l030",
      cost: 4,
      max: 1,
      img: "030.webp",
      incomeType: "none",
      title: "Focus Reserves",
      description: () => "Start each battle with +1 Focus Charge(s).",
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
      title: "Tax Collectors",
      description: ({ lvl }: LVL) =>
        `Produces ${Math.min(750, lvl * 250)} Gold daily.`,
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
      title: "Mining: Crystals",
      description: ({ lvl }: LVL) =>
        `Produces ${Math.min(2, lvl)} Crystal(s) daily.`,
    },
    l120: {
      id: "l120",
      cost: 3,
      max: 1,
      img: "120.webp",
      incomeType: "none",
      title: "Hidden Desires",
      description: ({ sight }: Sight) =>
        `Your Hive heroes see exact information about neutral squads within ${3 * sight} squares.`,
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
      title: "Resource Riches II",
      description: () =>
        "Provides a one-time allotment of 5000 Gold, 10 Wood, and 10 Ore when enacted.",
    },
    l210: {
      id: "l210",
      cost: 4,
      max: 1,
      img: "210.webp",
      incomeType: "none",
      title: "Natural Selection",
      description: () =>
        "External dwellings in an area that you control produce upgraded creatures.",
    },
    l220: {
      id: "l220",
      cost: 3,
      max: 1,
      img: "220.webp",
      incomeType: "none",
      title: "Ancient Power",
      description: () => "Primal spells of your heroes gain 1 level(s).",
    },
    l300: {
      id: "l300",
      cost: 4,
      max: 2,
      img: "300.webp",
      incomeType: "none",
      title: "Prosper and Flourish",
      description: ({ lvl }: LVL) =>
        `External dwellings increase respective creature growth in the cities by ${Math.min(100, lvl * 50)}.`,
    },
    l310: {
      id: "l310",
      cost: 3,
      max: 1,
      img: "310.webp",
      incomeType: "none",
      title: "Beelzebub's Gaze",
      description: ({ sight }: Sight) =>
        `Your Hive heroes see exact information about enemy heroes and cities within ${3 * sight} squares.`,
    },
    l400: {
      id: "l400",
      cost: 4,
      max: 2,
      img: "400.webp",
      incomeType: "none",
      title: "Evolve, Adapt, Overcome",
      description: ({ lvl }: LVL) =>
        `Upgrading your Hive creatures costs –${Math.min(20, lvl * 10)}% Gold. Recruiting upgraded creatures is discounted by the same amount.`,
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
      title: "Resource Riches III",
      description: () =>
        "Provides a one-time allotment of 7500 Gold, 15 Wood, and 15 Ore when enacted.",
    },
    l420: {
      id: "l420",
      cost: 3,
      max: 3,
      img: "420.webp",
      incomeType: "none",
      title: "Hive Magic",
      description: ({ lvl }: LVL) =>
        `Your heroes deal +${Math.min(30, lvl * 10)}% Magic Damage.`,
    },
    l001: {
      id: "l001",
      cost: 2,
      max: 3,
      img: "001.webp",
      incomeType: "none",
      title: "Hive Integration",
      description: ({ lvl }: LVL) =>
        `Friendly creatures gain ${Math.min(3, lvl)} Attack.`,
    },
    l011: {
      id: "l011",
      cost: 2,
      max: 3,
      img: "011.webp",
      incomeType: "none",
      title: "Hive Reception",
      description: ({ lvl }: LVL) =>
        `Friendly creatures gain ${Math.min(3, lvl)} Defense.`,
    },
    l021: {
      id: "l021",
      cost: 3,
      max: 1,
      img: "021.webp",
      incomeType: "none",
      title: "Hive Offsprings I",
      description: () => `Summoned Fire Larvae deal +100% Damage on death.`,
    },
    l101: {
      id: "l101",
      cost: 3,
      max: 2,
      img: "101.webp",
      incomeType: "none",
      title: "Elite Parasites",
      description: ({ lvl }: LVL) =>
        `Parasite growth in your cities increases by 4. They gain ${Math.min(2, lvl)} HP.`,
    },
    l111: {
      id: "l111",
      cost: 3,
      max: 2,
      img: "111.webp",
      incomeType: "none",
      title: "Elite Locusts",
      description: ({ lvl }: LVL) =>
        `Locust growth in your cities increases by 4. They gain ${Math.min(2, lvl)} Speed.`,
    },
    l121: {
      id: "l121",
      cost: 3,
      max: 2,
      img: "121.webp",
      incomeType: "none",
      title: "Elite Hornets",
      description: ({ lvl }: LVL) =>
        `Hornet growth in your cities increases by 2. They gain ${Math.min(2, lvl)} Initiative.`,
    },
    l201: {
      id: "l201",
      cost: 3,
      max: 2,
      img: "201.webp",
      incomeType: "none",
      title: "Elite Scorpions",
      description: ({ lvl }: LVL) =>
        `Hornet growth in your cities increases by 2. They gain ${lvl >= 2 ? 3 : 1} Initiative.`,
    },
    l211: {
      id: "l211",
      cost: 3,
      max: 2,
      img: "211.webp",
      incomeType: "none",
      title: "Elite Reavers",
      description: ({ lvl }: LVL) =>
        `Reaver growth in your cities increases by 1. They gain ${lvl >= 2 ? 5 : 1} Morale and 1 Luck.`,
    },
    l221: {
      id: "l221",
      cost: 3,
      max: 2,
      img: "221.webp",
      incomeType: "none",
      title: "Elite Waurmos",
      description: ({ lvl }: LVL) =>
        `Waurms growth in your cities increases by 1. They gain ${lvl >= 2 ? 5 : 1} Morale and 1 Luck.`,
    },
    l231: {
      id: "l231",
      cost: 4,
      max: 1,
      img: "231.webp",
      incomeType: "none",
      title: "Hive Offsprings II",
      description: () => `Summoned Fire Larvae attack twice.`,
    },
    l301: {
      id: "l301",
      cost: 3,
      max: 2,
      img: "301.webp",
      incomeType: "none",
      title: "Elite Hive Queens",
      description: ({ lvl }: LVL) =>
        `Hive Queen growth in your cities increases by 1. They deal +${Math.min(10, lvl * 5)} Damage and gain ${Math.min(50, lvl * 25)} HP.`,
    },
    l311: {
      id: "l311",
      cost: 2,
      max: 3,
      img: "311.webp",
      incomeType: "none",
      title: "Elite Hive Queens",
      description: ({ lvl }: LVL) =>
        `When battling in the area you do not control, friendly creatures gain ${Math.min(6, lvl * 2)} Attack and Defense.`,
    },
    l401: {
      id: "l401",
      cost: 4,
      max: 2,
      img: "401.webp",
      incomeType: "none",
      title: "Infernal Rage",
      description: ({ lvl }: LVL) =>
        `Friendly creatures deal +${Math.min(2, lvl)} Damage.`,
    },
    l411: {
      id: "l411",
      cost: 3,
      max: 3,
      img: "411.webp",
      incomeType: "none",
      title: "No Compassion",
      description: ({ lvl }: LVL) =>
        `The chance of Morale or Luck triggering for friendly creatures increases by ${Math.min(3, lvl)}% for each point of their Morale or Luck, respectively.`,
    },
    l421: {
      id: "l421",
      cost: 5,
      max: 1,
      img: "421.webp",
      incomeType: "none",
      title: "Hive Offsprings III",
      description: () =>
        `Summoned Fire Larvae provoke adjacent enemies to attack them over other units.`,
    },
  },
} as const;

// On-screen layout for each faction's law board: each inner array is a group
// (column) of law ids, mirroring the original nested-array positions.
export const LAW_LAYOUT: Record<
  keyof typeof LAWS,
  { left: LawID[][]; right: LawID[][] }
> = {
  hive: {
    left: [
      ["l000", "l010", "l020", "l030"],
      ["l100", "l110", "l120"],
      ["l200", "l210", "l220"],
      ["l300", "l310"],
      ["l400", "l410", "l420"],
    ],
    right: [
      ["l001", "l011", "l021"],
      ["l101", "l111", "l121"],
      ["l201", "l211", "l221", "l231"],
      ["l301", "l311"],
      ["l401", "l411", "l421"]
    ],
  },
};

type LVL = { lvl: number };
type Sight = { sight: number };
