/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "olog-reader-landing",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },

  async run() {
    // Determine domain based on stage
    const domain =
      $app.stage === "production"
        ? "ologreader.com"
        : `${$app.stage}-ologreader.com`;

    new sst.aws.Nextjs("MyWeb", {
      domain: domain,
      environment: {
        NEXT_PUBLIC_API_URL: "https://api.reader.olog.me/v1",
      },
    });
  },
});
