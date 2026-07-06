import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/faction/$id/mines")({
  head: ({ params }) => {
    const faction = capitalize(params.id);
    const title = `${faction} — Mines | Era Planner`;
    const description = `Optimize ${faction} mine upgrades and plan resource extraction to maximize your economy in Olden Era.`;
    const url = `https://eraplanner.com/faction/${params.id}/mines`;

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
                  item: "https://eraplanner.com",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: faction,
                  item: `https://eraplanner.com/faction/${params.id}/castles`,
                },
                { "@type": "ListItem", position: 3, name: "Mines", item: url },
              ],
            },
          ]),
        },
      ],
    };
  },
  component: () => null,
});

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
