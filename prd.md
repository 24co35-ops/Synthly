# Product Requirements Document (PRD) — AI Text Utility

**Version:** 1.0  
**Status:** Draft  
**Owner:** Product  
**Last Updated:** April 2026

---

## 1. Purpose

This document defines the requirements for an AI-powered text utility that enables users to paste any text and apply structured transformations — summarization, bullet extraction, action item extraction, question extraction, and tone rewriting — with fast, trustworthy, and privacy-conscious results.

---

## 2. Background & Problem Statement

Users across writing, research, business, and personal productivity regularly need to:

- Condense long articles, notes, or transcripts into key points
- Rewrite text for a different audience or register
- Pull out tasks and questions from messy notes or conversations

Existing AI tools fail because they hallucinate facts, miss key points, flatten nuance, struggle with long text, and give users no way to verify outputs. They also expose sensitive data and create expectation mismatches by presenting everything as equally reliable.

This product addresses those gaps with a guided, transparent, privacy-first utility.

---

## 3. Goals

- Deliver fast, structured AI text transformations that users can act on without extensive review
- Reduce blind trust in AI output by providing source-linked evidence alongside results
- Protect sensitive content by defaulting to privacy-preserving behavior
- Set honest expectations through UI copy and inline caveats
- Ship a focused MVP quickly and validate with real users before expanding

---

## 4. Non-Goals

- General-purpose chat or open-ended question answering
- Document editing or collaborative annotation
- Deep domain-specific models (legal, medical, code) — out of scope for MVP
- Native mobile app — web-only for MVP
- Real-time collaboration or shared workspaces

---

## 5. Target Users

| Persona | Description | Primary need |
|---|---|---|
| Knowledge Worker | Analyst, researcher, consultant | Summarize reports and meeting notes quickly |
| Writer / Editor | Content creator, journalist | Rewrite drafts in different tones; extract key ideas |
| Student | Undergraduate or postgraduate | Condense readings; extract questions for review |
| Operations / PM | Project or product manager | Extract action items from meeting transcripts |

---

## 6. User Stories

### Core Actions

**US-01:** As a user, I want to paste a block of text and receive a concise prose summary so that I can understand the main point without reading the full content.

**US-02:** As a user, I want to convert text into a structured bullet list so that I can scan key points quickly.

**US-03:** As a user, I want to extract action items from a meeting transcript or note so that I know exactly what tasks were assigned or decided.

**US-04:** As a user, I want to extract open questions from text so that I can identify gaps and follow-ups.

**US-05:** As a user, I want to rewrite text in a chosen tone (formal, casual, simplified, professional) so that I can adapt content for different audiences.

### Output Controls

**US-06:** As a user, I want to choose output length (short, balanced, detailed) so that I can control the depth of the result.

**US-07:** As a user, I want to copy or download the output as plain text or markdown so that I can use it immediately in other tools.

**US-08:** As a user, I want to save outputs to a session history so that I can reference earlier results without re-processing.

### Trust & Verification

**US-09:** As a user, I want to see highlighted phrases from the original text alongside the output so that I can quickly verify accuracy.

**US-10:** As a user, I want to see a clear, non-alarming notice when the output may miss nuance so that I know when to review carefully.

### Privacy

**US-11:** As a user, I want a privacy mode that prevents my text from being logged or retained so that I can safely process confidential content.

**US-12:** As a user, I want to see a warning when my pasted text contains personally identifiable information so that I can decide whether to proceed.

---

## 7. Functional Requirements

### 7.1 Input

| ID | Requirement | Priority |
|---|---|---|
| F-01 | Users can paste text into a large textarea | P0 |
| F-02 | Character and word count is displayed below the input | P1 |
| F-03 | Text can be cleared with a single button | P0 |
| F-04 | Input accepts `.txt` and `.md` file drag-and-drop | P2 |
| F-05 | A PII warning is shown when sensitive patterns are detected | P1 |
| F-06 | Inputs under 30 words display a soft length warning | P1 |
| F-07 | Inputs over 50,000 characters display an info notice about chunked processing | P1 |

### 7.2 Actions

| ID | Requirement | Priority |
|---|---|---|
| F-08 | Five action buttons are available: Summarize, Turn into Bullets, Extract Action Items, Extract Questions, Rewrite Tone | P0 |
| F-09 | Rewrite Tone reveals a secondary picker: Formal, Casual, Simplified, Professional | P0 |
| F-10 | Only one action runs at a time; concurrent runs are not supported | P0 |
| F-11 | A length selector (Short / Balanced / Detailed) is available for all actions | P0 |
| F-12 | The user can re-run with a different action or length without re-pasting | P1 |

### 7.3 Processing

| ID | Requirement | Priority |
|---|---|---|
| F-13 | AI responses stream token by token to the output panel | P0 |
| F-14 | Long inputs are automatically chunked and results merged hierarchically | P1 |
| F-15 | The user can cancel an in-progress request | P1 |
| F-16 | Processing must begin within 1 second of action button click | P0 |

### 7.4 Output

| ID | Requirement | Priority |
|---|---|---|
| F-17 | Output is rendered as formatted markdown (bold, bullets) | P0 |
| F-18 | Source highlights are shown alongside each output (closest matching phrases from input) | P1 |
| F-19 | A confidence/caveat notice is displayed below every output | P0 |
| F-20 | One-click copy to clipboard (plain text) | P0 |
| F-21 | Download as `.txt` or `.md` | P1 |
| F-22 | Save to session history | P1 |
| F-23 | Regenerate (re-run same action) button | P1 |

### 7.5 History

| ID | Requirement | Priority |
|---|---|---|
| F-24 | Session history shows up to 20 saved outputs | P1 |
| F-25 | Each history entry shows: action type, timestamp, first 80 chars of input, and the output | P1 |
| F-26 | History is cleared on session end for unauthenticated users | P1 |
| F-27 | Authenticated users have persistent history across sessions | P2 |

### 7.6 Privacy

| ID | Requirement | Priority |
|---|---|---|
| F-28 | Privacy mode is on by default for new users | P1 |
| F-29 | When Privacy Mode is on, user text is not logged server-side | P0 |
| F-30 | PII detection runs client-side (regex) in Privacy Mode | P1 |
| F-31 | A visual lock indicator appears on the input when Privacy Mode is active | P1 |
| F-32 | Users can toggle Privacy Mode in Settings | P1 |

---

## 8. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | Time-to-first-token ≤ 1.5 seconds for inputs under 2,000 words |
| Reliability | 99.5% uptime; graceful degradation with clear error states |
| Scalability | Stateless processing; horizontally scalable via serverless functions |
| Security | HTTPS only; no plaintext API credentials in client code; input sanitized before processing |
| Accessibility | WCAG 2.1 AA compliance; keyboard-navigable; screen-reader-friendly live output region |
| Browser Support | Chrome 110+, Firefox 110+, Safari 16+, Edge 110+ |

---

## 9. Success Metrics

| Metric | Target (30 days post-launch) |
|---|---|
| Actions completed per session | ≥ 2.5 average |
| Copy / Download rate | ≥ 40% of completed actions |
| Return usage (same user, 2+ sessions) | ≥ 25% |
| Error rate (API failures) | < 2% of requests |
| Privacy Mode retention (left on) | ≥ 60% of sessions |
| User-reported trust ("was the output accurate?") | ≥ 70% positive in NPS/feedback prompt |

---

## 10. Limitations & Caveats (Product Stance)

The product will clearly communicate the following limitations in the UI:

- AI output may be inaccurate or incomplete, especially for technical, legal, or domain-specific text
- Summaries may miss nuance in short or complex input
- Tone rewriting in languages other than English is lower quality
- The tool is not a substitute for expert review in high-stakes contexts (legal, medical, financial)
- Source highlights are approximate and do not guarantee exact factual provenance

---

## 11. MVP Scope

The following features constitute the launch-ready MVP:

**Included in MVP:**
- Text paste input with word count and clear button
- Five core action buttons
- Tone picker for Rewrite Tone
- Short / Balanced / Detailed length selector
- Streaming output with markdown rendering
- Confidence/caveat notice
- Copy to clipboard
- Basic PII pattern warning (client-side regex)
- Privacy Mode toggle
- Session history (up to 20 items)

**Deferred to V2:**
- File drag-and-drop upload
- Source highlight diff view
- Persistent cross-session history (requires auth)
- Presidio-based server-side PII detection
- Download as `.md` / `.txt`
- Non-English language caveats

---

## 12. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| AI hallucination damages user trust | High | High | Source highlights + caveat copy; extractive-first prompting |
| Users paste highly sensitive data | Medium | High | Privacy Mode on by default; PII detection warning |
| Long inputs degrade output quality | Medium | Medium | Chunking + hierarchical merge; length warning for very long input |
| Users expect perfection and churn | Medium | Medium | Transparent UI copy; honest limits stated clearly |
| API rate limits cause errors at scale | Low | Medium | Queue + retry logic; graceful error state |

---

## 13. Open Questions

- Should we offer a "Compare" view (original vs. rewritten) for the Rewrite Tone action?
- What is the right default for history retention for authenticated users — 30 days or indefinite?
- Should source highlights be shown inline (interleaved) or in a separate panel?
- Do we need a user feedback mechanism ("Was this helpful?") on each output for model quality tracking?
