import Hero from "#/features/hero/Hero";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: Hero });
