---
artifact_type: architecture
project_id: loadsmart-gtm-agent
version: v1.0.0
status: approved
owner: eng
reviewers: [architect, operator]
well_architected_review: pass
pal_run_id: loadsmart-alpha-001
confidence: 0.99
---

# 10. System Architecture: Loadsmart Live GTM Agent OS

## 1. High-Level C4 Architecture (L1 & L2)

```mermaid
flowchart TB
    subgraph Users ["Sales Operations & Field Pods"]
        SDR["SDR / AE Reps"]
        RevOps["RevOps Leadership"]
    end

    subgraph Edge ["Edge & CDN Layer (Vercel / Cloudflare)"]
        WAF["Edge WAF & TLS Termination"]
        RouteHandlers["Next.js 16 Edge Route Handlers"]
    end

    subgraph AppServer ["Application & Agent Core"]
        ChatEngine["Vercel AI SDK v7 Agent Engine"]
        PALEngine["PAL Pipeline & Foundation Gate (W=1.00)"]
        TruthGuardEngine["Calibrated Truth & Claims Guard"]
        PodManager["Pod State & Funnel Service"]
    end

    subgraph Connectors ["Third-Party Connectors & Orchestration"]
        N8N["n8n Workflows Webhook"]
        SFDC["Salesforce / HubSpot Adapter"]
        Gong["Gong Engage / Amplemarket"]
        Clay["Clay Waterfall Enrichment"]
    end

    subgraph Storage ["Dual Persistence Engine"]
        LocalDB[".data/loadsmart-gtm.json (Zero-Config Dev)"]
        SupaDB["Supabase Postgres with RLS (Production)"]
    end

    Users --> WAF
    WAF --> RouteHandlers
    RouteHandlers --> ChatEngine
    RouteHandlers --> PALEngine
    RouteHandlers --> PodManager
    ChatEngine --> TruthGuardEngine
    PALEngine --> Connectors
    PodManager --> Storage
    ChatEngine --> Storage
```

## 2. Component Design & Responsibilities

1. **Vercel AI SDK v7 Streaming Engine:** Orchestrates streaming dialog with clients via `@ai-sdk/react` (`useChat`), handles tool execution loops, and supports dynamic model swapping (Google Gemini 2.5 / Flash + Anthropic Claude 3.5 Sonnet) with offline demo simulation.
2. **Deterministic 10-Step Pod Pipeline:** Enforces sequential transition of 20 accounts per pod:
   - `06:00` `la-signal`
   - `06:30` `la-crm-audit`
   - `07:00` `la-abm-tag`
   - `07:15` `la-persona-enrich`
   - `07:45` `la-research`
   - `08:15` `la-email`
   - `08:30` `la-sequence` (Human Approval Gate)
   - `17:00` `la-daily-report`
3. **Calibrated Truth Guard:** Intercepts drafted touchpoints and validates every quantitative claim against `knowledge/claims-library.md`. Prevents AI hallucination of unsupported ROI or fake shipper logos.
4. **Dual Persistence Layer:**
   - Development & Evaluation: Fast, atomic local file database in `.data/loadsmart-gtm.json`.
   - Production Cloud: Supabase Postgres instance secured by Row Level Security (RLS) on `pod_id` and `user_id`.
