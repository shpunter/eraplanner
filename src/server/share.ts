import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { z } from "zod";

const SHARE_TTL = 60 * 60 * 24 * 30; // 30 days

export const saveShare = createServerFn({ method: "POST" })
  .inputValidator(z.object({ state: z.string() }))
  .handler(async ({ data }) => {
    const id = crypto.randomUUID().replace(/-/g, "").slice(0, 10);
    await env.SHARES.put(id, data.state, { expirationTtl: SHARE_TTL });
    return { id };
  });

export const loadShare = createServerFn({ method: "GET" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const state = await env.SHARES.get(data.id);
    if (!state) throw new Error("Share not found or expired");
    return { state };
  });
