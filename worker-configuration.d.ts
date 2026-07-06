// Run `wrangler types` after the KV namespace is created to regenerate
// with the full @cloudflare/workers-types definitions.

declare module "cloudflare:workers" {
  interface KVNamespace {
    get(key: string): Promise<string | null>;
    put(
      key: string,
      value: string,
      options?: { expirationTtl?: number },
    ): Promise<void>;
    delete(key: string): Promise<void>;
  }

  const env: {
    SHARES: KVNamespace;
  };

  export { env };
}
