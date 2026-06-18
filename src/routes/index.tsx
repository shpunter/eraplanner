import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({
      to: "/faction/$id",
      params: { id: "temple" },
      search: { m: "castles" },
    });
  },
});
