import { createFileRoute } from "@tanstack/react-router";
import { heroes } from "./heroes";
import Hero from "#/features/hero/Hero";

export const Route = createFileRoute("/hero/$id")({
  head: ({ params }) => {
    const id = (
      parseInt(params.id, 10) in heroes ? parseInt(params.id, 10) : 0
    ) as keyof typeof heroes;
    const hero = heroes[id];
    const title = `${hero.name} — ${hero.class} | Era Planner`;
    const description = `${hero.name} is a ${hero.type} hero of the ${hero.fraction} faction in Olden Era. ${hero.class} class with ${hero.mainStats.attack} Attack and ${hero.mainStats.defense} Defense. Build and optimize your hero.`;
    const url = `https://www.eraplanner.com/hero/${params.id}`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: hero.name,
            description: `${hero.name} is a ${hero.type} ${hero.class} hero of the ${hero.fraction} faction in Olden Era.`,
            url,
          }),
        },
      ],
    };
  },
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
