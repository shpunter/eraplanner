import { createFileRoute } from "@tanstack/react-router";
import SeoSection from "../SeoSection/SeoSection";

export const Route = createFileRoute("/faction/$id/mines")({
  head: ({ params }) => {
    const faction = capitalize(params.id);
    const title = `${faction} — Mines | Era Planner`;
    const description = `Optimize ${faction} mine upgrades and plan resource extraction to maximize your economy in Olden Era.`;
    const url = `https://www.eraplanner.com/faction/${params.id}/mines`;

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
                  item: `https://www.eraplanner.com/faction/${params.id}/`,
                },
                { "@type": "ListItem", position: 3, name: "Mines", item: url },
              ],
            },
          ]),
        },
      ],
    };
  },
  component: MinesInfo,
});

function MinesInfo() {
  const { id } = Route.useParams();
  const faction = capitalize(id);

  return (
    <SeoSection
      heading={`${faction} Mines — Olden Era Mine Planner`}
      lead={`Plan your ${faction} mine upgrades in Olden Era. Track resource extraction across gold, wood, ore, gems, and other materials. Optimize your mine build order to maximize economy output throughout the full campaign timeline.`}
    />
  );
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
