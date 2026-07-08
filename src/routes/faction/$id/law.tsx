import { createFileRoute } from "@tanstack/react-router";
import { lawSeo } from "../law.seo";

export const Route = createFileRoute("/faction/$id/law")({
  head: ({ params }) => {
    const id = params.id as keyof typeof lawSeo;
    const faction = capitalize(params.id);
    const title = `${faction} — Law | Era Planner`;
    const description = `Plan ${faction} law upgrades, manage faction bonuses, and optimize your legal system in Olden Era.`;
    const url = `https://eraplanner.com/faction/${params.id}/law`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        {
          name: "keywords",
          content: `olden era law builder, ${params.id} law builder, ${params.id} law upgrades, olden era ${params.id} laws, law planner, olden era law guide, faction laws, ${faction} law, olden era builder`,
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
                { "@type": "ListItem", position: 3, name: "Law", item: url },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: `${faction} Laws`,
              numberOfItems: lawSeo[id].length,
              itemListElement: lawSeo[id].map((l, i) => ({
                "@type": "ListItem",
                position: i + 1,
                item: {
                  "@type": "Thing",
                  name: l.title,
                  description: l.description,
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
