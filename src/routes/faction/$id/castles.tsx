import { createFileRoute } from "@tanstack/react-router";
import { castlesSeo } from "../castles.seo";

export const Route = createFileRoute("/faction/$id/castles")({
  head: ({ params }) => {
    const id = params.id as keyof typeof castlesSeo;
    const faction = capitalize(params.id);
    const title = `${faction} — Castles | Era Planner`;
    const description = `Plan ${faction} castle upgrades, track production buildings, and optimize your build order for Olden Era.`;
    const url = `https://eraplanner.com/faction/${params.id}/castles`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        {
          name: "keywords",
          content: `olden era castle builder, ${params.id} castle builder, ${params.id} castle build, olden era ${params.id} builds, castle upgrade planner, castle build order, olden era castle guide, ${faction} castle, olden era builder`,
        },
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
          children: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: title,
              description,
              url,
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Era Planner",
                  item: "https://eraplanner.com",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: faction,
                  item: `https://eraplanner.com/faction/${params.id}/castles`,
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: "Castles",
                  item: url,
                },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: `${faction} Castle Buildings`,
              numberOfItems: castlesSeo[id].length,
              itemListElement: castlesSeo[id].map((b, i) => ({
                "@type": "ListItem",
                position: i + 1,
                item: {
                  "@type": "Thing",
                  name: b.name,
                  description: b.description,
                },
              })),
            },
          ]),
        },
      ],
    };
  },
  component: () => null,
});

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
