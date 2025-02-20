/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: "anime-list",
      removal: input?.stage === "main" ? "retain" : "remove",
      protect: ["main"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: {
          region: "us-east-1",
          profile: "agape-media-dev",
        },
        cloudflare: "5.49.1",
      },
    };
  },
  async run() {
    new sst.aws.SvelteKit("MyWeb", {
      ...(process.env.SST_STAGE === "main" && {
        domain: {
          name: "anime.themattmayfield.com",
          dns: sst.cloudflare.dns(),
        },
      }),
    });
  },
});
