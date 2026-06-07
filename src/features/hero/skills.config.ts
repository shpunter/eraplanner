export const skills = {
  defense: {
    info: [
      {
        img: "70px-Skill_Defence.png",
        description: "Friendly units take 10% less damage from basic attacks.",
      },
      {
        img: "70px-Skill_Advanced_Defence.png",
        description: "Friendly units take 15% less damage from basic attacks.",
      },
      {
        img: "70px-Skill_Expert_Defence.png",
        description: "Friendly units take 20% less damage from basic attacks.",
      },
    ],
    subSkills: [
      {
        img: "cover.webp",
        title: "Cover",
        description:
          "Friendly creatures take –20% Damage from Ranged and Long Reach attacks",
      },
      {
        img: "hymn_to_the_martyrs.webp",
        title: "Hymn to the Martyrs",
        description:
          "Friendly creatures generate +1 Focus Point(s) when they take Damage. This bonus is doubled if the hero knows “Recruitment”",
      },
      {
        img: "as_luck_would_have_it.webp",
        title: "As Luck Would Have It",
        description:
          "Friendly creatures gain +2 Defense for each point of Luck",
      },
      {
        img: "shields_and_shells.webp",
        title: "Shields and Shells",
        description: "Enemy creatures deal –1 Damage.",
      },
      {
        img: "wizard_contract.webp",
        title: "Wizard Contract",
        description:
          "Friendly creatures take –10% Magic Damage. This bonus is doubled if the hero knows “Diplomacy.”",
      },
      {
        img: "unstoppable_force.webp",
        title: "Unstoppable Force",
        description: "–15% Attack to enemy creatures.",
      },
    ],
  },
  offence: {
    info: [
      {
        img: "70px-Skill_Offence.png",
        description: "Friendly units deal 10% more damage with basic attacks.",
      },
      {
        img: "70px-Skill_Advanced_Offence.png",
        description: "Friendly units deal 15% more damage with basic attacks.",
      },
      {
        img: "70px-Skill_Expert_Offence.png",
        description: "Friendly units deal 20% more damage with basic attacks.",
      },
    ],
    subSkills: [
      {
        img: "archery.webp",
        title: "Archery",
        description:
          "Friendly creatures’ Ranged and Long Reach attacks deal +15% Damage.",
      },
      {
        img: "battle_march.webp",
        title: "Battle March",
        description:
          "Friendly creatures generate +1 Focus Point(s) per attack. This bonus is doubled if the hero knows “Luck.”",
      },
      {
        img: "battle_frenzy.webp",
        title: "Battle Frenzy",
        description:
          "Friendly creatures gain +2 Attack for each point of Morale.",
      },
      {
        img: "shadow_blades.webpg",
        title: "Shadow Blades",
        description: "Friendly creatures deal +1 Damage.",
      },
      {
        img: "reality_wardens.webp",
        title: "Reality Wardens",
        description:
          "Friendly creatures deal +50% Damage to summoned enemy creatures. This bonus is doubled if the hero knows “Nightshade Magic.”",
      },
      {
        img: "firmness.webp",
        title: "Firmness",
        description: "–15% Defense to enemy creatures.",
      },
    ],
  },
  battleCraft: {
    info: [
      {
        img: "70px-Skill_Battlecraft.png",
        description:
          "When a friendly unit waits in battle, it gains 20% attack. When a friendly unit skips its turn, it gains 20% defense.",
      },
      {
        img: "70px-Skill_Advanced_Battlecraft.png",
        description:
          "When a friendly unit waits in battle, it gains 30% attack. When a friendly unit skips its turn, it gains 30% defense.",
      },
      {
        img: "70px-Skill_Expert_Battlecraft.png",
        description:
          "When a friendly unit waits in battle, it gains 40% attack. When a friendly unit skips its turn, it gains 40% defense.",
      },
    ],
    subSkills: [],
  },
  leadership: {
    info: [
      {
        img: "70px-Skill_Leadership.png",
        description: "Morale increases by 1.",
      },
      {
        img: "70px-Skill_Advanced_Leadership.png",
        description: "Morale increases by 2.",
      },
      {
        img: "70px-Skill_Expert_Leadership.png",
        description: "Morale increases by 3.",
      },
    ],
  },
  luck: {
    info: [
      {
        img: "70px-Skill_Luck.png",
        description: "Increases luck by 1.",
      },
      {
        img: "70px-Skill_Advanced_Luck.png",
        description: "Increases luck by 2.",
      },
      {
        img: "70px-Skill_Expert_Luck.png",
        description: "Increases luck by 3.",
      },
    ],
  },
  resistance: {
    info: [
      {
        img: "70px-Skill_Resistance.png",
        description: "Friendly creatures take –10% Magic Damage.",
      },
      {
        img: "70px-Skill_Advanced_Resistance.png",
        description: "Friendly creatures take –20% Magic Damage.",
      },
      {
        img: "70px-Skill_Expert_Resistance.png",
        description: "Friendly creatures take –30% Magic Damage.",
      },
    ],
  },
  siegecraft: {
    info: [
      {
        img: "70px-Skill_Siegecraft.png",
        description: "The catapult deals +50 Damage.",
      },
      {
        img: "70px-Skill_Advanced_Siegecraft.png",
        description: "The catapult deals +100 Damage.",
      },
      {
        img: "70px-Skill_Expert_Siegecraft.png",
        description: "The catapult deals +150 Damage.",
      },
    ],
  },
  tactics: {
    info: [
      {
        img: "70px-Skill_Tactics.png",
        description:
          "You can rearrange creatures before the start of battle within a 2-lines area.",
      },
      {
        img: "70px-Skill_Advanced_Tactics.png",
        description:
          "You can rearrange creatures before the start of battle within a 3-lines area.",
      },
      {
        img: "70px-Skill_Expert_Tactics.png",
        description:
          "You can rearrange creatures before the start of battle within a 4-lines area.",
      },
    ],
  },
  recruitment: {
    info: [
      {
        img: "70px-Skill_Recruitment.png",
        description: "All cities gain +4 growth to Tier 1 units.",
      },
      {
        img: "70px-Skill_Advanced_Recruitment.png",
        description: "All cities gain +2 growth to Tier 2 units.",
      },
      {
        img: "70px-Skill_Expert_Recruitment.png",
        description: "All cities gain +1 growth to Tier 3 units.",
      },
    ],
  },
  summonAvatar: {
    info: [
      {
        img: "70px-Skill_Summon_Avatar.png",
        description:
          "Grants a unique battle spell. It summons an Avatar that scales with the hero’s Spell Power and Knowledge.",
      },
      {
        img: "70px-Skill_Advanced_Summon_Avatar.png",
        description:
          "Grants a unique battle spell. It summons an Avatar that scales more strongly with the hero’s Spell Power and Knowledge.",
      },
      {
        img: "70px-Skill_Expert_Summon_Avatar.png",
        description:
          "Grants a unique battle spell. It summons an Avatar that scales even more strongly with the hero’s Spell Power and Knowledge.",
      },
    ],
  },
  intelligence: {
    info: [
      {
        img: "70px-Skill_Intelligence.png",
        description:
          "The hero can learn up to tier‑3 spells without needing to learn the corresponding Magic School.",
      },
      {
        img: "70px-Skill_Advanced_Intelligence.png",
        description:
          "The hero can learn up to tier‑4 spells without needing to learn the corresponding Magic School.",
      },
      {
        img: "70px-Skill_Expert_Intelligence.png",
        description:
          "The hero can learn up to tier‑5 spells without needing to learn the corresponding Magic School.",
      },
    ],
  },
  battleMagic: {
    info: [
      {
        img: "70px-Skill_Battle_Magic.png",
        description:
          "Friendly creatures’ Attack and Defence increase by 10% of their hero’s Spell Power and Knowledge.",
      },
      {
        img: "70px-Skill_Advanced_Battle_Magic.png",
        description:
          "Friendly creatures’ Attack and Defence increase by 20% of their hero’s Spell Power and Knowledge.",
      },
      {
        img: "70px-Skill_Expert_Battle_Magic.png",
        description:
          "Friendly creatures’ Attack and Defence increase by 30% of their hero’s Spell Power and Knowledge.",
      },
    ],
  },
  sorcery: {
    info: [
      {
        img: "70px-Skill_Sorcery.png",
        description: "+10% Magic Damage.",
      },
      {
        img: "70px-Skill_Advanced_Sorcery.png",
        description: "+20% Magic Damage.",
      },
      {
        img: "70px-Skill_Expert_Sorcery.png",
        description: "+30% Magic Damage.",
      },
    ],
  },
  thaumaturgy: {
    info: [
      {
        img: "70px-Skill_Thaumaturgy.png",
        description:
          "Allows the hero to use the Spellbook one more time per battle round. Spells cost +300% mana after each use.",
      },
      {
        img: "70px-Skill_Advanced_Thaumaturgy.png",
        description:
          "Allows the hero to use the Spellbook one more time per battle round. Spells cost +200% mana after each use.",
      },
      {
        img: "70px-Skill_Expert_Thaumaturgy.png",
        description:
          "Allows the hero to use the Spellbook one more time per battle round. Spells cost +100% mana after each use.",
      },
    ],
  },
  arcaneMagic: {
    title: "Arcane Magic",
    info: [
      {
        img: "70px-Skill_Arcane_Magic.png",
        description: "The hero can learn tier‑3 Arcane spells.",
      },
      {
        img: "70px-Skill_Advanced_Arcane_Magic.png",
        description:
          "The hero can learn tier‑4 Arcane spells. Arcane spells cost –3 mana.",
      },
      {
        img: "70px-Skill_Expert_Arcane_Magic.png",
        description:
          "The hero can learn tier‑5 Arcane spells. Arcane spells cost –3 mana and gain +1 level(s).",
      },
    ],
  },
  daylightMagic: {
    title: "Daylight Magic",
    info: [
      {
        img: "70px-Skill_Daylight_Magic.png",
        description: "The hero can learn tier‑3 Daylight spells.",
      },
      {
        img: "70px-Skill_Advanced_Daylight_Magic.png",
        description:
          "The hero can learn tier‑4 Daylight spells. Daylight spells cost –3 mana.",
      },
      {
        img: "70px-Skill_Expert_Daylight_Magic.png",
        description:
          "The hero can learn tier‑5 Daylight spells. Daylight spells cost –3 mana and gain +1 level(s).",
      },
    ],
  },
  nightshadeMagic: {
    title: "Nightshade Magic",
    info: [
      {
        img: "70px-Skill_Nightshade_Magic.png",
        description: "The hero can learn tier‑3 Nightshade spells.",
      },
      {
        img: "70px-Skill_Advanced_Nightshade_Magic.png",
        description:
          "The hero can learn tier‑4 Nightshade spells. Nightshade spells cost –3 mana.",
      },
      {
        img: "70px-Skill_Expert_Nightshade_Magic.png",
        description:
          "The hero can learn tier‑5 Nightshade spells. Nightshade spells cost –3 mana and gain +1 level(s).",
      },
    ],
  },
  primalMagic: {
    title: "Primal Magic",
    info: [
      {
        img: "70px-Skill_Primal_Magic.png",
        description: "The hero can learn tier‑3 Primal spells.",
      },
      {
        img: "70px-Skill_Advanced_Primal_Magic.png",
        description:
          "The hero can learn tier‑4 Primal spells. Primal spells cost –3 mana.",
      },
      {
        img: "70px-Skill_Expert_Primal_Magic.png",
        description:
          "The hero can learn tier‑5 Primal spells. Primal spells cost –3 mana and gain +1 level(s).",
      },
    ],
  },
  diplomacy: {
    title: "Diplomacy",
    info: [
      {
        img: "70px-Skill_Diplomacy.png",
        description:
          "Allows you to sometimes recruit neutral armies for Gold instead of fighting them.",
      },
      {
        img: "70px-Skill_Advanced_Diplomacy.png",
        description:
          "Allows you to sometimes recruit neutral armies for Gold instead of fighting them. +25% Persuasion Power in Diplomacy.",
      },
      {
        img: "70px-Skill_Expert_Diplomacy.png",
        description:
          "Allows you to sometimes recruit neutral armies for Gold instead of fighting them. +50% Persuasion Power in Diplomacy.",
      },
    ],
  },
  logistics: {
    title: "Logistics",
    info: [
      {
        img: "70px-Skill_Logistics.png",
        description: "+10% Movement Points on the global map.",
      },
      {
        img: "70px-Skill_Advanced_Logistics.png",
        description: "+15% Movement Points on the global map.",
      },
      {
        img: "70px-Skill_Expert_Logistics.png",
        description: "+20% Movement Points on the global map.",
      },
    ],
  },
  scouting: {
    title: "Scouting",
    info: [
      {
        img: "70px-Skill_Scouting.png",
        description: "+1 to sight radius.",
      },
      {
        img: "70px-Skill_Advanced_Scouting.png",
        description: "+2 to sight radius.",
      },
      {
        img: "70px-Skill_Expert_Scouting.png",
        description: "+3 to sight radius.",
      },
    ],
  },
  insight: {
    title: "Insight",
    info: [
      {
        img: "70px-Skill_Insight.png",
        description: "+20% XP.",
      },
      {
        img: "70px-Skill_Advanced_Insight.png",
        description: "+30% XP.",
      },
      {
        img: "70px-Skill_Expert_Insight.png",
        description: "+40% XP.",
      },
    ],
  },
  economy: {
    title: "Economy",
    info: [
      {
        img: "70px-Skill_Economy.png",
        description: "+500 Gold daily.",
      },
      {
        img: "70px-Skill_Advanced_Economy.png",
        description: "+1000 Gold daily.",
      },
      {
        img: "70px-Skill_Expert_Economy.png",
        description: "+1500 Gold daily.",
      },
    ],
  },
} as const;
