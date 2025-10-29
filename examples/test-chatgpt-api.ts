// Example: How to call the ChatGPT API endpoint
// Run with: bun examples/test-chatgpt-api.ts

const API_URL = 'http://localhost:3000/api/chatgpt/query';

async function testChatGPT() {
  try {
    console.log('Sending request to ChatGPT API...');

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'What makes Trae.ai different from other AI solutions?',
        // Recommended settings to avoid timeout:
        // proxy_url: 'http://proxy.scrapeless.com:8080-country_US', // Specify country
        timeout: 300000, // 5 minutes (increase for slower connections)
        session_name: 'My ChatGPT Session',
        web_search: true, // Disable web search for faster response
        session_recording: false,
        answer_type: 'text', // 'text' | 'html' | 'raw'
        // webhook: 'https://your-webhook-url.com/callback',
      }),
    });

    const result = await response.json();

    if (result.success) {
      console.log('\n✅ Success!');
      console.log('Answer:', result.answer);
      console.log('Duration:', result.duration, 'seconds');
      console.log('Country:', result.country_code);

      if (result.citations?.length) {
        console.log('\nCitations:');
        result.citations.forEach((citation: any, i: number) => {
          console.log(`  ${i + 1}. ${citation.title}: ${citation.url}`);
        });
      }

      if (result.links_attached?.length) {
        console.log('\nAttached Links:');
        result.links_attached.forEach((link: any) => {
          console.log(`  - ${link.title}: ${link.url}`);
        });
      }
    } else {
      console.error('❌ Error:', result.error_reason || result.error);
    }
  } catch (error) {
    console.error('❌ Request failed:', error);
  }
}

testChatGPT();
