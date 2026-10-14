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

    const web = new sst.aws.Nextjs("MyWeb", {
      domain,
      environment: {
        NEXT_PUBLIC_API_URL: "https://api.reader.olog.me/v1",
      },
    });

    if ($app.stage === "production") {
      new sst.aws.Nextjs("VoiceWeb", {
        domain: "voice.ologreader.com",
        buildCommand: web.nodes.server?.apply((server) =>
          server.arn.apply(() => "test -f .open-next/open-next.output.json"),
        ),
        environment: {
          NEXT_PUBLIC_API_URL: "https://api.reader.olog.me/v1",
        },
      });
    }
  },
});
