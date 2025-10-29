import { serve } from "bun";
import index from "./index.html";
import { ChatgptService, type QueryChatgptRequest } from './services/chatgpt-query';

const chatGPTService = new ChatgptService();

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/chatgpt/query": {
      async POST(req) {
        try {
          const body = await req.json();

          if (!body.prompt) {
            return Response.json({
              success: false,
              error: 'prompt is required',
            }, { status: 400 });
          }

          // Prepare input for ChatgptService
          const input: QueryChatgptRequest = {
            prompt: body.prompt,
            task_id: body.task_id || crypto.randomUUID(),
            proxy_url: body.proxy_url || '',
            timeout: body.timeout || 180000,
            session_name: body.session_name || 'ChatGPT Query',
            web_search: body.web_search !== false,
            session_recording: body.session_recording || false,
            answer_type: body.answer_type || 'text',
            webhook: body.webhook,
          };

          // Create timeout checker
          const startTime = Date.now();
          const checkTimeout = () => Date.now() - startTime > input.timeout;

          // Call the solver
          const result = await chatGPTService.solver(input, checkTimeout);

          // Parse the response data (it's returned as Buffer array)
          const responseData = JSON.parse(Buffer.from(result.data).toString());

          return Response.json(responseData);
        } catch (error: any) {
          if (error.success === false) {
            return Response.json(error, { status: 500 });
          }
          return Response.json({
            success: false,
            error: error.message || 'Unknown error',
          }, { status: 500 });
        }
      },
    },

    // "/api/hello": {
    //   async GET(req) {
    //     try {
    //       const browser = await Puppeteer.connect({
    //         apiKey: process.env.SCRAPELESS_API_KEY || 'YOUR_API_KEY',
    //         sessionName: 'sdk_test',
    //         sessionTTL: 180,
    //         proxyCountry: 'ANY',
    //         sessionRecording: true,
    //         defaultViewport: null,
    //       });

    //       const page = await browser.newPage();
    //       await page.goto('https://www.scrapeless.com');
    //       const title = await page.title();
    //       await browser.close();

    //       return Response.json({
    //         success: true,
    //         title,
    //         message: "Successfully scraped scrapeless.com",
    //       });
    //     } catch (error) {
    //       return Response.json({
    //         success: false,
    //         error: error instanceof Error ? error.message : 'Unknown error',
    //       }, { status: 500 });
    //     }
    //   },
    //   async PUT(req) {
    //     return Response.json({
    //       message: "Hello, world!",
    //       method: "PUT",
    //     });
    //   },
    // },

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
