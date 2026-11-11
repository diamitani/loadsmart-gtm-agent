---
artifact_type: api
project_id: loadsmart-gtm-agent
version: v1.0.0
status: approved
owner: eng
reviewers: [architect, product]
well_architected_review: pass
pal_run_id: loadsmart-alpha-001
confidence: 0.99
---

# 13. API Contracts & Endpoint Specifications

## 1. REST Endpoints Overview

| Method | Path | Description | Request Payload | Response |
|---|---|---|---|---|
| `POST` | `/api/chat` | Vercel AI SDK v7 streaming assistant | `{ messages: Message[] }` | SSE Stream (`text/plain; charset=utf-8`) |
| `GET` | `/api/pods` | Fetch pod metrics, funnels, accounts | Query: `?podId=pod-1` | `{ pods, selectedPod, metrics, accounts, mailboxes, stuckAccounts }` |
| `POST` | `/api/pipeline` | Execute a 10-step pipeline stage | `{ podId, stage, accountIds }` | `{ success: boolean, stage, processedCount, updatedAccounts }` |
| `GET` | `/api/automations` | List and download n8n / Clay JSONs | None | `{ workflows: AutomationBlueprint[] }` |
| `GET` | `/api/health` | Service health & model connectivity | None | `{ status: "ok", timestamp, persistence: "local" \| "supabase" }` |

## 2. API Contract Details

### `POST /api/chat`
- **Request Body:**
  ```json
  {
    "messages": [
      { "role": "user", "content": "Nominate 20 accounts for Pod 2 Enterprise TMS" }
    ]
  }
  ```
- **Response:**
  Streams token events and tool call invocations conformant with the Vercel AI SDK protocol (`0:"text"`, `9:{"toolCallId":...}`).

### `GET /api/pods`
- **Response Body:**
  ```json
  {
    "selectedPod": "pod-1",
    "metrics": {
      "targetAccounts": 20,
      "activeSequenced": 14,
      "meetingsBooked": 3,
      "pipelineValue": "$185,000",
      "mailboxHealthScore": 98.4,
      "leakRate": 10.0
    },
    "funnel": [
      { "stage": "Nominated", "count": 20, "percentage": 100 },
      { "stage": "CRM Cleared", "count": 18, "percentage": 90 },
      { "stage": "Enriched", "count": 16, "percentage": 80 },
      { "stage": "Researched", "count": 16, "percentage": 80 },
      { "stage": "Copy Approved", "count": 14, "percentage": 70 },
      { "stage": "Sequenced", "count": 14, "percentage": 70 },
      { "stage": "Meeting Booked", "count": 3, "percentage": 15 }
    ]
  }
  ```
