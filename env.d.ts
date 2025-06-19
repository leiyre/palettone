declare module "nitro" {
  interface RuntimeConfig {
    cloudflare: {
      accountId: string;
      aiToken: string;
    };
  }
}
