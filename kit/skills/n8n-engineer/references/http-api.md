# HTTP And API Patterns

Use this file when the task is about HTTP Request, REST APIs, auth, pagination, or the n8n API.

## Official default

The HTTP Request node is one of n8n's most versatile nodes. Use it when:
- no node exists
- a node exists but lacks the needed operation
- you need direct API control
- you need to turn an API call into an AI tool

## Decision order

1. Native node with supported operation
2. Native credential reused inside HTTP Request
3. Generic HTTP auth in HTTP Request
4. Custom node only if reuse or UX justifies it

## Authentication

Official guidance:
- Prefer `Predefined Credential Type` when available.
- Use generic auth only when no predefined credential exists.

Common generic options:
- Basic auth
- Header auth
- Bearer auth
- OAuth1
- OAuth2
- Query auth
- Custom auth

## Import curl

If API docs provide curl examples, import them into HTTP Request instead of hand-translating from scratch. This is often the fastest route from docs to a working node.

## Pagination

Official guidance:
- inspect the API first
- understand how the API exposes next-page state
- use the built-in pagination options when possible

HTTP Request supports:
- update a parameter in each request
- response contains next URL

Useful built-in variables:
- `$pageCount`
- `$request`
- `$response`

Important nuance:
- APIs paginate differently
- the HTTP Request node can help
- but if your workflow logic spans multiple calls or branches, you may still need explicit loop design

## Batching and rate limits

Use batching when processing large item sets or rate-limited APIs.

Official node options include:
- items per batch
- batch interval

Strong pattern:

1. Normalize input items.
2. Batch requests.
3. Wait or slow down when the API is sensitive.
4. Retry only where safe and idempotent.

## Timeout and SSL

The HTTP Request node supports timeout settings.

Use it when:
- a slow upstream should fail predictably
- long waits need to be capped
- you need SSL certificate support for a call

Useful nuance:
- the built-in `n8n` node can call the n8n API
- if your n8n server requires SSL, the docs say to use HTTP Request instead because it can provide SSL certificates

## Custom API operations for existing integrations

Official n8n guidance explicitly supports this pattern:
- if a built-in node lacks an endpoint, use HTTP Request with that service's predefined credential type

This is often the best answer before building a custom node.

## n8n API

Official auth pattern:
- send the key in `X-N8N-API-KEY`

Use the n8n API when:
- automating workflow administration
- inspecting executions
- creating or updating credentials and workflows where supported
- building platform tooling around n8n itself

## Build checklist for API work

- base URL confirmed
- auth method confirmed
- method and endpoint confirmed
- required headers mapped
- request body schema mapped
- pagination plan defined
- rate-limit plan defined
- retries and idempotency considered
- output schema normalized for downstream nodes
