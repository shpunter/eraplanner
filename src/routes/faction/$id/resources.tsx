import { createFileRoute } from "@tanstack/react-router";
import SeoSection from "../SeoSection/SeoSection";

export const Route = createFileRoute("/faction/$id/resources")({
  head: ({ params }) => {
    const faction = capitalize(params.id);
    const title = `${faction} — Resources | Era Planner`;
    const description = `Track ${faction} resource income across the full campaign timeline and plan upgrades in Olden Era.`;
    const url = `https://www.eraplanner.com/faction/${params.id}/resources`;

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
  component: ResourcesInfo,
});

function ResourcesInfo() {
  const { id } = Route.useParams();
  const faction = capitalize(id);

  return (
    <SeoSection
      heading={`${faction} Resources — Olden Era Resource Tracker`}
      lead={`Track ${faction} resource income across the full Olden Era campaign timeline. See how gold, wood, ore, gems, and other resources accumulate as you upgrade buildings and mines. Plan your economy to stay ahead at every stage.`}
    />
  );
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
