import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/faction/$id/resources")({
  head: ({ params }) => {
    const faction = capitalize(params.id);
    const title = `${faction} — Resources | Era Planner`;
    const description = `Track ${faction} resource income across the full campaign timeline and plan upgrades in Olden Era.`;
    const url = `https://eraplanner.com/faction/${params.id}/resources`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        {
          name: "keywords",
          content: `olden era resource planner, ${params.id} resource builder, ${params.id} resources, olden era ${params.id} economy, resource income tracker, olden era economy guide, ${faction} resources, olden era builder`,
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
                  name: "Resources",
                  item: url,
                },
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
