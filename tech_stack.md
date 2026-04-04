# Tech Stack — AI Text Utility

## Overview

This document outlines the recommended technology choices for building a guided AI text utility that supports summarization, rewriting, bullet extraction, and insight generation, with a focus on speed, trust, and privacy.

---

## Frontend

| Layer | Technology | Rationale |
|---|---|---|
| Framework | **Next.js 14 (App Router)** | SSR + RSC for fast initial loads; excellent DX |
| Language | **TypeScript** | Type safety across API contracts and state |
| Styling | **Tailwind CSS** | Utility-first; fast iteration on scan-friendly layouts |
| UI Components | **shadcn/ui** | Accessible, unstyled primitives; easy to theme |
| State Management | **Zustand** | Lightweight; sufficient for input/output/history state |
| Streaming UI | **Vercel AI SDK (`useChat`, `useCompletion`)** | Native streaming + abort support |
| Rich Text Diff | **diff-match-patch** | Show source-linked highlights for trust/verification |
| Icons | **Lucide React** | Consistent, minimal icon set |

---

## Backend

| Layer | Technology | Rationale |
|---|---|---|
| Runtime | **Node.js 20+ (Edge-compatible)** | Low cold-start latency for streaming routes |
| API Framework | **Next.js Route Handlers** | Co-located with frontend; no extra server needed for MVP |
| AI Integration | **Anthropic Claude API (claude-sonnet-4)** | Best-in-class instruction following; strong summarization |
| Streaming | **Server-Sent Events via `ReadableStream`** | Token-level streaming for perceived speed |
| Text Chunking | **LangChain.js `RecursiveCharacterTextSplitter`** | Handles long-input processing with overlap |
| Input Validation | **Zod** | Schema validation on all incoming payloads |

---

## Privacy & Security

| Concern | Solution |
|---|---|
| PII Detection | **Microsoft Presidio** (Python microservice) or **@aws-sdk/comprehend** (managed) |
| Redaction | Strip/mask entities before sending to AI API |
| Transport | **HTTPS only**; no plaintext API calls |
| Data Retention | No server-side logging of user text by default |
| Auth (optional) | **NextAuth.js** with OAuth or magic link |

---

## Data & Storage

| Need | Technology |
|---|---|
| Output History | **Upstash Redis** (serverless KV; per-user, TTL-based) |
| File Uploads (optional) | **Vercel Blob** or **AWS S3** |
| User Preferences | **localStorage** (client-only) or Redis for signed-in users |
| Database (if auth added) | **PlanetScale / Neon** (serverless Postgres) |

---

## Infrastructure & DevOps

| Layer | Technology |
|---|---|
| Hosting | **Vercel** (zero-config, edge network, streaming-native) |
| CI/CD | **GitHub Actions** |
| Environment Config | **Vercel Environment Variables** |
| Error Monitoring | **Sentry** |
| Analytics (privacy-safe) | **Plausible** or **PostHog** |

---

## Testing

| Type | Tool |
|---|---|
| Unit | **Vitest** |
| Component | **React Testing Library** |
| E2E | **Playwright** |
| AI Output Eval | **Promptfoo** (regression testing prompts) |

---

## Architecture Diagram (Simplified)

```
User Browser
    │
    ▼
Next.js Frontend (Vercel Edge)
    │  — Paste input, action selection
    │  — Streaming output display
    │  — Diff/highlight viewer
    ▼
Next.js Route Handler (/api/process)
    │  — Zod validation
    │  — Text chunking (LangChain.js)
    │  — PII redaction (Presidio microservice)
    ▼
Anthropic Claude API
    │  — Streaming response
    ▼
Upstash Redis
    └── History, session cache
```

---

## Key Decisions & Trade-offs

**Why Next.js over a separate backend?**
For an MVP, co-locating API routes reduces infra overhead. Can be split into a dedicated service if scale demands it.

**Why Claude over GPT-4o?**
Claude Sonnet offers superior instruction-following for structured output tasks (bullets, summaries, tone rewriting) with lower hallucination rates on constrained prompts.

**Why chunking vs. long-context in one pass?**
Chunking + hierarchical summarization is more reliable and cost-effective for very long inputs, even as context windows grow. It also allows section-level source linking.

**Why Presidio for PII?**
It is open-source, runs locally or as a microservice, and supports custom entity types — better than regex-only approaches for a privacy-differentiating feature.
