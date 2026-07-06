import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";

import type { QueryClient } from "@tanstack/react-query";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import "../shared/initShare";
import appCss from "../styles.css?url";
import "../shared/prefetchRemotes";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Era Planner — Olden Era" },
      {
        name: "description",
        content:
          "Free planning tool for the online strategy game Olden Era. Plan your castle builds, track resources, mines and army for all 6 factions across the full campaign timeline.",
      },
      {
        name: "keywords",
        content:
          "olden era, olden era planner, olden era builds, olden era guide, olden era castle, olden era factions, era planner, hive, schism, temple, dungeon, grove, necropolis",
      },
      { name: "robots", content: "index, follow" },
      { name: "theme-color", content: "#000000" },

      // Open Graph
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://eraplanner.com" },
      { property: "og:site_name", content: "Era Planner" },
      { property: "og:title", content: "Era Planner — Olden Era" },
      {
        property: "og:description",
        content:
          "Free planning tool for the online strategy game Olden Era. Plan castle builds, track resources, mines and army for all 6 factions.",
      },
      {
        property: "og:image",
        content: "https://eraplanner.com/img/faction/temple.webp",
      },

      // Twitter / X
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Era Planner — Olden Era" },
      {
        name: "twitter:description",
        content:
          "Free planning tool for the online strategy game Olden Era. Plan castle builds, track resources, mines and army for all 6 factions.",
      },
      {
        name: "twitter:image",
        content: "https://eraplanner.com/img/faction/temple.webp",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.json" },
    ],
  }),
  shellComponent: RootDocument,
});

const JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Era Planner",
  url: "https://eraplanner.com",
  description:
    "Free planning tool for the online strategy game Olden Era. Plan castle builds, track resources, mines and army for all 6 factions.",
  applicationCategory: "GameApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: ok
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
        />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
