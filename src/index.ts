import { serve } from "bun";
import index from "./index.html";
import { Puppeteer } from '@scrapeless-ai/sdk';

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/hello": {
      async GET(req) {
        try {
          const browser = await Puppeteer.connect({
            apiKey: process.env.SCRAPELESS_API_KEY || 'YOUR_API_KEY',
            sessionName: 'sdk_test',
            sessionTTL: 180,
            proxyCountry: 'ANY',
            sessionRecording: true,
            defaultViewport: null,
          });

          const page = await browser.newPage();
          await page.goto('https://www.scrapeless.com');
          const title = await page.title();
          await browser.close();

          return Response.json({
            success: true,
            title,
            message: "Successfully scraped scrapeless.com",
          });
        } catch (error) {
          return Response.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          }, { status: 500 });
        }
      },
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async req => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
