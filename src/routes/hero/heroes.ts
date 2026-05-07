export const heroes = {
  [0b000]: {
    id: 0b000,
    avatar: "0.webp",
    name: "Nihil",
    type: "Might",
    class: "Oathkeeper",
    fraction: "Schism",
    mainStats: {
      attack: 3,
      defense: 2,
      magicPower: 1,
      knowledge: 1,
      luck: 0,
      morale: 0,
    },
    secondaryStats: {
      movementPoints: 240,
      xp: 1000,
      mana: 20,
    },
  },
  [0b001]: {
    id: 0b001,
    avatar: "1.webp",
    name: "Blackhorn",
    type: "Might",
    class: "Oathkeeper",
    fraction: "Schism",
    mainStats: {
      attack: 3,
      defense: 2,
      magicPower: 1,
      knowledge: 1,
      luck: 0,
      morale: 0,
    },
    secondaryStats: {
      movementPoints: 200,
      xp: 1000,
      mana: 20,
    },
    
  },
} as const;
