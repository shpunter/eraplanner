import { createFileRoute } from "@tanstack/react-router";
import { castlesSeo } from "../castles.seo";
import SeoSection from "../SeoSection/SeoSection";

export const Route = createFileRoute("/faction/$id/castles")({
  head: ({ params }) => {
    const id = params.id as keyof typeof castlesSeo;
    const faction = capitalize(params.id);
    const title = `${faction} — Castles | Era Planner`;
    const description = `Plan ${faction} castle upgrades, track production buildings, and optimize your build order for Olden Era.`;
    const url = `https://www.eraplanner.com/faction/${params.id}/castles`;

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
                  item: "https://www.eraplanner.com",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: faction,
                  item: `https://www.eraplanner.com/faction/${params.id}/castles`,
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
  component: CastlesInfo,
});

function CastlesInfo() {
  const { id } = Route.useParams();
  const faction = capitalize(id);
  const seoId = id as keyof typeof castlesSeo;
  const buildings = castlesSeo[seoId];

  return (
    <SeoSection
      heading={`${faction} Castle Buildings — Olden Era Build Planner`}
      lead={`Plan your ${faction} castle upgrades in Olden Era. Track all ${buildings.length} ${faction} buildings, set your build order, and optimize resource production across the full campaign timeline.`}
      items={buildings}
    />
  );
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
