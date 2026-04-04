# Design Document — AI Text Utility

**Version:** 1.0  
**Status:** Draft  
**Last Updated:** April 2026

---

## 1. Product Vision

A guided AI text utility that lets users paste any text and instantly apply high-confidence transformations — summarize, bulletize, extract action items, extract questions, and rewrite by tone — with structured, source-verifiable outputs they can trust and act on immediately.

The product is **not** "one AI box that does everything." It is a focused set of clearly labelled, fast, honest tools.

---

## 2. Design Principles

| Principle | What it means in practice |
|---|---|
| **Scan-first** | Users read output by scanning, not reading top to bottom. Outputs use clear hierarchy, short sentences, and visible structure. |
| **Transparency over magic** | Every output shows where the information came from. No invisible reasoning. |
| **Speed + trust** | Streaming output is shown immediately. Source highlights appear alongside to enable fast verification. |
| **Honest limits** | The UI communicates what the tool does well and where it may fall short, rather than overpromising. |
| **Privacy by default** | No text is stored server-side unless the user explicitly saves it. PII warnings appear proactively. |

---

## 3. Information Architecture

```
App
├── Home / Workspace
│   ├── Input Area (paste box)
│   ├── Action Bar (5 core actions)
│   ├── Output Panel (result + source highlights)
│   └── Output Controls (length, copy, save, download)
├── History (saved outputs, per session or per user)
└── Settings
    ├── Privacy Mode toggle
    ├── Default action preference
    └── Output length default
```

---

## 4. Core User Flow

```
1. User pastes or types text into the input area
2. User selects one action from the action bar
3. (Optional) User selects output length: Short / Balanced / Detailed
4. System streams the result token by token
5. Output is displayed alongside source highlights
6. User copies, downloads, or saves the result
7. User can re-run with a different action or length without re-pasting
```

---

## 5. Component Breakdown

### 5.1 Input Area

- Large, resizable textarea with placeholder: *"Paste your text here — an article, note, email, meeting transcript, or any content you want to process."*
- Character/word count shown below
- PII warning banner appears if sensitive patterns are detected (emails, phone numbers, names in context)
- "Clear" button visible once text is present
- Drag-and-drop file support (`.txt`, `.md`) — stretch goal

### 5.2 Action Bar

Five primary actions presented as prominent, clearly labelled buttons:

| Button Label | What it does |
|---|---|
| **Summarize** | Concise prose summary of the main argument or content |
| **Turn into Bullets** | Key points extracted as a structured bullet list |
| **Extract Action Items** | Tasks, decisions, or to-dos from the text |
| **Extract Questions** | Open questions or unknowns present in or raised by the text |
| **Rewrite Tone** | Rewrite in a chosen tone (Formal / Casual / Simplified / Professional) |

Actions are mutually exclusive per run. Rewrite Tone reveals a secondary tone picker on click.

### 5.3 Output Panel

- **Result area:** Streams output in real time. Markdown rendered (bold, bullets, etc.)
- **Source highlights:** Below or beside the result, key phrases from the original text are highlighted to show where the output came from
- **Confidence notice:** A subtle, non-alarming disclaimer: *"AI output may miss nuance in technical or legal text. Review before sharing."*
- **Action repeat bar:** After output, user can switch action or length and re-run without re-pasting

### 5.4 Output Controls

- One-click **Copy** (copies plain text or formatted markdown)
- **Download** as `.txt` or `.md`
- **Save to History** (session-scoped by default; user-scoped if signed in)
- **Regenerate** to re-run the same action

### 5.5 Length Selector

Three options shown as a segmented control:

- **Short** — 2–4 sentences or 3–5 bullets
- **Balanced** *(default)* — moderate depth
- **Detailed** — comprehensive, preserves nuance

---

## 6. Privacy Mode

When Privacy Mode is enabled:

- Text is not sent to any server for PII detection pre-processing
- A browser-side regex scan flags obvious patterns (email addresses, phone numbers, SSNs)
- The user sees a modal: *"Privacy Mode is on. Your text is processed only for this request and not stored."*
- A lock icon appears in the input area

Privacy Mode is on by default for first-time users.

---

## 7. Empty and Error States

| State | UI treatment |
|---|---|
| Empty input, action clicked | Shake animation on input; hint text: *"Paste some text first"* |
| Input too short (< 30 words) | Soft warning: *"This text is very short — results may be limited"* |
| Input too long (> 50,000 chars) | Info banner: *"Long text will be processed in sections and merged"* |
| API error / timeout | Inline error in output panel: *"Something went wrong. Try again."* with retry button |
| Partial stream cut off | Show what streamed, with: *"Response was cut short — try Detailed mode or shorten input"* |

---

## 8. Visual Design Guidance

### Typography

- Body: Inter or system-ui, 15–16px, 1.6 line height
- Output text: Slightly larger (17px), generous line height for readability
- Labels: 13px, medium weight, uppercase tracking for action buttons

### Color Palette

- Background: Near-white (`#F8F9FA`) with white panels
- Primary action: Deep blue (`#1E40AF`) — conveys trust and precision
- Highlight (source): Warm amber (`#FDE68A`) — visible but not alarming
- PII warning: Soft orange (`#FED7AA`)
- Destructive / error: Muted red (`#FCA5A5`)
- Text: `#111827` primary, `#6B7280` secondary

### Layout

- Single-column, max-width 800px, centered
- Input area: ~30% of viewport height
- Action bar: Full width, 5 equally spaced buttons
- Output panel: Appears below with smooth slide-in

### Motion

- Streaming text: Rendered as it arrives (no fade-in delay per token)
- Panel transitions: 150ms ease-out
- PII warning: Slide down from top of input box

---

## 9. Accessibility

- All interactive elements keyboard-navigable (Tab order: input → action buttons → length selector → output controls)
- Action buttons have descriptive `aria-label` values
- Output area is an `aria-live="polite"` region so screen readers announce streamed content
- Contrast ratios ≥ 4.5:1 for all text on backgrounds
- Error messages associated with inputs via `aria-describedby`

---

## 10. Known Design Limitations

- Source highlighting is approximate — it shows the closest matching phrase, not guaranteed exact provenance
- Tone rewriting in non-English text is lower quality and should carry a caveat
- History is session-only for unauthenticated users; data loss on tab close is expected and should be communicated
