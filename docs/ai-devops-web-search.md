# AI DevOps Web Search

The AI DevOps widget supports web search through a backend proxy endpoint. Do not put Tavily, Brave, SerpApi, or Exa keys in frontend code.

## Recommended Provider

Use Tavily for the first implementation.

Backend environment:

```env
TAVILY_API_KEY=tvly-dev-...
```

If a Tavily key was pasted into chat, logs, Git, or browser code, rotate it before production use.

## Backend Endpoint Contract

The frontend calls:

```http
POST /api/v1/ai-devops/search
Content-Type: application/json
```

Request:

```json
{
  "query": "latest GitHub Actions outage status",
  "session_id": "sess-example",
  "history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ],
  "max_results": 5
}
```

Response:

```json
{
  "provider": "tavily",
  "answer": "Short grounded summary.",
  "results": [
    {
      "title": "Source title",
      "url": "https://example.com",
      "content": "Relevant snippet"
    }
  ]
}
```

## Tavily Proxy Shape

Example backend behavior:

```js
app.post('/api/v1/ai-devops/search', async (req, res) => {
  const query = String(req.body?.query || '').slice(0, 500);
  if (!query) return res.status(400).json({ error: 'query is required' });
  if (!process.env.TAVILY_API_KEY) return res.status(503).json({ error: 'TAVILY_API_KEY is not configured' });

  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.TAVILY_API_KEY}`,
    },
    body: JSON.stringify({
      query,
      search_depth: 'basic',
      max_results: Math.min(Number(req.body?.max_results || 5), 5),
      include_answer: true,
    }),
  });

  const data = await response.json();
  if (!response.ok) return res.status(response.status).json({ error: data.error || 'Search failed' });

  res.json({
    provider: 'tavily',
    answer: data.answer || '',
    results: (data.results || []).map((item) => ({
      title: item.title,
      url: item.url,
      content: item.content,
    })),
  });
});
```

## Frontend Behavior

The widget detects requests like `search the web`, `look up`, `latest`, or `browse`, then calls the backend proxy. If the endpoint is missing or the key is not configured, it shows a setup message instead of pretending it browsed.
