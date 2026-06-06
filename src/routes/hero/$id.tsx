import { createFileRoute } from "@tanstack/react-router";
import { heroes } from "./heroes";
import Hero from "#/features/hero/Hero";

export const Route = createFileRoute("/hero/$id")({
  loader: async ({ params }): Promise<{ hero: TypeHero }> => {
    const idCandidate = parseInt(params.id, 10) as ID;
    const id = idCandidate > 1 || idCandidate < 0 ? 0 : idCandidate;

    return {
      hero: await fetchHeroData(id),
    };
  },
  component: Hero,
});

const fetchHeroData = async (id: ID) => {
  return heroes[id];
};

type ID = keyof typeof heroes;

export type TypeHero = {
  id: ID;
  avatar: string;
  name: string;
  type: "Might";
  class: "Oathkeeper";
  fraction: "Schism";
  mainStats: MainStats;
  secondaryStats: SecondaryStats;
};

export type MainStats = {
  attack: number;
  defense: number;
  magicPower: number;
  knowledge: number;
  luck: number;
  morale: number;
};

export type SecondaryStats = {
  movementPoints: number;
  xp: number;
  mana: number;
};
