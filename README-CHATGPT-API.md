# ChatGPT Query API

A minimal Bun server implementation for querying ChatGPT using the Scrapeless SDK.

## Setup

1. **Install dependencies:**
   ```bash
   bun install
   ```

2. **Start the server:**
   ```bash
   bun dev
   ```

   The server will run at `http://localhost:3000`

## API Endpoint

### POST `/api/chatgpt/query`

Query ChatGPT with a prompt and get the response.

**Request Body:**

```json
{
  "prompt": "What is the capital of France?",
  "proxy_url": "http://proxy.scrapeless.com:8080",
  "timeout": 180000,
  "session_name": "ChatGPT Query",
  "web_search": true,
  "session_recording": false,
  "answer_type": "text",
  "webhook": "https://your-webhook-url.com/callback"
}
```

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `prompt` | string | ✅ Yes | - | The question/prompt to send to ChatGPT |
| `proxy_url` | string | No | `http://proxy.scrapeless.com:8080` | Proxy URL for the request |
| `timeout` | number | No | `180000` | Request timeout in milliseconds |
| `session_name` | string | No | `"ChatGPT Query"` | Name for the browser session |
| `web_search` | boolean | No | `true` | Enable web search in ChatGPT |
| `session_recording` | boolean | No | `false` | Record the browser session |
| `answer_type` | string | No | `"text"` | Response format: `"text"`, `"html"`, or `"raw"` |
| `webhook` | string | No | - | Webhook URL for async callback |

**Success Response:**

```json
{
  "prompt": "What is the capital of France?",
  "task_id": "123e4567-e89b-12d3-a456-426614174000",
  "duration": "12.34",
  "answer": "The capital of France is Paris.",
  "url": "https://chatgpt.com/?q=...",
  "success": true,
  "country_code": "US",
  "citations": [
    {
      "url": "https://example.com",
      "icon": "https://...",
      "title": "Example Title",
      "description": "Description..."
    }
  ],
  "links_attached": [
    {
      "position": 1,
      "text": "Link text",
      "url": "https://..."
    }
  ],
  "image_cards": [
    {
      "position": 1,
      "url": "https://..."
    }
  ],
  "products": [
    {
      "url": "https://...",
      "title": "Product name",
      "image_urls": ["https://..."]
    }
  ]
}
```

**Error Response:**

```json
{
  "success": false,
  "error_reason": "Error message here"
}
```

## Usage Examples

### Using curl

```bash
curl -X POST http://localhost:3000/api/chatgpt/query \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "What is the capital of France?"
  }'
```

### Using Bun/TypeScript

```typescript
const response = await fetch('http://localhost:3000/api/chatgpt/query', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: 'What is the capital of France?',
  }),
});

const result = await response.json();
console.log(result);
```

### Using the example script

```bash
bun examples/test-chatgpt-api.ts
```

## Configuration

The ChatGPT service uses the Scrapeless API. Make sure to set your API key in the service file:

[src/services/chatgpt-query.ts:70](src/services/chatgpt-query.ts#L70)

```typescript
scrapeless = new Scrapeless({
  apiKey: 'your-api-key-here'
});
```

## How It Works

1. **Request**: Client sends a POST request with a prompt
2. **Processing**: Server creates a browser session using Scrapeless
3. **ChatGPT**: Navigates to ChatGPT and submits the prompt
4. **Extraction**: Extracts the answer, citations, links, and other data
5. **Response**: Returns structured JSON with all extracted data

## Development

Run the server in development mode with hot reloading:

```bash
bun dev
```

## Production

Run the server in production mode:

```bash
bun start
```
